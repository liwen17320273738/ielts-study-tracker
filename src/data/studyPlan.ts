export interface DayTask {
  id: string
  day: number
  date: string
  weekday: string
  theme: string
  tasks: TaskItem[]
  focus: string
}

export interface TaskItem {
  id: string
  category: '词汇' | '听力' | '阅读' | '写作' | '口语' | '模考' | '复盘' | '弱项' | '休息' | '分析' | '总结'
  duration: number
  content: string
  done: boolean
}

export interface WeekPlan {
  week: number
  phase: string
  dateRange: string
  goal: string
  days: DayTask[]
  weeklyTargets: string[]
  mockExam?: string
}

export interface MockExam {
  id: number
  week: number
  source: string
  listening: number | null
  reading: number | null
  writing: number | null
  speaking: number | null
  total: number | null
  date: string | null
  notes: string
}

let taskId = 0
function tid(): string {
  return `task_${++taskId}`
}
let dayId = 0
function did(): string {
  return `day_${++dayId}`
}

function makeTask(category: TaskItem['category'], duration: number, content: string): TaskItem {
  return { id: tid(), category, duration, content, done: false }
}

export const studyPlan: WeekPlan[] = [
  {
    week: 1,
    phase: '基础重建',
    dateRange: '3月5日 - 3月11日',
    goal: '熟悉题型 + 词汇200+ + 听力阅读入门',
    weeklyTargets: [
      '词汇：200个新词 + 复习',
      '听力：剑桥15 Test1 完整精听',
      '阅读：掌握定位 + 判断 + 配对技巧',
      '写作：了解Task1题型',
      '口语：熟悉Part1题库',
      '模考：1套（听+读）'
    ],
    days: [
      {
        id: did(), day: 1, date: '3月5日', weekday: '周四',
        theme: '诊断测试 + 词汇启动',
        focus: '了解雅思题型，不追求正确率',
        tasks: [
          makeTask('词汇', 30, '背诵 List 1-2（约100词）- 教育类+工作类'),
          makeTask('听力', 45, '剑桥15 Test1 Section1，做1遍 + 精听1遍'),
          makeTask('阅读', 45, '剑桥15 Test1 Passage1，不限时完成'),
          makeTask('复盘', 15, '记录错题类型和原因')
        ]
      },
      {
        id: did(), day: 2, date: '3月6日', weekday: '周五',
        theme: '听力基础 + 阅读技巧',
        focus: '掌握阅读定位技巧',
        tasks: [
          makeTask('词汇', 30, 'List 3-4 + 复习 List 1-2（环境类+科技类）'),
          makeTask('听力', 45, '剑桥15 Test1 Section2，做1遍 + 精听'),
          makeTask('阅读', 45, '学习雅思阅读技巧（扫读/定位/同义替换）'),
          makeTask('口语', 30, '跟读 BBC 6 Minute English 1篇')
        ]
      },
      {
        id: did(), day: 3, date: '3月7日', weekday: '周六',
        theme: '听力进阶 + 阅读练习',
        focus: '听力Section3对话理解',
        tasks: [
          makeTask('词汇', 30, 'List 5-6 + 复习 List 3-4（社会类+健康类）'),
          makeTask('听力', 45, '剑桥15 Test1 Section3，做1遍 + 精听'),
          makeTask('阅读', 45, '剑桥15 Test1 Passage2，限时25min'),
          makeTask('写作', 30, '了解Task1题型（图表/地图/流程）')
        ]
      },
      {
        id: did(), day: 4, date: '3月8日', weekday: '周日',
        theme: '周复习 + 模考体验',
        focus: '体验完整考试节奏',
        tasks: [
          makeTask('词汇', 30, '复习 List 1-6'),
          makeTask('模考', 120, '剑桥15 Test1 完整做一遍（听+读）'),
          makeTask('分析', 45, '统计正确率，分析错题'),
          makeTask('总结', 15, '填写周总结')
        ]
      },
      {
        id: did(), day: 5, date: '3月9日', weekday: '周一',
        theme: '听力Section4 + 阅读判断',
        focus: '攻克听力最难Section4',
        tasks: [
          makeTask('词汇', 30, 'List 7-8 + 复习 List 5-6（媒体类+经济类）'),
          makeTask('听力', 45, '剑桥15 Test1 Section4，学术讲座精听'),
          makeTask('阅读', 45, '学习判断题（True/False/Not Given）技巧'),
          makeTask('口语', 30, '雅思哥APP看Part1题库')
        ]
      },
      {
        id: did(), day: 6, date: '3月10日', weekday: '周二',
        theme: '阅读配对 + 写作Task1',
        focus: '写作Task1开头段写法',
        tasks: [
          makeTask('词汇', 30, 'List 9-10 + 复习 List 7-8'),
          makeTask('阅读', 45, '学习配对题技巧 + 练习'),
          makeTask('写作', 45, 'Task1 线图/柱图写法学习'),
          makeTask('口语', 30, 'Part1常见话题自问自答')
        ]
      },
      {
        id: did(), day: 7, date: '3月11日', weekday: '周三',
        theme: '周总结 + 弱项强化',
        focus: '查漏补缺，准备第2周',
        tasks: [
          makeTask('词汇', 30, '复习 List 1-10（200词测试）'),
          makeTask('弱项', 60, '针对本周最弱的单项强化'),
          makeTask('写作', 45, 'Task1练习1篇（线图或柱图）'),
          makeTask('口语', 30, '跟读模仿1篇')
        ]
      }
    ]
  },
  {
    week: 2,
    phase: '基础重建',
    dateRange: '3月12日 - 3月18日',
    goal: '词汇2500+ | 听力Section1-2正确率70%+ | 阅读速度提升',
    weeklyTargets: [
      '词汇：List 11-22 完成',
      '听力：剑15 T2-T3前两Section',
      '阅读：判断题+配对题专项',
      '写作：Task1柱图/线图/饼图',
      '口语：Part1日常话题'
    ],
    mockExam: '剑15 T2',
    days: [
      {
        id: did(), day: 8, date: '3月12日', weekday: '周四',
        theme: '新周开始',
        focus: '听力Section1-2正确率提升',
        tasks: [
          makeTask('词汇', 30, 'List 11-12'),
          makeTask('听力', 45, '剑15 T2 S1 精听'),
          makeTask('阅读', 45, '剑15 Passage3'),
          makeTask('口语', 30, '跟读练习')
        ]
      },
      {
        id: did(), day: 9, date: '3月13日', weekday: '周五',
        theme: '写作入门',
        focus: '柱图写作结构',
        tasks: [
          makeTask('词汇', 30, 'List 13-14'),
          makeTask('听力', 45, '剑15 T2 S2 精听'),
          makeTask('阅读', 45, '判断题专项练习'),
          makeTask('写作', 45, 'Task1 柱图练习'),
          makeTask('口语', 30, 'Part1练习')
        ]
      },
      {
        id: did(), day: 10, date: '3月14日', weekday: '周六',
        theme: '听力深入',
        focus: '听力Section3技巧',
        tasks: [
          makeTask('词汇', 30, 'List 15-16'),
          makeTask('听力', 45, '剑15 T2 S3 精听'),
          makeTask('阅读', 45, '剑15 Passage4'),
          makeTask('口语', 30, '跟读练习')
        ]
      },
      {
        id: did(), day: 11, date: '3月15日', weekday: '周日',
        theme: '写作练习日',
        focus: '线图写作+配对题',
        tasks: [
          makeTask('词汇', 30, 'List 17-18'),
          makeTask('听力', 45, '剑15 T2 S4 精听'),
          makeTask('阅读', 45, '配对题专项练习'),
          makeTask('写作', 45, 'Task1 线图练习'),
          makeTask('口语', 30, 'Part1练习')
        ]
      },
      {
        id: did(), day: 12, date: '3月16日', weekday: '周一',
        theme: '新篇章阅读',
        focus: '剑16阅读入门',
        tasks: [
          makeTask('词汇', 30, 'List 19-20'),
          makeTask('听力', 45, '剑15 T3 S1 精听'),
          makeTask('阅读', 45, '剑16 Passage1'),
          makeTask('口语', 30, '跟读练习')
        ]
      },
      {
        id: did(), day: 13, date: '3月17日', weekday: '周二',
        theme: '饼图写作',
        focus: 'Task1饼图结构',
        tasks: [
          makeTask('词汇', 30, 'List 21-22'),
          makeTask('听力', 45, '剑15 T3 S2 精听'),
          makeTask('阅读', 45, '剑16 Passage2'),
          makeTask('写作', 45, 'Task1 饼图练习'),
          makeTask('口语', 30, 'Part1练习')
        ]
      },
      {
        id: did(), day: 14, date: '3月18日', weekday: '周三',
        theme: '模考日',
        focus: '模考检验两周成果',
        tasks: [
          makeTask('词汇', 30, '复习 List 1-22'),
          makeTask('模考', 120, '剑15 T2 完整模考（听+读）'),
          makeTask('分析', 45, '错题分析+周总结'),
          makeTask('复盘', 30, '本周学习回顾')
        ]
      }
    ]
  },
  {
    week: 3,
    phase: '基础重建',
    dateRange: '3月19日 - 3月25日',
    goal: '词汇3000+ | 写作Task2入门 | 口语Part2',
    weeklyTargets: [
      '词汇：List 23-34 完成',
      '听力：剑15 T3 + 剑16 T1',
      '阅读：剑16-17真题',
      '写作：Task2结构掌握',
      '口语：Part2能说满2分钟'
    ],
    mockExam: '剑16 T1',
    days: [
      {
        id: did(), day: 15, date: '3月19日', weekday: '周四',
        theme: 'Task2引言段',
        focus: '写作Task2结构入门',
        tasks: [
          makeTask('词汇', 30, 'List 23-24'),
          makeTask('听力', 45, '剑15 T3 S3 精听'),
          makeTask('阅读', 45, '剑16 Passage3'),
          makeTask('写作', 45, 'Task2 引言段写法'),
          makeTask('口语', 30, 'Part2话题准备')
        ]
      },
      {
        id: did(), day: 16, date: '3月20日', weekday: '周五',
        theme: 'Task2主体段',
        focus: '论点+论据+例子结构',
        tasks: [
          makeTask('词汇', 30, 'List 25-26'),
          makeTask('听力', 45, '剑15 T3 S4 精听'),
          makeTask('阅读', 45, '剑16 Passage4'),
          makeTask('写作', 45, 'Task2 主体段练习'),
          makeTask('口语', 30, 'Part2练习')
        ]
      },
      {
        id: did(), day: 17, date: '3月21日', weekday: '周六',
        theme: 'Task2结尾段',
        focus: '完整Task2结构',
        tasks: [
          makeTask('词汇', 30, 'List 27-28'),
          makeTask('听力', 45, '剑16 T1 S1 精听'),
          makeTask('阅读', 45, '剑17 Passage1'),
          makeTask('写作', 45, 'Task2 结尾段练习'),
          makeTask('口语', 30, 'Part2练习')
        ]
      },
      {
        id: did(), day: 18, date: '3月22日', weekday: '周日',
        theme: 'Task2完整篇',
        focus: '第一篇完整大作文',
        tasks: [
          makeTask('词汇', 30, 'List 29-30'),
          makeTask('听力', 45, '剑16 T1 S2 精听'),
          makeTask('阅读', 45, '剑17 Passage2'),
          makeTask('写作', 60, 'Task2 完整篇（教育类）'),
          makeTask('口语', 30, 'Part2练习')
        ]
      },
      {
        id: did(), day: 19, date: '3月23日', weekday: '周一',
        theme: 'Part3口语入门',
        focus: '口语深入讨论技巧',
        tasks: [
          makeTask('词汇', 30, 'List 31-32'),
          makeTask('听力', 45, '剑16 T1 S3 精听'),
          makeTask('阅读', 45, '剑17 Passage3'),
          makeTask('口语', 45, 'Part3入门+练习')
        ]
      },
      {
        id: did(), day: 20, date: '3月24日', weekday: '周二',
        theme: 'Task2第二篇',
        focus: '科技类话题',
        tasks: [
          makeTask('词汇', 30, 'List 33-34'),
          makeTask('听力', 45, '剑16 T1 S4 精听'),
          makeTask('阅读', 45, '剑17 Passage4'),
          makeTask('写作', 60, 'Task2 完整篇（科技类）'),
          makeTask('口语', 30, 'Part3练习')
        ]
      },
      {
        id: did(), day: 21, date: '3月25日', weekday: '周三',
        theme: '模考日',
        focus: '模考+周总结',
        tasks: [
          makeTask('词汇', 30, '复习 List 23-34'),
          makeTask('模考', 120, '剑16 T1 完整模考（听+读）'),
          makeTask('分析', 45, '错题分析'),
          makeTask('复盘', 30, '周总结')
        ]
      }
    ]
  },
  {
    week: 4,
    phase: '基础重建',
    dateRange: '3月26日 - 4月1日',
    goal: '词汇3500+ | 第一次完整模考 | 写作批改',
    weeklyTargets: [
      '词汇：3500+词汇量',
      '完成第一次完整模考（听读写说）',
      'Task1地图/流程/混合图',
      '第一篇写作送批改',
      '目标模考分数：5.5-6分'
    ],
    mockExam: '剑17 T1',
    days: [
      {
        id: did(), day: 22, date: '3月26日', weekday: '周四',
        theme: 'Task1地图题',
        focus: '地图题写作技巧',
        tasks: [
          makeTask('词汇', 30, 'List 35-36'),
          makeTask('听力', 45, '剑16 T2 S1 精听'),
          makeTask('阅读', 45, '剑18 Passage1'),
          makeTask('写作', 45, 'Task1 地图题练习'),
          makeTask('口语', 30, 'Part2串题')
        ]
      },
      {
        id: did(), day: 23, date: '3月27日', weekday: '周五',
        theme: 'Task1流程图',
        focus: '流程图写作结构',
        tasks: [
          makeTask('词汇', 30, 'List 37-38'),
          makeTask('听力', 45, '剑16 T2 S2 精听'),
          makeTask('阅读', 45, '剑18 Passage2'),
          makeTask('写作', 45, 'Task1 流程图练习'),
          makeTask('口语', 30, 'Part3练习')
        ]
      },
      {
        id: did(), day: 24, date: '3月28日', weekday: '周六',
        theme: 'Task2环境类',
        focus: '环境类话题论证',
        tasks: [
          makeTask('词汇', 30, 'List 39-40'),
          makeTask('听力', 45, '剑16 T2 S3 精听'),
          makeTask('阅读', 45, '剑18 Passage3'),
          makeTask('写作', 60, 'Task2 完整篇（环境类）'),
          makeTask('口语', 30, 'Part2练习')
        ]
      },
      {
        id: did(), day: 25, date: '3月29日', weekday: '周日',
        theme: 'Task2社会类',
        focus: '社会类话题论证',
        tasks: [
          makeTask('词汇', 30, 'List 41-42'),
          makeTask('听力', 45, '剑16 T2 S4 精听'),
          makeTask('阅读', 45, '剑18 Passage4'),
          makeTask('写作', 60, 'Task2 完整篇（社会类）'),
          makeTask('口语', 30, 'Part3练习')
        ]
      },
      {
        id: did(), day: 26, date: '3月30日', weekday: '周一',
        theme: 'Task1混合图',
        focus: '混合图+限时阅读',
        tasks: [
          makeTask('词汇', 30, 'List 43-44'),
          makeTask('听力', 45, '剑16 T3 S1 精听'),
          makeTask('阅读', 60, '限时3篇阅读训练'),
          makeTask('写作', 45, 'Task1 混合图练习'),
          makeTask('口语', 30, 'Part2串题')
        ]
      },
      {
        id: did(), day: 27, date: '3月31日', weekday: '周二',
        theme: '写作送批',
        focus: '第一篇送批改+错题重做',
        tasks: [
          makeTask('词汇', 30, 'List 45-46'),
          makeTask('听力', 45, '剑16 T3 S2 精听'),
          makeTask('阅读', 45, '错题重做'),
          makeTask('写作', 45, '送批1篇Task2'),
          makeTask('口语', 30, 'Part3练习')
        ]
      },
      {
        id: did(), day: 28, date: '4月1日', weekday: '周三',
        theme: '第一次完整模考',
        focus: '完整模考（听读写说）目标5.5-6分',
        tasks: [
          makeTask('词汇', 30, '复习 List 35-46'),
          makeTask('模考', 180, '剑17 T1 完整模考（听+读+写+说）'),
          makeTask('分析', 60, '完整错题分析+月总结')
        ]
      }
    ]
  },
  {
    week: 5,
    phase: '专项突破',
    dateRange: '4月2日 - 4月8日',
    goal: '听力Section3-4突破 | 词汇4000+',
    weeklyTargets: [
      '听力Section3-4正确率提升',
      '词汇List 47-58',
      '写作送批2篇',
      '阅读限时训练'
    ],
    mockExam: '剑17 T2',
    days: [
      { id: did(), day: 29, date: '4月2日', weekday: '周四', theme: '听力Section3攻克', focus: '学术对话理解', tasks: [makeTask('词汇', 30, 'List 47-48'), makeTask('听力', 45, '剑17 T1 S3 精听'), makeTask('阅读', 45, '剑18 Passage1'), makeTask('写作', 45, 'Task1复习'), makeTask('口语', 30, 'Part2串题')] },
      { id: did(), day: 30, date: '4月3日', weekday: '周五', theme: '听力Section4攻克', focus: '学术讲座精听', tasks: [makeTask('词汇', 30, 'List 49-50'), makeTask('听力', 45, '剑17 T1 S4 精听'), makeTask('阅读', 45, '剑18 Passage2'), makeTask('写作', 60, 'Task2 教育类'), makeTask('口语', 30, 'Part3练习')] },
      { id: did(), day: 31, date: '4月4日', weekday: '周六', theme: 'Section3强化', focus: '多人对话场景', tasks: [makeTask('词汇', 30, 'List 51-52'), makeTask('听力', 45, '剑17 T2 S3 精听'), makeTask('阅读', 45, '剑18 Passage3'), makeTask('写作', 60, 'Task2 科技类'), makeTask('口语', 30, 'Part2练习')] },
      { id: did(), day: 32, date: '4月5日', weekday: '周日', theme: 'Section4强化', focus: '长段学术听力', tasks: [makeTask('词汇', 30, 'List 53-54'), makeTask('听力', 45, '剑17 T2 S4 精听'), makeTask('阅读', 45, '剑18 Passage4'), makeTask('写作', 60, 'Task2 环境类'), makeTask('口语', 30, 'Part3练习')] },
      { id: did(), day: 33, date: '4月6日', weekday: '周一', theme: '综合训练', focus: '限时阅读+听力', tasks: [makeTask('词汇', 30, 'List 55-56'), makeTask('听力', 45, '剑17 T3 S3 精听'), makeTask('阅读', 60, '限时3篇训练'), makeTask('写作', 60, 'Task2 社会类'), makeTask('口语', 30, 'Part2串题')] },
      { id: did(), day: 34, date: '4月7日', weekday: '周二', theme: '写作送批', focus: '送批2篇+错题', tasks: [makeTask('词汇', 30, 'List 57-58'), makeTask('听力', 45, '剑17 T3 S4 精听'), makeTask('阅读', 45, '错题重做'), makeTask('写作', 45, '送批2篇Task2'), makeTask('口语', 30, 'Part3练习')] },
      { id: did(), day: 35, date: '4月8日', weekday: '周三', theme: '模考日', focus: '模考+周总结', tasks: [makeTask('词汇', 30, '复习 List 47-58'), makeTask('模考', 120, '剑17 T2 完整模考'), makeTask('分析', 45, '错题分析'), makeTask('复盘', 30, '周总结')] }
    ]
  },
  {
    week: 6,
    phase: '专项突破',
    dateRange: '4月9日 - 4月15日',
    goal: '阅读配对/判断专项 | 写作话题积累',
    weeklyTargets: ['阅读难题专项突破', '写作话题语料积累', '口语Part3深入', '送批2篇写作'],
    mockExam: '剑18 T1',
    days: [
      { id: did(), day: 36, date: '4月9日', weekday: '周四', theme: '配对题专项', focus: '配对题技巧深入', tasks: [makeTask('词汇', 30, 'List 59-60'), makeTask('听力', 45, '剑17 T4 S1 精听'), makeTask('阅读', 60, '配对题专项训练'), makeTask('写作', 60, 'Task2 文化类'), makeTask('口语', 30, 'Part2准备')] },
      { id: did(), day: 37, date: '4月10日', weekday: '周五', theme: '配对题强化', focus: '提高配对正确率', tasks: [makeTask('词汇', 30, 'List 61-62'), makeTask('听力', 45, '剑17 T4 S2 精听'), makeTask('阅读', 60, '配对题强化练习'), makeTask('写作', 60, 'Task2 政府类'), makeTask('口语', 30, 'Part2练习')] },
      { id: did(), day: 38, date: '4月11日', weekday: '周六', theme: '判断题专项', focus: 'T/F/NG精准判断', tasks: [makeTask('词汇', 30, 'List 63-64'), makeTask('听力', 45, '剑17 T4 S3 精听'), makeTask('阅读', 60, '判断题专项训练'), makeTask('写作', 60, 'Task2 犯罪类'), makeTask('口语', 30, 'Part3练习')] },
      { id: did(), day: 39, date: '4月12日', weekday: '周日', theme: '判断题强化', focus: '易错判断题分析', tasks: [makeTask('词汇', 30, 'List 65-66'), makeTask('听力', 45, '剑17 T4 S4 精听'), makeTask('阅读', 60, '判断题强化练习'), makeTask('写作', 60, 'Task2 媒体类'), makeTask('口语', 30, 'Part3练习')] },
      { id: did(), day: 40, date: '4月13日', weekday: '周一', theme: '填空题专项', focus: '填空题技巧', tasks: [makeTask('词汇', 30, 'List 67-68'), makeTask('听力', 45, '剑18 T1 S1 精听'), makeTask('阅读', 60, '填空题专项训练'), makeTask('写作', 60, 'Task2 完整篇'), makeTask('口语', 30, 'Part2串题')] },
      { id: did(), day: 41, date: '4月14日', weekday: '周二', theme: '选择题+送批', focus: '选择题+送批2篇', tasks: [makeTask('词汇', 30, 'List 69-70'), makeTask('听力', 45, '剑18 T1 S2 精听'), makeTask('阅读', 60, '选择题专项训练'), makeTask('写作', 45, '送批2篇'), makeTask('口语', 30, 'Part3练习')] },
      { id: did(), day: 42, date: '4月15日', weekday: '周三', theme: '模考日', focus: '模考检验', tasks: [makeTask('词汇', 30, '复习 List 59-70'), makeTask('模考', 120, '剑18 T1 完整模考'), makeTask('分析', 45, '错题分析'), makeTask('复盘', 30, '周总结')] }
    ]
  },
  {
    week: 7,
    phase: '专项突破',
    dateRange: '4月16日 - 4月22日',
    goal: '写作模板整理 | 口语Part3强化',
    weeklyTargets: ['形成自己的写作模板', '口语能应对Part3', '送批2篇写作', '模板背诵'],
    mockExam: '剑18 T2',
    days: [
      { id: did(), day: 43, date: '4月16日', weekday: '周四', theme: 'Task1模板整理', focus: '图表作文模板', tasks: [makeTask('词汇', 30, 'List 71-72'), makeTask('听力', 45, '剑18 T2 S1 精听'), makeTask('阅读', 45, '剑15复习'), makeTask('写作', 60, '整理Task1模板'), makeTask('口语', 30, 'Part3难题')] },
      { id: did(), day: 44, date: '4月17日', weekday: '周五', theme: 'Task2模板整理', focus: '大作文模板', tasks: [makeTask('词汇', 30, 'List 73-74'), makeTask('听力', 45, '剑18 T2 S2 精听'), makeTask('阅读', 45, '剑16复习'), makeTask('写作', 60, '整理Task2模板'), makeTask('口语', 30, 'Part3难题')] },
      { id: did(), day: 45, date: '4月18日', weekday: '周六', theme: '模板运用', focus: '用模板写完整篇', tasks: [makeTask('词汇', 30, 'List 75-76'), makeTask('听力', 45, '剑18 T2 S3 精听'), makeTask('阅读', 45, '剑17复习'), makeTask('写作', 60, 'Task2 完整篇'), makeTask('口语', 45, 'Part2全串')] },
      { id: did(), day: 46, date: '4月19日', weekday: '周日', theme: '模板练习', focus: '模板默写+运用', tasks: [makeTask('词汇', 30, 'List 77-78'), makeTask('听力', 45, '剑18 T2 S4 精听'), makeTask('阅读', 45, '错题本复习'), makeTask('写作', 60, 'Task2 完整篇'), makeTask('口语', 30, 'Part3模拟')] },
      { id: did(), day: 47, date: '4月20日', weekday: '周一', theme: '限时训练', focus: '阅读限时+口语模拟', tasks: [makeTask('词汇', 30, 'List 79-80'), makeTask('听力', 45, '剑18 T3 S1 精听'), makeTask('阅读', 60, '限时3篇训练'), makeTask('写作', 45, '送批2篇'), makeTask('口语', 30, 'Part2模拟')] },
      { id: did(), day: 48, date: '4月21日', weekday: '周二', theme: '模板背诵', focus: '背诵+巩固', tasks: [makeTask('词汇', 30, 'List 81-82'), makeTask('听力', 45, '剑18 T3 S2 精听'), makeTask('阅读', 45, '错题本复习'), makeTask('写作', 45, '模板背诵默写'), makeTask('口语', 30, 'Part3模拟')] },
      { id: did(), day: 49, date: '4月22日', weekday: '周三', theme: '模考日', focus: '模考+周总结', tasks: [makeTask('词汇', 30, '复习 List 71-82'), makeTask('模考', 120, '剑18 T2 完整模考'), makeTask('分析', 45, '错题分析'), makeTask('复盘', 30, '周总结')] }
    ]
  },
  {
    week: 8,
    phase: '专项突破',
    dateRange: '4月23日 - 4月29日',
    goal: '第二次模考 | 目标6.5分',
    weeklyTargets: ['模考目标6.5分', '错题全面复习', '模板默写', '查漏补缺'],
    mockExam: '剑18 T3',
    days: [
      { id: did(), day: 50, date: '4月23日', weekday: '周四', theme: '综合复习', focus: '全面巩固', tasks: [makeTask('词汇', 30, '复习高频词'), makeTask('听力', 45, '剑18 T3 S3 精听'), makeTask('阅读', 45, '剑18 Passage1'), makeTask('写作', 45, 'Task1练习'), makeTask('口语', 30, 'Part1复习')] },
      { id: did(), day: 51, date: '4月24日', weekday: '周五', theme: '综合练习', focus: '写作+阅读', tasks: [makeTask('词汇', 30, '复习高频词'), makeTask('听力', 45, '剑18 T3 S4 精听'), makeTask('阅读', 45, '剑18 Passage2'), makeTask('写作', 60, 'Task2练习'), makeTask('口语', 30, 'Part2复习')] },
      { id: did(), day: 52, date: '4月25日', weekday: '周六', theme: '错题重做', focus: '错题攻克', tasks: [makeTask('词汇', 30, '复习高频词'), makeTask('听力', 45, '错题重听'), makeTask('阅读', 45, '剑18 Passage3'), makeTask('写作', 45, '送批2篇'), makeTask('口语', 30, 'Part3复习')] },
      { id: did(), day: 53, date: '4月26日', weekday: '周日', theme: '模板默写', focus: '模板巩固', tasks: [makeTask('词汇', 30, '复习高频词'), makeTask('听力', 45, '错题重听'), makeTask('阅读', 45, '剑18 Passage4'), makeTask('写作', 45, '模板默写'), makeTask('口语', 45, '全模拟')] },
      { id: did(), day: 54, date: '4月27日', weekday: '周一', theme: '休息日', focus: '完全放松恢复', tasks: [makeTask('休息', 0, '完全放松，不学习')] },
      { id: did(), day: 55, date: '4月28日', weekday: '周二', theme: '轻量复习', focus: '保持手感', tasks: [makeTask('词汇', 30, '轻量复习'), makeTask('听力', 30, '轻量复习'), makeTask('阅读', 30, '轻量复习'), makeTask('写作', 30, '看范文'), makeTask('口语', 30, '看题库')] },
      { id: did(), day: 56, date: '4月29日', weekday: '周三', theme: '模考日', focus: '模考目标6.5分', tasks: [makeTask('模考', 180, '剑18 T3 完整模考（听读写说）'), makeTask('分析', 60, '完整分析+月总结')] }
    ]
  },
  {
    week: 9,
    phase: '冲刺模考',
    dateRange: '4月30日 - 5月6日',
    goal: '查漏补缺 | 写作定稿 | 词汇5000+',
    weeklyTargets: ['复习所有错题', '写作模板定型', '词汇高频复习', '模考剑15 T3'],
    mockExam: '剑15 T3',
    days: [
      { id: did(), day: 57, date: '4月30日', weekday: '周四', theme: '错题复习', focus: '剑15错题', tasks: [makeTask('词汇', 30, '高频词复习'), makeTask('听力', 45, '剑15错题重听'), makeTask('阅读', 45, '错题重做'), makeTask('写作', 45, 'Task1定稿'), makeTask('口语', 30, 'Part1全复习')] },
      { id: did(), day: 58, date: '5月1日', weekday: '周五', theme: '错题复习', focus: '剑16错题', tasks: [makeTask('词汇', 30, '高频词复习'), makeTask('听力', 45, '剑16错题重听'), makeTask('阅读', 45, '错题重做'), makeTask('写作', 45, 'Task2定稿'), makeTask('口语', 30, 'Part2全串')] },
      { id: did(), day: 59, date: '5月2日', weekday: '周六', theme: '限时训练+送批', focus: '限时+送批', tasks: [makeTask('词汇', 30, '高频词复习'), makeTask('听力', 45, '剑17错题重听'), makeTask('阅读', 60, '限时3篇'), makeTask('写作', 45, '送批2篇'), makeTask('口语', 30, 'Part3难题')] },
      { id: did(), day: 60, date: '5月3日', weekday: '周日', theme: '模板巩固', focus: '模板+错题', tasks: [makeTask('词汇', 30, '高频词复习'), makeTask('听力', 45, '剑18错题重听'), makeTask('阅读', 60, '限时3篇'), makeTask('写作', 45, '模板默写'), makeTask('口语', 30, 'Part3模拟')] },
      { id: did(), day: 61, date: '5月4日', weekday: '周一', theme: '精听强化', focus: 'Section4专项', tasks: [makeTask('词汇', 30, '高频词复习'), makeTask('听力', 60, '精听Section4'), makeTask('阅读', 45, '错题本复习'), makeTask('写作', 60, 'Task2完整篇'), makeTask('口语', 30, '全模拟')] },
      { id: did(), day: 62, date: '5月5日', weekday: '周二', theme: '送批+复习', focus: '最后送批', tasks: [makeTask('词汇', 30, '高频词复习'), makeTask('听力', 60, '精听Section4'), makeTask('阅读', 45, '错题本复习'), makeTask('写作', 45, '送批2篇'), makeTask('口语', 30, '全模拟')] },
      { id: did(), day: 63, date: '5月6日', weekday: '周三', theme: '模考日', focus: '模考+周总结', tasks: [makeTask('模考', 180, '剑15 T3 完整模考'), makeTask('分析', 60, '完整分析')] }
    ]
  },
  {
    week: 10,
    phase: '冲刺模考',
    dateRange: '5月7日 - 5月13日',
    goal: '全真模拟 | 时间控制 | 状态调整',
    weeklyTargets: ['3次完整模考', '严格计时3小时', '口语对练2次', '写作最后批改'],
    days: [
      { id: did(), day: 64, date: '5月7日', weekday: '周四', theme: '全真模考1', focus: '严格计时', tasks: [makeTask('模考', 180, '剑16 T2 完整模考（听读写）严格计时'), makeTask('口语', 30, '口语模拟')] },
      { id: did(), day: 65, date: '5月8日', weekday: '周五', theme: '模考分析', focus: '找问题', tasks: [makeTask('分析', 90, '模考分析+口语对练'), makeTask('弱项', 60, '弱项强化')] },
      { id: did(), day: 66, date: '5月9日', weekday: '周六', theme: '全真模考2', focus: '严格计时', tasks: [makeTask('模考', 180, '剑16 T3 完整模考（听读写）严格计时'), makeTask('口语', 30, '口语模拟')] },
      { id: did(), day: 67, date: '5月10日', weekday: '周日', theme: '模考分析', focus: '弱项强化', tasks: [makeTask('分析', 90, '模考分析'), makeTask('弱项', 60, '针对弱项专项训练')] },
      { id: did(), day: 68, date: '5月11日', weekday: '周一', theme: '全真模考3', focus: '严格计时', tasks: [makeTask('模考', 180, '剑17 T2 完整模考（听读写）严格计时'), makeTask('口语', 30, '口语模拟')] },
      { id: did(), day: 69, date: '5月12日', weekday: '周二', theme: '最后批改', focus: '写作定稿', tasks: [makeTask('分析', 90, '模考分析'), makeTask('写作', 60, '送批最后2篇')] },
      { id: did(), day: 70, date: '5月13日', weekday: '周三', theme: '轻量复习', focus: '放松', tasks: [makeTask('词汇', 30, '看模板'), makeTask('阅读', 30, '轻量复习'), makeTask('休息', 60, '放松调整')] }
    ]
  },
  {
    week: 11,
    phase: '冲刺模考',
    dateRange: '5月14日 - 5月20日',
    goal: '最后冲刺 | 状态巅峰',
    weeklyTargets: ['3次模考', '模板默写', '错题本最后过一遍', '口语全模拟'],
    days: [
      { id: did(), day: 71, date: '5月14日', weekday: '周四', theme: '模考', focus: '完整考试', tasks: [makeTask('模考', 180, '剑17 T3 完整模考'), makeTask('口语', 30, '口语模拟')] },
      { id: did(), day: 72, date: '5月15日', weekday: '周五', theme: '分析+对练', focus: '最后一次对练', tasks: [makeTask('分析', 90, '模考分析'), makeTask('口语', 60, '最后一次口语对练')] },
      { id: did(), day: 73, date: '5月16日', weekday: '周六', theme: '模考', focus: '完整考试', tasks: [makeTask('模考', 180, '剑18 T1 完整模考'), makeTask('口语', 30, '口语练习')] },
      { id: did(), day: 74, date: '5月17日', weekday: '周日', theme: '模板复习', focus: '默写所有模板', tasks: [makeTask('分析', 90, '模考分析'), makeTask('写作', 60, '模板默写')] },
      { id: did(), day: 75, date: '5月18日', weekday: '周一', theme: '模考', focus: '完整考试', tasks: [makeTask('模考', 180, '剑18 T2 完整模考'), makeTask('口语', 30, '口语练习')] },
      { id: did(), day: 76, date: '5月19日', weekday: '周二', theme: '错题本', focus: '最后过一遍错题', tasks: [makeTask('分析', 90, '模考分析'), makeTask('阅读', 60, '错题本最后复习')] },
      { id: did(), day: 77, date: '5月20日', weekday: '周三', theme: '轻量复习', focus: '看范文+放松', tasks: [makeTask('写作', 30, '看范文'), makeTask('口语', 30, '看题库'), makeTask('休息', 60, '放松调整')] }
    ]
  },
  {
    week: 12,
    phase: '冲刺模考',
    dateRange: '5月21日 - 考试日',
    goal: '调整状态 | 轻松上阵',
    weeklyTargets: ['保持手感', '不学新内容', '调整作息', '准备考试材料'],
    days: [
      { id: did(), day: 78, date: '5月21日', weekday: '周四', theme: '保持手感', focus: '听力保持', tasks: [makeTask('听力', 60, '听力Section1-2保持手感'), makeTask('词汇', 30, '高频词回顾')] },
      { id: did(), day: 79, date: '5月22日', weekday: '周五', theme: '轻量阅读', focus: '阅读+词汇', tasks: [makeTask('阅读', 45, '1篇阅读练习'), makeTask('词汇', 30, '高频词回顾')] },
      { id: did(), day: 80, date: '5月23日', weekday: '周六', theme: '写作模板', focus: '模板默写', tasks: [makeTask('写作', 60, '写作模板默写，不写新题')] },
      { id: did(), day: 81, date: '5月24日', weekday: '周日', theme: '口语复习', focus: '开口练习', tasks: [makeTask('口语', 60, 'Part1-2开口练习')] },
      { id: did(), day: 82, date: '5月25日', weekday: '周一', theme: '休息日', focus: '完全放松', tasks: [makeTask('休息', 0, '完全放松，不学习')] },
      { id: did(), day: 83, date: '5月26日', weekday: '周二', theme: '考前准备', focus: '看考场+准备证件', tasks: [makeTask('休息', 30, '看考场路线，准备身份证、铅笔、橡皮')] },
      { id: did(), day: 84, date: '5月27日', weekday: '周三', theme: '考试日', focus: '加油！目标7分！', tasks: [] }
    ]
  }
]

export const mockExams: MockExam[] = [
  { id: 1, week: 2, source: '剑15 T2', listening: null, reading: null, writing: null, speaking: null, total: null, date: null, notes: '' },
  { id: 2, week: 3, source: '剑16 T1', listening: null, reading: null, writing: null, speaking: null, total: null, date: null, notes: '' },
  { id: 3, week: 4, source: '剑17 T1', listening: null, reading: null, writing: null, speaking: null, total: null, date: null, notes: '' },
  { id: 4, week: 5, source: '剑17 T2', listening: null, reading: null, writing: null, speaking: null, total: null, date: null, notes: '' },
  { id: 5, week: 6, source: '剑18 T1', listening: null, reading: null, writing: null, speaking: null, total: null, date: null, notes: '' },
  { id: 6, week: 7, source: '剑18 T2', listening: null, reading: null, writing: null, speaking: null, total: null, date: null, notes: '' },
  { id: 7, week: 8, source: '剑18 T3', listening: null, reading: null, writing: null, speaking: null, total: null, date: null, notes: '' },
  { id: 8, week: 9, source: '剑15 T3', listening: null, reading: null, writing: null, speaking: null, total: null, date: null, notes: '' },
  { id: 9, week: 10, source: '剑16 T2', listening: null, reading: null, writing: null, speaking: null, total: null, date: null, notes: '' },
  { id: 10, week: 10, source: '剑16 T3', listening: null, reading: null, writing: null, speaking: null, total: null, date: null, notes: '' },
  { id: 11, week: 10, source: '剑17 T2', listening: null, reading: null, writing: null, speaking: null, total: null, date: null, notes: '' },
  { id: 12, week: 11, source: '剑17 T3', listening: null, reading: null, writing: null, speaking: null, total: null, date: null, notes: '' },
  { id: 13, week: 11, source: '剑18 T1', listening: null, reading: null, writing: null, speaking: null, total: null, date: null, notes: '' },
  { id: 14, week: 11, source: '剑18 T2', listening: null, reading: null, writing: null, speaking: null, total: null, date: null, notes: '' },
]

export const milestones = [
  { week: 2, label: '词汇2500+', target: 2500, type: 'vocab' },
  { week: 4, label: '模考5.5-6分', target: 5.75, type: 'score' },
  { week: 8, label: '模考6.5分', target: 6.5, type: 'score' },
  { week: 10, label: '写作10篇完成', target: 10, type: 'writing' },
  { week: 12, label: '正式考试7分', target: 7, type: 'score' },
]
