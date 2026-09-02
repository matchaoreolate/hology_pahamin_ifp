import {
  ReactFlow,
  type Connection,
  type EdgeMouseHandler,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMemo } from "react";

import type { MatchingPair } from "../../types";
import { MatchingConnectionLine, MatchingEdge, type MatchingEdgeType } from "./MatchingConnection";
import { MatchingNode, type MatchingNodeStatus, type MatchingNodeType } from "./MatchingNode";

const LEFT_X = 5;
const RIGHT_X = 620;
const NODE_WIDTH = 360;
const ROW_HEIGHT = 110;
const ROW_GAP = 32;

export const leftNodeId = (itemId: string) => `left:${itemId}`;
export const rightNodeId = (itemId: string) => `right:${itemId}`;
export const itemIdFromNodeId = (nodeId: string) => nodeId.slice(nodeId.indexOf(":") + 1);

const nodeTypes: NodeTypes = { matchingNode: MatchingNode };
const edgeTypes: EdgeTypes = { matchingEdge: MatchingEdge };

interface MatchingCanvasProps {
  pairs: MatchingPair[];
  /** leftItemId -> rightItemId */
  matches: Record<string, string>;
  onConnect: (leftId: string, rightId: string) => void;
  onRemoveConnection: (leftId: string) => void;
}

export function MatchingCanvas({
  pairs,
  matches,
  onConnect,
  onRemoveConnection,
}: MatchingCanvasProps) {
  const pairsByLeftId = useMemo(
    () => new Map(pairs.map((pair) => [pair.left.id, pair])),
    [pairs],
  );
  const connectedRightToLeft = useMemo(() => {
    const map = new Map<string, string>();
    for (const [leftId, rightId] of Object.entries(matches)) map.set(rightId, leftId);
    return map;
  }, [matches]);

  const nodes: MatchingNodeType[] = useMemo(
    () =>
      pairs.flatMap((pair, index) => {
        const y = index * (ROW_HEIGHT + ROW_GAP);
        const leftId = pair.left.id;
        const rightId = pair.right.id;

        const connectedRightId = matches[leftId];
        const leftStatus: MatchingNodeStatus = connectedRightId
          ? connectedRightId === rightId
            ? "correct"
            : "incorrect"
          : "idle";

        const connectedLeftId = connectedRightToLeft.get(rightId);
        const rightStatus: MatchingNodeStatus = connectedLeftId
          ? pairsByLeftId.get(connectedLeftId)?.right.id === rightId
            ? "correct"
            : "incorrect"
          : "idle";

        return [
          {
            id: leftNodeId(leftId),
            type: "matchingNode" as const,
            position: { x: LEFT_X, y },
            data: { label: pair.left.label, side: "left" as const, status: leftStatus },
            draggable: false,
            selectable: false,
            width: NODE_WIDTH,
          },
          {
            id: rightNodeId(rightId),
            type: "matchingNode" as const,
            position: { x: RIGHT_X, y },
            data: { label: pair.right.label, side: "right" as const, status: rightStatus },
            draggable: false,
            selectable: false,
            width: NODE_WIDTH,
          },
        ];
      }),
    [pairs, matches, pairsByLeftId, connectedRightToLeft],
  );

  const edges: MatchingEdgeType[] = useMemo(
    () =>
      Object.entries(matches).map(([leftId, rightId]) => {
        const pair = pairs.find((p) => p.left.id === leftId);
        const correct = pair?.right.id === rightId;
        return {
          id: `edge:${leftId}:${rightId}`,
          type: "matchingEdge" as const,
          source: leftNodeId(leftId),
          target: rightNodeId(rightId),
          data: { correct },
        };
      }),
    [matches, pairs],
  );

  function handleConnect(connection: Connection) {
    const leftId = itemIdFromNodeId(connection.source);
    const rightId = itemIdFromNodeId(connection.target);
    onConnect(leftId, rightId);
  }

  const handleEdgeClick: EdgeMouseHandler<MatchingEdgeType> = (_event, edge) => {
    onRemoveConnection(itemIdFromNodeId(edge.source));
  };

  return (
    <div className="matching-canvas h-[62vh] max-h-[620px] min-h-[380px] w-[72vw] max-w-[1100px] min-w-[320px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnect={handleConnect}
        onEdgeClick={handleEdgeClick}
        connectionLineComponent={MatchingConnectionLine}
        connectionRadius={44}
        fitView
        fitViewOptions={{ padding: 0.05 }}
        minZoom={0.1}
        maxZoom={1.5}
        nodesDraggable={false}
        nodesConnectable
        elementsSelectable={false}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ interactionWidth: 20 }}
      />
    </div>
  );
}
