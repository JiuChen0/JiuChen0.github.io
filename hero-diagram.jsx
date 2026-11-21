/* A workload distributed across four parallel processes. */

const HeroDiagram = ({ language = "en" }) => {
  const width = 720;
  const height = 180;
  const center = 360;
  const inputX = 76;
  const outputX = width - inputX;
  const middle = height / 2;
  const ranks = [24, 68, 112, 156];
  const labels = language === "zh"
    ? {
        caption: "并行计算与进程间通信",
        input: "任务输入",
        output: "汇总结果",
        note: "任务分给四个进程处理。虚线表示进程间的通信。",
      }
    : {
        caption: "Parallel computation and communication",
        input: "Workload",
        output: "Results",
        note: "Work is split across four ranks. Dashed lines mark communication between ranks.",
      };

  const position = (x, y) => ({ left: `${100 * x / width}%`, top: `${100 * y / height}%` });
  const laneFor = (y) =>
    `M ${inputX} ${middle} C 178 ${middle}, 225 ${y}, ${center - 32} ${y}
     H ${center + 32} C 495 ${y}, 542 ${middle}, ${outputX} ${middle}`;

  return (
    <figure className="hero-anim">
      <style>{`
        .hero-anim {
          margin: 32px 0 0;
          padding: 20px;
          border: 1px solid var(--rule);
          border-radius: 12px;
          background: color-mix(in srgb, var(--bg), var(--accent) 4%);
        }
        .hero-anim .hero-anim-head {
          margin: 0 0 20px;
          color: var(--ink);
          font-weight: 500;
          font-size: 14px;
          line-height: 1.4;
          letter-spacing: 0;
          text-transform: none;
        }
        .hero-network {
          position: relative;
          block-size: 184px;
          color: var(--ink-soft);
          font: 400 12px/1.25 var(--mono);
        }
        .hero-network svg {
          display: block;
          width: 100%;
          height: 100%;
        }
        .hero-rank, .hero-terminal {
          position: absolute;
          transform: translate(-50%, -50%);
        }
        .hero-rank {
          min-width: 56px;
          padding: 4px 6px;
          border: 1px solid color-mix(in srgb, var(--accent) 32%, var(--rule));
          border-radius: 6px;
          color: var(--ink);
          background: var(--bg);
          text-align: center;
          white-space: nowrap;
        }
        .hero-terminal {
          width: 8px;
          height: 8px;
          border: 1px solid var(--accent);
          border-radius: 50%;
          background: var(--bg);
        }
        .hero-terminal span {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
        }
        .hero-anim .hero-diagram-note {
          margin: 12px 0 0;
          color: var(--ink-mute);
          font-size: 13px;
          line-height: 1.5;
        }
        .hero-tok {
          opacity: 0;
          offset-rotate: 0deg;
          animation: hero-flow 2.2s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes hero-flow {
          0% { offset-distance: 0%; opacity: 0; }
          12% { opacity: 1; }
          82% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @media (max-width: 640px) {
          .hero-anim { margin-top: 24px; padding: 16px; }
          .hero-network { block-size: 160px; font-size: 11px; }
          .hero-rank { min-width: 48px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-tok { animation: none; }
        }
      `}</style>
      <figcaption className="hero-anim-head">{labels.caption}</figcaption>
      <div className="hero-network" aria-hidden="true">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          {ranks.map((y) => (
            <path
              key={y}
              d={laneFor(y)}
              fill="none"
              stroke="var(--accent)"
              strokeOpacity=".38"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <line
            x1={center}
            y1={ranks[0]}
            x2={center}
            y2={ranks[ranks.length - 1]}
            stroke="var(--accent)"
            strokeOpacity=".64"
            strokeDasharray="3 4"
            vectorEffect="non-scaling-stroke"
          />
          {ranks.map((y, i) => (
            <circle
              key={y}
              r="3"
              fill="var(--accent)"
              className="hero-tok"
              style={{ offsetPath: `path("${laneFor(y)}")`, animationDelay: `${i * 100}ms` }}
            />
          ))}
        </svg>
        <span className="hero-terminal" style={position(inputX, middle)}><span>{labels.input}</span></span>
        {ranks.map((y, i) => (
          <span key={y} className="hero-rank" style={position(center, y)}>rank {i}</span>
        ))}
        <span className="hero-terminal" style={position(outputX, middle)}><span>{labels.output}</span></span>
      </div>
      <p className="hero-diagram-note">{labels.note}</p>
    </figure>
  );
};

window.HeroDiagram = HeroDiagram;
