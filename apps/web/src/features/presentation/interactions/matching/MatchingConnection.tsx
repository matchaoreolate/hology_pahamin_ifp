import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  type ConnectionLineComponentProps,
  type EdgeProps,
  type Edge,
} from "@xyflow/react";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface MatchingEdgeData extends Record<string, unknown> {
  correct: boolean;
}

export type MatchingEdgeType = Edge<MatchingEdgeData, "matchingEdge">;

const strokeByCorrect = {
  true: "var(--success)",
  false: "var(--destructive)",
};

/** The line shown while the user is actively dragging from a handle. */
export function MatchingConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
}: ConnectionLineComponentProps) {
  const [path] = getStraightPath({ sourceX: fromX, sourceY: fromY, targetX: toX, targetY: toY });
  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={3}
        strokeDasharray="6 6"
        strokeLinecap="round"
      />
      <circle cx={toX} cy={toY} r={6} fill="var(--primary)" />
    </g>
  );
}

/** A persisted connection between a left and right matching card. */
export function MatchingEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  markerEnd,
}: EdgeProps<MatchingEdgeType>) {
  const correct = data?.correct ?? false;
  const [path, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  const stroke = strokeByCorrect[correct ? "true" : "false"];

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        interactionWidth={40}
        style={{ stroke, strokeWidth: 3 }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          className={cn(
            "pointer-events-none absolute flex size-6 items-center justify-center rounded-full border-2 bg-card shadow-sm",
            correct ? "border-success text-success" : "border-destructive text-destructive",
          )}
        >
          {correct ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
