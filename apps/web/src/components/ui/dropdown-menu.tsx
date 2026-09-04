import { Menu as BaseMenu } from "@base-ui/react/menu";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export const DropdownMenu = BaseMenu.Root;
export const DropdownMenuTrigger = BaseMenu.Trigger;

export function DropdownMenuContent({ className, children, ...props }: ComponentProps<typeof BaseMenu.Popup>) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner sideOffset={4} align="end" className="z-50">
        <BaseMenu.Popup
          className={cn(
            "min-w-36 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
            className,
          )}
          {...props}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export function DropdownMenuItem({
  className,
  variant,
  ...props
}: ComponentProps<typeof BaseMenu.Item> & { variant?: "default" | "destructive" }) {
  return (
    <BaseMenu.Item
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none select-none data-[highlighted]:bg-secondary",
        variant === "destructive" ? "text-destructive data-[highlighted]:bg-destructive/10" : "text-foreground",
        className,
      )}
      {...props}
    />
  );
}
