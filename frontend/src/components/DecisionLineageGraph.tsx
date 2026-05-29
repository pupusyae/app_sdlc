'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GitBranch, RefreshCw } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4022';

interface GraphNode {
  id: string;
  data: {
    label: string;
    status: string;
    approved_by: string | null;
  };
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

function layoutNodes(nodes: Node[], edges: Edge[]) {
  const dagLevels: Record<string, number> = {};
  const inDegree: Record<string, number> = {};
  const adjacency: Record<string, string[]> = {};

  nodes.forEach((n) => {
    inDegree[n.id] = 0;
    adjacency[n.id] = [];
  });

  edges.forEach((e) => {
    adjacency[e.source]?.push(e.target);
    inDegree[e.target] = (inDegree[e.target] || 0) + 1;
  });

  const queue: string[] = [];
  Object.entries(inDegree).forEach(([id, deg]) => {
    if (deg === 0) queue.push(id);
  });

  let level = 0;
  while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const id = queue.shift()!;
      dagLevels[id] = level;
      adjacency[id]?.forEach((next) => {
        inDegree[next]--;
        if (inDegree[next] === 0) queue.push(next);
      });
    }
    level++;
  }

  const LEVEL_GAP = 120;
  const NODE_GAP = 80;

  let currentLevel = 0;
  let idxInLevel = 0;

  return nodes.map((node, i) => {
    const lvl = dagLevels[node.id] ?? i;
    if (lvl !== currentLevel) {
      currentLevel = lvl;
      idxInLevel = 0;
    }
    return {
      ...node,
      position: {
        x: currentLevel * LEVEL_GAP,
        y: idxInLevel++ * NODE_GAP,
      },
    };
  });
}

export default function DecisionLineageGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);

  const fetchGraph = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/governance/lineage-graph`);
      if (res.ok) {
        const data = await res.json();
        const flowNodes: Node[] = (data.nodes || []).map((n: GraphNode) => ({
          id: n.id,
          type: 'default',
          data: {
            label: (
              <div className="px-3 py-2 max-w-[200px]">
                <p className="text-xs font-medium truncate">{n.data.label}</p>
                <span
                  className={`text-[10px] px-1 py-0.5 rounded mt-1 inline-block ${
                    n.data.status === 'Approved'
                      ? 'bg-green-500/20 text-green-400'
                      : n.data.status === 'Deprecated'
                      ? 'bg-gray-500/20 text-gray-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {n.data.status}
                </span>
              </div>
            ),
          },
          position: { x: 0, y: 0 },
          style: {
            background: n.data.status === 'Deprecated' ? '#1f2937' : '#111827',
            border: `1px solid ${
              n.data.status === 'Approved'
                ? '#22c55e40'
                : n.data.status === 'Deprecated'
                ? '#6b728040'
                : '#eab30840'
            }`,
            borderRadius: '8px',
            fontSize: 12,
          },
        }));

        const flowEdges: Edge[] = (data.edges || []).map((e: GraphEdge) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#6366f1' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
          labelStyle: { fill: '#9ca3af', fontSize: 10 },
          labelBgStyle: { fill: '#111827' },
        }));

        const laidOut = layoutNodes(flowNodes, flowEdges);
        setNodes(laidOut);
        setEdges(flowEdges);
      }
    } catch {
      // Keep empty
    } finally {
      setLoading(false);
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2 uppercase tracking-wider">
            <GitBranch className="w-4 h-4 text-purple-400" />
            Decision Lineage Graph
          </h3>
          <p className="text-xs text-gray-500 mt-1">Visualizing how architectural decisions relate</p>
        </div>
        <button
          onClick={fetchGraph}
          className="p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
          title="Refresh graph"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center bg-gray-900/30 rounded-lg border border-gray-800/50">
          <p className="text-xs text-gray-600">Loading graph...</p>
        </div>
      ) : nodes.length === 0 ? (
        <div className="flex-1 flex items-center justify-center bg-gray-900/30 rounded-lg border border-gray-800/50">
          <div className="text-center">
            <GitBranch className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-xs text-gray-600">No ADR lineage data available.<br />Create and approve ADRs to see the graph.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-gray-900/30 rounded-lg border border-gray-800/50 overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            attributionPosition="bottom-left"
          >
            <Background color="#1f2937" gap={16} />
            <Controls className="[&>button]:bg-gray-800 [&>button]:border-gray-700 [&>button]:text-gray-300" />
            <MiniMap
              nodeColor={(n) => {
                const status = n.data?.label?.props?.children?.[1]?.props?.children;
                if (status === 'Deprecated') return '#6b7280';
                if (status === 'Approved') return '#22c55e';
                return '#eab308';
              }}
              className="bg-gray-900 border border-gray-700 !rounded-lg"
            />
          </ReactFlow>
        </div>
      )}
    </div>
  );
}
