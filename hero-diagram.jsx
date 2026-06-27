/* Hero diagram: distributed inference visualization.
   Tokens enter from the left, fan out across 4 GPU shards in parallel,
   then merge into an output stream. Subtle motion, accent-color tokens.
*/

const HeroDiagram = ({ playing = true }) => {
  const W = 720;
  const H = 180;
  const GPU_COUNT = 4;
  const GPU_W = 60;
  const GPU_H = 22;
  const GPU_X = 280;
  const ENTRY_X = 60;
  const EXIT_X = W - 60;
  const MID_Y = H / 2;
  const GPU_GAP = 30;
  const GPU_TOTAL_H = GPU_COUNT * GPU_H + (GPU_COUNT - 1) * GPU_GAP;
  const GPU_Y0 = (H - GPU_TOTAL_H) / 2;

  const gpus = Array.from({ length: GPU_COUNT }, (_, i) => ({
    i,
    y: GPU_Y0 + i * (GPU_H + GPU_GAP) + GPU_H / 2,
  }));

  // Generate token streams: each token spawns at a staggered phase,
  // travels entry -> assigned GPU -> exit. We use CSS animations on
  // <circle> elements via offset-path... simpler: animate cx/cy with SMIL is unreliable.
  // We'll use a CSS-driven approach with keyframes per lane.

  const tokens = [];
  const STREAMS_PER_LANE = 3;
  gpus.forEach((g, laneIdx) => {
    for (let k = 0; k < STREAMS_PER_LANE; k++) {
      const delay = (laneIdx * 0.35 + k * 1.1) % 4.4;
      tokens.push({ id: `${laneIdx}-${k}`, lane: laneIdx, y: g.y, delay });
    }
  });

  // Path for a single lane: entry -> gpu in -> gpu out -> exit
  const lanePath = (g) => {
    const gpuLeft = GPU_X;
    const gpuRight = GPU_X + GPU_W;
    return `M ${ENTRY_X} ${MID_Y} C ${ENTRY_X + 80} ${MID_Y}, ${gpuLeft - 60} ${g.y}, ${gpuLeft} ${g.y} L ${gpuRight} ${g.y} C ${gpuRight + 60} ${g.y}, ${EXIT_X - 80} ${MID_Y}, ${EXIT_X} ${MID_Y}`;
  };

  return (
    <div className="hero-anim">
      <div className="hero-anim-head">
        <span>fig 01 · distributed inference · tensor-parallel forward pass</span>
        <span className="live">streaming</span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", maxHeight: 180 }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <style>{`
            @keyframes flow {
              0%   { offset-distance: 0%;   opacity: 0; }
              8%   { opacity: 1; }
              92%  { opacity: 1; }
              100% { offset-distance: 100%; opacity: 0; }
            }
            .hero-tok {
              offset-rotate: 0deg;
              animation: flow 4.4s linear infinite;
              ${playing ? "" : "animation-play-state: paused;"}
            }
          `}</style>
        </defs>

        {/* Lane paths (faint) */}
        {gpus.map((g) => (
          <path
            key={`p-${g.i}`}
            d={lanePath(g)}
            fill="none"
            stroke="var(--rule)"
            strokeWidth="1"
          />
        ))}

        {/* Entry & exit labels */}
        <g fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.06em" fontWeight="600">
          <text x={ENTRY_X} y={MID_Y - 14} textAnchor="middle">PROMPT</text>
          <text x={ENTRY_X} y={MID_Y + 22} textAnchor="middle" fill="var(--ink-soft)" fontSize="10" fontWeight="500">tok[i]</text>
          <text x={EXIT_X} y={MID_Y - 14} textAnchor="middle">LOGITS</text>
          <text x={EXIT_X} y={MID_Y + 22} textAnchor="middle" fill="var(--ink-soft)" fontSize="10" fontWeight="500">y[i+1]</text>
        </g>

        {/* Entry/exit nodes */}
        <circle cx={ENTRY_X} cy={MID_Y} r="5" fill="var(--bg)" stroke="var(--ink-soft)" strokeWidth="1.2" />
        <circle cx={EXIT_X} cy={MID_Y} r="5" fill="var(--bg)" stroke="var(--ink-soft)" strokeWidth="1.2" />

        {/* GPU shards */}
        {gpus.map((g) => (
          <g key={`g-${g.i}`}>
            <rect
              x={GPU_X}
              y={g.y - GPU_H / 2}
              width={GPU_W}
              height={GPU_H}
              rx="5"
              ry="5"
              fill="var(--bg)"
              stroke="var(--ink-soft)"
              strokeWidth="1"
            />
            <text
              x={GPU_X + GPU_W / 2}
              y={g.y + 3.5}
              textAnchor="middle"
              fontFamily="var(--mono)"
              fontSize="10"
              fill="var(--ink)"
              letterSpacing="-0.005em"
              fontWeight="500"
            >
              gpu:{g.i}
            </text>
            {/* GPU activity tick */}
            <rect
              x={GPU_X + 4}
              y={g.y + GPU_H / 2 - 4}
              width={GPU_W - 8}
              height={1.5}
              fill="var(--accent)"
              opacity="0.35"
            />
          </g>
        ))}

        {/* All-reduce annotation between GPUs */}
        <g
          fontFamily="var(--mono)"
          fontSize="9.5"
          fill="var(--ink-mute)"
          letterSpacing="0.08em"
          fontWeight="600"
        >
          <text x={GPU_X + GPU_W / 2} y={GPU_Y0 - 6} textAnchor="middle">
            ALL-REDUCE
          </text>
        </g>
        {/* tiny vertical ticks between GPUs to suggest comm */}
        {gpus.slice(0, -1).map((g, idx) => {
          const y1 = g.y + GPU_H / 2;
          const y2 = gpus[idx + 1].y - GPU_H / 2;
          return (
            <line
              key={`comm-${idx}`}
              x1={GPU_X + GPU_W / 2}
              x2={GPU_X + GPU_W / 2}
              y1={y1}
              y2={y2}
              stroke="var(--accent)"
              strokeWidth="0.8"
              strokeDasharray="2 3"
              opacity="0.55"
            />
          );
        })}

        {/* Animated tokens flowing along each lane */}
        {tokens.map((t) => {
          const g = gpus[t.lane];
          const d = lanePath(g);
          return (
            <circle
              key={`tok-${t.id}`}
              r="3"
              fill="var(--accent)"
              className="hero-tok"
              style={{
                offsetPath: `path("${d}")`,
                animationDelay: `-${t.delay}s`,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

window.HeroDiagram = HeroDiagram;
