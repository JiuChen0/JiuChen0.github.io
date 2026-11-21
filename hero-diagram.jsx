/* Illustrate a workload split across four parallel processes. */

const HeroDiagram = ({ playing = true, language = "en" }) => {
  const W = 720;
  const H = 180;
  const RANK_COUNT = 4;
  const RANK_W = 60;
  const RANK_H = 22;
  const RANK_X = 280;
  const ENTRY_X = 60;
  const EXIT_X = W - 60;
  const MID_Y = H / 2;
  const RANK_GAP = 30;
  const RANK_TOTAL_H = RANK_COUNT * RANK_H + (RANK_COUNT - 1) * RANK_GAP;
  const RANK_Y0 = (H - RANK_TOTAL_H) / 2;
  const labels = language === "zh"
    ? {
        caption: "并行计算与进程间通信",
        input: "任务输入",
        output: "结果汇总",
      }
    : {
        caption: "Parallel computation and communication",
        input: "WORKLOAD",
        output: "RESULTS",
      };

  const ranks = Array.from({ length: RANK_COUNT }, (_, i) => ({
    i,
    y: RANK_Y0 + i * (RANK_H + RANK_GAP) + RANK_H / 2,
  }));

  const workItems = [];
  const ITEMS_PER_RANK = 3;
  ranks.forEach((rank) => {
    for (let k = 0; k < ITEMS_PER_RANK; k++) {
      const laneIdx = rank.i;
      const delay = (laneIdx * 0.35 + k * 1.1) % 4.4;
      workItems.push({ id: `${laneIdx}-${k}`, lane: laneIdx, delay });
    }
  });

  // A lane runs from the input through one process to the output.
  const lanePath = (g) => {
    const rankLeft = RANK_X;
    const rankRight = RANK_X + RANK_W;
    return `M ${ENTRY_X} ${MID_Y} C ${ENTRY_X + 80} ${MID_Y}, ${rankLeft - 60} ${g.y}, ${rankLeft} ${g.y} L ${rankRight} ${g.y} C ${rankRight + 60} ${g.y}, ${EXIT_X - 80} ${MID_Y}, ${EXIT_X} ${MID_Y}`;
  };

  return (
    <div className="hero-anim">
      <div className="hero-anim-head">{labels.caption}</div>
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
        {ranks.map((g) => (
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
          <text x={ENTRY_X} y={MID_Y - 14} textAnchor="middle">{labels.input}</text>
          <text x={EXIT_X} y={MID_Y - 14} textAnchor="middle">{labels.output}</text>
        </g>

        {/* Entry/exit nodes */}
        <circle cx={ENTRY_X} cy={MID_Y} r="5" fill="var(--bg)" stroke="var(--ink-soft)" strokeWidth="1.2" />
        <circle cx={EXIT_X} cy={MID_Y} r="5" fill="var(--bg)" stroke="var(--ink-soft)" strokeWidth="1.2" />

        {/* Parallel processes */}
        {ranks.map((g) => (
          <g key={`g-${g.i}`}>
            <rect
              x={RANK_X}
              y={g.y - RANK_H / 2}
              width={RANK_W}
              height={RANK_H}
              rx="5"
              ry="5"
              fill="var(--bg)"
              stroke="var(--ink-soft)"
              strokeWidth="1"
            />
            <text
              x={RANK_X + RANK_W / 2}
              y={g.y + 3.5}
              textAnchor="middle"
              fontFamily="var(--mono)"
              fontSize="10"
              fill="var(--ink)"
              letterSpacing="-0.005em"
              fontWeight="500"
            >
              rank {g.i}
            </text>
            {/* Process activity indicator */}
            <rect
              x={RANK_X + 4}
              y={g.y + RANK_H / 2 - 4}
              width={RANK_W - 8}
              height={1.5}
              fill="var(--accent)"
              opacity="0.35"
            />
          </g>
        ))}

        {/* Communication between processes */}
        {ranks.slice(0, -1).map((g, idx) => {
          const y1 = g.y + RANK_H / 2;
          const y2 = ranks[idx + 1].y - RANK_H / 2;
          return (
            <line
              key={`comm-${idx}`}
              x1={RANK_X + RANK_W / 2}
              x2={RANK_X + RANK_W / 2}
              y1={y1}
              y2={y2}
              stroke="var(--accent)"
              strokeWidth="0.8"
              strokeDasharray="2 3"
              opacity="0.55"
            />
          );
        })}

        {/* Animated work items */}
        {workItems.map((t) => {
          const g = ranks[t.lane];
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
