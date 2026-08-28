import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      className={`w-full border border-[#c4c7c7] px-[13px] py-[13px] text-sm text-[#1a1c1d] placeholder:text-[#6b7280] focus:outline-none focus:border-black ${className}`}
      {...rest}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      className={`w-full border border-[#c4c7c7] px-[13px] py-[13px] text-sm text-[#1a1c1d] placeholder:text-[#6b7280] focus:outline-none focus:border-black resize-none ${className}`}
      {...rest}
    />
  );
}
