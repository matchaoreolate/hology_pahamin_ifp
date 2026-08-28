import type { PresentationSlide } from "../../types";

export function VisualSlide({ slide }: { slide: PresentationSlide }) {
  const asset = slide.assets?.[0];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-16 text-center">
      {slide.title && (
        <h2 className="text-2xl font-semibold tracking-tight text-black">{slide.title}</h2>
      )}
      {asset && (
        <img
          src={asset.url}
          alt={asset.alt ?? ""}
          className="max-h-72 border border-[#c4c7c7] object-cover"
        />
      )}
      {slide.content && <p className="max-w-xl text-sm text-[#5d5e66]">{slide.content}</p>}
    </div>
  );
}
