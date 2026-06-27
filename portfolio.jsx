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
    titleZh: "分布式大模型推理",
    blurb: "Tensor / pipeline / expert parallelism, KV-cache scheduling, and the serving-time tradeoffs of latency, throughput, and memory pressure on commodity clusters.",
    blurbZh: "研究张量、流水线与专家并行，KV 缓存调度，以及在通用集群上部署模型时延迟、吞吐量和内存压力之间的权衡。",
  },
  {
    tag: "AREA 02",
    tagZh: "方向 02",
    title: "Heterogeneous computing",
    titleZh: "异构计算",
    blurb: "Co-scheduling across GPU, CPU, and emerging accelerators — placement, offloading, and the cost models that decide where each tensor lives.",
    blurbZh: "研究 GPU、CPU 与新型加速器之间的协同调度，包括任务放置、卸载策略，以及决定每个张量存放位置的成本模型。",
  },
  {
    tag: "AREA 03",
    tagZh: "方向 03",
    title: "System performance",
    titleZh: "系统性能",
    blurb: "Profiling, kernel-level bottleneck analysis, and the long tail of memory-bandwidth and PCIe / NVLink contention that dominates real workloads.",
    blurbZh: "关注性能分析、内核级瓶颈定位，以及在真实负载中占据主导的内存带宽和 PCIe / NVLink 争用等长尾问题。",
  },
  {
    tag: "AREA 04",
    tagZh: "方向 04",
    title: "ML systems for scale",
    titleZh: "面向规模化的机器学习系统",
    blurb: "Building runtimes and primitives that survive the gap between a clean benchmark and the messy, multi-tenant reality of production serving.",
    blurbZh: "构建能够跨越理想基准测试与复杂多租户生产环境之间鸿沟的运行时和系统原语。",
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
    blurbZh: "参与开发 BloomBee：一个去中心化服务系统，将模型的 Transformer 模块拆分到 P2P 网络中的多个节点，使异构闲置 GPU 能够协同部署和微调单机无法容纳的超大模型（如 LLaMA 3.1 405B）。系统基于 Hivemind 和 FlexLLMGen，并集成 HuggingFace Transformers。我的工作聚焦于运行时的系统级优化：改进卸载路径中的共享内存使用、移除旧版量化代码和无效模块，让代码库对新贡献者更加精简易用。",
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
    blurbZh: "在 Garmin 为竞速平台构建自动驾驶技术栈：使用 Arduino 实现控制逻辑，基于 OpenMV 视觉进行车道检测，通过 RX/TX 完成传感器数据交换，采用 PID 进行路径跟随，并融合多传感器避障以实现实时环境适应。",
    links: [{ label: "Writeup", labelZh: "项目介绍", href: "#" }],
  },
  {
    anim: "speech",
    title: "Dialect speech-recognition CNNs",
    titleZh: "方言语音识别 CNN",
    stack: ["Python", "TensorFlow", "CNN"],
    blurb: "Designed and trained CNN-based acoustic models at Zhejiang University for speech-to-text on regional Chinese dialects — focusing on accuracy and usability for underserved language variants.",
    blurbZh: "在浙江大学设计并训练基于 CNN 的声学模型，用于中国地方方言的语音转文字，重点提升低资源方言变体的识别准确率和可用性。",
    links: [{ label: "Writeup", labelZh: "项目介绍", href: "#" }],
  },
  {
    anim: "churn",
    title: "High-risk user churn prediction",
    titleZh: "高风险用户流失预测",
    stack: ["Python", "Logistic Reg.", "Random Forest"],
    blurb: "Built a churn-risk pipeline at China Unicom: feature engineering and time-series user-activity signals fed into logistic regression, decision trees, and random forests; iteratively tuned to improve high-risk identification accuracy.",
    blurbZh: "在中国联通构建用户流失风险分析流程：对用户活动时间序列进行特征工程，并使用逻辑回归、决策树和随机森林建模，通过迭代调优提升高风险用户的识别准确率。",
    links: [{ label: "Writeup", labelZh: "项目介绍", href: "#" }],
  },
];

const EXPERIENCE = [
  {
    anim: "research",
    when: "2025 — Present",
    whenZh: "2025 — 至今",
    title: "Visiting Researcher · Distributed LLM Systems",
    titleZh: "访问研究员 · 分布式大模型系统",
    where: "Parallel Architecture, System & Algorithm Lab — UC Merced",
    whereZh: "并行架构、系统与算法实验室 — 加州大学默塞德分校",
    blurb: "Working on BloomBee, a decentralized P2P serving system that shards a model's transformer blocks across peers so heterogeneous GPUs can collaboratively run and fine-tune very-large models (e.g. LLaMA 3.1 405B) built on Hivemind and FlexLLMGen. Cleaning up the runtime: optimizing shared-memory usage in the offloading path, retiring legacy quantization, and trimming dead code to keep the system approachable for new contributors.",
    blurbZh: "参与 BloomBee 项目。该系统基于 Hivemind 和 FlexLLMGen，将模型的 Transformer 模块分片到 P2P 节点，使异构 GPU 能够协同运行和微调超大模型（如 LLaMA 3.1 405B）。我的工作包括优化卸载路径中的共享内存使用、移除旧版量化方案和冗余代码，使运行时更精简、更易于参与。",
    tag: "Research",
    tagZh: "科研",
  },
  {
    anim: "teaching",
    when: "2025",
    title: "Graduate Teaching Assistant · CSE 132",
    titleZh: "研究生助教 · CSE 132",
    where: "McKelvey School of Engineering — Washington University in St. Louis",
    whereZh: "McKelvey 工学院 — 圣路易斯华盛顿大学",
    blurb: "TA for Intro to Computer Engineering: held office hours, supported students on programming, Arduino, and assembly-language assignments; helped run Piazza and improve course communication.",
    blurbZh: "担任《计算机工程导论》课程助教：负责答疑时间，辅导编程、Arduino 和汇编语言作业，并协助维护 Piazza、改善课程沟通。",
    tag: "Teaching",
    tagZh: "教学",
  },
  {
    anim: "radar",
    when: "2023",
    title: "Machine Recognition Developer",
    titleZh: "机器识别开发工程师",
    where: "Garmin Ltd. — Oregon, USA",
    whereZh: "Garmin — 美国俄勒冈州",
    blurb: "Developed an autonomous-navigation system for RoboRacer using Arduino, an OpenMV camera, and PID-controlled path-following. Integrated multi-sensor obstacle avoidance for real-time adaptability.",
    blurbZh: "使用 Arduino、OpenMV 摄像头和 PID 路径跟随为 RoboRacer 开发自动导航系统，并集成多传感器避障功能以实现实时环境适应。",
    tag: "Industry",
    tagZh: "业界",
  },
  {
    anim: "waveform",
    when: "2021",
    title: "Research Assistant · Speech Recognition",
    titleZh: "研究助理 · 语音识别",
    where: "Graduate School — Zhejiang University, Ningbo",
    whereZh: "浙江大学宁波科创中心",
    blurb: "Built CNN acoustic models (Python / TensorFlow) for dialect-aware speech-to-text, improving accuracy for regional Chinese variants.",
    blurbZh: "使用 Python 和 TensorFlow 构建面向方言的 CNN 声学模型，提升中国地方方言语音转文字的识别准确率。",
    tag: "Research",
    tagZh: "科研",
  },
  {
    anim: "shield",
    when: "2021",
    title: "Information Security Intern",
    titleZh: "信息安全实习生",
    where: "China Unicom Ltd. — Gansu, China",
    whereZh: "中国联通 — 中国甘肃",
    blurb: "Designed a high-risk user-churn identification pipeline. Engineered time-series features and trained logistic-regression, decision-tree, and random-forest models to improve churn-risk classification.",
    blurbZh: "设计高风险用户流失识别流程，对时间序列数据进行特征工程，并训练逻辑回归、决策树和随机森林模型以提升流失风险分类效果。",
    tag: "Industry",
    tagZh: "业界",
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
    textZh: "Andrew C. Lim、Lim Ho Puah 与 Lim Peng Mau 奖学金 — 俄勒冈州立大学工程学院。",
  },
  {
    year: "2023",
    text: "International Student Scholarship — Oregon State University.",
    textZh: "国际学生奖学金 — 俄勒冈州立大学。",
  },
  {
    year: "2021",
    text: "Computer Software Copyright — issued by the National Copyright Administration of China.",
    textZh: "计算机软件著作权 — 中华人民共和国国家版权局颁发。",
  },
  {
    year: "2021",
    text: "Third Prize — China Computer Design Competition.",
    textZh: "三等奖 — 中国大学生计算机设计大赛。",
  },
  {
    year: "2021",
    text: "Third-Class Scholarship — Northwest Minzu University.",
    textZh: "三等奖学金 — 西北民族大学。",
  },
  {
    year: "2019",
    text: "Third-Class Scholarship — Northwest Minzu University.",
    textZh: "三等奖学金 — 西北民族大学。",
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
    updated: "最近更新",
    updatedValue: "2026 年 5 月",
    heroMeta: "即将攻读博士 · 机器学习系统 · 圣路易斯 → ?",
    heroLede: "我是 Jiu Chen，一名专注于机器学习系统的计算机科学研究者。我的研究聚焦于大模型分布式推理、异构计算，以及那些漫长、不够光鲜却至关重要的性能优化工作。",
    heroTags: ["分布式推理", "张量 / 流水线并行", "异构计算", "内核级性能优化", "机器学习运行时"],
    sections: {
      about: ["关于我", "简单介绍一下自己。"],
      research: ["研究方向", "我关注的问题。"],
      publications: ["论文发表", "论文与预印本。"],
      projects: ["项目经历", "我做过的一些项目。"],
      experience: ["工作经历", "我工作和研究过的地方。"],
      education: ["教育背景", "我的求学经历。"],
      awards: ["荣誉奖项", "获得的荣誉与认可。"],
      contact: ["联系方式", "欢迎与我联系。"],
    },
    aboutLead: <>我毕业于<strong>圣路易斯华盛顿大学</strong>，获计算机科学硕士学位。目前，我在加州大学默塞德分校的<strong>并行架构、系统与算法实验室</strong>担任访问研究员，从事分布式大模型推理研究。</>,
    aboutBody: "我的主要兴趣是大规模机器学习系统，包括分布式大模型推理、异构计算和系统性能优化。我将在 2026 年秋季开始攻读博士学位。在此之前，我希望更认真地阅读、更从容地写作，也思考未来五年真正值得构建的系统。",
    researchLead: "概括来说：如何让超大模型的部署更便宜、更快速、更可预测？有意思的答案往往存在于模型、运行时与硬件的交界处。",
    authorNote: <>作者姓名中的<strong>粗体</strong>表示本人。</>,
    equalContribution: "共同一作",
    projectsLead: "这些是我在科研和业界环境中完成的代码、实验与系统项目。",
    backToTop: "返回顶部 ↑",
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
        <>为<span className="grad">大模型</span>构建可扩展系统。</>
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
