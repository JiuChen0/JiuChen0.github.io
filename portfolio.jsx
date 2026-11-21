/* Jiu Chen — personal site
   Clean / minimal direction. Single-page scrolling layout with sticky rail nav.
*/

const { useState, useEffect, useLayoutEffect, useRef } = React;

// ---------- data ----------

const SEQUOIA_LAB_URL = "https://sequoia-lab.github.io/index.html";

const SECTIONS = [
  { id: "about",        label: "About",        labelZh: "关于我" },
  { id: "research",     label: "Research",     labelZh: "研究方向" },
  { id: "publications", label: "Publications", labelZh: "论文" },
  { id: "projects",     label: "Projects",     labelZh: "项目" },
  { id: "experience",   label: "Experience",   labelZh: "研究与工作" },
  { id: "education",    label: "Education",    labelZh: "教育经历" },
  { id: "awards",       label: "Awards",       labelZh: "奖项" },
  { id: "contact",      label: "Contact",      labelZh: "联系方式" },
];

const RESEARCH = [
  {
    tag: "AREA 01",
    tagZh: "方向 01",
    title: "System performance optimization",
    titleZh: "系统性能优化",
    blurb: "Profiling parallel workloads to find bottlenecks in computation, memory access, and communication. I study how those bottlenecks shift as the problem size or number of processors grows.",
    blurbZh: "用性能分析工具检查计算效率、内存带宽和通信开销，看看问题规模变大或处理器变多时，瓶颈会不会跟着变。",
  },
  {
    tag: "AREA 02",
    tagZh: "方向 02",
    title: "Parallel scientific computing",
    titleZh: "科学计算与并行模拟",
    blurb: "I've started studying QPESIM, a quantum phase estimation simulator, to understand how state-vector partitioning and MPI communication affect performance across processes and nodes.",
    blurbZh: "最近开始研究量子相位估计模拟器 QPESIM，关注状态向量怎么划分、进程之间要交换多少数据，以及这些开销会怎样影响程序在多节点上的性能。",
  },
  {
    tag: "AREA 03",
    tagZh: "方向 03",
    title: "Heterogeneous computing",
    titleZh: "异构计算",
    blurb: "Scheduling work across CPUs, GPUs, and other accelerators. I look at where to place data and when offloading pays off once transfer costs are included.",
    blurbZh: "研究怎么在 CPU、GPU 和专用加速器之间分配任务和数据，把传输开销也算进去，判断什么时候把任务交给另一种设备更划算。",
  },
  {
    tag: "AREA 04",
    tagZh: "方向 04",
    title: "Distributed LLM inference",
    titleZh: "大模型分布式推理",
    blurb: "Tensor, pipeline, and expert parallelism for serving large models. I study KV-cache scheduling and the tradeoffs among latency, throughput, and GPU memory use.",
    blurbZh: "研究怎么把大模型的推理任务分到多张卡上。我关注张量并行、流水线并行、专家并行和 KV 缓存调度，以及怎么在延迟、吞吐量和显存占用之间取得平衡。",
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
    titleZh: "BloomBee：去中心化的大模型推理与微调",
    stack: ["Python", "PyTorch", "Hivemind", "P2P"],
    blurb: "I contributed to BloomBee as a visiting researcher at UC Merced's PASA Lab. BloomBee splits a model's Transformer blocks across peers in a P2P network, so idle GPUs with different capacities can serve and fine-tune models too large for a single machine, such as Llama 3.1 405B. It builds on Hivemind and FlexLLMGen and integrates with Hugging Face Transformers. I improved shared-memory management during offloading and removed legacy quantization code and unused modules.",
    blurbZh: "我在 UC Merced 的 PASA Lab 做访问研究时参与了 BloomBee。这个项目把模型的 Transformer 层分到 P2P 网络的不同节点上，让不同配置的闲置 GPU 一起运行或微调单机装不下的模型，比如 Llama 3.1 405B。项目基于 Hivemind 和 FlexLLMGen，并接入 Hugging Face Transformers。我主要改进了卸载过程中的共享内存管理，也清理了旧的量化代码和无用模块，方便维护和上手。",
    links: [
      { label: "Repo", labelZh: "代码仓库", href: "https://github.com/ai-decentralized/BloomBee" },
      { label: "PR #34", labelZh: "PR #34", href: "https://github.com/ai-decentralized/BloomBee/pull/34" },
    ],
  },
  {
    anim: "roboracer",
    title: "RoboRacer — autonomous navigation system",
    titleZh: "RoboRacer：赛车自动导航",
    stack: ["Arduino", "OpenMV", "PID", "C++"],
    blurb: "Built an autonomous-driving stack for a racing platform at Garmin: Arduino control logic, OpenMV vision for lane detection, RX/TX sensor exchange, PID for path-following, and multi-sensor obstacle-avoidance for real-time adaptability.",
    blurbZh: "在 Garmin，我为 RoboRacer 小车开发了自动导航系统。小车用 OpenMV 识别车道，经 RX/TX 传输传感器数据，由 Arduino 执行 PID 控制，还能用多个传感器实时避障。",
    links: [{ label: "Writeup", labelZh: "项目介绍", href: "#" }],
  },
  {
    anim: "speech",
    title: "Dialect speech-recognition CNNs",
    titleZh: "基于 CNN 的方言语音识别",
    stack: ["Python", "TensorFlow", "CNN"],
    blurb: "Designed and trained CNN-based acoustic models at Zhejiang University for speech-to-text on regional Chinese dialects — focusing on accuracy and usability for underserved language variants.",
    blurbZh: "在浙江大学，我用 CNN 训练声学模型，把方言语音转成文字。重点是让训练数据较少的方言也能识别得更准，在实际场景中用得起来。",
    links: [{ label: "Writeup", labelZh: "项目介绍", href: "#" }],
  },
  {
    anim: "churn",
    title: "High-risk user churn prediction",
    titleZh: "用户流失风险预测",
    stack: ["Python", "Logistic Reg.", "Random Forest"],
    blurb: "Built a churn-risk pipeline at China Unicom: feature engineering and time-series user-activity signals fed into logistic regression, decision trees, and random forests; iteratively tuned to improve high-risk identification accuracy.",
    blurbZh: "在中国联通实习时，我根据用户活跃度随时间的变化提取特征，比较并调整了逻辑回归、决策树和随机森林模型，提高了对可能流失用户的识别准确率。",
    links: [{ label: "Writeup", labelZh: "项目介绍", href: "#" }],
  },
];

const EXPERIENCE = [
  {
    anim: "research",
    when: "Started in 2025",
    whenZh: "2025 年开始",
    title: "Visiting Researcher · Distributed LLM Systems",
    titleZh: "访问研究员（大模型分布式推理）",
    where: "Parallel Architecture, System, and Algorithm (PASA) Lab — UC Merced",
    whereZh: "加州大学默塞德分校并行架构、系统与算法实验室（PASA Lab）",
    blurb: "Contributed to BloomBee, a P2P system for running and fine-tuning large models across heterogeneous GPUs. I improved shared-memory management during offloading and removed legacy quantization code and unused modules.",
    blurbZh: "在访问研究期间参与了 BloomBee 的研发，研究怎么让不同配置的 GPU 一起运行和微调超大模型。我主要改进了卸载过程中的共享内存管理，并清理了旧代码。",
    tag: "Research",
    tagZh: "研究",
  },
  {
    anim: "teaching",
    when: "2025",
    title: "Graduate Teaching Assistant · CSE 132",
    titleZh: "研究生助教 · CSE 132",
    where: "McKelvey School of Engineering — Washington University in St. Louis",
    whereZh: "圣路易斯华盛顿大学 McKelvey 工学院",
    blurb: "TA for Intro to Computer Engineering: held office hours, supported students on programming, Arduino, and assembly-language assignments; helped run Piazza and improve course communication.",
    blurbZh: "给《计算机工程导论》做助教，负责课后答疑，帮同学解决编程、Arduino 和汇编作业中的问题，也协助维护 Piazza 讨论区和课程通知。",
    tag: "Teaching",
    tagZh: "教学",
  },
  {
    anim: "radar",
    when: "2023",
    title: "Machine Recognition Developer",
    titleZh: "机器视觉开发工程师",
    where: "Garmin Ltd. — Oregon, USA",
    whereZh: "Garmin（美国俄勒冈州）",
    blurb: "Developed an autonomous-navigation system for RoboRacer using Arduino, an OpenMV camera, and PID-controlled path-following. Integrated multi-sensor obstacle avoidance for real-time adaptability.",
    blurbZh: "开发 RoboRacer 小车的自动导航功能，用 OpenMV 摄像头识别车道，搭配 Arduino 和 PID 控制跟踪路线，并接入多个传感器实现实时避障。",
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
    blurbZh: "用 Python 和 TensorFlow 训练方言识别模型，提高语音转文字的准确率。",
    tag: "Research",
    tagZh: "研究",
  },
  {
    anim: "shield",
    when: "2021",
    title: "Information Security Intern",
    titleZh: "信息安全实习生",
    where: "China Unicom Ltd. — Gansu, China",
    whereZh: "中国联通（甘肃）",
    blurb: "Designed a high-risk user-churn identification pipeline. Engineered time-series features and trained logistic-regression, decision-tree, and random-forest models to improve churn-risk classification.",
    blurbZh: "分析用户活跃度的变化，提取时间序列特征，并用逻辑回归、决策树和随机森林预测哪些用户更可能流失。",
    tag: "Industry",
    tagZh: "实习",
  },
];

const EDUCATION = [
  {
    when: "Spring 2027",
    whenZh: "2027 年春季",
    degree: "Ph.D. in Computer Software Engineering",
    degreeZh: "计算机软件工程博士",
    where: "University of California, Merced · Sequoia Lab",
    whereZh: "加州大学默塞德分校（UC Merced） · Sequoia Lab",
    watermark: { kind: "img", src: "assets/uc-merced-logo.png" },
  },
  {
    when: "2024 — 2025",
    whenZh: "2024–2025 年",
    degree: "M.S. in Computer Science",
    degreeZh: "计算机科学硕士",
    where: "Washington University in St. Louis, MO, USA",
    whereZh: "圣路易斯华盛顿大学（美国密苏里州）",
    watermark: { kind: "img", src: "assets/washu-shield.png" },
  },
  {
    when: "2021 — 2024",
    whenZh: "2021–2024 年",
    degree: "B.S. in Computer Science",
    degreeZh: "计算机科学学士",
    where: "Oregon State University, OR, USA",
    whereZh: "俄勒冈州立大学（美国俄勒冈州）",
    watermark: { kind: "img", src: "assets/osu-shield.png" },
  },
  {
    when: "2018 — 2022",
    whenZh: "2018–2022 年",
    degree: "B.Eng. in Electronics Engineering",
    degreeZh: "电子信息工程学士",
    where: "Northwest Minzu University, Gansu, China",
    whereZh: "西北民族大学（甘肃）",
    watermark: { kind: "img", src: "assets/nmu-logo.png" },
  },
];

const AWARDS = [
  {
    year: "2023",
    text: "Andrew C. Lim, Lim Ho Puah & Lim Peng Mau Scholarship — Oregon State University, College of Engineering.",
    textZh: "俄勒冈州立大学工程学院 Andrew C. Lim、Lim Ho Puah 与 Lim Peng Mau 奖学金",
  },
  {
    year: "2023",
    text: "International Student Scholarship — Oregon State University.",
    textZh: "俄勒冈州立大学国际学生奖学金",
  },
  {
    year: "2021",
    text: "Computer Software Copyright — issued by the National Copyright Administration of China.",
    textZh: "计算机软件著作权（国家版权局）",
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
    documentTitle: "Jiu Chen — Systems & High-Performance Computing",
    languageLabel: "Language",
    themeLabel: "Dark mode",
    contents: "Contents",
    elsewhere: "Elsewhere",
    email: "Email",
    updated: "Updated",
    updatedValue: "November 2026",
    heroMeta: "Ph.D. Student · UC Merced · Systems & HPC",
    heroLede: "I'm Jiu Chen. I study what limits performance when programs run across many processors or machines. My work spans large-model inference and, more recently, scientific simulation.",
    heroTags: ["Performance profiling", "Parallel and distributed computing", "Heterogeneous computing", "Scientific simulation"],
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
    aboutLead: <>I'm a Ph.D. student in Computer Software Engineering at the <strong>University of California, Merced</strong> and a member of <strong><a href={SEQUOIA_LAB_URL} style={{ textDecoration: "underline" }}>Sequoia Lab</a></strong>. I earned my M.S. in Computer Science from <strong>Washington University in St. Louis</strong>.</>,
    aboutBody: "I recently started studying parallel performance in QPESIM, a simulator for quantum phase estimation. During an earlier research visit to UC Merced's PASA Lab, I contributed to BloomBee, a distributed system for large-model inference.",
    researchLead: "I measure how much time goes into computation, memory access, and communication. That helps me decide whether to divide the work differently, change where data is placed, or adjust when processes exchange it.",
    authorNote: <>Author names in <strong>bold</strong> indicate me.</>,
    equalContribution: "equal contribution",
    projectsLead: "Code, experiments, and systems I've built across research and industry settings.",
    backToTop: "Back to top ↑",
  },
  zh: {
    documentTitle: "Jiu Chen｜系统与高性能计算",
    languageLabel: "语言",
    themeLabel: "深色模式",
    contents: "目录",
    elsewhere: "站外链接",
    email: "邮箱",
    updated: "更新于",
    updatedValue: "2026 年 11 月",
    heroMeta: "加州大学默塞德分校博士生 · 高性能计算",
    heroLede: "我是 Jiu Chen，主要做并行计算的性能优化。我关心程序跑在多个处理器或多台机器上时，究竟慢在哪里。现在关注的应用包括大模型推理和科学模拟。",
    heroTags: ["性能分析", "并行与分布式计算", "异构计算", "科学模拟"],
    sections: {
      about: [null, "关于我"],
      research: [null, "研究方向"],
      publications: [null, "论文与预印本"],
      projects: [null, "项目"],
      experience: [null, "研究与工作经历"],
      education: [null, "教育经历"],
      awards: [null, "奖项与荣誉"],
      contact: [null, "联系方式"],
    },
    aboutLead: <>我在<strong>加州大学默塞德分校（UC Merced）</strong>读计算机软件工程博士，所在的课题组是 <strong><a href={SEQUOIA_LAB_URL} style={{ textDecoration: "underline" }}>Sequoia Lab</a></strong>。读博前，我在<strong>圣路易斯华盛顿大学</strong>获得了计算机科学硕士学位。</>,
    aboutBody: "我最近开始研究量子相位估计模拟器 QPESIM，关注它的并行性能。此前，我在 UC Merced 的 PASA Lab 做访问研究，参与了 BloomBee 的开发。",
    researchLead: "做性能优化时，我会先看程序的时间主要花在计算、访存还是通信上。如果通信是瓶颈，就试着减少进程间的数据传输。如果卡在访存，就调整数据布局。这些问题在大模型推理和科学模拟里都会遇到。",
    authorNote: <><strong>加粗</strong>的是我的名字。</>,
    equalContribution: "共同一作",
    projectsLead: "这里有我在研究和实习中做过的项目，从大模型推理到赛车导航和语音识别。",
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

// ---------- site controls ----------

const LanguageSwitch = ({ language, onChange }) => (
  <div className="language-switch" data-language={language} role="group" aria-label={COPY[language].languageLabel}>
    <button
      type="button"
      lang="en"
      aria-pressed={language === "en"}
      onClick={() => onChange("en")}
    >
      EN
    </button>
    <button
      type="button"
      lang="zh-CN"
      aria-pressed={language === "zh"}
      onClick={() => onChange("zh")}
    >
      中文
    </button>
  </div>
);

const ThemeSwitch = ({ dark, label, onToggle }) => (
  <button
    type="button"
    className="theme-switch"
    role="switch"
    aria-checked={dark}
    aria-label={label}
    title={label}
    onClick={onToggle}
  >
    <span className="theme-switch__track" aria-hidden="true">
      <span className="theme-switch__clouds" />
      <span className="theme-switch__stars" />
      <span className="theme-switch__orb">
        <span className="theme-switch__craters" />
      </span>
    </span>
  </button>
);

// ---------- rail ----------

const Rail = ({ active, language }) => {
  const copy = COPY[language];
  return (
  <aside className="rail">
    <div className="rail-mark">
      <img className="avatar" src="assets/jiu-chen.jpg" alt="Jiu Chen" />
      <span>Jiu Chen</span>
    </div>

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
        <a href="mailto:c.jiu@wustl.edu">{copy.email}</a>
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
    <h1 style={language === "zh" ? { maxWidth: "none" } : undefined}>
      {language === "zh" ? (
        <>让<span className="grad" style={{ whiteSpace: "nowrap" }}>并行计算</span><span style={{ whiteSpace: "nowrap" }}>跑得更快</span></>
      ) : (
        <>Making <span className="grad">parallel systems</span> faster.</>
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
    {eyebrow && <div className="s-eyebrow">{eyebrow}</div>}
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
            <div className="exp-when">{localize(e, "when", language)}</div>
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
          <span className="label">{copy.email}</span>
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

const getInitialTweaks = () => ({
  ...TWEAK_DEFAULTS,
  theme: document.documentElement.dataset.theme || TWEAK_DEFAULTS.theme,
});

const useSiteTweaks = window.useTweaks || function useLocalTweaks(initialValues) {
  const [values, setValues] = useState(initialValues);
  return [values, (key, value) => setValues((current) => ({ ...current, [key]: value }))];
};

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
  const [tweaks, setTweak] = useSiteTweaks(getInitialTweaks);
  const [language, setLanguage] = useState(getInitialLanguage);
  const active = useActiveSection(SECTIONS.map((s) => s.id));

  const changeTheme = (theme) => {
    setTweak("theme", theme);
    try {
      window.localStorage.setItem("jiu-chen-theme", theme);
    } catch (_) {
      // Theme switching still works when storage is unavailable.
    }
  };

  useLayoutEffect(() => {
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
      <div className="site-controls">
        <LanguageSwitch language={language} onChange={setLanguage} />
        <ThemeSwitch
          dark={tweaks.theme === "dark"}
          label={COPY[language].themeLabel}
          onToggle={() => changeTheme(tweaks.theme === "dark" ? "light" : "dark")}
        />
      </div>
      <main className="page">
        <Rail active={active} language={language} />
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
              onChange={changeTheme}
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
