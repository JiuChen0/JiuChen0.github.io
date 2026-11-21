/* A sticky frame with a reversible timeline driven by document scrolling. */
const limitSceneProgress = (value) => Math.min(1, Math.max(0, value));

const ScrollScene = ({ className = "", prepare, children }) => {
  const storyRef = React.useRef(null);
  const frameRef = React.useRef(null);

  React.useLayoutEffect(() => {
    const story = storyRef.current;
    const frame = frameRef.current;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const draw = prepare?.(story, frame);
    let enabled = false;
    let distance = 0;
    let stickyTop = 0;
    let progress = 0;
    let lastTime = 0;
    let raf = 0;

    const target = () => {
      const entry = 44;
      return limitSceneProgress((stickyTop + entry - story.getBoundingClientRect().top) / (distance + entry));
    };

    const paint = () => {
      story.style.setProperty("--scene-progress", progress);
      draw?.(progress);
    };

    const tick = (now) => {
      raf = 0;
      const next = target();
      const elapsed = lastTime ? now - lastTime : 16;
      progress += (next - progress) * (1 - Math.exp(-elapsed / 48));
      if (Math.abs(next - progress) < .003) {
        progress = next;
        lastTime = 0;
      } else {
        lastTime = now;
        raf = requestAnimationFrame(tick);
      }
      paint();
    };

    const onScroll = () => {
      if (enabled && !raf && progress !== target()) raf = requestAnimationFrame(tick);
    };

    const measure = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      lastTime = 0;
      stickyTop = Math.max(parseFloat(getComputedStyle(frame).top) || 0, 0);
      enabled = !motion.matches && frame.offsetHeight + stickyTop + 24 <= window.innerHeight;
      story.toggleAttribute("data-scroll-enabled", enabled);
      if (enabled) {
        distance = story.offsetHeight - frame.offsetHeight;
        progress = target();
        paint();
      }
    };

    measure();
    const size = new ResizeObserver(measure);
    size.observe(frame);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    motion.addEventListener("change", measure);
    return () => {
      cancelAnimationFrame(raf);
      size.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      motion.removeEventListener("change", measure);
    };
  }, [prepare]);

  return (
    <div className={`scroll-scene ${className}`} ref={storyRef}>
      <div className="scroll-scene__frame" ref={frameRef}>{children}</div>
    </div>
  );
};

window.ScrollScene = ScrollScene;


const ChapterSequence = ({ title, children }) => {
  const sequenceRef = React.useRef(null);

  React.useLayoutEffect(() => {
    const sequence = sequenceRef.current;
    const heading = sequence.querySelector(".chapter-heading");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const rows = [...sequence.querySelectorAll("[data-chapter-row]")].map(row => ({
      row,
      figure: row.querySelector(".proj-anim"),
      progress: null,
      figureProgress: null,
      animations: [],
      duration: 0,
    }));
    let enabled = false;
    let raf = 0;
    let lastTime = 0;

    const progressAt = (top, scroll, first, last, maxScroll) => {
      const end = Math.min(top + scroll - last, maxScroll);
      const start = Math.min(top + scroll - first, end - 96);
      return limitSceneProgress((scroll - start) / (end - start));
    };

    const tick = (now, immediate = false) => {
      raf = 0;
      const elapsed = lastTime ? now - lastTime : 16;
      const ease = immediate ? 1 : 1 - Math.exp(-elapsed / 48);
      const scroll = window.scrollY;
      const height = window.innerHeight;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - height);
      const top = Math.max(72, Math.min(192, (heading?.offsetHeight || 0) + 78));
      const first = top + (height - top) * .81;
      const last = top + (height - top) * .12;
      const targets = rows.map(({ row, figure }) => ({
        row: progressAt(row.getBoundingClientRect().top, scroll, first, last, maxScroll),
        figure: figure ? progressAt(figure.getBoundingClientRect().top, scroll, first, last, maxScroll) : 0,
      }));
      let moving = false;
      let sum = 0;
      const interpolate = (value, target) => {
        const next = value === null ? target : value + (target - value) * ease;
        if (Math.abs(next - target) < .002) return target;
        moving = true;
        return next;
      };

      rows.forEach((item, i) => {
        const progress = interpolate(item.progress, targets[i].row);
        const figureProgress = interpolate(item.figureProgress, targets[i].figure);
        if (progress !== item.progress) item.row.style.setProperty("--row-progress", progress);
        if (figureProgress !== item.figureProgress) {
          const time = Math.min(item.duration * figureProgress, Math.max(0, item.duration - .5));
          item.animations.forEach(animation => { animation.currentTime = time; });
        }
        item.progress = progress;
        item.figureProgress = figureProgress;
        sum += progress;
      });
      if (heading) {
        heading.style.setProperty("--chapter-progress", sum / Math.max(1, rows.length));
        heading.toggleAttribute("data-pinned", heading.getBoundingClientRect().top > sequence.getBoundingClientRect().top + 1);
      }

      if (moving) {
        lastTime = now;
        raf = requestAnimationFrame(tick);
      } else {
        lastTime = 0;
      }
    };

    const onScroll = () => {
      if (enabled && !raf) raf = requestAnimationFrame(tick);
    };

    const applyPreference = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      enabled = !motion.matches;
      sequence.toggleAttribute("data-sequence-ready", enabled);
      if (!enabled) return;
      rows.forEach(item => {
        item.animations = item.figure?.getAnimations({ subtree: true }) || [];
        item.duration = Math.max(0, ...item.animations.map(animation => {
          const { duration, delay } = animation.effect.getTiming();
          animation.pause();
          return Number(duration) + Math.max(delay, 0);
        }));
        item.progress = null;
        item.figureProgress = null;
      });
      tick(performance.now(), true);
    };

    applyPreference();
    const size = new ResizeObserver(onScroll);
    size.observe(sequence);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    motion.addEventListener("change", applyPreference);
    return () => {
      size.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      motion.removeEventListener("change", applyPreference);
    };
  }, []);

  return (
    <div className="chapter-sequence" ref={sequenceRef}>
      {title && <div className="chapter-heading"><h2 className="s-title">{title}</h2></div>}
      {children}
    </div>
  );
};

window.ChapterSequence = ChapterSequence;
