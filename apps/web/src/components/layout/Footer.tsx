export function Footer() {
  return (
    <footer className="flex w-full items-center justify-between border-t border-border bg-card px-6 py-4">
      <span className="font-mono text-xs font-bold text-foreground">PahamIn AI</span>
      <span className="font-mono text-[11px] text-muted-foreground">
        © 2026 PahamIn AI.
      </span>
      <div className="flex gap-4 font-mono text-[11px] text-muted-foreground">
        <span className="cursor-pointer transition-colors hover:text-foreground">Bantuan</span>
        <span className="cursor-pointer transition-colors hover:text-foreground">
          Syarat &amp; Ketentuan
        </span>
      </div>
    </footer>
  );
}
