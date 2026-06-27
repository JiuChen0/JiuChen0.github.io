/* Jiu Chen — personal site
   Clean / minimal direction. Single-page scrolling layout with sticky rail nav.
*/

const { useState, useEffect, useRef } = React;

// ---------- data ----------

const SECTIONS = [
  { id: "about",        label: "About",        labelZh: "关于我" },
  { id: "research",     label: "Research",     labelZh: "研究方向" },
  { id: "publications", label: "Publications", labelZh: "论文发表" },
  { id: "projects",     label: "Projects",     labelZh: "项目经历" },
  { id: "experience",   label: "Experience",   labelZh: "工作经历" },
  { id: "education",    label: "Education",    labelZh: "教育背景" },
  { id: "awards",       label: "Awards",       labelZh: "荣誉奖项" },
  { id: "contact",      label: "Contact",      labelZh: "联系方式" },
];

const RESEARCH = [
  {
    tag: "AREA 01",
    tagZh: "方向 01",
    title: "Distributed LLM inference",
    titleZh: "大模型分布式推理",
    blurb: "Tensor / pipeline / expert parallelism, KV-cache scheduling, and the serving-time tradeoffs of latency, throughput, and memory pressure on commodity clusters.",
    blurbZh: "主要关注张量并行、流水线并行和专家并行、KV Cache 调度，以及在常见硬件集群上如何权衡延迟、吞吐和显存占用。",
  },
  {
    tag: "AREA 02",
    tagZh: "方向 02",
    title: "Heterogeneous computing",
    titleZh: "异构计算",
    blurb: "Co-scheduling across GPU, CPU, and emerging accelerators — placement, offloading, and the cost models that decide where each tensor lives.",
    blurbZh: "研究如何在 GPU、CPU 和各类加速器之间安排计算与数据：任务放在哪里、何时卸载，以及如何用成本模型做判断。",
  },
  {
    tag: "AREA 03",
    tagZh: "方向 03",
    title: "System performance",
    titleZh: "系统性能优化",
    blurb: "Profiling, kernel-level bottleneck analysis, and the long tail of memory-bandwidth and PCIe / NVLink contention that dominates real workloads.",
    blurbZh: "从性能分析和内核瓶颈入手，追踪内存带宽、PCIe / NVLink 争用等在真实负载中最容易被低估的问题。",
  },
  {
    tag: "AREA 04",
    tagZh: "方向 04",
    title: "ML systems for scale",
    titleZh: "可扩展的机器学习系统",
    blurb: "Building runtimes and primitives that survive the gap between a clean benchmark and the messy, multi-tenant reality of production serving.",
    blurbZh: "做能真正落地的运行时和系统组件：不仅要在基准测试里表现好，也要能应付多租户生产环境的复杂情况。",
  },
];

const PUBLICATIONS = [
  {
    year: "2026",
    venue: "arXiv preprint",
    venueZh: "arXiv 预印本",
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
    venueLongZh: "arXiv:2604.21072 · 2026 年 5 月",
    links: [
      { label: "PDF", labelZh: "PDF", href: "https://arxiv.org/pdf/2604.21072" },
      { label: "Abstract", labelZh: "摘要", href: "https://arxiv.org/abs/2604.21072" },
    ],
  },
];

const PROJECTS = [
  {
    anim: "bloombee",
    title: "BloomBee — decentralized LLM fine-tuning & inference",
    titleZh: "BloomBee — 去中心化大模型微调与推理",
    stack: ["Python", "PyTorch", "Hivemind", "P2P"],
    blurb: "Contributing to BloomBee, a decentralized serving system that splits a model's transformer blocks across peers in a P2P network — letting heterogeneous, idle GPUs collaboratively serve and fine-tune very large models (e.g. LLaMA 3.1 405B) that no single machine could hold. Built on Hivemind and FlexLLMGen, with HuggingFace Transformers integration. My contributions focus on system-level cleanup of the runtime: optimizing shared-memory usage in the offloading path, retiring legacy quantization code, and removing dead modules to keep the codebase lean for new contributors.",
    blurbZh: "我参与的 BloomBee 是一个去中心化大模型服务系统。它把 Transformer 层分散到 P2P 网络中的不同节点，让多台配置不一的闲置 GPU 一起运行或微调单机放不下的大模型，例如 LLaMA 3.1 405B。项目基于 Hivemind 和 FlexLLMGen，并接入 HuggingFace Transformers。我主要负责运行时优化：改进卸载过程中的共享内存使用、清理旧的量化实现和无用模块，让代码更精简，也让新贡献者更容易上手。",
    links: [
      { label: "Repo", labelZh: "代码仓库", href: "https://github.com/ai-decentralized/BloomBee" },
      { label: "PR #34", labelZh: "PR #34", href: "https://github.com/ai-decentralized/BloomBee/pull/34" },
    ],
  },
  {
    anim: "roboracer",
    title: "RoboRacer — autonomous navigation system",
    titleZh: "RoboRacer — 自动驾驶导航系统",
    stack: ["Arduino", "OpenMV", "PID", "C++"],
    blurb: "Built an autonomous-driving stack for a racing platform at Garmin: Arduino control logic, OpenMV vision for lane detection, RX/TX sensor exchange, PID for path-following, and multi-sensor obstacle-avoidance for real-time adaptability.",
    blurbZh: "在 Garmin 的 RoboRacer 项目中，我负责自动导航系统的开发：用 Arduino 编写控制逻辑，以 OpenMV 完成车道识别，通过 RX/TX 交换传感器数据，再结合 PID 路径跟随和多传感器避障，让小车能实时应对赛道变化。",
    links: [{ label: "Writeup", labelZh: "项目介绍", href: "#" }],
  },
  {
    anim: "speech",
    title: "Dialect speech-recognition CNNs",
    titleZh: "基于 CNN 的方言语音识别",
    stack: ["Python", "TensorFlow", "CNN"],
    blurb: "Designed and trained CNN-based acoustic models at Zhejiang University for speech-to-text on regional Chinese dialects — focusing on accuracy and usability for underserved language variants.",
    blurbZh: "在浙江大学做过一套方言语音识别模型，用 CNN 完成地方方言的语音转文字，重点改善低资源方言的识别准确率和实际可用性。",
    links: [{ label: "Writeup", labelZh: "项目介绍", href: "#" }],
  },
  {
    anim: "churn",
    title: "High-risk user churn prediction",
    titleZh: "用户流失风险预测",
    stack: ["Python", "Logistic Reg.", "Random Forest"],
    blurb: "Built a churn-risk pipeline at China Unicom: feature engineering and time-series user-activity signals fed into logistic regression, decision trees, and random forests; iteratively tuned to improve high-risk identification accuracy.",
    blurbZh: "在中国联通实习时，我搭建了一套用户流失风险预测流程。通过分析用户活动的时间序列、设计特征，并比较逻辑回归、决策树和随机森林等模型，提高了高风险用户的识别准确率。",
    links: [{ label: "Writeup", labelZh: "项目介绍", href: "#" }],
  },
];

const EXPERIENCE = [
  {
    anim: "research",
    when: "2025 — Present",
    whenZh: "2025 — 至今",
    title: "Visiting Researcher · Distributed LLM Systems",
    titleZh: "访问研究员 · 大模型分布式系统",
    where: "Parallel Architecture, System & Algorithm Lab — UC Merced",
    whereZh: "并行架构、系统与算法实验室 · 加州大学默塞德分校",
    blurb: "Working on BloomBee, a decentralized P2P serving system that shards a model's transformer blocks across peers so heterogeneous GPUs can collaboratively run and fine-tune very-large models (e.g. LLaMA 3.1 405B) built on Hivemind and FlexLLMGen. Cleaning up the runtime: optimizing shared-memory usage in the offloading path, retiring legacy quantization, and trimming dead code to keep the system approachable for new contributors.",
    blurbZh: "在实验室参与 BloomBee，研究如何把 Transformer 层分散到 P2P 节点，让异构 GPU 协同运行和微调超大模型。我主要负责运行时优化，包括改进卸载过程中的共享内存使用、清理旧的量化实现和冗余代码。",
    tag: "Research",
    tagZh: "研究",
  },
  {
    anim: "teaching",
    when: "2025",
    title: "Graduate Teaching Assistant · CSE 132",
    titleZh: "研究生助教 · CSE 132",
    where: "McKelvey School of Engineering — Washington University in St. Louis",
    whereZh: "McKelvey 工学院 · 圣路易斯华盛顿大学",
    blurb: "TA for Intro to Computer Engineering: held office hours, supported students on programming, Arduino, and assembly-language assignments; helped run Piazza and improve course communication.",
    blurbZh: "担任《计算机工程导论》课程助教，组织课后答疑，辅导编程、Arduino 和汇编语言作业，并协助维护 Piazza 和课程通知。",
    tag: "Teaching",
    tagZh: "教学",
  },
  {
    anim: "radar",
    when: "2023",
    title: "Machine Recognition Developer",
    titleZh: "机器视觉开发工程师",
    where: "Garmin Ltd. — Oregon, USA",
    whereZh: "Garmin · 美国俄勒冈州",
    blurb: "Developed an autonomous-navigation system for RoboRacer using Arduino, an OpenMV camera, and PID-controlled path-following. Integrated multi-sensor obstacle avoidance for real-time adaptability.",
    blurbZh: "参与 RoboRacer 自动导航系统开发，使用 Arduino、OpenMV 摄像头和 PID 完成路径跟随，并加入多传感器避障，让小车能够实时应对环境变化。",
    tag: "Industry",
    tagZh: "研发",
  },
  {
    anim: "waveform",
    when: "2021",
    title: "Research Assistant · Speech Recognition",
    titleZh: "研究助理 · 语音识别",
    where: "Graduate School — Zhejiang University, Ningbo",
    whereZh: "浙江大学宁波科创中心",
    blurb: "Built CNN acoustic models (Python / TensorFlow) for dialect-aware speech-to-text, improving accuracy for regional Chinese variants.",
    blurbZh: "使用 Python 和 TensorFlow 训练方言语音识别模型，改善地方方言语音转文字的准确率。",
    tag: "Research",
    tagZh: "研究",
  },
  {
    anim: "shield",
    when: "2021",
    title: "Information Security Intern",
    titleZh: "信息安全实习生",
    where: "China Unicom Ltd. — Gansu, China",
    whereZh: "中国联通 · 甘肃",
    blurb: "Designed a high-risk user-churn identification pipeline. Engineered time-series features and trained logistic-regression, decision-tree, and random-forest models to improve churn-risk classification.",
    blurbZh: "搭建用户流失风险识别流程，从时间序列数据中提取特征，并训练逻辑回归、决策树和随机森林模型，提高高风险用户的识别效果。",
    tag: "Industry",
    tagZh: "实习",
  },
];

const EDUCATION = [
  {
    when: "2024 — 2025",
    degree: "M.S. in Computer Science",
    degreeZh: "计算机科学硕士",
    where: "Washington University in St. Louis, MO, USA",
    whereZh: "圣路易斯华盛顿大学 · 美国密苏里州",
    watermark: { kind: "img", src: "assets/washu-shield.png" },
  },
  {
    when: "2021 — 2024",
    degree: "B.S. in Computer Science",
    degreeZh: "计算机科学学士",
    where: "Oregon State University, OR, USA",
    whereZh: "俄勒冈州立大学 · 美国俄勒冈州",
    watermark: { kind: "img", src: "assets/osu-shield.png" },
  },
  {
    when: "2018 — 2022",
    degree: "B.Eng. in Electronics Engineering",
    degreeZh: "电子信息工程学士",
    where: "Northwest Minzu University, Gansu, China",
    whereZh: "西北民族大学 · 中国甘肃",
    watermark: { kind: "img", src: "assets/nmu-logo.png" },
  },
];

const AWARDS = [
  {
    year: "2023",
    text: "Andrew C. Lim, Lim Ho Puah & Lim Peng Mau Scholarship — Oregon State University, College of Engineering.",
    textZh: "Andrew C. Lim、Lim Ho Puah 与 Lim Peng Mau 奖学金 · 俄勒冈州立大学工程学院",
  },
  {
    year: "2023",
    text: "International Student Scholarship — Oregon State University.",
    textZh: "俄勒冈州立大学国际学生奖学金",
  },
  {
    year: "2021",
    text: "Computer Software Copyright — issued by the National Copyright Administration of China.",
    textZh: "国家版权局计算机软件著作权",
  },
  {
    year: "2021",
    text: "Third Prize — China Computer Design Competition.",
    textZh: "中国大学生计算机设计大赛三等奖",
  },
  {
    year: "2021",
    text: "Third-Class Scholarship — Northwest Minzu University.",
    textZh: "西北民族大学三等奖学金",
  },
  {
    year: "2019",
    text: "Third-Class Scholarship — Northwest Minzu University.",
    textZh: "西北民族大学三等奖学金",
  },
];

const COPY = {
  en: {
    documentTitle: "Jiu Chen — ML Systems Researcher",
    languageLabel: "Language",
    contents: "Contents",
    elsewhere: "Elsewhere",
    updated: "Updated",
    updatedValue: "May 2026",
    heroMeta: "Incoming Ph.D. · ML Systems · St. Louis → ?",
    heroLede: "I'm Jiu Chen — a computer-science researcher working on machine-learning systems, with a focus on distributed inference for large models, heterogeneous computing, and the long, unglamorous business of performance optimization.",
    heroTags: ["Distributed inference", "Tensor / pipeline parallelism", "Heterogeneous compute", "Kernel-level perf", "ML runtimes"],
    sections: {
      about: ["About", "A few words about me."],
      research: ["Research", "What I think about."],
      publications: ["Publications", "Papers & preprints."],
      projects: ["Projects", "Things I've built."],
      experience: ["Experience", "Where I've worked."],
      education: ["Education", "Where I studied."],
      awards: ["Awards", "Honors & recognition."],
      contact: ["Contact", "Reach me."],
    },
    aboutLead: <>I graduated from <strong>Washington University in St. Louis</strong> with a Master's degree in Computer Science. I'm currently a visiting researcher at the <strong>Parallel Architecture, System &amp; Algorithm Lab</strong> at UC Merced, working on distributed large-model inference.</>,
    aboutBody: "My primary interests focus on large-scale machine-learning systems — distributed LLM inference, heterogeneous computing, and system performance optimization. I'm starting a Ph.D. in Fall 2026 and using the months in between to read more carefully, write more slowly, and think about what kinds of systems would actually be worth building over the next five years.",
    researchLead: "Broadly: how do we make very large models cheap, fast, and predictable to serve? The interesting answers tend to live at the boundary between the model, the runtime, and the hardware.",
    authorNote: <>Author names in <strong>bold</strong> indicate me.</>,
    equalContribution: "equal contribution",
    projectsLead: "Code, experiments, and systems I've built across research and industry settings.",
    backToTop: "Back to top ↑",
  },
  zh: {
    documentTitle: "Jiu Chen — 机器学习系统研究者",
    languageLabel: "语言",
    contents: "目录",
    elsewhere: "其他平台",
    updated: "更新于",
    updatedValue: "2026 年 5 月",
    heroMeta: "2026 秋季开始读博 · 机器学习系统 · 圣路易斯 → ?",
    heroLede: "我是 Jiu Chen，主要做机器学习系统研究。目前关心的问题包括大模型分布式推理、异构计算，以及系统里那些不起眼却往往决定性能的细节。",
    heroTags: ["大模型分布式推理", "张量 / 流水线并行", "异构计算", "内核性能分析", "机器学习运行时"],
    sections: {
      about: ["关于我", "你好，我是 Jiu Chen。"],
      research: ["研究方向", "我在研究什么。"],
      publications: ["论文发表", "论文与预印本。"],
      projects: ["项目经历", "做过的一些项目。"],
      experience: ["工作经历", "研究、教学与实习。"],
      education: ["教育背景", "求学经历。"],
      awards: ["荣誉奖项", "一些奖项与荣誉。"],
      contact: ["联系方式", "欢迎联系我。"],
    },
    aboutLead: <>我在<strong>圣路易斯华盛顿大学</strong>获得计算机科学硕士学位。目前是加州大学默塞德分校<strong>并行架构、系统与算法实验室</strong>的访问研究员，主要研究大模型分布式推理。</>,
    aboutBody: "我感兴趣的是大规模机器学习系统：如何做好大模型分布式推理，如何在异构硬件上高效计算，以及如何从系统层面把性能一点点抠出来。2026 年秋季，我将开始博士阶段的学习。眼下这段时间，我想多读一点、慢一点写，也认真想清楚未来几年最值得做的问题。",
    researchLead: "我常想的是：怎样让大模型部署得更快、更省，也更稳定？答案通常不只在模型本身，而在模型、运行时和硬件如何配合。",
    authorNote: <>我的名字以<strong>粗体</strong>标出。</>,
    equalContribution: "共同一作",
    projectsLead: "下面是我在科研和实习中做过的一些代码、实验和系统。",
    backToTop: "回到顶部 ↑",
  },
};

const localize = (item, key, language) =>
  language === "zh" && item[`${key}Zh`] ? item[`${key}Zh`] : item[key];

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

const LanguageSwitch = ({ language, onChange }) => (
  <div className="language-switch" role="group" aria-label={COPY[language].languageLabel}>
    <button
      type="button"
      className={language === "en" ? "active" : ""}
      aria-pressed={language === "en"}
      onClick={() => onChange("en")}
    >
      EN
    </button>
    <button
      type="button"
      className={language === "zh" ? "active" : ""}
      aria-pressed={language === "zh"}
      onClick={() => onChange("zh")}
    >
      中文
    </button>
  </div>
);

const Rail = ({ active, language, onLanguageChange }) => {
  const copy = COPY[language];
  return (
  <aside className="rail">
    <div className="rail-mark">
      <img className="avatar" src="assets/jiu-chen.jpg" alt="Jiu Chen" />
      <span>Jiu Chen</span>
    </div>

    <LanguageSwitch language={language} onChange={onLanguageChange} />

    <div className="rail-section rail-contents">
      <div className="rail-block-label">{copy.contents}</div>
      <nav className="rail-nav">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === s.id ? "active" : ""}
          >
            {localize(s, "label", language)}
          </a>
        ))}
      </nav>
    </div>

    <div className="rail-section rail-elsewhere">
      <div className="rail-block-label">{copy.elsewhere}</div>
      <div className="rail-links">
        <a href="https://github.com/JiuChen0" target="_blank" rel="noopener">GitHub</a>
        <a href="https://www.linkedin.com/in/jiuchen" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://arxiv.org/abs/2604.21072" target="_blank" rel="noopener">arXiv</a>
        <a href="mailto:c.jiu@wustl.edu">Email</a>
      </div>
    </div>

    <div className="rail-section rail-updated">
      <div className="rail-block-label">{copy.updated}</div>
      <div className="rail-stamp">{copy.updatedValue}</div>
    </div>
  </aside>
  );
};

// ---------- sections ----------

const Hero = ({ showAnim, language }) => {
  const copy = COPY[language];
  return (
  <header className="hero" id="top">
    <img className="hero-portrait" src="assets/jiu-chen.jpg" alt="Jiu Chen" />
    <div className="hero-meta">
      <span className="pulse"></span>
      <span>{copy.heroMeta}</span>
    </div>
    <h1>
      {language === "zh" ? (
        <>让<span className="grad">大模型</span>跑得<span style={{ whiteSpace: "nowrap" }}>更快</span>、更稳、更省。</>
      ) : (
        <>Building systems for <span className="grad">large&nbsp;models</span> at&nbsp;scale.</>
      )}
    </h1>
    <p className="hero-lede">{copy.heroLede}</p>
    <div className="hero-tags">
      {copy.heroTags.map((tag) => <span key={tag}>{tag}</span>)}
    </div>
    {showAnim && <HeroDiagram playing={true} language={language} />}
  </header>
  );
};

const SectionHead = ({ eyebrow, title }) => (
  <>
    <div className="s-eyebrow">{eyebrow}</div>
    <h2 className="s-title">{title}</h2>
  </>
);

const About = ({ language }) => {
  const copy = COPY[language];
  return (
  <section className="s" id="about">
    <SectionHead eyebrow={copy.sections.about[0]} title={copy.sections.about[1]} />
    <div className="s-body">
      <p className="lead">{copy.aboutLead}</p>
      <p>{copy.aboutBody}</p>
    </div>
  </section>
  );
};

const Research = ({ language }) => {
  const copy = COPY[language];
  return (
  <section className="s" id="research">
    <SectionHead eyebrow={copy.sections.research[0]} title={copy.sections.research[1]} />
    <div className="s-body">
      <p className="lead">{copy.researchLead}</p>
      <div className="research-grid">
        {RESEARCH.map((r) => (
          <div key={r.tag} className="research-cell">
            <div className="tag">{localize(r, "tag", language)}</div>
            <h3>{localize(r, "title", language)}</h3>
            <p>{localize(r, "blurb", language)}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};

const Publications = ({ language }) => {
  const copy = COPY[language];
  return (
  <section className="s" id="publications">
    <SectionHead eyebrow={copy.sections.publications[0]} title={copy.sections.publications[1]} />
    <div className="s-body">
      <p style={{ fontSize: 14.5, color: "var(--ink-mute)", marginBottom: 6 }}>
        {copy.authorNote}
        <span style={{ marginLeft: 8 }}>(<sup style={{ color: "var(--accent)" }}>*</sup> {copy.equalContribution})</span>
      </p>
      <div>
        {PUBLICATIONS.map((p, i) => (
          <article className="pub" key={i}>
            <div className="pub-meta">
              <span className="y">{p.year}</span>
              <span>{localize(p, "venue", language)}</span>
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
              <p className="venue">{localize(p, "venueLong", language)}</p>
              <div className="pub-links">
                {p.links.map((l) => (
                  <a className="pill-link" key={l.label} href={l.href} target="_blank" rel="noopener">{localize(l, "label", language)} <span style={{ opacity: 0.6 }}>↗</span></a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
  );
};

const Projects = ({ language }) => {
  const copy = COPY[language];
  return (
  <section className="s" id="projects">
    <SectionHead eyebrow={copy.sections.projects[0]} title={copy.sections.projects[1]} />
    <div className="s-body">
      <p className="lead">{copy.projectsLead}</p>
      <div>
        {PROJECTS.map((p, i) => {
          const Anim = window.PROJECT_ANIMS && window.PROJECT_ANIMS[p.anim];
          return (
            <article className="proj" key={i}>
              <div className="proj-text">
                <div className="proj-head">
                  <h3>{localize(p, "title", language)}</h3>
                </div>
                <div className="proj-stack">
                  {p.stack.map((s, j) => (<span key={j}>{s}</span>))}
                </div>
                <p>{localize(p, "blurb", language)}</p>
                <div className="proj-links">
                  {p.links.map((l) => (
                    <a className="pill-link" key={l.label} href={l.href} target="_blank" rel="noopener">{localize(l, "label", language)} <span style={{ opacity: 0.6 }}>↗</span></a>
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
};

const Experience = ({ language }) => {
  const copy = COPY[language];
  return (
  <section className="s" id="experience">
    <SectionHead eyebrow={copy.sections.experience[0]} title={copy.sections.experience[1]} />
    <div className="s-body">
      <div>
        {EXPERIENCE.map((e, i) => {
          const Anim = window.EXP_ANIMS && window.EXP_ANIMS[e.anim];
          return (
            <article className={`exp${Anim ? "" : " no-anim"}`} key={i}>
              <div className="exp-when">{localize(e, "when", language)}</div>
              <div className="exp-body">
                <div className="exp-title-row">
                  <h3>{localize(e, "title", language)}</h3>
                  {e.tag && <span className="exp-tag">{localize(e, "tag", language)}</span>}
                </div>
                <p className="where">{localize(e, "where", language)}</p>
                <p>{localize(e, "blurb", language)}</p>
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
};

const Education = ({ language }) => {
  const copy = COPY[language];
  return (
  <section className="s" id="education">
    <SectionHead eyebrow={copy.sections.education[0]} title={copy.sections.education[1]} />
    <div className="s-body">
      <div>
        {EDUCATION.map((e, i) => (
          <article className="edu" key={i}>
            <div className="exp-when">{e.when}</div>
            <div className="exp-body">
              <h3>{localize(e, "degree", language)}</h3>
              <p className="where" style={{ marginBottom: 0 }}>{localize(e, "where", language)}</p>
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
};

const Awards = ({ language }) => {
  const copy = COPY[language];
  return (
  <section className="s" id="awards">
    <SectionHead eyebrow={copy.sections.awards[0]} title={copy.sections.awards[1]} />
    <div className="s-body">
      <ul className="award-list">
        {AWARDS.map((a, i) => (
          <li className="award" key={i}>
            <span className="y">{a.year}</span>
            <span className="t">{localize(a, "text", language)}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
  );
};

const Contact = ({ language }) => {
  const copy = COPY[language];
  return (
  <section className="s" id="contact">
    <SectionHead eyebrow={copy.sections.contact[0]} title={copy.sections.contact[1]} />
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
};

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

const getInitialLanguage = () => {
  try {
    const saved = window.localStorage.getItem("jiu-chen-language");
    return saved === "zh" || saved === "en" ? saved : "en";
  } catch (_) {
    return "en";
  }
};

// ---------- root ----------

const App = () => {
  const [tweaks, setTweak] = window.useTweaks
    ? window.useTweaks(TWEAK_DEFAULTS)
    : [TWEAK_DEFAULTS, () => {}];
  const [language, setLanguage] = useState(getInitialLanguage);
  const active = useActiveSection(SECTIONS.map((s) => s.id));

  useEffect(() => {
    applyTheme(tweaks.theme, tweaks.accent);
  }, [tweaks.theme, tweaks.accent]);

  useEffect(() => {
    const copy = COPY[language];
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = copy.documentTitle;
    try {
      window.localStorage.setItem("jiu-chen-language", language);
    } catch (_) {
      // The site still works when storage is unavailable.
    }
  }, [language]);

  const TP = window.TweaksPanel;
  const TSection = window.TweakSection;
  const TRadio = window.TweakRadio;
  const TToggle = window.TweakToggle;

  return (
    <>
      <main className="page">
        <Rail active={active} language={language} onLanguageChange={setLanguage} />
        <div className="content">
          <Hero showAnim={tweaks.showHeroAnim} language={language} />
          <About language={language} />
          <Research language={language} />
          <Publications language={language} />
          <Projects language={language} />
          <Experience language={language} />
          <Education language={language} />
          <Awards language={language} />
          <Contact language={language} />
          <div className="colophon">
            <span>© 2026 Jiu Chen</span>
            <a href="#top">{COPY[language].backToTop}</a>
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
