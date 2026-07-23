// UI strings grouped by screen/product object per docs/localization-workflow.md.
// Keys are stable; `en` is the source copy and `zh-Hans` is required before a
// feature is release-ready. Catalog data (deed/spot names) stays dynamic and
// is localized via API `localized_name` fields, not here.

export const en = {
  header: {
    eyebrow: "Virtual good karma map",
    karmaLabel: "karma"
  },
  nav: {
    today: "Today",
    map: "Map",
    deeds: "Deeds",
    community: "Community",
    profile: "Profile",
    tabSuffix: "tab"
  },
  categories: {
    all: "All",
    animals: "Animals",
    elders: "Elders",
    environment: "Nature",
    support: "Blessings"
  },
  moods: {
    calm: "Calm",
    heavy: "Heavy",
    lonely: "Lonely",
    grateful: "Grateful"
  },
  moodDeeds: {
    calm: "Release fish at East Lake",
    heavy: "Light a path home",
    lonely: "Send an anonymous blessing",
    grateful: "Help elder cross safely"
  },
  today: {
    eyebrow: "Today",
    title: "Do one quiet good deed.",
    copy: "Check in, choose a small symbolic action, and leave the day a little lighter.",
    moodTitle: "How are you arriving?",
    streak: "%{count} day streak",
    recommended: "Recommended deed",
    recommendedCopy: "A symbolic action that keeps comfort separate from real-world claims.",
    completeDeed: "Complete deed",
    journalTitle: "Karma journal",
    journalPlaceholder: "Today I want to release one worry and do one kind thing."
  },
  map: {
    eyebrow: "World map",
    title: "Explore places that need a little light.",
    spotLabel: "%{name} good deed spot"
  },
  deeds: {
    eyebrow: "Deed catalog",
    title: "Small rituals, clear categories.",
    shown: "%{count} shown",
    ritualPreview: "Ritual preview",
    performRitual: "Perform ritual"
  },
  calm: {
    eyebrow: "Calm ritual",
    title: "Take a focused moment first.",
    copy: "Use a short presence timer, optional soundscape, and quiet reflection before recording a symbolic deed.",
    ready: "ready",
    optional: "optional",
    soundscapes: {
      water: "Water",
      rain: "Rain",
      forest: "Forest"
    },
    guidedStepOne: "1. Breathe once and name the intention.",
    guidedStepTwo: "2. Hold the action gently until the timer completes.",
    guidedStepThree: "3. Record how you feel without pressure.",
    startFocus: "Start 20s focus",
    completeFocused: "Complete with focus"
  },
  safety: {
    notice: "This is symbolic comfort only. It does not guarantee luck, virtue, health, or real-world impact."
  },
  community: {
    eyebrow: "Community",
    title: "A low-pressure kindness wall.",
    blessingPlaceholder: "May your road feel less heavy today.",
    sendBlessing: "Send blessing",
    bless: "Bless",
    report: "Report"
  },
  account: {
    eyebrow: "Account",
    signInTitle: "Welcome back, quietly.",
    signUpTitle: "Keep your karma with you.",
    copy: "An account keeps your karma and streak safe across devices. No pressure — guest mode always works.",
    usernamePlaceholder: "Username",
    passwordPlaceholder: "Password",
    signIn: "Sign in",
    signUp: "Create account",
    switchToSignUp: "New here? Create a quiet account",
    switchToSignIn: "Already have an account? Sign in",
    signedInAs: "Signed in as %{name}",
    signedInCopy: "Your karma and streak follow you now. Your journal stays on this device.",
    signOut: "Sign out",
    gentleError: "That did not work — no rush, try once more.",
    guestNote: "You can keep using Foobow without an account."
  },
  profile: {
    eyebrow: "Profile & Preferences",
    title: "Your virtual footprint.",
    statistics: "Statistics",
    totalKarma: "Total Karma",
    dayStreak: "Day Streak",
    preferences: "Preferences",
    quietMode: "Quiet Mode",
    quietModeCopy: "Suppress loud notifications and sound effects.",
    privateJournal: "Private Journal",
    privateJournalCopy: "Keep reflections stored locally on your device.",
    seniorMode: "Senior / High Readability Mode",
    seniorModeCopy: "Enlarge text font sizes and touch targets for comfortable reading.",
    language: "Language",
    languageCopy: "Choose the app language or follow the device setting.",
    languageSystem: "System",
    dataControls: "Data Controls",
    exportBackup: "Export local backup"
  }
};

export type TranslationShape = typeof en;

export const zhHans: TranslationShape = {
  header: {
    eyebrow: "虚拟善缘地图",
    karmaLabel: "善缘"
  },
  nav: {
    today: "今日",
    map: "地图",
    deeds: "善举",
    community: "社区",
    profile: "我的",
    tabSuffix: "标签页"
  },
  categories: {
    all: "全部",
    animals: "动物",
    elders: "长辈",
    environment: "自然",
    support: "祝福"
  },
  moods: {
    calm: "平静",
    heavy: "沉重",
    lonely: "孤单",
    grateful: "感恩"
  },
  moodDeeds: {
    calm: "在东湖云放生",
    heavy: "点亮一条回家的路",
    lonely: "送出一句匿名祝福",
    grateful: "扶长辈安全过马路"
  },
  today: {
    eyebrow: "今日",
    title: "做一件安静的小善事。",
    copy: "签到、选择一个象征性善举，让今天稍微轻一点。",
    moodTitle: "今天的心情如何？",
    streak: "连续 %{count} 天",
    recommended: "推荐善举",
    recommendedCopy: "象征性的善举，与真实世界的承诺清楚分开。",
    completeDeed: "完成善举",
    journalTitle: "善缘日记",
    journalPlaceholder: "今天我想放下一点担心，做一件温和的小事。"
  },
  map: {
    eyebrow: "世界地图",
    title: "探索需要一点光的地方。",
    spotLabel: "%{name}善举地点"
  },
  deeds: {
    eyebrow: "善举目录",
    title: "小仪式，清晰分类。",
    shown: "显示 %{count} 项",
    ritualPreview: "仪式预览",
    performRitual: "执行仪式"
  },
  calm: {
    eyebrow: "静心仪式",
    title: "先留一个专注的片刻。",
    copy: "在记录象征性善举前，使用短暂计时、可选声景和安静反思。",
    ready: "就绪",
    optional: "可选",
    soundscapes: {
      water: "流水",
      rain: "雨声",
      forest: "森林"
    },
    guidedStepOne: "1. 呼吸一次，说出今天的心意。",
    guidedStepTwo: "2. 轻轻按住动作，直到计时完成。",
    guidedStepThree: "3. 无压力地记录此刻的感受。",
    startFocus: "开始 20 秒专注",
    completeFocused: "专注完成"
  },
  safety: {
    notice: "这只是象征性安慰，不保证好运、美德、健康或真实影响。"
  },
  community: {
    eyebrow: "社区",
    title: "低压力的祝福墙。",
    blessingPlaceholder: "愿你今天的路不那么沉重。",
    sendBlessing: "送出祝福",
    bless: "祝福",
    report: "举报"
  },
  account: {
    eyebrow: "账户",
    signInTitle: "安静地，欢迎回来。",
    signUpTitle: "把善缘带在身边。",
    copy: "账户可以让善缘和连续记录在不同设备间保留。没有压力——访客模式始终可用。",
    usernamePlaceholder: "用户名",
    passwordPlaceholder: "密码",
    signIn: "登录",
    signUp: "创建账户",
    switchToSignUp: "第一次来？创建一个安静的账户",
    switchToSignIn: "已有账户？直接登录",
    signedInAs: "已登录：%{name}",
    signedInCopy: "善缘和连续记录会跟随你。日记仍只保存在本设备。",
    signOut: "退出登录",
    gentleError: "这次没有成功——不着急，再试一次。",
    guestNote: "不登录也可以继续使用浮宝。"
  },
  profile: {
    eyebrow: "个人与偏好",
    title: "你的虚拟足迹。",
    statistics: "统计",
    totalKarma: "累计善缘",
    dayStreak: "连续天数",
    preferences: "偏好设置",
    quietMode: "安静模式",
    quietModeCopy: "减少打扰通知与音效。",
    privateJournal: "私人日记",
    privateJournalCopy: "反思内容只保存在你的设备上。",
    seniorMode: "长辈友好 · 高可读模式",
    seniorModeCopy: "放大字体与触控区域，阅读更舒适。",
    language: "语言",
    languageCopy: "选择应用语言，或跟随设备设置。",
    languageSystem: "系统",
    dataControls: "数据管理",
    exportBackup: "导出本地备份"
  }
};
