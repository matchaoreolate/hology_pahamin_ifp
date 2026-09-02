"""
Static prompt templates for PresentationArtifact v0.2.

Contains:
- SCHEMA_TEMPLATE  : JSON schema example shown to Gemini
- INTERACTION_RULES: Full specification of all 5 interaction primitives
                     (choice | matching | sorting | reveal | drag_drop)

These are kept separate so they can be updated without touching builder logic.
"""

SCHEMA_TEMPLATE = """\
{{
  "version": "0.2",
  "meta": {{
    "title": "{topik}",
    "mata_pelajaran": "{mata_pelajaran}",
    "topik": "{topik}",
    "fase": "{fase}",
    "total_slides": {n}
  }},
  "slides": [
    {{
      "id": "slide-1",
      "order": 1,
      "type": "opening",
      "title": "Judul Slide Pembuka",
      "content": "Pengantar topik pembelajaran",
      "assets": [],
      "interaction": null,
      "teacher_note": "Ajak siswa fokus dan mulai dengan apersepsi",
      "speaker_script": "Halo anak-anak hebat! Hari ini kita akan belajar tentang..."
    }}
  ]
}}"""

# ─────────────────────────────────────────────────────────────────
# Interaction Rules — all 5 primitives with annotated JSON examples
# ─────────────────────────────────────────────────────────────────

INTERACTION_RULES = """\
5. Untuk slide bertipe "interactive", field `interaction` HARUS menggunakan salah satu dari 5 primitive berikut:

   a) **Choice** (`"type": "choice"`):
      Struktur: instruction, options[{id, label}], correct_answer (berisi id), feedback{correct, incorrect}
      Contoh:
      {
        "type": "choice",
        "instruction": "Apa fungsi utama akar pada tumbuhan?",
        "options": [
          {"id": "opt-a", "label": "Menyerap air dan mineral"},
          {"id": "opt-b", "label": "Melakukan fotosintesis"},
          {"id": "opt-c", "label": "Menghasilkan bunga"}
        ],
        "correct_answer": "opt-a",
        "feedback": {"correct": "Tepat! Akar menyerap air dan mineral dari tanah.", "incorrect": "Coba lagi! Perhatikan fungsi utama akar."}
      }

   b) **Matching** (`"type": "matching"`):
      Struktur: instruction, pairs[{id, left{id, label}, right{id, label}}], feedback
      Contoh:
      {
        "type": "matching",
        "instruction": "Pasangkan setiap hewan dengan habitatnya!",
        "pairs": [
          {"id": "pair-1", "left": {"id": "left-1", "label": "Ikan"}, "right": {"id": "right-1", "label": "Laut"}},
          {"id": "pair-2", "left": {"id": "left-2", "label": "Elang"}, "right": {"id": "right-2", "label": "Udara"}}
        ],
        "feedback": {"correct": "Hebat! Semua pasangan tepat.", "incorrect": "Ada yang kurang tepat, coba lagi!"}
      }

   c) **Sorting** (`"type": "sorting"`):
      Struktur: instruction, categories[{id, label}], items[{id, label, correct_category}], feedback
      Contoh:
      {
        "type": "sorting",
        "instruction": "Kelompokkan benda-benda berikut!",
        "categories": [
          {"id": "cat-hidup", "label": "Makhluk Hidup"},
          {"id": "cat-mati", "label": "Benda Mati"}
        ],
        "items": [
          {"id": "item-1", "label": "Pohon", "correct_category": "cat-hidup"},
          {"id": "item-2", "label": "Batu", "correct_category": "cat-mati"}
        ],
        "feedback": {"correct": "Benar semua!", "incorrect": "Ada yang perlu diperbaiki."}
      }

   d) **Reveal** (`"type": "reveal"`):
      Struktur: instruction (opsional), items[{id, label, revealed_content, asset?}]
      Contoh:
      {
        "type": "reveal",
        "instruction": "Klik setiap kartu untuk lihat jawabannya!",
        "items": [
          {"id": "rv-1", "label": "Evaporasi", "revealed_content": "Air menguap karena panas matahari."},
          {"id": "rv-2", "label": "Kondensasi", "revealed_content": "Uap air mendingin menjadi titik-titik air."}
        ]
      }

   e) **Drag & Drop** (`"type": "drag_drop"`):
      Struktur: instruction, items[{id, label}], targets[{id, label}], answers[{item_id, target_id}], feedback
      Setiap item harus memiliki tepat satu target yang benar di dalam answers[].
      Contoh:
      {
        "type": "drag_drop",
        "instruction": "Seret setiap tahap ke urutan yang benar!",
        "items": [
          {"id": "item-evap", "label": "Evaporasi"},
          {"id": "item-kond", "label": "Kondensasi"},
          {"id": "item-presi", "label": "Presipitasi"}
        ],
        "targets": [
          {"id": "target-1", "label": "Tahap 1"},
          {"id": "target-2", "label": "Tahap 2"},
          {"id": "target-3", "label": "Tahap 3"}
        ],
        "answers": [
          {"item_id": "item-evap", "target_id": "target-1"},
          {"item_id": "item-kond", "target_id": "target-2"},
          {"item_id": "item-presi", "target_id": "target-3"}
        ],
        "feedback": {"correct": "Urutan siklus air sudah tepat!", "incorrect": "Ada tahap yang terbalik, coba lagi!"}
      }"""
