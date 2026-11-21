/* Scroll through the work distribution, rank communication, and result collection. */

const STORY_LABELS = {
  en: {
    caption: "Parallel computation and communication",
    input: "Workload",
    output: "Results",
    steps: ["Dispatch work", "Exchange data", "Gather results"],
    note: "A workload is split across four ranks. They exchange data before the results are gathered.",
  },
  zh: {
    caption: "并行计算与进程间通信",
    input: "任务输入",
    output: "汇总结果",
    steps: ["分发任务", "交换数据", "汇总结果"],
    note: "任务分给四个进程。各进程在计算时交换数据，最后汇总结果。",
  },
};

const NETWORK_WIDTH = 720;
const NETWORK_HEIGHT = 180;
const NETWORK_CENTER = 360;
const NETWORK_INPUT = 94;
const NETWORK_OUTPUT = NETWORK_WIDTH - NETWORK_INPUT;
const NETWORK_MIDDLE = 90;
const NETWORK_RANKS = [22, 67, 113, 158];

const terminalPosition = (x, y) => ({
  left: `${100 * x / NETWORK_WIDTH}%`,
  top: `${100 * y / NETWORK_HEIGHT}%`,
});

const dispatchPath = (y) =>
  `M ${NETWORK_INPUT} ${NETWORK_MIDDLE} C 174 ${NETWORK_MIDDLE}, 238 ${y}, ${NETWORK_CENTER} ${y}`;
const gatherPath = (y) =>
  `M ${NETWORK_CENTER} ${y} C 482 ${y}, 546 ${NETWORK_MIDDLE}, ${NETWORK_OUTPUT} ${NETWORK_MIDDLE}`;
const prepareResearchDiagram = (story, scene) => {
  const get = (name) => [...scene.querySelectorAll(`[data-network="${name}"]`)];
  const trace = (name) => get(name).map(path => ({ path, length: path.getTotalLength() }));
  const left = trace("dispatch");
  const right = trace("gather");
  const dots = get("rank-dot");
  const exchanges = get("exchange-dot");

  const move = (dot, position, visibility) => {
    dot.setAttribute("cx", position.x);
    dot.setAttribute("cy", position.y);
    dot.setAttribute("opacity", visibility);
  };

  const fade = (part) => Math.min(1, part * 12, (1 - part) * 12);

  return (progress) => {
    const dispatch = limitSceneProgress(progress * 3);
    const exchange = limitSceneProgress(progress * 3 - 1);
    const gather = limitSceneProgress(progress * 3 - 2);
    const step = Math.min(2, Math.floor(progress * 3));
    story.dataset.step = step;
    story.style.setProperty("--research-dispatch", dispatch);
    story.style.setProperty("--research-exchange", exchange);
    story.style.setProperty("--research-gather", gather);

    const receiving = step === 0;
    const lanes = receiving ? left : right;
    const travel = receiving ? dispatch : gather;
    dots.forEach((dot, i) => {
      const lane = lanes[i];
      const part = limitSceneProgress((travel - i * .04) / .88);
      move(dot, lane.path.getPointAtLength(part * lane.length), fade(part));
    });

    const first = NETWORK_RANKS[0];
    const last = NETWORK_RANKS[NETWORK_RANKS.length - 1];
    exchanges.forEach((dot, index) => {
      move(dot, {
        x: NETWORK_CENTER,
        y: index ? last - (last - first) * exchange : first + (last - first) * exchange,
      }, fade(exchange));
    });
  };
};

const ResearchStory = ({ language, children }) => {
  const labels = STORY_LABELS[language];
  return (
    <ScrollScene className="research-story" prepare={prepareResearchDiagram}>
      {children}
      <figure className="research-diagram">
        <figcaption>{labels.caption}</figcaption>
        <div className="research-network" aria-hidden="true">
          <svg viewBox={`0 0 ${NETWORK_WIDTH} ${NETWORK_HEIGHT}`} preserveAspectRatio="none">
            {NETWORK_RANKS.map((y) => (
              <g key={y}>
                <path className="research-lane" d={dispatchPath(y) + " " + gatherPath(y)} />
                <path className="research-dispatch" data-network="dispatch" d={dispatchPath(y)} pathLength="1" />
                <path className="research-gather" data-network="gather" d={gatherPath(y)} pathLength="1" />
              </g>
            ))}
            <line className="research-exchange" x1={NETWORK_CENTER} y1={NETWORK_RANKS[0]}
              x2={NETWORK_CENTER} y2={NETWORK_RANKS[NETWORK_RANKS.length - 1]} />
            {NETWORK_RANKS.map((y) => <ellipse className="research-packet" key={y} data-network="rank-dot" />)}
            <ellipse className="research-packet" data-network="exchange-dot" />
            <ellipse className="research-packet" data-network="exchange-dot" />
          </svg>
          <span className="research-terminal research-input" style={terminalPosition(NETWORK_INPUT, NETWORK_MIDDLE)}>
            <span>{labels.input}</span>
          </span>
          {NETWORK_RANKS.map((y, i) => (
            <span key={y} className="research-rank" style={terminalPosition(NETWORK_CENTER, y)}>rank {i}</span>
          ))}
          <span className="research-terminal research-output" style={terminalPosition(NETWORK_OUTPUT, NETWORK_MIDDLE)}>
            <span>{labels.output}</span>
          </span>
        </div>
        <ol className="research-steps" aria-hidden="true">
          {labels.steps.map((label) => <li key={label}>{label}</li>)}
        </ol>
        <p className="research-diagram-note">{labels.note}</p>
      </figure>
    </ScrollScene>
  );
};

window.ResearchStory = ResearchStory;
