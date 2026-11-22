import type { Architecture } from "@/lib/content/schema";

export function ArchitectureDiagram({ graph }: { graph: Architecture }) {
  const height = Math.ceil(graph.nodes.length / 2) * 140 + 30;
  const position = (id: string) => {
    const index = graph.nodes.findIndex((node) => node.id === id);
    return { x: 30 + (index % 2) * 400, y: 20 + Math.floor(index / 2) * 140 };
  };
  return <figure className="architecture-diagram"><figcaption>{graph.summary}</figcaption><svg viewBox={`0 0 800 ${height}`} aria-hidden="true">
    {graph.edges.map((edge, index) => { const from = position(edge.from); const to = position(edge.to); return <line key={index} x1={from.x + 165} y1={from.y + 40} x2={to.x + 165} y2={to.y + 40} className="architecture-edge" />; })}
    {graph.nodes.map((node) => { const point = position(node.id); return <g key={node.id}><rect x={point.x} y={point.y} width="330" height="80" rx="4" /><text x={point.x + 165} y={point.y + 46} textAnchor="middle">{node.label}</text></g>; })}
  </svg><ul className="architecture-connections">{graph.edges.map((edge, index) => <li key={index}>{graph.nodes.find((node) => node.id === edge.from)!.label} to {graph.nodes.find((node) => node.id === edge.to)!.label}: {edge.label}</li>)}</ul></figure>;
}
