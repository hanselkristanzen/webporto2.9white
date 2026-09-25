/**
 * A frozen, hand-composed echo of the hero's node network. Rendered instead
 * of the WebGL particle scene when the visitor prefers reduced motion, or when
 * WebGL isn't available — no animation, no pointer tracking, just a quiet
 * still image in the same visual language.
 */
export function LatticeFallback() {
  const nodes: [number, number, boolean][] = [
    [180, 120, true], [260, 80, false], [340, 150, false], [120, 210, false],
    [230, 220, true], [310, 260, false], [400, 200, false], [170, 300, false],
    [260, 330, false], [90, 130, false], [380, 90, false], [340, 310, true],
    [60, 260, false], [420, 280, false], [200, 60, false],
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [0, 3], [0, 4], [4, 5], [5, 6], [2, 6], [3, 7],
    [4, 7], [7, 8], [5, 8], [1, 10], [2, 10], [8, 11], [6, 13], [11, 13],
    [3, 9], [9, 12], [7, 12], [0, 14], [1, 14],
  ];

  return (
    <svg
      viewBox="0 0 480 400"
      role="img"
      aria-label="Abstract illustration of a connected node network, representing systems and computation"
      style={{ width: "100%", height: "100%" }}
    >
      <g stroke="rgba(246,243,236,0.22)" strokeWidth={1}>
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
          />
        ))}
      </g>
      <g>
        {nodes.map(([x, y, isHub], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={isHub ? 5 : 2.6}
            fill={isHub ? "#e8b84b" : "rgba(216,211,196,0.75)"}
          />
        ))}
      </g>
    </svg>
  );
}
