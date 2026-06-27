/* Project animations — one small, restrained SVG vignette per project.
   Apple-style: subtle motion, monochrome + accent, no decorative noise.
*/

// ---------- BloomBee: P2P pipeline of transformer-block shards ----------

const BloomBeeAnim = () => {
  const W = 280, H = 160;
  // 4 peer nodes on a single baseline — clean horizontal pipeline.
  const BOX_W = 36, BOX_H = 22;
  const BASE_Y = 86;
  const peers = [
    { label: "L0–7",   geo: "us-w" },
    { label: "L8–15",  geo: "eu-c" },
    { label: "L16–23", geo: "ap-e" },
    { label: "L24–31", geo: "us-e" },
  ];
  // distribute evenly with margins for in/out labels
  const LEFT_PAD = 36, RIGHT_PAD = 36;
  const span = W - LEFT_PAD - RIGHT_PAD;
  const xs = peers.map((_, i) => LEFT_PAD + (span * (i + 0.5)) / peers.length);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="proj-svg">
      <defs>
        <style>{`
          @keyframes bb-act {
            0%   { offset-distance: 0%;   opacity: 0; }
            12%  { opacity: 1; }
            88%  { opacity: 1; }
            100% { offset-distance: 100%; opacity: 0; }
          }
          @keyframes bb-blink {
            0%, 100% { opacity: 0.35; }
            50%      { opacity: 1; }
          }
          .bb-act { offset-rotate: 0deg; animation: bb-act 3.2s linear infinite; }
        `}</style>
      </defs>

      {/* header */}
      <g fontFamily="var(--mono)" fontSize="9" letterSpacing="0.08em" fontWeight="600">
        <text x="14" y="20" fill="var(--ink-mute)">LLAMA 3.1 · 405B</text>
        <text x={W - 14} y="20" textAnchor="end" fill="var(--accent)">P2P · 4 PEERS</text>
      </g>

      {/* hop arcs ABOVE the boxes — activations travel through the internet */}
      {peers.slice(0, -1).map((_, i) => {
        const x1 = xs[i] + BOX_W / 2;
        const x2 = xs[i + 1] - BOX_W / 2;
        const yEnd = BASE_Y;
        const cx = (x1 + x2) / 2;
        const cy = BASE_Y - 26; // arc apex sits above the boxes
        const d = `M ${x1} ${yEnd} Q ${cx} ${cy}, ${x2} ${yEnd}`;
        return (
          <g key={`hop-${i}`}>
            <path d={d} fill="none" stroke="var(--rule)" strokeWidth="1" strokeDasharray="2 3" />
            <rect
              className="bb-act"
              x="-4" y="-2.5" width="8" height="5" rx="1.5"
              fill="var(--accent)"
              style={{ offsetPath: `path("${d}")`, animationDelay: `${-i * 0.8}s` }}
            />
          </g>
        );
      })}

      {/* peer nodes */}
      {peers.map((p, i) => (
        <g key={`peer-${i}`}>
          <rect
            x={xs[i] - BOX_W / 2} y={BASE_Y - BOX_H / 2}
            width={BOX_W} height={BOX_H} rx="4"
            fill="var(--bg)" stroke="var(--ink-soft)" strokeWidth="1"
          />
          {/* busy tick */}
          <rect
            x={xs[i] - BOX_W / 2 + 5} y={BASE_Y + BOX_H / 2 - 4}
            width={BOX_W - 10} height="1.5"
            fill="var(--accent)"
            style={{ animation: `bb-blink 1.6s ease-in-out ${i * 0.25}s infinite` }}
          />
          {/* layer-range label */}
          <text
            x={xs[i]} y={BASE_Y + 1}
            textAnchor="middle"
            fontFamily="var(--mono)" fontSize="9.5" fontWeight="600"
            fill="var(--ink)" letterSpacing="0.02em"
          >
            {p.label}
          </text>
          {/* geo tag underneath */}
          <text
            x={xs[i]} y={BASE_Y + BOX_H / 2 + 14}
            textAnchor="middle"
            fontFamily="var(--mono)" fontSize="8.5"
            fill="var(--ink-mute)" letterSpacing="0.08em"
          >
            {p.geo}
          </text>
        </g>
      ))}

      {/* in/out endpoints — sit cleanly outside the peer chain */}
      {(() => {
        const inX = xs[0] - BOX_W / 2;
        const outX = xs[xs.length - 1] + BOX_W / 2;
        const labelGap = 18;
        return (
          <g>
            <line x1={14 + labelGap} y1={BASE_Y} x2={inX} y2={BASE_Y}
              stroke="var(--ink-faint)" strokeWidth="1" />
            <line x1={outX} y1={BASE_Y} x2={W - 14 - labelGap} y2={BASE_Y}
              stroke="var(--ink-faint)" strokeWidth="1" />
            <text x="14" y={BASE_Y + 3}
              fontFamily="var(--mono)" fontSize="9" fontWeight="600"
              fill="var(--ink-mute)" letterSpacing="0.08em">
              in
            </text>
            <text x={W - 14} y={BASE_Y + 3} textAnchor="end"
              fontFamily="var(--mono)" fontSize="9" fontWeight="600"
              fill="var(--ink-mute)" letterSpacing="0.08em">
              out
            </text>
          </g>
        );
      })()}

      {/* footer caption */}
      <text x={W / 2} y={H - 10} textAnchor="middle"
        fontFamily="var(--mono)" fontSize="8.5" fill="var(--ink-mute)"
        letterSpacing="0.06em" fontWeight="600">
        layer-sharded pipeline · hivemind
      </text>
    </svg>
  );
};

// ---------- RoboRacer: top-down car following a track ----------

const RoboRacerAnim = () => {
  const W = 280, H = 160;
  // a smooth S-curve track
  const track = `M 24 ${H - 30} C 80 ${H - 30}, 90 30, 150 30 S 250 ${H - 30}, ${W - 20} ${H - 30}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="proj-svg">
      <defs>
        <style>{`
          @keyframes rr-car {
            0%   { offset-distance: 0%; }
            100% { offset-distance: 100%; }
          }
          @keyframes rr-ray {
            0%, 100% { opacity: 0.15; }
            50%      { opacity: 0.55; }
          }
          .rr-car  {
            offset-path: path("${track}");
            offset-rotate: auto;
            animation: rr-car 4.6s cubic-bezier(.45,.05,.55,.95) infinite;
          }
          .rr-ray { animation: rr-ray 1.4s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* lane edges */}
      <path d={track} fill="none" stroke="var(--rule)" strokeWidth="22" strokeLinecap="round" />
      <path d={track} fill="none" stroke="var(--bg)" strokeWidth="20" strokeLinecap="round" />
      {/* centerline dashes */}
      <path d={track} fill="none" stroke="var(--ink-faint)" strokeWidth="1" strokeDasharray="4 6" />

      {/* start / end markers */}
      <circle cx="24" cy={H - 30} r="4" fill="var(--bg)" stroke="var(--ink-soft)" strokeWidth="1.2" />
      <circle cx={W - 20} cy={H - 30} r="4" fill="var(--accent)" />

      {/* the car — small rounded rect with sensor rays */}
      <g className="rr-car">
        {/* sensor cone */}
        <path d="M 0 0 L 22 -7 L 22 7 Z" fill="var(--accent)" opacity="0.18" className="rr-ray" />
        {/* sensor rays */}
        <line x1="0" y1="0" x2="22" y2="-5" stroke="var(--accent)" strokeWidth="0.8" className="rr-ray" />
        <line x1="0" y1="0" x2="24" y2="0"  stroke="var(--accent)" strokeWidth="0.8" className="rr-ray" />
        <line x1="0" y1="0" x2="22" y2="5"  stroke="var(--accent)" strokeWidth="0.8" className="rr-ray" />
        {/* body */}
        <rect x="-7" y="-4.5" width="14" height="9" rx="2" fill="var(--ink)" />
        <rect x="-5" y="-3" width="4" height="6" fill="var(--accent)" opacity="0.85" />
      </g>

      {/* readout */}
      <g fontFamily="var(--mono)" fontSize="9" letterSpacing="0.08em" fontWeight="600">
        <text x="14" y="20" fill="var(--ink-mute)">AUTO · PID</text>
        <text x={W - 14} y="20" textAnchor="end" fill="var(--accent)">LANE LOCKED</text>
      </g>
    </svg>
  );
};

// ---------- Speech CNN: waveform → spectrogram → text ----------

const SpeechAnim = () => {
  const W = 280, H = 160;
  // 22 waveform bars on the left
  const BARS = 24;
  const barX0 = 18;
  const barW = 4;
  const barGap = 3;
  const barAreaH = 70;
  const barCY = 92;

  // pseudo-random but stable heights
  const heights = Array.from({ length: BARS }, (_, i) => {
    const v = Math.sin(i * 0.7) * Math.cos(i * 0.3) * 0.5 + 0.55;
    return Math.max(0.18, Math.min(0.95, v));
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="proj-svg">
      <defs>
        <style>{`
          @keyframes sp-bar {
            0%, 100% { transform: scaleY(0.35); }
            50%      { transform: scaleY(1); }
          }
          @keyframes sp-caret { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
          @keyframes sp-text-1 { 0%, 30% { opacity: 0; } 35%, 100% { opacity: 1; } }
          @keyframes sp-text-2 { 0%, 50% { opacity: 0; } 55%, 100% { opacity: 1; } }
          @keyframes sp-text-3 { 0%, 70% { opacity: 0; } 75%, 100% { opacity: 1; } }
          .sp-bar { transform-origin: center; transform-box: fill-box; }
          .sp-caret { animation: sp-caret 1s steps(2) infinite; }
        `}</style>
      </defs>

      {/* baseline */}
      <line x1={barX0 - 4} y1={barCY} x2={barX0 + BARS * (barW + barGap)} y2={barCY}
        stroke="var(--rule)" strokeWidth="1" />

      {/* waveform bars */}
      {heights.map((h, i) => {
        const x = barX0 + i * (barW + barGap);
        const hh = h * barAreaH * 0.5;
        return (
          <rect key={`b-${i}`}
            className="sp-bar"
            x={x} y={barCY - hh} width={barW} height={hh * 2} rx={barW / 2}
            fill="var(--accent)"
            style={{
              animation: `sp-bar ${1.1 + (i % 5) * 0.13}s ease-in-out ${i * 0.04}s infinite`,
              opacity: 0.75 + (i % 3) * 0.08,
            }}
          />
        );
      })}

      {/* arrow → */}
      <g transform={`translate(${barX0 + BARS * (barW + barGap) + 6} ${barCY})`}
         stroke="var(--ink-mute)" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <line x1="0" y1="0" x2="12" y2="0" />
        <polyline points="8,-3 12,0 8,3" />
      </g>

      {/* transcript box */}
      <g transform={`translate(${barX0} ${H - 36})`}>
        <text fontFamily="var(--mono)" fontSize="9" fill="var(--ink-mute)" letterSpacing="0.08em" fontWeight="600">
          TRANSCRIPT
        </text>
        <g transform="translate(0 18)" fontFamily="var(--sans)" fontSize="13" fill="var(--ink)" fontWeight="500">
          <text style={{ animation: "sp-text-1 2.4s ease-out infinite" }}>侬好</text>
          <text x="34" style={{ animation: "sp-text-2 2.4s ease-out infinite" }}>，</text>
          <text x="42" style={{ animation: "sp-text-3 2.4s ease-out infinite" }}>世界</text>
          <rect x="78" y="-11" width="2" height="14" fill="var(--accent)" className="sp-caret" />
        </g>
      </g>

      {/* model label */}
      <g fontFamily="var(--mono)" fontSize="9" letterSpacing="0.08em" fontWeight="600">
        <text x="14" y="20" fill="var(--ink-mute)">DIALECT · CNN</text>
        <text x={W - 14} y="20" textAnchor="end" fill="var(--accent)">↓ STT</text>
      </g>
    </svg>
  );
};

// ---------- Churn: scatter classified into risk buckets ----------

const ChurnAnim = () => {
  const W = 280, H = 160;
  // 3 vertical buckets: low / med / high
  const bucketY = 110;
  const bucketH = 32;
  const bucketW = 70;
  const gap = 12;
  const startX = (W - (bucketW * 3 + gap * 2)) / 2;

  const buckets = [
    { label: "LOW",  x: startX,                       color: "var(--ink-faint)" },
    { label: "MED",  x: startX + (bucketW + gap),     color: "var(--ink-mute)"  },
    { label: "HIGH", x: startX + (bucketW + gap) * 2, color: "var(--accent)"    },
  ];

  // dots that fall from top into a bucket
  const dots = [
    { x: 70,  bucket: 0, delay: 0.0  },
    { x: 110, bucket: 2, delay: 0.4  },
    { x: 150, bucket: 1, delay: 0.8  },
    { x: 90,  bucket: 0, delay: 1.2  },
    { x: 180, bucket: 2, delay: 1.6  },
    { x: 130, bucket: 1, delay: 2.0  },
    { x: 200, bucket: 2, delay: 2.4  },
    { x: 60,  bucket: 0, delay: 2.8  },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="proj-svg">
      <defs>
        <style>{`
          @keyframes ch-drop {
            0%   { transform: translateY(-30px); opacity: 0; }
            12%  { opacity: 1; }
            70%  { transform: translateY(46px); opacity: 1; }
            100% { transform: translateY(46px); opacity: 0; }
          }
          .ch-dot { transform-origin: center; transform-box: fill-box; }
        `}</style>
      </defs>

      {/* header */}
      <g fontFamily="var(--mono)" fontSize="9" letterSpacing="0.08em" fontWeight="600">
        <text x="14" y="20" fill="var(--ink-mute)">CHURN RISK</text>
        <text x={W - 14} y="20" textAnchor="end" fill="var(--accent)">RF · LR</text>
      </g>

      {/* incoming user lane (top dashed line) */}
      <line x1="40" y1="44" x2={W - 40} y2="44" stroke="var(--rule)" strokeWidth="1" strokeDasharray="3 4" />
      <text x="40" y="38" fontFamily="var(--mono)" fontSize="8" fill="var(--ink-mute)" letterSpacing="0.06em" fontWeight="600">
        USERS →
      </text>

      {/* falling dots, each classified */}
      {dots.map((d, i) => {
        const target = buckets[d.bucket];
        const tx = target.x + bucketW / 2;
        return (
          <circle key={`d-${i}`} r="3" fill={target.color}
            className="ch-dot"
            cx={tx} cy={50}
            style={{ animation: `ch-drop 3.2s cubic-bezier(.4,.05,.7,1) ${d.delay}s infinite` }} />
        );
      })}

      {/* 3 buckets */}
      {buckets.map((b, i) => (
        <g key={`bk-${i}`}>
          <rect x={b.x} y={bucketY} width={bucketW} height={bucketH} rx="6"
            fill="var(--bg-soft)" stroke="var(--rule)" strokeWidth="1" />
          {/* fill bar — taller for HIGH to imply detection */}
          <rect x={b.x + 4} y={bucketY + bucketH - 6 - (i === 2 ? 18 : i === 1 ? 10 : 5)}
            width={bucketW - 8} height={i === 2 ? 18 : i === 1 ? 10 : 5} rx="3"
            fill={b.color} opacity={i === 2 ? 0.9 : 0.55} />
          <text x={b.x + bucketW / 2} y={bucketY + bucketH + 14}
            textAnchor="middle"
            fontFamily="var(--mono)" fontSize="9" fill="var(--ink-soft)"
            letterSpacing="0.08em" fontWeight="600">
            {b.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

// ---------- registry ----------

const PROJECT_ANIMS = {
  bloombee:  BloomBeeAnim,
  roboracer: RoboRacerAnim,
  speech:    SpeechAnim,
  churn:     ChurnAnim,
};

window.PROJECT_ANIMS = PROJECT_ANIMS;
