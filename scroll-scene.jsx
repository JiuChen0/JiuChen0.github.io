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
