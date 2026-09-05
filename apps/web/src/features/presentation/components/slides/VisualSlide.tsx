import type { PresentationSlide } from "../../types";

export function VisualSlide({ slide }: { slide: PresentationSlide }) {
  const asset = slide.assets?.[0];
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-8 text-center">
      {slide.title && (
        <h2 className="text-3xl font-bold tracking-tight text-foreground drop-shadow-xs">
          {slide.title}
        </h2>
      )}

      {asset && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-muted shadow-md transition-transform duration-300 hover:scale-[1.01]">
          <img
            src={asset.url}
            alt={asset.alt ?? "Ilustrasi pembelajaran"}
            className="max-h-80 w-auto max-w-full rounded-xl object-contain shadow-sm"
          />
        </div>
      )}

      {slide.content && (
        <p className="max-w-2xl text-base font-medium text-muted-foreground leading-relaxed">
          {slide.content}
        </p>
      )}
    </div>
  );
}
