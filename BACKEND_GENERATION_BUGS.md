# Backend bugs found in the AI generation pipeline

Found while testing `POST /projects/{id}/generate` end-to-end from the frontend against a
real project. Both live in `apps/api/app/tasks/generate.py` (+ one touches
`apps/api/app/db/base.py` indirectly). **Not applied** — flagging for review/handoff, no
backend files were changed.

---

## Bug 1: orchestrator crashes immediately, project status gets stuck at `"processing"` forever

**File**: `apps/api/app/tasks/generate.py`, `generate_all_outputs_task` (~line 60)

```python
if tasks:
    group(tasks).apply_async().get(timeout=300, propagate=False)

await update_final_project_status(project_id)
```

Calling `.get()` on a Celery group **from inside a running task** is explicitly disallowed —
Celery raises immediately:

```
RuntimeError: Never call result.get() within a task!
See https://docs.celeryq.dev/en/latest/userguide/tasks.html#avoid-launching-synchronous-subtasks
```

This crashes `generate_all_outputs_task` before it ever reaches `update_final_project_status()`.
Result: **the project's `status` field is permanently stuck at `"processing"`**, regardless of
whether the individual output tasks (presentation/lkpd/ebook) succeed or fail. Since
`ProjectGeneratorService.trigger()` refuses to re-trigger a project that's already
`"processing"` (409 Conflict), a project that hits this bug can never be regenerated through
the API again — it's stuck.

Reproduced live: project `2dd02152-ae4c-4e85-834a-d1ea3fad7d9a` (title `[AI] Ekosistem Sawah`)
is sitting in this exact stuck state in the dev DB right now, left there on purpose as a
repro case.

Even suppressing the `RuntimeError` (e.g. `task_allow_sync_subtasks=True`) wouldn't be a real
fix — the orchestrator task still occupies one worker slot while *blocking* on child tasks
that need worker slots to run. With `concurrency: 2` (current worker config), this
self-deadlocks once child-task count reaches available slots.

### Suggested fix — Celery chord (fan-out, then finalize)

Replace the blocking `.get()` with a chord: dispatch the group, and let Celery call a
callback task automatically once every child finishes — no blocking wait.

```python
from celery import chord

@celery_app.task(bind=True, name="app.tasks.generate.generate_all_outputs_task")
def generate_all_outputs_task(self, project_id: str):
    async def _prepare():
        return await fetch_project_for_generation(project_id)

    project, selected, config = run_async(_prepare())
    if not project:
        return

    tasks = [
        _task.s(project_id, config.get(key, {}))
        for key, _task in [
            ("presentation", generate_presentation_task),
            ("lkpd", generate_lkpd_task),
            ("ebook", generate_ebook_task),
        ]
        if key in selected
    ]
    if tasks:
        chord(tasks)(finalize_generation_task.s(project_id))
    else:
        run_async(update_final_project_status(project_id))


@celery_app.task(name="app.tasks.generate.finalize_generation_task")
def finalize_generation_task(_results, project_id: str):
    """Chord callback — runs once every one of a project's output tasks finishes."""
    run_async(update_final_project_status(project_id))
```

Verified this compiles/registers correctly and the worker picks up `finalize_generation_task`
with no import errors. **However**, applying it surfaced Bug 2 below — the chord callback
does get invoked, but crashes on its DB call for a separate, pre-existing reason.

---

## Bug 2 (pre-existing, only reachable once Bug 1 is fixed): async DB connections reused across event loops

**File**: `apps/api/app/tasks/generate.py`, `run_async()` (~line 34), combined with
`apps/api/app/db/base.py`'s module-level `engine`.

```python
def run_async(coro):
    """Run an async coroutine from a sync Celery task."""
    loop = asyncio.new_event_loop()
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()
```

Every Celery task call opens a **brand-new event loop**, runs its coroutine, then closes the
loop. But `AsyncSessionLocal` is bound to a **module-level, process-global `engine`**
(`apps/api/app/db/base.py`) with a real connection pool (`pool_size=10`, `pool_pre_ping=True`).
asyncpg connections are bound to the event loop they were created on.

- 1st DB call in a given worker process: fresh loop, fresh connection, fine.
- 2nd DB call in the *same* worker process (a different task, later — Celery prefork workers
  handle many tasks sequentially in one long-lived OS process): SQLAlchemy pulls a pooled
  connection still bound to the *first* (now-closed) loop → crash:

```
RuntimeError: Task <Task pending name='Task-4' coro=<update_final_project_status() ...>>
got Future <Future pending ...> attached to a different loop
```

This bug already existed before today — it just was never reached, because Bug 1 always
crashed the orchestrator before a second same-process DB round-trip could happen via that
path. It reproduced immediately once Bug 1's chord fix was applied and
`finalize_generation_task` → `update_final_project_status()` actually ran.

### Suggested fix (scoped, minimal)

Dispose the engine's connection pool at the end of every `run_async()` call, so no
loop-bound connections leak into the next task's fresh loop:

```python
from app.db.base import engine

def run_async(coro):
    loop = asyncio.new_event_loop()
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.run_until_complete(engine.dispose())
        loop.close()
```

Trade-off: every task reconnects to Postgres instead of reusing a pooled connection — fine at
current volume, not ideal at high throughput. A more thorough fix would give each Celery
worker **one persistent event loop for its whole process lifetime** instead of one per task
(e.g. via a `worker_process_init` signal), so the pool's connections stay valid across task
calls — bigger structural change, didn't want to make that call unilaterally.

This fix is scoped to `tasks/generate.py` only — `apps/api/app/db/base.py` itself doesn't need
touching, since FastAPI's own request path keeps one persistent event loop and isn't affected.

---

## Unrelated finding from the same test run

`GEMINI_MODEL=gemini-1.5-flash` in `apps/api/.env` 404s:

```
404 models/gemini-1.5-flash is not found for API version v1beta, or is not supported for
generateContent. Call ModelService.ListModels to see the list of available models and their
supported methods.
```

That model's been retired. Needs bumping to a currently-supported Gemini model name before AI
generation will actually succeed end-to-end, independent of the two bugs above.

---

## Repro trail (dev DB, `demo.guru@pahamin.dev` account)

- `2dd02152-ae4c-4e85-834a-d1ea3fad7d9a` (`[AI] Ekosistem Sawah`) — stuck at `"processing"`,
  demonstrates Bug 1 as originally written (before any fix was applied/reverted).
- `7ca08c6e-c859-40f8-8882-4b3d7e5379ec` (`[AI TEST] Chord Fix Verification`) — created while
  testing the Bug 1 fix; also stuck at `"processing"`, this time due to Bug 2 surfacing once
  Bug 1's fix was live. The Bug 1 fix has since been **reverted** (`git checkout` on
  `apps/api/app/tasks/generate.py`), so the code is back to its original state — these two
  projects are left as-is as live repro cases.
