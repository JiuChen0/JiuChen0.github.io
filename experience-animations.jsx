/* Experience animations — small, icon-style vignettes (~104×68).
   Compact and abstract; sit beside each experience row.
*/

// ---------- shared ----------

const ExpFrame = ({ children }) => (
  <svg viewBox="0 0 104 68" className="exp-svg">
    {children}
  </svg>
);

// ---------- 1. UC Merced — research / BloomBee pipeline (mini) ----------

const ExpResearchAnim = () => {
  const peers = [22, 52, 82];
  const y = 34;
  return (
    <ExpFrame>
      <defs>
        <style>{`
          @keyframes ea-flow {
            0%   { offset-distance: 0%;   opacity: 0; }
            15%  { opacity: 1; }
            85%  { opacity: 1; }
            100% { offset-distance: 100%; opacity: 0; }
          }
          .ea-flow { offset-rotate: 0deg; animation: ea-flow 2.4s linear infinite; }
        `}</style>
      </defs>
      {/* hop arcs above */}
      {peers.slice(0, -1).map((x, i) => {
        const x1 = x + 7, x2 = peers[i + 1] - 7;
        const d = `M ${x1} ${y} Q ${(x1 + x2) / 2} ${y - 14}, ${x2} ${y}`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke="var(--rule)" strokeWidth="1" strokeDasharray="2 3" />
            <circle r="2.2" fill="var(--accent)" className="ea-flow"
              style={{ offsetPath: `path("${d}")`, animationDelay: `${-i * 0.7}s` }} />
          </g>
        );
      })}
      {/* peer boxes */}
      {peers.map((x, i) => (
        <g key={`p-${i}`}>
          <rect x={x - 7} y={y - 7} width="14" height="14" rx="2.5"
            fill="var(--bg)" stroke="var(--ink-soft)" strokeWidth="1" />
          <rect x={x - 4} y={y + 1.5} width="8" height="1.2" fill="var(--accent)" opacity="0.7" />
        </g>
      ))}
      {/* caption */}
      <text x="52" y="56" textAnchor="middle"
        fontFamily="var(--mono)" fontSize="7" fontWeight="600"
        fill="var(--ink-mute)" letterSpacing="0.08em">
        P2P · L0…L31
      </text>
    </ExpFrame>
  );
};

// ---------- 2. WashU TA — terminal / office hours ----------

const ExpTeachingAnim = () => (
  <ExpFrame>
    <defs>
      <style>{`
        @keyframes ea-type-1 { 0%, 18% { opacity: 0; } 22%, 100% { opacity: 1; } }
        @keyframes ea-type-2 { 0%, 40% { opacity: 0; } 44%, 100% { opacity: 1; } }
        @keyframes ea-type-3 { 0%, 62% { opacity: 0; } 66%, 100% { opacity: 1; } }
        @keyframes ea-caret { 0%, 100% { opacity: 1; } 50% { opacity: 0.15; } }
        .ea-caret { animation: ea-caret 1s steps(2) infinite; }
      `}</style>
    </defs>
    {/* terminal frame */}
    <rect x="10" y="12" width="84" height="44" rx="4"
      fill="var(--bg)" stroke="var(--ink-faint)" strokeWidth="1" />
    {/* traffic dots */}
    <circle cx="16" cy="18" r="1.4" fill="var(--ink-faint)" />
    <circle cx="21" cy="18" r="1.4" fill="var(--ink-faint)" />
    <circle cx="26" cy="18" r="1.4" fill="var(--ink-faint)" />
    {/* prompt + chars */}
    <g fontFamily="var(--mono)" fontSize="7.5" fontWeight="600" letterSpacing="0.05em">
      <text x="14" y="34" fill="var(--accent)">{">"}</text>
      <text x="22" y="34" fill="var(--ink)" style={{ animation: "ea-type-1 3s ease-out infinite" }}>g</text>
      <text x="28" y="34" fill="var(--ink)" style={{ animation: "ea-type-2 3s ease-out infinite" }}>c</text>
      <text x="34" y="34" fill="var(--ink)" style={{ animation: "ea-type-3 3s ease-out infinite" }}>c</text>
      <text x="14" y="46" fill="var(--ink-mute)">cse132</text>
      <rect x="42" y="40" width="1.4" height="8" fill="var(--accent)" className="ea-caret" />
    </g>
  </ExpFrame>
);

// ---------- 3. Garmin — radar sweep ----------

const ExpRadarAnim = () => {
  const cx = 52, cy = 36, r = 22;
  return (
    <ExpFrame>
      <defs>
        <style>{`
          @keyframes ea-sweep {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes ea-blip {
            0%, 40%  { r: 0; opacity: 0; }
            45%      { r: 1.4; opacity: 1; }
            100%     { r: 3.5; opacity: 0; }
          }
          .ea-sweep { transform-origin: ${cx}px ${cy}px; animation: ea-sweep 3s linear infinite; }
          .ea-blip  { animation: ea-blip 3s linear infinite; }
        `}</style>
        <linearGradient id="sweep-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* rings */}
      <circle cx={cx} cy={cy} r={r}        fill="none" stroke="var(--rule)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r * 0.66} fill="none" stroke="var(--rule)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r * 0.33} fill="none" stroke="var(--rule)" strokeWidth="1" />
      {/* crosshairs */}
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="var(--rule)" strokeWidth="1" />
      <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="var(--rule)" strokeWidth="1" />
      {/* sweep */}
      <g className="ea-sweep">
        <path d={`M ${cx} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 0 0 ${cx + Math.cos(-Math.PI / 3) * r} ${cy + Math.sin(-Math.PI / 3) * r} Z`}
          fill="url(#sweep-grad)" />
        <line x1={cx} y1={cy} x2={cx + r} y2={cy}
          stroke="var(--accent)" strokeWidth="1.2" />
      </g>
      {/* a couple of "detected" blips */}
      <circle cx={cx + 8} cy={cy - 10} fill="var(--accent)" className="ea-blip" />
      <circle cx={cx - 14} cy={cy + 6} fill="var(--accent)"
        className="ea-blip" style={{ animationDelay: "-1.4s" }} />
      {/* center */}
      <circle cx={cx} cy={cy} r="1.6" fill="var(--ink)" />
    </ExpFrame>
  );
};

// ---------- 4. Zhejiang — waveform pulse ----------

const ExpWaveformAnim = () => {
  const bars = 11;
  const startX = 16;
  const barW = 5;
  const gap = 2;
  const cy = 34;
  return (
    <ExpFrame>
      <defs>
        <style>{`
          @keyframes ea-bar {
            0%, 100% { transform: scaleY(0.3); }
            50%      { transform: scaleY(1); }
          }
          .ea-bar { transform-origin: center; transform-box: fill-box; }
        `}</style>
      </defs>
      {/* baseline */}
      <line x1={startX - 4} y1={cy} x2={startX + bars * (barW + gap)} y2={cy}
        stroke="var(--rule)" strokeWidth="1" />
      {Array.from({ length: bars }).map((_, i) => {
        const x = startX + i * (barW + gap);
        const h = 6 + (i % 4) * 4 + Math.sin(i * 0.8) * 3;
        return (
          <rect key={i} className="ea-bar"
            x={x} y={cy - h} width={barW} height={h * 2} rx={barW / 2}
            fill="var(--accent)" opacity={0.75 + (i % 3) * 0.08}
            style={{ animation: `ea-bar ${1 + (i % 4) * 0.15}s ease-in-out ${i * 0.06}s infinite` }} />
        );
      })}
      <text x="52" y="58" textAnchor="middle"
        fontFamily="var(--mono)" fontSize="7" fontWeight="600"
        fill="var(--ink-mute)" letterSpacing="0.08em">
        CNN · STT
      </text>
    </ExpFrame>
  );
};

// ---------- 5. China Unicom — shield + scan line ----------

const ExpShieldAnim = () => {
  const cx = 52, top = 12, w = 28, h = 40;
  // shield path
  const sx = cx, sy = top;
  const shield = `
    M ${sx} ${sy}
    L ${sx + w / 2} ${sy + 6}
    L ${sx + w / 2} ${sy + h - 14}
    Q ${sx + w / 2} ${sy + h}, ${sx} ${sy + h}
    Q ${sx - w / 2} ${sy + h}, ${sx - w / 2} ${sy + h - 14}
    L ${sx - w / 2} ${sy + 6}
    Z
  `;
  return (
    <ExpFrame>
      <defs>
        <style>{`
          @keyframes ea-scan {
            0%   { transform: translateY(0px); opacity: 0.3; }
            10%  { opacity: 1; }
            50%  { transform: translateY(34px); opacity: 1; }
            90%  { opacity: 1; }
            100% { transform: translateY(0px); opacity: 0.3; }
          }
          @keyframes ea-pip { 0%, 100% { opacity: 0.25; } 50% { opacity: 1; } }
          .ea-scan { animation: ea-scan 2.4s ease-in-out infinite; }
        `}</style>
        <clipPath id="shield-clip">
          <path d={shield} />
        </clipPath>
      </defs>
      {/* shield outline */}
      <path d={shield} fill="var(--bg-soft)" stroke="var(--ink-soft)" strokeWidth="1.1" />
      {/* horizontal feature ticks inside (feature importance bars) */}
      <g clipPath="url(#shield-clip)">
        <rect x={cx - 9} y={top + 12} width="10" height="1.2" fill="var(--ink-faint)" />
        <rect x={cx - 9} y={top + 17} width="14" height="1.2" fill="var(--ink-faint)" />
        <rect x={cx - 9} y={top + 22} width="6"  height="1.2" fill="var(--ink-faint)" />
        <rect x={cx - 9} y={top + 27} width="12" height="1.2" fill="var(--ink-faint)" />
        {/* sweeping scan line */}
        <rect x={cx - 14} y={top} width="28" height="1.5" fill="var(--accent)" className="ea-scan" />
      </g>
      {/* tiny corner pips */}
      <circle cx={cx - 14} cy={top + 3} r="1.2" fill="var(--accent)"
        style={{ animation: "ea-pip 1.6s ease-in-out infinite" }} />
      <circle cx={cx + 14} cy={top + 3} r="1.2" fill="var(--accent)"
        style={{ animation: "ea-pip 1.6s ease-in-out 0.8s infinite" }} />
      {/* caption */}
      <text x="52" y="64" textAnchor="middle"
        fontFamily="var(--mono)" fontSize="7" fontWeight="600"
        fill="var(--ink-mute)" letterSpacing="0.08em">
        RISK · RF
      </text>
    </ExpFrame>
  );
};

// ---------- registry ----------

window.EXP_ANIMS = {
  research: ExpResearchAnim,
  teaching: ExpTeachingAnim,
  radar:    ExpRadarAnim,
  waveform: ExpWaveformAnim,
  shield:   ExpShieldAnim,
};
