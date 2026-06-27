/* Jiu Chen — personal site
   Clean / minimal direction. Single-page scrolling layout with sticky rail nav.
*/

const { useState, useEffect, useRef } = React;

// ---------- data ----------

const SECTIONS = [
  { id: "about",        label: "About" },
  { id: "research",     label: "Research" },
  { id: "publications", label: "Publications" },
  { id: "projects",     label: "Projects" },
  { id: "experience",   label: "Experience" },
  { id: "education",    label: "Education" },
  { id: "awards",       label: "Awards" },
  { id: "contact",      label: "Contact" },
];

const RESEARCH = [
  {
    tag: "AREA 01",
    title: "Distributed LLM inference",
    blurb: "Tensor / pipeline / expert parallelism, KV-cache scheduling, and the serving-time tradeoffs of latency, throughput, and memory pressure on commodity clusters.",
  },
  {
    tag: "AREA 02",
    title: "Heterogeneous computing",
    blurb: "Co-scheduling across GPU, CPU, and emerging accelerators — placement, offloading, and the cost models that decide where each tensor lives.",
  },
  {
    tag: "AREA 03",
    title: "System performance",
    blurb: "Profiling, kernel-level bottleneck analysis, and the long tail of memory-bandwidth and PCIe / NVLink contention that dominates real workloads.",
  },
  {
    tag: "AREA 04",
    title: "ML systems for scale",
    blurb: "Building runtimes and primitives that survive the gap between a clean benchmark and the messy, multi-tenant reality of production serving.",
  },
];

const PUBLICATIONS = [
  {
    year: "2026",
    venue: "arXiv preprint",
    title: "Distributed Generative Inference of LLM at Internet Scales with Multi-Dimensional Communication Optimization",
    authors: [
      { name: "Jiu Chen", me: true, eq: true },
      { name: "Shuangyan Yang", eq: true },
      { name: "Xu Xiong", eq: true },
      { name: "Hexiao Duan" },
      { name: "Xinran Zhang" },
      { name: "Jie Ren" },
      { name: "Dong Li" },
    ],
    venueLong: "arXiv:2604.21072 · May 2026",
    links: [
      { label: "PDF", href: "https://arxiv.org/pdf/2604.21072" },
      { label: "Abstract", href: "https://arxiv.org/abs/2604.21072" },
    ],
  },
];

const PROJECTS = [
  {
    anim: "bloombee",
    title: "BloomBee — decentralized LLM fine-tuning & inference",
    stack: ["Python", "PyTorch", "Hivemind", "P2P"],
    blurb: "Contributing to BloomBee, a decentralized serving system that splits a model's transformer blocks across peers in a P2P network — letting heterogeneous, idle GPUs collaboratively serve and fine-tune very large models (e.g. LLaMA 3.1 405B) that no single machine could hold. Built on Hivemind and FlexLLMGen, with HuggingFace Transformers integration. My contributions focus on system-level cleanup of the runtime: optimizing shared-memory usage in the offloading path, retiring legacy quantization code, and removing dead modules to keep the codebase lean for new contributors.",
    links: [
      { label: "Repo", href: "https://github.com/ai-decentralized/BloomBee" },
      { label: "PR #34", href: "https://github.com/ai-decentralized/BloomBee/pull/34" },
    ],
  },
  {
    anim: "roboracer",
    title: "RoboRacer — autonomous navigation system",
    stack: ["Arduino", "OpenMV", "PID", "C++"],
    blurb: "Built an autonomous-driving stack for a racing platform at Garmin: Arduino control logic, OpenMV vision for lane detection, RX/TX sensor exchange, PID for path-following, and multi-sensor obstacle-avoidance for real-time adaptability.",
    links: [{ label: "Writeup", href: "#" }],
  },
  {
    anim: "speech",
    title: "Dialect speech-recognition CNNs",
    stack: ["Python", "TensorFlow", "CNN"],
    blurb: "Designed and trained CNN-based acoustic models at Zhejiang University for speech-to-text on regional Chinese dialects — focusing on accuracy and usability for underserved language variants.",
    links: [{ label: "Writeup", href: "#" }],
  },
  {
    anim: "churn",
    title: "High-risk user churn prediction",
    stack: ["Python", "Logistic Reg.", "Random Forest"],
    blurb: "Built a churn-risk pipeline at China Unicom: feature engineering and time-series user-activity signals fed into logistic regression, decision trees, and random forests; iteratively tuned to improve high-risk identification accuracy.",
    links: [{ label: "Writeup", href: "#" }],
  },
];

const EXPERIENCE = [
  {
    anim: "research",
    when: "2025 — Present",
    title: "Visiting Researcher · Distributed LLM Systems",
    where: "Parallel Architecture, System & Algorithm Lab — UC Merced",
    blurb: "Working on BloomBee, a decentralized P2P serving system that shards a model's transformer blocks across peers so heterogeneous GPUs can collaboratively run and fine-tune very-large models (e.g. LLaMA 3.1 405B) built on Hivemind and FlexLLMGen. Cleaning up the runtime: optimizing shared-memory usage in the offloading path, retiring legacy quantization, and trimming dead code to keep the system approachable for new contributors.",
    tag: "Research",
  },
  {
    anim: "teaching",
    when: "2025",
    title: "Graduate Teaching Assistant · CSE 132",
    where: "McKelvey School of Engineering — Washington University in St. Louis",
    blurb: "TA for Intro to Computer Engineering: held office hours, supported students on programming, Arduino, and assembly-language assignments; helped run Piazza and improve course communication.",
    tag: "Teaching",
  },
  {
    anim: "radar",
    when: "2023",
    title: "Machine Recognition Developer",
    where: "Garmin Ltd. — Oregon, USA",
    blurb: "Developed an autonomous-navigation system for RoboRacer using Arduino, an OpenMV camera, and PID-controlled path-following. Integrated multi-sensor obstacle avoidance for real-time adaptability.",
    tag: "Industry",
  },
  {
    anim: "waveform",
    when: "2021",
    title: "Research Assistant · Speech Recognition",
    where: "Graduate School — Zhejiang University, Ningbo",
    blurb: "Built CNN acoustic models (Python / TensorFlow) for dialect-aware speech-to-text, improving accuracy for regional Chinese variants.",
    tag: "Research",
  },
  {
    anim: "shield",
    when: "2021",
    title: "Information Security Intern",
    where: "China Unicom Ltd. — Gansu, China",
    blurb: "Designed a high-risk user-churn identification pipeline. Engineered time-series features and trained logistic-regression, decision-tree, and random-forest models to improve churn-risk classification.",
    tag: "Industry",
  },
];

const EDUCATION = [
  {
    when: "2024 — 2025",
    degree: "M.S. in Computer Science",
    where: "Washington University in St. Louis, MO, USA",
    watermark: { kind: "img", src: "assets/washu-shield.png" },
  },
  {
    when: "2021 — 2024",
    degree: "B.S. in Computer Science",
    where: "Oregon State University, OR, USA",
    watermark: { kind: "img", src: "assets/osu-shield.png" },
  },
  {
    when: "2018 — 2022",
    degree: "B.Eng. in Electronics Engineering",
    where: "Northwest Minzu University, Gansu, China",
    watermark: { kind: "img", src: "assets/nmu-logo.png" },
  },
];

const AWARDS = [
  { year: "2023", text: "Andrew C. Lim, Lim Ho Puah & Lim Peng Mau Scholarship — Oregon State University, College of Engineering." },
  { year: "2023", text: "International Student Scholarship — Oregon State University." },
  { year: "2021", text: "Computer Software Copyright — issued by the National Copyright Administration of China." },
  { year: "2021", text: "Third Prize — China Computer Design Competition." },
  { year: "2021", text: "Third-Class Scholarship — Northwest Minzu University." },
  { year: "2019", text: "Third-Class Scholarship — Northwest Minzu University." },
];

// ---------- helpers ----------

const useActiveSection = (ids) => {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 140;
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids.join(",")]);
  return active;
};

// ---------- rail ----------

const Rail = ({ active }) => (
  <aside className="rail">
    <div className="rail-mark">
      <img className="avatar" src="assets/jiu-chen.jpg" alt="Jiu Chen" />
      <span>Jiu Chen</span>
    </div>

    <div>
      <div className="rail-block-label">Contents</div>
      <nav className="rail-nav">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === s.id ? "active" : ""}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </div>

    <div>
      <div className="rail-block-label">Elsewhere</div>
      <div className="rail-links">
        <a href="https://github.com/JiuChen0" target="_blank" rel="noopener">GitHub</a>
        <a href="https://www.linkedin.com/in/jiuchen" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://arxiv.org/abs/2604.21072" target="_blank" rel="noopener">arXiv</a>
        <a href="mailto:c.jiu@wustl.edu">Email</a>
      </div>
    </div>

    <div>
      <div className="rail-block-label">Updated</div>
      <div className="rail-stamp">May 2026</div>
    </div>
  </aside>
);

// ---------- sections ----------

const Hero = ({ showAnim }) => (
  <header className="hero" id="top">
    <img className="hero-portrait" src="assets/jiu-chen.jpg" alt="Jiu Chen" />
    <div className="hero-meta">
      <span className="pulse"></span>
      <span>Incoming Ph.D. · ML Systems · St. Louis → ?</span>
    </div>
    <h1>
      Building systems for{" "}
      <span className="grad">large&nbsp;models</span>{" "}
      at&nbsp;scale.
    </h1>
    <p className="hero-lede">
      I'm Jiu Chen — a computer-science researcher working on machine-learning
      systems, with a focus on distributed inference for large models, heterogeneous
      computing, and the long, unglamorous business of performance optimization.
    </p>
    <div className="hero-tags">
      <span>Distributed inference</span>
      <span>Tensor / pipeline parallelism</span>
      <span>Heterogeneous compute</span>
      <span>Kernel-level perf</span>
      <span>ML runtimes</span>
    </div>
    {showAnim && <HeroDiagram playing={true} />}
  </header>
);

const SectionHead = ({ eyebrow, title }) => (
  <>
    <div className="s-eyebrow">{eyebrow}</div>
    <h2 className="s-title">{title}</h2>
  </>
);

const About = () => (
  <section className="s" id="about">
    <SectionHead eyebrow="About" title="A few words about me." />
    <div className="s-body">
      <p className="lead">
        I graduated from <strong>Washington University in St. Louis</strong> with a
        Master's degree in Computer Science. I'm currently a visiting researcher
        at the <strong>Parallel Architecture, System &amp; Algorithm Lab</strong> at
        UC Merced, working on distributed large-model inference.
      </p>
      <p>
        My primary interests focus on large-scale machine-learning systems —
        distributed LLM inference, heterogeneous computing, and system performance
        optimization. I'm starting a Ph.D. in Fall 2026 and using the months in
        between to read more carefully, write more slowly, and think about what
        kinds of systems would actually be worth building over the next five years.
      </p>
    </div>
  </section>
);

const Research = () => (
  <section className="s" id="research">
    <SectionHead eyebrow="Research" title="What I think about." />
    <div className="s-body">
      <p className="lead">
        Broadly: how do we make very large models cheap, fast, and predictable
        to serve? The interesting answers tend to live at the boundary between
        the model, the runtime, and the hardware.
      </p>
      <div className="research-grid">
        {RESEARCH.map((r) => (
          <div key={r.tag} className="research-cell">
            <div className="tag">{r.tag}</div>
            <h3>{r.title}</h3>
            <p>{r.blurb}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Publications = () => (
  <section className="s" id="publications">
    <SectionHead eyebrow="Publications" title="Papers & preprints." />
    <div className="s-body">
      <p style={{ fontSize: 14.5, color: "var(--ink-mute)", marginBottom: 6 }}>
        Author names in <strong>bold</strong> indicate me.
        <span style={{ marginLeft: 8 }}>(<sup style={{ color: "var(--accent)" }}>*</sup> equal contribution)</span>
      </p>
      <div>
        {PUBLICATIONS.map((p, i) => (
          <article className="pub" key={i}>
            <div className="pub-meta">
              <span className="y">{p.year}</span>
              <span>{p.venue}</span>
            </div>
            <div className="pub-body">
              <h3>{p.title}</h3>
              <p className="authors">
                {p.authors.map((a, j) => (
                  <React.Fragment key={j}>
                    {a.me ? <strong>{a.name}</strong> : a.name}
                    {a.eq ? <sup style={{ color: "var(--accent)", marginLeft: 1 }}>*</sup> : null}
                    {j < p.authors.length - 1 ? ", " : ""}
                  </React.Fragment>
                ))}
              </p>
              <p className="venue">{p.venueLong}</p>
              <div className="pub-links">
                {p.links.map((l) => (
                  <a className="pill-link" key={l.label} href={l.href} target="_blank" rel="noopener">{l.label} <span style={{ opacity: 0.6 }}>↗</span></a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const Projects = () => (
  <section className="s" id="projects">
    <SectionHead eyebrow="Projects" title="Things I've built." />
    <div className="s-body">
      <p className="lead">
        Code, experiments, and systems I've built across research and industry settings.
      </p>
      <div>
        {PROJECTS.map((p, i) => {
          const Anim = window.PROJECT_ANIMS && window.PROJECT_ANIMS[p.anim];
          return (
            <article className="proj" key={i}>
              <div className="proj-text">
                <div className="proj-head">
                  <h3>{p.title}</h3>
                </div>
                <div className="proj-stack">
                  {p.stack.map((s, j) => (<span key={j}>{s}</span>))}
                </div>
                <p>{p.blurb}</p>
                <div className="proj-links">
                  {p.links.map((l) => (
                    <a className="pill-link" key={l.label} href={l.href} target="_blank" rel="noopener">{l.label} <span style={{ opacity: 0.6 }}>↗</span></a>
                  ))}
                </div>
              </div>
              {Anim && (
                <div className="proj-anim" aria-hidden="true">
                  <Anim />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

const Experience = () => (
  <section className="s" id="experience">
    <SectionHead eyebrow="Experience" title="Where I've worked." />
    <div className="s-body">
      <div>
        {EXPERIENCE.map((e, i) => {
          const Anim = window.EXP_ANIMS && window.EXP_ANIMS[e.anim];
          return (
            <article className={`exp${Anim ? "" : " no-anim"}`} key={i}>
              <div className="exp-when">{e.when}</div>
              <div className="exp-body">
                <div className="exp-title-row">
                  <h3>{e.title}</h3>
                  {e.tag && <span className="exp-tag">{e.tag}</span>}
                </div>
                <p className="where">{e.where}</p>
                <p>{e.blurb}</p>
              </div>
              {Anim && (
                <div className="exp-anim-slot" aria-hidden="true">
                  <Anim />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

const Education = () => (
  <section className="s" id="education">
    <SectionHead eyebrow="Education" title="Where I studied." />
    <div className="s-body">
      <div>
        {EDUCATION.map((e, i) => (
          <article className="edu" key={i}>
            <div className="exp-when">{e.when}</div>
            <div className="exp-body">
              <h3>{e.degree}</h3>
              <p className="where" style={{ marginBottom: 0 }}>{e.where}</p>
            </div>
            <div className="edu-watermark" aria-hidden="true">
              {e.watermark.kind === "img" && (
                <img src={e.watermark.src} alt="" />
              )}
              {e.watermark.kind === "glyph" && (
                <span className="glyph">{e.watermark.char}</span>
              )}
              {e.watermark.kind === "glyph-cjk" && (
                <span className="glyph-cjk">{e.watermark.char}</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const Awards = () => (
  <section className="s" id="awards">
    <SectionHead eyebrow="Awards" title="Honors & recognition." />
    <div className="s-body">
      <ul className="award-list">
        {AWARDS.map((a, i) => (
          <li className="award" key={i}>
            <span className="y">{a.year}</span>
            <span className="t">{a.text}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

const Contact = () => (
  <section className="s" id="contact">
    <SectionHead eyebrow="Contact" title="Reach me." />
    <div className="s-body">
      <div className="contact-grid">
        <a className="contact-cell" href="mailto:c.jiu@wustl.edu">
          <span className="label">Email</span>
          <span className="value">c.jiu@wustl.edu <span className="arrow">↗</span></span>
        </a>
        <a className="contact-cell" href="https://github.com/JiuChen0" target="_blank" rel="noopener">
          <span className="label">GitHub</span>
          <span className="value">@JiuChen0 <span className="arrow">↗</span></span>
        </a>
        <a className="contact-cell" href="https://www.linkedin.com/in/jiuchen" target="_blank" rel="noopener">
          <span className="label">LinkedIn</span>
          <span className="value">in/jiuchen <span className="arrow">↗</span></span>
        </a>
        <a className="contact-cell" href="https://arxiv.org/abs/2604.21072" target="_blank" rel="noopener">
          <span className="label">arXiv</span>
          <span className="value">2604.21072 <span className="arrow">↗</span></span>
        </a>
      </div>
    </div>
  </section>
);

// ---------- tweaks ----------

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "blue",
  "showHeroAnim": true
}/*EDITMODE-END*/;

const ACCENTS = {
  blue:   { light: "#0066cc", lightBg: "rgba(0,102,204,0.08)",  dark: "#2997ff", darkBg: "rgba(41,151,255,0.14)" },
  indigo: { light: "#5e5ce6", lightBg: "rgba(94,92,230,0.10)",  dark: "#7d7aff", darkBg: "rgba(125,122,255,0.16)" },
  green:  { light: "#0a8a4a", lightBg: "rgba(10,138,74,0.10)",  dark: "#30d158", darkBg: "rgba(48,209,88,0.14)" },
  graphite: { light: "#1d1d1f", lightBg: "rgba(0,0,0,0.06)", dark: "#f5f5f7", darkBg: "rgba(255,255,255,0.10)" },
};

const applyTheme = (theme, accent) => {
  document.documentElement.setAttribute("data-theme", theme);
  const a = ACCENTS[accent] || ACCENTS.blue;
  const isDark = theme === "dark";
  document.documentElement.style.setProperty("--accent",    isDark ? a.dark    : a.light);
  document.documentElement.style.setProperty("--accent-bg", isDark ? a.darkBg  : a.lightBg);
};

// ---------- root ----------

const App = () => {
  const [tweaks, setTweak] = window.useTweaks
    ? window.useTweaks(TWEAK_DEFAULTS)
    : [TWEAK_DEFAULTS, () => {}];
  const active = useActiveSection(SECTIONS.map((s) => s.id));

  useEffect(() => {
    applyTheme(tweaks.theme, tweaks.accent);
  }, [tweaks.theme, tweaks.accent]);

  const TP = window.TweaksPanel;
  const TSection = window.TweakSection;
  const TRadio = window.TweakRadio;
  const TToggle = window.TweakToggle;

  return (
    <>
      <main className="page">
        <Rail active={active} />
        <div className="content">
          <Hero showAnim={tweaks.showHeroAnim} />
          <About />
          <Research />
          <Publications />
          <Projects />
          <Experience />
          <Education />
          <Awards />
          <Contact />
          <div className="colophon">
            <span>© 2026 Jiu Chen</span>
            <a href="#top">Back to top ↑</a>
          </div>
        </div>
      </main>

      {TP && (
        <TP title="Tweaks">
          <TSection label="Appearance">
            <TRadio
              label="Theme"
              value={tweaks.theme}
              onChange={(v) => setTweak("theme", v)}
              options={[
                { label: "Light", value: "light" },
                { label: "Dark",  value: "dark" },
              ]}
            />
            <TRadio
              label="Accent"
              value={tweaks.accent}
              onChange={(v) => setTweak("accent", v)}
              options={[
                { label: "Blue",   value: "blue" },
                { label: "Indigo", value: "indigo" },
                { label: "Green",  value: "green" },
                { label: "Mono",   value: "graphite" },
              ]}
            />
          </TSection>
          <TSection label="Hero">
            <TToggle
              label="Animated diagram"
              value={tweaks.showHeroAnim}
              onChange={(v) => setTweak("showHeroAnim", v)}
            />
          </TSection>
        </TP>
      )}
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
