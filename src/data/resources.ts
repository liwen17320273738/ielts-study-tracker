export interface Resource {
  name: string
  url?: string
  description: string
  priority: '必备' | '推荐' | '可选'
  cost?: string
}

export interface ResourceCategory {
  title: string
  icon: string
  items: Resource[]
}

export const resources: ResourceCategory[] = [
  {
    title: '真题与教材', icon: '📕',
    items: [
      { name: '剑桥雅思真题 10-19', description: '最核心的练习材料，至少做完 14-19', priority: '必备', cost: '150-200元' },
      { name: '剑桥雅思官方指南 Official Guide', description: '官方出题思路讲解', priority: '推荐', cost: '60元' },
      { name: '9分达人阅读/听力系列', description: '按题型分类真题汇编，刷题量大', priority: '推荐', cost: '40元/本' },
      { name: '顾家北《手把手教你雅思写作》', description: '写作入门必读，国内最受欢迎写作书', priority: '必备', cost: '50元' },
      { name: '慎小嶷《十天突破雅思写作》', description: '写作进阶参考', priority: '推荐', cost: '50元' },
      { name: '慎小嶷《十天突破雅思口语》', description: '口语话题分类梳理', priority: '推荐', cost: '50元' },
      { name: '刘洪波《雅思阅读真经总纲》', description: '阅读方法论 + 同义替换', priority: '推荐', cost: '45元' },
      { name: '刘洪波《雅思听力真经》', description: '听力场景词汇 + 技巧', priority: '可选', cost: '45元' },
      { name: '王陆807雅思词汇精讲（听力篇）', description: '听力高频场景词汇', priority: '推荐', cost: '40元' },
      { name: '《雅思词汇真经》', description: '按话题分类的雅思核心词汇', priority: '推荐', cost: '50元' },
      { name: '杨凡《雅思语法》', description: '语法薄弱者必备', priority: '可选', cost: '40元' },
    ]
  },
  {
    title: '听力资源', icon: '🎧',
    items: [
      { name: 'BBC 6 Minute English', url: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english', description: '免费精听材料，带文本+词汇，每周更新', priority: '必备' },
      { name: 'BBC Learning English', url: 'https://www.bbc.co.uk/learningenglish', description: '多种节目类型：新闻、语法、发音等', priority: '必备' },
      { name: 'TED Talks', url: 'https://www.ted.com/', description: '学术讲座风格，练Section4，带字幕', priority: '推荐' },
      { name: 'IELTS Listening Practice (YouTube)', url: 'https://www.youtube.com/@IELTSListeningPractice', description: '大量模拟听力练习', priority: '推荐' },
      { name: 'Randall\'s ESL Cyber Listening Lab', url: 'https://www.esl-lab.com/', description: '分级听力练习，带题目', priority: '推荐' },
      { name: 'Scientific American 60s Science', url: 'https://www.scientificamerican.com/podcast/60-second-science/', description: '60秒科学播客，练学术听力', priority: '推荐' },
      { name: 'NPR News', url: 'https://www.npr.org/', description: '美式英语新闻播客', priority: '可选' },
      { name: '每日英语听力 APP', description: '资源全，可变速，支持精听模式', priority: '推荐' },
      { name: '可可英语 APP', url: 'https://www.kekenet.com/', description: '免费英语听力+阅读资源', priority: '推荐' },
      { name: 'Podcasts in English', url: 'https://www.podcastsinenglish.com/', description: '按级别分类的英语播客', priority: '可选' },
      { name: 'Luke\'s English Podcast', url: 'https://teacherluke.co.uk/', description: '英式英语播客，适合日常听力', priority: '可选' },
    ]
  },
  {
    title: '阅读资源', icon: '📖',
    items: [
      { name: 'IELTS Simon 阅读', url: 'https://ielts-simon.com/', description: '前考官 Simon 的阅读技巧+范文', priority: '必备' },
      { name: 'The Guardian', url: 'https://www.theguardian.com/', description: '英国主流报纸，社科类文章', priority: '推荐' },
      { name: 'The Economist', url: 'https://www.economist.com/', description: '经济+国际时事，学术性强', priority: '推荐' },
      { name: 'National Geographic', url: 'https://www.nationalgeographic.com/', description: '自然科学类文章，常见雅思话题', priority: '推荐' },
      { name: 'New Scientist', url: 'https://www.newscientist.com/', description: '科学类文章，Section3风格', priority: '推荐' },
      { name: 'BBC News', url: 'https://www.bbc.com/news', description: '时事新闻，提升阅读速度', priority: '推荐' },
      { name: 'ScienceDaily', url: 'https://www.sciencedaily.com/', description: '科学新闻，学术阅读材料', priority: '可选' },
      { name: '雅思哥 APP', url: 'https://www.ieltsbro.com/', description: '真题+解析+机经', priority: '推荐' },
      { name: '小站雅思 APP', description: '真题练习+限时训练', priority: '推荐' },
      { name: 'ReadTheory', url: 'https://readtheory.org/', description: '自适应阅读练习平台，免费', priority: '可选' },
      { name: 'Lingua.com', url: 'https://lingua.com/english/reading/', description: '分级英语阅读材料', priority: '可选' },
    ]
  },
  {
    title: '写作资源', icon: '✍️',
    items: [
      { name: 'IELTS Simon 写作', url: 'https://ielts-simon.com/', description: '前考官范文，Task1+Task2每题型都有', priority: '必备' },
      { name: 'IELTS Liz 写作系列', url: 'https://ieltsliz.com/ielts-writing-task-2/', description: '写作结构详解+范文', priority: '必备' },
      { name: '顾家北 B站免费课', url: 'https://www.bilibili.com/', description: 'B站搜索"顾家北雅思写作"', priority: '必备' },
      { name: 'IELTS Advantage 写作', url: 'https://www.ieltsadvantage.com/', description: '结构化写作方法论', priority: '推荐' },
      { name: 'Band 9 Sample Essays', url: 'https://ielts-simon.com/', description: '9分范文集合学习', priority: '推荐' },
      { name: 'Grammarly', url: 'https://www.grammarly.com/', description: '语法+拼写检查工具', priority: '推荐' },
      { name: 'Ludwig.guru', url: 'https://ludwig.guru/', description: '英语语境搜索引擎，查搭配', priority: '推荐' },
      { name: 'Thesaurus.com', url: 'https://www.thesaurus.com/', description: '同义词替换工具', priority: '推荐' },
      { name: 'Academic Word List (AWL)', url: 'https://www.wgtn.ac.nz/lals/resources/academicwordlist/', description: '学术词汇表570词，提升写作用词', priority: '推荐' },
      { name: '淘宝写作批改', description: '约20-30元/篇，至少批改10篇', priority: '必备', cost: '250元/10篇' },
      { name: 'italki 外教批改', url: 'https://www.italki.com/', description: '外教逐句批改，约50-100元/篇', priority: '可选', cost: '50-100元/篇' },
      { name: 'Write & Improve (Cambridge)', url: 'https://writeandimprove.com/', description: '剑桥大学免费AI写作评分工具', priority: '推荐' },
    ]
  },
  {
    title: '口语资源', icon: '🗣️',
    items: [
      { name: '雅思哥 APP', url: 'https://www.ieltsbro.com/', description: '当季口语题库，必用，换题季及时更新', priority: '必备' },
      { name: 'IELTS Speaking Assistant', description: 'AI口语模拟练习APP', priority: '推荐' },
      { name: 'IELTS Liz 口语系列', url: 'https://ieltsliz.com/ielts-speaking/', description: '口语每个Part详细技巧+示范', priority: '必备' },
      { name: 'IELTS Advantage 口语', url: 'https://www.ieltsadvantage.com/', description: '口语结构+高分答案', priority: '推荐' },
      { name: 'italki 外教对练', url: 'https://www.italki.com/', description: '约50-150元/小时，找雅思考官陪练最佳', priority: '推荐', cost: '400元/10h' },
      { name: 'Cambly', url: 'https://www.cambly.com/', description: '随时找外教聊天，适合口语输出', priority: '推荐', cost: '约100元/月' },
      { name: 'ELSA Speak APP', url: 'https://elsaspeak.com/', description: 'AI发音纠正工具', priority: '推荐' },
      { name: 'Forvo', url: 'https://forvo.com/', description: '真人发音词典，查发音', priority: '推荐' },
      { name: 'YouGlish', url: 'https://youglish.com/', description: '搜索单词在YouTube中的真实使用场景', priority: '可选' },
      { name: '淘宝口语陪练', description: '约30-50元/小时', priority: '推荐' },
      { name: 'Speechling', url: 'https://speechling.com/', description: '免费口语练习+真人教练反馈', priority: '可选' },
    ]
  },
  {
    title: '词汇资源', icon: '📝',
    items: [
      { name: '不背单词 APP', description: '设置雅思词库，艾宾浩斯复习曲线', priority: '推荐', cost: '部分付费' },
      { name: '墨墨背单词 APP', description: '自定义词库+复习提醒', priority: '推荐', cost: '部分付费' },
      { name: 'Anki', url: 'https://apps.ankiweb.net/', description: '间隔重复记忆卡片，可导入雅思词汇包', priority: '推荐' },
      { name: 'Quizlet', url: 'https://quizlet.com/', description: '在线闪卡+游戏化学习，搜索IELTS词汇', priority: '推荐' },
      { name: 'Vocabulary.com', url: 'https://www.vocabulary.com/', description: '智能词汇学习系统', priority: '可选' },
      { name: 'AWL Highlighter', url: 'https://www.nottingham.ac.uk/alzsh3/acvocab/awlhighlighter.htm', description: '高亮文章中的学术词汇', priority: '可选' },
      { name: 'Merriam-Webster', url: 'https://www.merriam-webster.com/', description: '权威英英词典', priority: '推荐' },
      { name: 'Cambridge Dictionary', url: 'https://dictionary.cambridge.org/', description: '剑桥词典，带雅思相关标记', priority: '必备' },
      { name: 'Longman Dictionary', url: 'https://www.ldoceonline.com/', description: '朗文词典，IELTS常用搭配', priority: '推荐' },
      { name: 'Collocation Dictionary', url: 'https://ozdic.com/', description: '搭配词典，提升写作地道性', priority: '推荐' },
    ]
  },
  {
    title: '语法资源', icon: '📐',
    items: [
      { name: 'English Grammar in Use (Murphy)', description: '剑桥语法经典教材（中级）', priority: '必备', cost: '60元' },
      { name: 'Grammarly', url: 'https://www.grammarly.com/', description: '实时语法检查+写作建议', priority: '推荐' },
      { name: 'English Page', url: 'https://www.englishpage.com/', description: '免费语法教程+练习', priority: '推荐' },
      { name: 'Perfect English Grammar', url: 'https://www.perfect-english-grammar.com/', description: '清晰的语法讲解+练习', priority: '推荐' },
      { name: 'Grammar Bytes', url: 'https://www.chompchomp.com/', description: '有趣的语法练习', priority: '可选' },
      { name: 'Road to Grammar', url: 'https://www.roadtogrammar.com/', description: '雅思语法专项练习', priority: '推荐' },
    ]
  },
  {
    title: 'YouTube/B站频道', icon: '🎬',
    items: [
      { name: 'IELTS Liz', url: 'https://www.youtube.com/@iabortieltsliz', description: '最受欢迎的雅思频道，全技能覆盖', priority: '必备' },
      { name: 'IELTS Simon (E2)', url: 'https://www.youtube.com/@E2IELTS', description: '前考官详解评分标准', priority: '必备' },
      { name: 'E2 IELTS', url: 'https://www.youtube.com/@E2IELTS', description: '澳洲IELTS培训频道，内容全面', priority: '推荐' },
      { name: 'IELTS Advantage', url: 'https://www.youtube.com/@IELTSAdvantage', description: '结构化备考方法', priority: '推荐' },
      { name: 'Academic English Help', url: 'https://www.youtube.com/@AcademicEnglishHelp', description: '学术英语+雅思写作', priority: '推荐' },
      { name: 'English with Lucy', url: 'https://www.youtube.com/@EnglishwithLucy', description: '英式英语学习', priority: '可选' },
      { name: 'Rachel\'s English', url: 'https://www.youtube.com/@rachelsenglish', description: '美式发音教程', priority: '可选' },
      { name: '顾家北写作（B站）', description: 'B站搜索"顾家北"，免费写作课', priority: '必备' },
      { name: '杜仕明雅思（B站）', description: 'B站搜索，听力+阅读技巧', priority: '推荐' },
      { name: '雅思哥（B站）', description: '口语题库讲解+技巧', priority: '推荐' },
      { name: 'Chris雅思口语（B站）', description: '口语示范+话题梳理', priority: '可选' },
    ]
  },
  {
    title: '免费模考与练习', icon: '📋',
    items: [
      { name: 'British Council 免费模考', url: 'https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests', description: '官方免费练习测试', priority: '必备' },
      { name: 'IDP 免费模考', url: 'https://ielts.idp.com/prepare/free-ielts-practice-tests', description: 'IDP官方练习', priority: '必备' },
      { name: 'IELTS Online Tests', url: 'https://ieltsonlinetests.com/', description: '大量免费在线模考', priority: '推荐' },
      { name: 'IELTS Exam.net', url: 'https://www.ielts-exam.net/', description: '免费真题练习', priority: '推荐' },
      { name: 'Test-English.com', url: 'https://test-english.com/', description: '分级英语测试', priority: '可选' },
      { name: 'Road to IELTS', url: 'https://www.roadtoielts.com/', description: 'British Council 付费备考平台', priority: '可选', cost: '约200元' },
      { name: 'Mini IELTS', url: 'https://mini-ielts.com/', description: '免费雅思听力+阅读练习', priority: '推荐' },
      { name: 'IELTS Buddy', url: 'https://www.ieltsbuddy.com/', description: '免费雅思技巧+模拟题', priority: '推荐' },
    ]
  },
  {
    title: '综合APP', icon: '📱',
    items: [
      { name: '雅思哥', url: 'https://www.ieltsbro.com/', description: '口语题库+听力+阅读真题', priority: '必备' },
      { name: '小站雅思', description: '真题练习+模考+讲解', priority: '推荐' },
      { name: '新东方雅思', description: '课程+真题+词汇', priority: '可选' },
      { name: '流利说 英语', description: 'AI口语练习', priority: '可选' },
      { name: 'Magoosh IELTS', url: 'https://ielts.magoosh.com/', description: '视频课程+练习题', priority: '可选', cost: '约600元' },
      { name: 'BBC Learning English APP', url: 'https://www.bbc.co.uk/learningenglish', description: '免费英语学习内容', priority: '推荐' },
    ]
  },
  {
    title: '官方网站', icon: '🌐',
    items: [
      { name: '雅思中国官网', url: 'https://www.chinaielts.org/', description: '报名+考试时间+考场信息', priority: '必备' },
      { name: 'IELTS.org', url: 'https://www.ielts.org/', description: '国际官网，评分标准+备考资源', priority: '推荐' },
      { name: 'British Council IELTS', url: 'https://takeielts.britishcouncil.org/', description: '免费备考资源+报名', priority: '推荐' },
      { name: 'IDP IELTS', url: 'https://ielts.idp.com/', description: 'IDP报名+资源', priority: '推荐' },
      { name: 'IELTS Liz', url: 'https://ieltsliz.com/', description: '全技能技巧+范文+视频', priority: '必备' },
      { name: '知乎雅思话题', url: 'https://www.zhihu.com/topic/19552828', description: '高分经验贴+备考策略', priority: '可选' },
      { name: '小红书雅思话题', description: '搜索"雅思"，大量备考经验', priority: '可选' },
    ]
  },
  {
    title: '写作话题语料库', icon: '💡',
    items: [
      { name: '教育类话题', description: '网络教育 vs 传统教育、大学教育的价值、出国留学利弊、儿童教育方式', priority: '必备' },
      { name: '科技类话题', description: 'AI影响、社交媒体利弊、远程办公、电子游戏影响、太空探索', priority: '必备' },
      { name: '环境类话题', description: '气候变化、垃圾分类、可再生能源、动物保护、城市规划', priority: '必备' },
      { name: '社会类话题', description: '贫富差距、老龄化、犯罪预防、男女平等、全球化', priority: '必备' },
      { name: '健康类话题', description: '快餐文化、心理健康、公共卫生、运动重要性、食品安全', priority: '推荐' },
      { name: '文化类话题', description: '传统文化保护、文化全球化、旅游影响、语言消失', priority: '推荐' },
      { name: '政府类话题', description: '政府责任 vs 个人责任、公共服务、税收、法律法规', priority: '推荐' },
      { name: '媒体类话题', description: '新闻自由、广告影响、社交媒体 vs 传统媒体、信息可靠性', priority: '推荐' },
    ]
  }
]

export const budget = [
  { item: '剑桥真题4-6本', cost: 200, priority: '必买' },
  { item: '顾家北写作书', cost: 50, priority: '必买' },
  { item: '词汇书/APP', cost: 50, priority: '必买' },
  { item: '写作批改10篇', cost: 250, priority: '必做' },
  { item: '口语对练10h', cost: 400, priority: '推荐' },
  { item: 'Grammar in Use', cost: 60, priority: '推荐' },
  { item: '慎小嶷口语/写作书', cost: 100, priority: '推荐' },
]

export const templates = {
  writing: {
    task1: {
      intro: 'The [chart/graph/diagram/table] illustrates/shows/depicts [主题] in [地点/时间].',
      overview: 'Overall, it is clear that [总体趋势]. Additionally, [另一个重要趋势].',
      body1: 'Looking at the details, [最大/最显著的数据] accounted for [比例/数量], which was the highest among all categories. This figure [上升/下降/保持] from [起始值] to [结束值] over the period.',
      body2: 'In contrast, [对比对象] was significantly lower at [数据]. Meanwhile, [其他数据] remained relatively stable/fluctuated throughout the period. It is also noticeable that [次要趋势].',
      summary: 'In summary, the data clearly shows that [主要结论].',
      synonyms: {
        'shows': ['illustrates', 'depicts', 'presents', 'compares', 'reveals', 'demonstrates'],
        'increased': ['rose', 'grew', 'climbed', 'went up', 'surged', 'soared', 'escalated'],
        'decreased': ['fell', 'declined', 'dropped', 'went down', 'plummeted', 'plunged', 'dwindled'],
        'percentage': ['proportion', 'share', 'ratio', 'fraction'],
        'significant': ['considerable', 'substantial', 'marked', 'notable', 'pronounced'],
        'stable': ['constant', 'steady', 'unchanged', 'consistent', 'level'],
        'fluctuated': ['varied', 'oscillated', 'wavered', 'was erratic'],
        'approximately': ['roughly', 'around', 'about', 'nearly', 'close to'],
        'highest': ['peak', 'maximum', 'greatest', 'largest', 'most'],
        'lowest': ['minimum', 'least', 'smallest', 'bottom'],
      }
    },
    task2: {
      intro: [
        '【背景句】In today\'s world, [话题背景] has become a controversial/widely debated issue.',
        '【改写题目】Some people argue that [观点A], while others believe that [观点B].',
        '【我的立场】In my opinion, I [strongly] agree/disagree with the former/latter view.',
        '【概述】This essay will discuss the reasons for my position.'
      ],
      body: [
        '【主题句】The main/primary reason why I support this view is that [论点].',
        '【解释】This is because [进一步解释]. In other words, [用不同方式重述].',
        '【例子】For example, a recent study by [来源] found that [具体例子/研究/数据].',
        '【小结】Therefore, it is evident that [小结句].'
      ],
      concession: [
        '【承认对方】Admittedly, there are some valid arguments on the other side.',
        '【具体说明】Some people may argue that [对方观点], and this viewpoint has some merit.',
        '【反驳】However, I believe that [你的反驳]. This is because [反驳理由].',
        '【小结】Thus, on balance, the benefits of my view outweigh the drawbacks.'
      ],
      conclusion: [
        '【重述立场】In conclusion, I firmly believe that [重述你的观点].',
        '【总结理由】This is primarily due to [理由1] and [理由2].',
        '【建议/展望】It is recommended that [建议/未来展望]. Only in this way can we [积极结果].'
      ]
    }
  },
  speaking: {
    part1: {
      work: 'I\'m currently [working as a... / studying...]. I\'ve been doing this for [时间]. I chose this because [原因]. Actually, I find it quite [感受], especially when [具体场景].',
      hometown: 'I\'m from [城市], which is located in [省份/地区]. It\'s famous for [特色]. What I like most about it is [原因]. I\'ve lived there for [时间], and it\'s changed a lot in recent years.',
      hobby: 'Well, I\'m really into [爱好]. I usually [具体活动] when I have spare time. The reason I enjoy it so much is that [原因]. It helps me [好处], and I\'d say it\'s become an important part of my life.',
      weather: 'The weather in my city is [描述]. I prefer [季节] because [原因]. When the weather is nice, I usually [活动]. Bad weather doesn\'t really bother me though, because [原因].',
      food: 'I\'m a big fan of [食物类型]. My favorite dish would be [具体菜名], which is [描述]. I usually have it [频率]. What makes it special is [特点].',
      travel: 'I really enjoy traveling. The last trip I took was to [地点], which was [感受]. I prefer [旅行方式] because [原因]. If I could go anywhere, I\'d choose [地方] because [理由].'
    },
    part2: {
      person: '【引入】I\'d like to talk about [人物], who is [关系].\n【外貌/性格】He/She is [形容词], and always [特点]. What stands out about them is [突出特征].\n【相识】I first met him/her [时间/场景]. At that time, [当时情况].\n【具体事例】One thing I remember clearly is [具体故事]. It really showed me [品质].\n【感受】What I admire most about him/her is [品质], because [原因].\n【总结】Overall, he/she has had a profound influence on me, and I feel grateful to have them in my life.',
      place: '【引入】I\'m going to describe [地点], which is located in [位置].\n【外观】It\'s a [形容词] place with [特点]. The atmosphere there is [描述].\n【首次访问】I first went there [时间/原因]. I remember being struck by [第一印象].\n【活动】When I was there, I [做了什么]. I also got to [另一个活动].\n【感受】What impressed me most was [印象最深的事], because [原因].\n【总结】That\'s why this place holds a special place in my heart, and I\'d love to go back someday.',
      event: '【引入】I\'d like to tell you about [事件], which happened [时间].\n【背景】At that time, [背景情况]. I was [当时状态].\n【经过】What happened was [具体经过]. Then, [后续发展].\n【感受】I felt incredibly [感受] because [原因]. It was a [形容词] experience.\n【结果】In the end, [结果]. It really changed my perspective on [方面].\n【总结】Looking back, this experience taught me that [收获], and it\'s something I\'ll never forget.',
      object: '【引入】The [物品] I want to talk about is [具体是什么]. It\'s quite special to me.\n【外观】It\'s [形容词] and has [特点]. It\'s made of [材质].\n【来源】I got it [时间/方式] from [谁/哪里]. The story behind it is [故事].\n【用途】I use it for [用途] almost every [频率]. It\'s incredibly [特点].\n【感受】What I like most about it is [原因]. It reminds me of [关联].\n【总结】It\'s really important to me because [意义], and I\'d be lost without it.',
      skill: '【引入】I\'d like to describe [技能], which I learned [时间].\n【如何学的】I first started learning it when [场景]. At the beginning, I found it [感受].\n【学习过程】I practiced by [练习方式]. The hardest part was [难点].\n【现在的水平】Now I\'d say I\'m [水平], and I can [能力].\n【感受】What I enjoy most about it is [原因].\n【总结】This skill has really enriched my life and I plan to continue improving.'
    },
    part3: {
      opinion: ['In my opinion, ...', 'From my perspective, ...', 'I believe that ...', 'As far as I\'m concerned, ...', 'Personally, I think ...', 'I\'d argue that ...'],
      reason: ['The main reason is that ...', 'This is because ...', 'There are several factors behind this.', 'One key factor is ...', 'This can be attributed to ...'],
      example: ['For instance, ...', 'A good example of this is ...', 'Take ... as an example.', 'To illustrate, ...', 'A case in point is ...'],
      contrast: ['On the one hand, ... On the other hand, ...', 'While some people ..., others ...', 'Compared to ..., ...', 'In contrast to ...', 'Conversely, ...'],
      stalling: ['That\'s an interesting question. Let me think...', 'I\'m not entirely sure, but I guess...', 'I haven\'t thought about this before, but maybe...', 'That\'s a thought-provoking question...', 'Well, off the top of my head, I\'d say...'],
      agreeing: ['I completely agree because ...', 'That\'s absolutely right, and I\'d add that ...', 'I share the same view because ...'],
      disagreeing: ['I see the point, but I\'d argue that ...', 'I respectfully disagree because ...', 'While that may be true, I think ...']
    }
  },
  connectors: {
    sequence: ['Firstly', 'Secondly', 'Thirdly', 'Finally', 'To begin with', 'Last but not least', 'Subsequently'],
    addition: ['Moreover', 'Furthermore', 'In addition', 'Besides', 'What is more', 'On top of that', 'Additionally'],
    contrast: ['However', 'Nevertheless', 'On the contrary', 'In contrast', 'Despite', 'Although', 'Whereas', 'Nonetheless'],
    cause: ['Therefore', 'Consequently', 'As a result', 'Hence', 'Thus', 'For this reason', 'Accordingly'],
    emphasis: ['What really matters is ...', 'The key point is ...', 'It is worth noting that ...', 'Most importantly, ...', 'Significantly, ...'],
    example: ['For example', 'For instance', 'Such as', 'To illustrate', 'A case in point is', 'Namely'],
    concession: ['Admittedly', 'Granted that', 'While it is true that', 'Even though', 'Despite the fact that'],
    complex: ['Not only ..., but also ...', 'The more ..., the more ...', 'It is ... that ... (强调句)', 'Were it not for ...', 'Had it not been for ...', 'Only by ... can we ...']
  }
}
