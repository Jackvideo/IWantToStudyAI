// 学习进度数据 - 基于学习日志.md 和学习大纲.md
export const progressData = {
  stages: [
    {
      id: 1,
      name: '机器学习基础',
      icon: '📊',
      status: 'in_progress',
      progress: 70,
      duration: '2-3周',
      color: '#6366f1',
      description: '西瓜书第1-4章，掌握ML核心思想',
      chapters: [
        { name: '第1章 绪论', status: 'completed', topics: ['基本术语', '假设空间', '归纳偏好', 'NFL定理', '奥卡姆剃刀'] },
        { name: '第2章 模型评估与选择', status: 'completed', topics: ['评估方法', '性能度量', '比较检验', '过拟合与欠拟合'] },
        { name: '第3章 线性模型', status: 'completed', topics: ['线性回归', '对数线性回归', '最小二乘解'] },
        { name: '第4章 决策树', status: 'completed', topics: ['信息增益', '增益率', '基尼指数', '预剪枝', '后剪枝'] },
      ]
    },
    {
      id: 2,
      name: '神经网络',
      icon: '🧠',
      status: 'in_progress',
      progress: 33,
      duration: '2-3周',
      color: '#8b5cf6',
      description: '神经元、MLP、BP算法、CNN/RNN',
      chapters: [
        { name: '神经网络基础', status: 'completed', topics: ['神经元模型', '激活函数', 'MLP', '前向传播', 'BP反向传播'] },
        { name: '深度学习组件', status: 'pending', topics: ['CNN', 'RNN', '训练技巧'] },
        { name: '通向语言模型', status: 'pending', topics: ['词嵌入', '序列建模', 'Attention初探'] },
      ]
    },
    {
      id: 3,
      name: '大语言模型',
      icon: '⭐',
      status: 'preview',
      progress: 10,
      duration: '3-4周',
      color: '#f59e0b',
      description: 'Transformer、GPT、Prompt Engineering',
      chapters: [
        { name: 'Transformer 架构', status: 'pending', topics: ['Self-Attention', 'QKV', 'Multi-Head', 'Position Encoding'] },
        { name: 'LLM 原理', status: 'pending', topics: ['预训练', 'GPT演进', 'RLHF', '涌现能力'] },
        { name: 'Prompt Engineering', status: 'pending', topics: ['ICL', 'Few-shot', 'CoT', 'RAG基础'] },
        { name: 'LLM 应用实践', status: 'pending', topics: ['API使用', '应用模式', '局限性'] },
      ]
    },
    {
      id: 4,
      name: 'Agent 开发',
      icon: '🤖',
      status: 'started',
      progress: 5,
      duration: '2-3周',
      color: '#10b981',
      description: 'LangChain、Function Calling、RAG、多Agent',
      chapters: [
        { name: 'Agent 基础', status: 'pending', topics: ['Agent概念', '核心组件', 'ReAct模式'] },
        { name: '开发实践', status: 'pending', topics: ['LangChain', 'Function Calling', 'RAG深入'] },
        { name: '高级 Agent', status: 'pending', topics: ['多Agent系统', '设计模式', '实战项目'] },
      ]
    }
  ],
  overallProgress: 35,
  totalWeeks: '10-13',
  lastUpdated: '2026-03-08',
}

// 一周学习计划数据
export const weeklyPlan = {
  dateRange: '2026-03-07 ~ 2026-03-13',
  days: [
    {
      date: '3/7',
      weekday: '周六',
      title: '信息熵 & 信息增益',
      category: 'decision-tree',
      categoryLabel: '决策树 🌳',
      duration: '45min',
      keyQuestion: '为什么用熵来衡量纯度？',
      completed: true,
    },
    {
      date: '3/8',
      weekday: '周日',
      title: '划分选择（增益率、基尼指数）',
      category: 'decision-tree',
      categoryLabel: '决策树 🌳',
      duration: '40min',
      keyQuestion: 'ID3 vs C4.5 vs CART 区别',
      completed: true,
    },
    {
      date: '3/9',
      weekday: '周一',
      title: '剪枝处理（预剪枝/后剪枝）',
      category: 'decision-tree',
      categoryLabel: '决策树 🌳',
      duration: '40min',
      keyQuestion: '剪枝靠什么缓解过拟合？',
      completed: true,
    },
    {
      date: '3/10',
      weekday: '周二',
      title: '神经元 + 感知机',
      category: 'neural-network',
      categoryLabel: '神经网络 🧠',
      duration: '45min',
      keyQuestion: '理解"加权求和+激活"',
      completed: true,
    },
    {
      date: '3/11',
      weekday: '周三',
      title: '多层网络 + BP算法',
      category: 'neural-network',
      categoryLabel: '神经网络 🧠',
      duration: '50min',
      keyQuestion: '反向传播 = 梯度下降基础',
      completed: true,
    },
    {
      date: '3/12',
      weekday: '周四',
      title: '为什么需要词嵌入',
      category: 'embedding',
      categoryLabel: '词嵌入 📝',
      duration: '35min',
      keyQuestion: 'One-Hot 的问题 → Dense Vector',
      completed: false,
    },
    {
      date: '3/13',
      weekday: '周五',
      title: 'Word2Vec 核心思想',
      category: 'embedding',
      categoryLabel: '词嵌入 📝',
      duration: '45min',
      keyQuestion: '词向量余弦相似度 = 语义相似度',
      completed: false,
    },
  ],
  checklist: [
    { id: 1, text: '第4章：信息熵与信息增益', completed: true },
    { id: 2, text: '第4章：划分选择（增益率、基尼指数）', completed: true },
    { id: 3, text: '第4章：剪枝处理（预剪枝、后剪枝）', completed: true },
    { id: 4, text: '第5章：神经元模型与感知机', completed: true },
    { id: 5, text: '第5章：多层网络与BP算法', completed: true },
    { id: 6, text: 'LLM预习：词嵌入概念', completed: false },
    { id: 7, text: 'LLM预习：Word2Vec基础', completed: false },
  ]
}

// 学习日志记录
export const studyLogs = [
  {
    date: '2026-03-08',
    title: '第5章 神经网络基础完成',
    type: 'study',
    icon: '🧠',
    entries: [
      {
        subtitle: '神经元 + 感知机',
        items: [
          { text: 'M-P 神经元：加权求和 → 减阈值 → 激活 → 输出', status: 'completed' },
          { text: '激活函数：阶跃（理想开关）→ Sigmoid（平滑可导）', status: 'completed' },
          { text: '感知机：能学习权重的神经元，只解线性可分问题', status: 'completed' },
          { text: 'XOR 问题：单层感知机无法解决，引发第一次 AI 寒冬', status: 'completed' },
        ]
      },
      {
        subtitle: 'MLP + 前向传播',
        items: [
          { text: '三层结构：输入层 → 隐藏层（空间变换）→ 输出层', status: 'completed' },
          { text: '前向传播：逐层"加权求和 + 激活"，数据从前往后流', status: 'completed' },
          { text: '隐藏层本质：空间变换，把线性不可分变为线性可分', status: 'completed' },
        ]
      },
      {
        subtitle: 'BP 反向传播 + 梯度下降',
        items: [
          { text: '梯度下降：w ← w - η·∂L/∂w，沿误差减小方向更新', status: 'completed' },
          { text: '链式法则：从输出往回逐层算每个权重对误差的贡献', status: 'completed' },
          { text: 'BP 三步循环：前向算预测 → 算损失 → 反向传梯度', status: 'completed' },
        ]
      },
      {
        subtitle: '知识串联',
        items: [
          { text: '梯度下降 ← 第3章线性回归的参数优化', status: 'info' },
          { text: 'Sigmoid ← 第3章对数几率回归', status: 'info' },
          { text: '过拟合风险 ← 第2章偏差-方差权衡', status: 'info' },
          { text: '无激活函数则多层=单层（线性复合还是线性）', status: 'info' },
        ]
      }
    ],
    insight: '神经网络三大支柱：神经元（基本计算单元）、前向传播（怎么算）、反向传播（怎么学）。隐藏层本质是空间变换。'
  },
  {
    date: '2026-03-07',
    title: '第4章 决策树学习完成',
    type: 'study',
    icon: '🌳',
    entries: [
      {
        subtitle: '决策树核心概念',
        items: [
          { text: '信息熵：衡量数据不确定性，全纯=0，最混乱=1', status: 'completed' },
          { text: '信息增益（ID3）：划分前后熵的差值，偏爱多值属性', status: 'completed' },
          { text: '增益率（C4.5）：对多值属性打折修正', status: 'completed' },
          { text: '基尼指数（CART）：随机两样本类别不同的概率', status: 'completed' },
        ]
      },
      {
        subtitle: '剪枝处理',
        items: [
          { text: '预剪枝：边长边剪，快但可能剪早导致欠拟合', status: 'completed' },
          { text: '后剪枝：先长全再从底往上剪，泛化更好但慢', status: 'completed' },
        ]
      },
      {
        subtitle: '知识串联',
        items: [
          { text: '剪枝 = 奥卡姆剃刀（第1章）', status: 'info' },
          { text: '信息增益偏好 = 归纳偏好（第2章）', status: 'info' },
          { text: '验证集评估剪枝 = 留出法/交叉验证（第2章）', status: 'info' },
        ]
      }
    ],
    insight: '决策树靠剪枝缓解过拟合（本质是奥卡姆剃刀）。当验证集不具代表性时，缓解失效。'
  },
  {
    date: '2026-03-07',
    title: '进度同步',
    type: 'sync',
    icon: '🔄',
    entries: [
      {
        subtitle: '基于 iWiki 笔记同步进度',
        items: [
          { text: '第1章 绪论 - 详细笔记', status: 'completed' },
          { text: '第2章 模型评估与选择 - 详细笔记', status: 'completed' },
          { text: '第3章 线性模型 - 已学', status: 'completed' },
          { text: '第4章 决策树 - 未见笔记，需补学 → 已完成', status: 'completed' },
        ]
      },
      {
        subtitle: 'LLM 方向',
        items: [
          { text: '向量相似度（余弦相似度、L2范数）', status: 'completed' },
          { text: 'LLM 应用概念（语义搜索、RAG、推荐系统）', status: 'completed' },
          { text: 'Transformer 预告（Attention = 词与词相似度计算）', status: 'info' },
        ]
      },
      {
        subtitle: 'Agent 开发',
        items: [
          { text: 'LangChain invoke 调用链路分析', status: 'completed' },
          { text: 'LangChain SDK API 参考', status: 'completed' },
        ]
      }
    ]
  },
  {
    date: '2026-01-30',
    title: '项目初始化',
    type: 'milestone',
    icon: '🎉',
    entries: [
      {
        subtitle: '项目初始化',
        items: [
          { text: '创建完整的学习框架', status: 'completed' },
          { text: '建立 AI 导师 Prompt 系统', status: 'completed' },
          { text: '设定西瓜书为主要教材', status: 'completed' },
        ]
      },
      {
        subtitle: '机器学习进度',
        items: [
          { text: '第1章 绪论 - 术语、假设空间、归纳偏好、NFL定理', status: 'completed' },
          { text: '第2章 模型评估 - 过拟合、评估方法、性能度量', status: 'completed' },
          { text: '第3章 线性模型 - 线性回归、对数线性回归、最小二乘解', status: 'completed' },
        ]
      },
      {
        subtitle: 'LLM 预习',
        items: [
          { text: '向量化：把语义变成数字', status: 'completed' },
          { text: '余弦相似度计算', status: 'completed' },
          { text: 'L2范数（向量长度）', status: 'completed' },
          { text: 'LLM 应用：语义搜索、RAG、推荐系统', status: 'completed' },
        ]
      }
    ],
    insight: '学一个新算法，先问：1. 它靠什么缓解过拟合？2. 这个缓解在什么时候失效？'
  }
]

/**
 * 从 studyLogs 自动派生里程碑数据，不再需要单独维护。
 * 每条学习日志自动成为一个里程碑条目。
 * 返回结果按日期倒序排列（最新的在上）。
 */
export function getMilestones() {
  // 从学习日志派生：每条日志 = 一条里程碑
  const logMilestones = studyLogs.map(log => ({
    date: log.date,
    title: log.title,
    icon: log.icon,
    description: log.entries
      .flatMap(e => e.items.filter(i => i.status === 'completed').map(i => i.text))
      .slice(0, 3)
      .join('；') || log.entries[0]?.subtitle || '',
    source: 'log',
  }))

  // 从阶段进度派生：已完成的章节按阶段聚合
  const stageMilestones = progressData.stages
    .filter(s => s.chapters.some(c => c.status === 'completed'))
    .map(s => {
      const completedChapters = s.chapters.filter(c => c.status === 'completed')
      return {
        date: progressData.lastUpdated,
        title: `${s.icon} ${s.name}：${completedChapters.length}/${s.chapters.length} 章完成`,
        icon: s.progress >= 100 ? '✅' : '📊',
        description: completedChapters.map(c => c.name).join('、'),
        source: 'progress',
      }
    })

  // 合并 + 去重（同日期同标题去重）+ 按日期倒序
  const seen = new Set()
  return [...logMilestones, ...stageMilestones]
    .filter(m => {
      const key = `${m.date}|${m.title}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

// 学习资源数据
export const resources = {
  books: [
    { name: '机器学习（西瓜书）', author: '周志华', status: 'primary', tag: '主教材', description: '本项目的核心教材，已有本地 PDF' },
    { name: '深度学习入门：基于Python的理论与实现', author: '斋藤康毅', status: 'recommended', tag: '入门', description: '鱼书，用 NumPy 从零实现神经网络' },
    { name: '动手学深度学习', author: '李沐', status: 'recommended', tag: '入门', description: '配套代码，边学边练' },
    { name: '深度学习', author: 'Goodfellow 等', status: 'reference', tag: '经典', description: '花书，理论深入' },
    { name: 'Build a Large Language Model', author: 'Sebastian Raschka', status: 'recommended', tag: 'LLM', description: '从零构建 LLM' },
  ],
  papers: [
    { name: 'Attention Is All You Need', year: 2017, tag: '必读', description: 'Transformer 原论文' },
    { name: 'Language Models are Few-Shot Learners', year: 2020, tag: '必读', description: 'GPT-3 论文' },
    { name: 'Training language models to follow instructions (InstructGPT)', year: 2022, tag: '必读', description: 'RLHF 方法论' },
    { name: 'Chain-of-Thought Prompting', year: 2022, tag: '必读', description: '思维链推理' },
    { name: 'ReAct: Reasoning and Acting', year: 2022, tag: 'Agent', description: 'Agent 核心模式' },
    { name: 'Retrieval-Augmented Generation', year: 2020, tag: 'RAG', description: 'RAG 原论文' },
  ],
  tools: [
    { name: 'PyTorch', category: 'framework', description: '深度学习框架' },
    { name: 'LangChain', category: 'framework', description: 'LLM 应用开发框架' },
    { name: 'scikit-learn', category: 'framework', description: '经典 ML 库' },
    { name: 'ChromaDB', category: 'database', description: '向量数据库' },
    { name: 'Hugging Face', category: 'platform', description: '模型和数据集平台' },
    { name: 'Google Colab', category: 'platform', description: '免费 GPU 实验环境' },
  ],
  websites: [
    { name: '3Blue1Brown', url: 'https://www.youtube.com/c/3blue1brown', category: '视频', description: '直觉理解数学概念' },
    { name: '李宏毅 ML', url: 'https://speech.ee.ntu.edu.tw/~hylee/ml/2023-spring.php', category: '视频', description: '中文机器学习课程' },
    { name: 'Andrej Karpathy', url: 'https://karpathy.ai/', category: '视频', description: 'GPT 深入浅出' },
    { name: 'Stanford CS229', url: 'https://cs229.stanford.edu/', category: '公开课', description: '机器学习经典课程' },
    { name: 'Fast.ai', url: 'https://www.fast.ai/', category: '教程', description: '实践导向深度学习' },
    { name: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/', category: 'LLM', description: 'Prompt 工程指南' },
  ],
}

// 阶段检查题
export const checkpoints = [
  {
    stage: 1,
    name: '机器学习基础',
    questions: [
      '什么是过拟合？如何避免？',
      '监督学习和无监督学习的区别是什么？',
      '损失函数的作用是什么？',
    ]
  },
  {
    stage: 2,
    name: '神经网络',
    questions: [
      '神经网络为什么需要激活函数？',
      '反向传播的核心思想是什么？',
      'CNN 为什么适合处理图像？',
    ]
  },
  {
    stage: 3,
    name: '大语言模型',
    questions: [
      'Attention 机制解决了什么问题？',
      'GPT 是如何训练的？',
      '什么是 Few-shot Learning？',
      '如何设计一个好的 Prompt？',
    ]
  },
  {
    stage: 4,
    name: 'Agent 开发',
    questions: [
      'Agent 的核心组件有哪些？',
      'RAG 的工作流程是什么？',
      '如何为 Agent 添加自定义工具？',
    ]
  },
]
