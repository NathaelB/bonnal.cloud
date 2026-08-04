import React from 'react'
import {
  ReactFlow,
  Handle,
  Position,
  getSmoothStepPath,
  type NodeProps,
  type EdgeProps,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Icon } from '@iconify/react'

interface ProjectNodeData extends Record<string, unknown> {
  label: string
  badge: string
  badgeClass: string
  icon: string
  iconBg: string
  iconColor: string
  href: string
  featured?: boolean
}

const hs: React.CSSProperties = {
  opacity: 0,
  pointerEvents: 'none',
  width: 1,
  height: 1,
  minWidth: 0,
  minHeight: 0,
  background: 'transparent',
  border: 'none',
}

// Custom edge using SVG SMIL animation — no CSS dependency
function AnimatedEdge({
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  })

  return (
    <path
      d={edgePath}
      stroke="var(--primary)"
      strokeWidth={1.5}
      strokeDasharray="8 4"
      strokeLinecap="round"
      fill="none"
      opacity={0.55}
    >
      <animate
        attributeName="stroke-dashoffset"
        from="24"
        to="0"
        dur="1.5s"
        repeatCount="indefinite"
      />
    </path>
  )
}

const edgeTypes = { flow: AnimatedEdge }

function ProjectNode({ data: rawData }: NodeProps) {
  const data = rawData as ProjectNodeData
  return (
    <div style={{ position: 'relative' }}>
      <Handle type="source" position={Position.Left} id="sl" style={hs} />
      <Handle type="target" position={Position.Left} id="tl" style={hs} />
      <Handle type="source" position={Position.Right} id="sr" style={hs} />
      <Handle type="target" position={Position.Right} id="tr" style={hs} />
      <Handle type="source" position={Position.Top} id="st" style={hs} />
      <Handle type="target" position={Position.Top} id="tt" style={hs} />
      <Handle type="source" position={Position.Bottom} id="sb" style={hs} />
      <Handle type="target" position={Position.Bottom} id="tb" style={hs} />

      <a
        href={data.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`nodrag nopan block rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
          data.featured ? 'p-5 w-52' : 'p-4 w-44'
        }`}
      >
        <div
          className={`flex items-center justify-center rounded-xl border border-border ${data.iconBg} ${
            data.featured ? 'size-12 mb-4' : 'size-10 mb-3'
          }`}
        >
          <Icon
            icon={data.icon}
            className={`${data.iconColor} ${data.featured ? 'size-7' : 'size-5'}`}
          />
        </div>
        <p className={`font-bold text-foreground leading-tight ${data.featured ? 'text-base' : 'text-sm'}`}>
          {data.label}
        </p>
        <p className={`mt-1 text-[10px] font-semibold ${data.badgeClass}`}>{data.badge}</p>
      </a>
    </div>
  )
}

const nodeTypes = { project: ProjectNode }

const nodes: Node<ProjectNodeData>[] = [
  {
    id: 'ferriskey',
    type: 'project',
    position: { x: 320, y: 160 },
    data: {
      label: 'FerrisKey',
      badge: 'Identity Foundation',
      badgeClass: 'text-orange-400',
      icon: 'mdi:shield-key-outline',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
      href: 'https://ferriskey.rs',
      featured: true,
    },
  },
  {
    id: 'ferriscord',
    type: 'project',
    position: { x: 650, y: 160 },
    data: {
      label: 'Ferriscord',
      badge: 'Realtime',
      badgeClass: 'text-violet-400',
      icon: 'mdi:forum-outline',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-400',
      href: 'https://github.com/ferrislabs',
    },
  },
  {
    id: 'mestier',
    type: 'project',
    position: { x: 0, y: 160 },
    data: {
      label: 'Mestier',
      badge: 'SaaS · CRM/ERP',
      badgeClass: 'text-blue-400',
      icon: 'mdi:office-building-outline',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      href: 'https://github.com/ferrislabs/mestier',
    },
  },
  {
    id: 'ferriskv',
    type: 'project',
    position: { x: 650, y: 20 },
    data: {
      label: 'FerrisKV',
      badge: 'Distributed KV',
      badgeClass: 'text-teal-400',
      icon: 'mdi:database-sync-outline',
      iconBg: 'bg-teal-500/10',
      iconColor: 'text-teal-400',
      href: 'https://github.com/ferrislabs/ferriskv',
    },
  },
]

const edges: Edge[] = [
  { id: 'fk-fc', source: 'ferriskey', target: 'ferriscord', type: 'flow' },
  { id: 'fk-fl', source: 'ferriskey', target: 'mestier', type: 'flow' },
  { id: 'fc-sm', source: 'ferriscord', target: 'ferriskv', type: 'flow' },
]

export function PlatformGraph() {
  return (
    <div className="h-[320px] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnScroll={false}
        preventScrolling={false}
        style={{ background: 'transparent' }}
      />
    </div>
  )
}
