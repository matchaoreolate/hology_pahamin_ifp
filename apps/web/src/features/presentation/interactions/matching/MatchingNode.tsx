import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

import { cn } from "@/lib/utils";

export type MatchingNodeStatus = "idle" | "connected" | "correct" | "incorrect";

export interface MatchingNodeData extends Record<string, unknown> {
  label: string;
  side: "left" | "right";
  status: MatchingNodeStatus;
}

export type MatchingNodeType = Node<MatchingNodeData, "matchingNode">;

const statusClasses: Record<MatchingNodeStatus, string> = {
  idle: "border-border bg-card hover:border-primary",
  connected: "border-foreground bg-secondary text-foreground",
  correct: "border-success bg-success/10 text-success",
  incorrect: "border-destructive bg-destructive/10 text-destructive",
};

const handleBase =
  "!size-7 !rounded-full !border-2 !border-primary !bg-card transition-colors data-[connecting=true]:!bg-accent";

export function MatchingNode({ data }: NodeProps<MatchingNodeType>) {
  const { label, side, status } = data;

  return (
    <div
      className={cn(
        "flex w-full items-center rounded-xl border-2 px-5 py-4 text-base font-medium shadow-sm transition-colors select-none",
        side === "right" ? "justify-end text-right" : "justify-start",
        statusClasses[status],
      )}
    >
      {side === "left" && (
        <Handle
          type="source"
          position={Position.Right}
          className={cn(handleBase, "!right-[-14px]")}
        />
      )}
      <span>{label}</span>
      {side === "right" && (
        <Handle
          type="target"
          position={Position.Left}
          className={cn(handleBase, "!left-[-14px]")}
        />
      )}
    </div>
  );
}
