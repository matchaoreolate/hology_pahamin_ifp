import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Tabs({ className, ...props }: ComponentProps<typeof BaseTabs.Root>) {
  return <BaseTabs.Root className={cn("flex flex-col", className)} {...props} />;
}

export function TabsList({ className, ...props }: ComponentProps<typeof BaseTabs.List>) {
  return (
    <BaseTabs.List
      className={cn("flex gap-1 border-b border-border p-1", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof BaseTabs.Tab>) {
  return (
    <BaseTabs.Tab
      className={cn(
        "flex-1 rounded-md px-4 py-3 text-center font-mono text-xs font-medium tracking-wide text-muted-foreground uppercase transition-colors outline-none data-[active]:bg-primary data-[active]:text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof BaseTabs.Panel>) {
  return <BaseTabs.Panel className={cn(className)} {...props} />;
}
