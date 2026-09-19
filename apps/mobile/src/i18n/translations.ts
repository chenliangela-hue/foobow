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
    blessings: "Blessings",
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
    community: "Community",
    learning: "Learning",
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
  blessings: {
    eyebrow: "Blessings · 祈福",
    title: "Offer a blessing for someone you love.",
    copy: "Choose who it is for, add a few words, and receive a warm blessing to hold. Symbolic comfort only — never a promise of luck.",
    categories: {
      family: "Family",
      health: "Health",
      study: "Study",
      travel: "Travel",
      remembrance: "Memorial",
      gratitude: "Gratitude"
    },
    recipientPlaceholder: "For whom? (optional)",
    messagePlaceholder: "A wish or worry you want to release (optional)",
    receive: "Receive a blessing",
    generating: "Gathering warmth...",
    source: "Foobow blessing reflection",
    save: "Keep this blessing (+1 karma)",
    saved: "Kept in your heart",
    lampEyebrow: "Wish lamp · 心灯",
    lampTitle: "Light a small lamp.",
    lampPlaceholder: "A quiet wish...",
    lightLamp: "Light the lamp (+1 karma)",
    lampsCount: "%{count} lit lamps",
    safety: "This is symbolic comfort only. It does not guarantee luck, virtue, health, or real-world impact."
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
    performRitual: "Perform ritual",
    dedication: "A gentle deed in the stream ripples into an ocean of peace. (Merit +%{points})"
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
      forest: "Forest",
      bell: "Bell"
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
    modeShare: "Share a deed",
    modeAsk: "Ask for help",
    selectDeed: "Choose a kindness deed to share",
    notePlaceholder: "Add a gentle reflection (optional)",
    askPlaceholder: "What kind support do you need today?",
    blessingPlaceholder: "May your road feel less heavy today.",
    sendBlessing: "Post to wall",
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
    deedsDone: "Deeds Done",
    badgesUnlocked: "Badges Unlocked",
    verifiedDonated: "Verified Donated",
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
  },
  muyu: {
    eyebrow: "Zen Muyu · Wooden Fish",
    title: "Tap for peace of mind.",
    copy: "Tap softly to ease worry and gather quiet presence. Each knock cultivates calm merit.",
    knocks: "%{count} knocks",
    accessibilityLabel: "Tap electronic wooden fish"
  },
  incense: {
    eyebrow: "Virtual Incense · 电子焚香",
    title: "Kindle incense for quiet reflection.",
    copy: "Choose an intention, kindle the fragrant stick, and let the gentle rising smoke quiet the mind.",
    light: "Kindle incense (+1 karma)",
    burning: "Burning peacefully with mindful presence",
    count: "%{count} incense lit",
    peace: "Peace · 平安",
    clarity: "Clarity · 清心",
    gratitude: "Gratitude · 感恩",
    release: "Release · 释怀"
  },
  pond: {
    eyebrow: "Zen Lotus Pond · 荷塘游鲤",
    title: "Release into tranquil water.",
    copy: "Watch fish swim gracefully among lotus blossoms. Every release creates ripples of kindness.",
    releaseAction: "Release fish into pond (+5 karma)",
    releasedToast: "A golden fish swims joyfully into the clear water · 善念涟漪"
  },
  wheel: {
    eyebrow: "Zen Prayer Wheel · 菩提转经轮",
    title: "Spin the wheel for quiet mindfulness.",
    copy: "Turn the sacred wheel clockwise to disperse compassionate thoughts. With every full turn, peace and merit gently ripple outwards.",
    turnsCount: "%{count} turns",
    autoSpin: "Auto spin",
    pauseAuto: "Pause auto",
    hint: "Drag or tap to spin clockwise",
    accessibilityLabel: "Spin electronic prayer wheel"
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
    blessings: "祈福",
    map: "善行地图",
    deeds: "善行库",
    community: "善缘墙",
    profile: "我的",
    tabSuffix: "标签页"
  },
  categories: {
    all: "全部",
    animals: "护生",
    elders: "敬老",
    environment: "爱物",
    community: "互助",
    learning: "笃行",
    support: "祈福"
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
  blessings: {
    eyebrow: "善念祈福 · 积福报",
    title: "为所爱之人，祈一份安好。",
    copy: "选择祈愿对象，写下轻声寄语，收获一份温暖回响。仅为善意慰藉，绝非功利求运。",
    categories: {
      family: "阖家",
      health: "安康",
      study: "学业",
      travel: "出行",
      remembrance: "追思",
      gratitude: "感恩"
    },
    recipientPlaceholder: "祈福对象（选填）",
    messagePlaceholder: "心愿或挂念，轻声诉说（选填）",
    receive: "求取善愿祝福",
    generating: "善念凝结中...",
    source: "福报 · 善愿寄语",
    save: "收下这份祝福 (+1 功德)",
    saved: "已妥帖珍藏于心",
    lampEyebrow: "心灯长明 · 祈愿祈福",
    lampTitle: "点亮一盏心灯。",
    lampPlaceholder: "写下一个宁静的心愿...",
    lightLamp: "点亮心灯 (+1 功德)",
    lampsCount: "%{count} 盏心灯常明",
    safety: "本功能纯属心灵慰藉，绝不代表福运承诺或医疗奇迹，请以平常心看待。"
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
    performRitual: "执行仪式",
    dedication: "心怀善念，福虽未至祸已远；善行入海，微波成澜。（功德 +%{points}）"
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
      forest: "森林",
      bell: "禅钟"
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
    eyebrow: "善缘墙",
    title: "温和互助，不设评判。",
    modeShare: "分享善行",
    modeAsk: "求助支持",
    selectDeed: "选择要分享的善行卡片",
    notePlaceholder: "添一句温柔心得（选填）",
    askPlaceholder: "今天需要什么样的善意支持？",
    blessingPlaceholder: "愿你今天的路不那么沉重。",
    sendBlessing: "发布至善缘墙",
    bless: "送祝福",
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
    deedsDone: "善举已成",
    badgesUnlocked: "徽章点亮",
    verifiedDonated: "爱心捐助",
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
  },
  muyu: {
    eyebrow: "静心木鱼 · 积功德",
    title: "轻敲木鱼，心生清净。",
    copy: "轻叩木鱼，放下烦恼，积攒福报与清净善念。一敲一念，心自安然。",
    knocks: "%{count} 次轻叩",
    accessibilityLabel: "轻敲电子木鱼"
  },
  incense: {
    eyebrow: "电子焚香 · 静心燃香",
    title: "点一炷心香，静心定神。",
    copy: "选一念心愿，燃起一缕青烟，看轻烟袅袅上升，洗去心头杂念。",
    light: "点燃心香（善缘 +1）",
    burning: "青烟袅袅，安顿当下心神",
    count: "%{count} 炷心香",
    peace: "平安 · 顺遂",
    clarity: "清心 · 澄明",
    gratitude: "感恩 · 喜乐",
    release: "释怀 · 放下"
  },
  pond: {
    eyebrow: "荷塘游鲤 · 善念放生",
    title: "放生入清池，自在游弋。",
    copy: "静看锦鲤在荷叶莲花间悠然游动。每一次善举，都是心中泛起的一圈清凉涟漪。",
    releaseAction: "放生游鱼入池（功德 +5）",
    releasedToast: "金鲤跃入清泉，自在游弋 · 善缘广聚"
  },
  wheel: {
    eyebrow: "菩提转经轮 · 禅意流转",
    title: "顺时针转动经轮，聚福宁心。",
    copy: "六字大明咒随轮流转，顺时针每转一匝，消除烦恼，善念普周一切有情。",
    turnsCount: "%{count} 圈转经",
    autoSpin: "恒转祈福",
    pauseAuto: "暂停恒转",
    hint: "滑动或轻触经轮顺时针转动",
    accessibilityLabel: "顺时针转动菩提转经轮"
  }
};

export const fr: TranslationShape = {
  header: { eyebrow: "Carte du bon karma virtuel", karmaLabel: "karma" },
  nav: { today: "Aujourd'hui", blessings: "Bénédictions", map: "Carte", deeds: "Actions", community: "Communauté", profile: "Profil", tabSuffix: "onglet" },
  categories: { all: "Tout", animals: "Animaux", elders: "Aînés", environment: "Nature", community: "Entraide", learning: "Savoir", support: "Bénédictions" },
  moods: { calm: "Calme", heavy: "Lourd", lonely: "Seul", grateful: "Reconnaissant" },
  moodDeeds: {
    calm: "Libérer un poisson au lac de l'Est",
    heavy: "Éclairer un chemin de retour",
    lonely: "Envoyer une bénédiction anonyme",
    grateful: "Aider un aîné à traverser"
  },
  today: {
    eyebrow: "Aujourd'hui",
    title: "Faites une bonne action, en silence.",
    copy: "Notez votre humeur, choisissez un petit geste symbolique, et allégez un peu la journée.",
    moodTitle: "Comment arrivez-vous ?",
    streak: "série de %{count} jours",
    recommended: "Action recommandée",
    recommendedCopy: "Un geste symbolique qui garde le réconfort distinct de toute promesse réelle.",
    completeDeed: "Accomplir l'action",
    journalTitle: "Journal du karma",
    journalPlaceholder: "Aujourd'hui, je veux relâcher une inquiétude et faire une chose gentille."
  },
  blessings: {
    eyebrow: "Bénédictions · 祈福",
    title: "Offrez une bénédiction à un être cher.",
    copy: "Choisissez pour qui, écrivez quelques mots et recevez une pensée chaleureuse. Réconfort symbolique uniquement.",
    categories: {
      family: "Famille",
      health: "Santé",
      study: "Études",
      travel: "Voyage",
      remembrance: "Mémoire",
      gratitude: "Gratitude"
    },
    recipientPlaceholder: "Pour qui ? (optionnel)",
    messagePlaceholder: "Un vœu ou un souci à libérer (optionnel)",
    receive: "Recevoir une bénédiction",
    generating: "Rassemblement de douceur...",
    source: "Réflexion de bienveillance Foobow",
    save: "Garder cette bénédiction (+1 mérite)",
    saved: "Gardée dans votre cœur",
    lampEyebrow: "Lampe de vœu · 心灯",
    lampTitle: "Allumez une petite lampe.",
    lampPlaceholder: "Un souhait discret...",
    lightLamp: "Allumer la lampe (+1 mérite)",
    lampsCount: "%{count} lampes allumées",
    safety: "Ceci est un réconfort symbolique uniquement. Ne garantit ni chance ni miracle."
  },
  map: {
    eyebrow: "Carte du monde",
    title: "Explorez les lieux qui ont besoin d'un peu de lumière.",
    spotLabel: "Lieu de bonne action : %{name}"
  },
  deeds: {
    eyebrow: "Catalogue d'actions",
    title: "De petits rituels, des catégories claires.",
    shown: "%{count} affichées",
    ritualPreview: "Aperçu du rituel",
    performRitual: "Accomplir le rituel",
    dedication: "Un geste bienveillant crée une onde de paix. (Mérite +%{points})"
  },
  calm: {
    eyebrow: "Rituel de calme",
    title: "Prenez d'abord un moment de présence.",
    copy: "Utilisez une courte minuterie, une ambiance sonore facultative et une réflexion tranquille avant d'enregistrer une action symbolique.",
    ready: "prêt",
    optional: "facultatif",
    soundscapes: { water: "Eau", rain: "Pluie", forest: "Forêt", bell: "Cloche" },
    guidedStepOne: "1. Respirez une fois et nommez votre intention.",
    guidedStepTwo: "2. Tenez le geste doucement jusqu'à la fin du minuteur.",
    guidedStepThree: "3. Notez ce que vous ressentez, sans pression.",
    startFocus: "Démarrer 20 s de présence",
    completeFocused: "Terminer en pleine présence"
  },
  safety: {
    notice: "Ceci n'est qu'un réconfort symbolique. Cela ne garantit ni chance, ni vertu, ni santé, ni résultat réel."
  },
  community: {
    eyebrow: "Communauté",
    title: "Un mur de bienveillance sans pression.",
    modeShare: "Partager une action",
    modeAsk: "Demander de l'aide",
    selectDeed: "Choisir une action de bonté",
    notePlaceholder: "Ajouter une douce réflexion (optionnel)",
    askPlaceholder: "De quel soutien bienveillant avez-vous besoin ?",
    blessingPlaceholder: "Que votre route vous semble moins lourde aujourd'hui.",
    sendBlessing: "Publier",
    bless: "Bénir",
    report: "Signaler"
  },
  account: {
    eyebrow: "Compte",
    signInTitle: "Bon retour, en douceur.",
    signUpTitle: "Gardez votre karma avec vous.",
    copy: "Un compte protège votre karma et votre série sur tous vos appareils. Sans pression — le mode invité fonctionne toujours.",
    usernamePlaceholder: "Nom d'utilisateur",
    passwordPlaceholder: "Mot de passe",
    signIn: "Se connecter",
    signUp: "Créer un compte",
    switchToSignUp: "Nouveau ? Créez un compte tranquille",
    switchToSignIn: "Déjà un compte ? Connectez-vous",
    signedInAs: "Connecté en tant que %{name}",
    signedInCopy: "Votre karma et votre série vous suivent. Votre journal reste sur cet appareil.",
    signOut: "Se déconnecter",
    gentleError: "Cela n'a pas fonctionné — sans hâte, réessayez.",
    guestNote: "Vous pouvez continuer à utiliser Foobow sans compte."
  },
  profile: {
    eyebrow: "Profil et préférences",
    title: "Votre empreinte virtuelle.",
    statistics: "Statistiques",
    totalKarma: "Karma total",
    dayStreak: "Jours d'affilée",
    deedsDone: "Actions faites",
    badgesUnlocked: "Badges reçus",
    verifiedDonated: "Dons vérifiés",
    preferences: "Préférences",
    quietMode: "Mode discret",
    quietModeCopy: "Réduit les notifications et les effets sonores.",
    privateJournal: "Journal privé",
    privateJournalCopy: "Garde vos réflexions sur cet appareil.",
    seniorMode: "Mode grande lisibilité",
    seniorModeCopy: "Agrandit les textes et les zones tactiles pour un confort de lecture.",
    language: "Langue",
    languageCopy: "Choisissez la langue de l'application ou suivez le réglage de l'appareil.",
    languageSystem: "Système",
    dataControls: "Gestion des données",
    exportBackup: "Exporter une sauvegarde locale"
  },
  muyu: {
    eyebrow: "Poisson de bois Zen · Muyu",
    title: "Frappez pour la paix de l'esprit.",
    copy: "Frappez doucement pour apaiser les soucis et cultiver le mérite tranquille. Chaque coup apporte présence.",
    knocks: "%{count} frappes",
    accessibilityLabel: "Frapper le poisson de bois"
  },
  incense: {
    eyebrow: "Encens virtuel · 电子焚香",
    title: "Allumez un encens pour la réflexion paisible.",
    copy: "Choisissez une intention, allumez le bâtonnet parfumé et laissez la fumée douce apaiser l'esprit.",
    light: "Allumer l'encens (+1 karma)",
    burning: "Brûle doucement en pleine présence",
    count: "%{count} encens allumés",
    peace: "Paix · 平安",
    clarity: "Clarté · 清心",
    gratitude: "Gratitude · 感恩",
    release: "Lâcher-prise · 释怀"
  },
  pond: {
    eyebrow: "Bassin de lotus Zen · 荷塘游鲤",
    title: "Relâcher dans l'eau tranquille.",
    copy: "Regardez les poissons nager paisiblement parmi les fleurs de lotus. Chaque geste crée des ondes de bonté.",
    releaseAction: "Relâcher dans le bassin (+5 mérite)",
    releasedToast: "Un poisson doré nage joyeusement dans l'eau claire · 善念涟漪"
  },
  wheel: {
    eyebrow: "Moulin à prières zen · 转经轮",
    title: "Tournez le moulin pour la paix de l'esprit.",
    copy: "Tournez la roue sacrée dans le sens horaire. À chaque tour complet, la paix et la compassion rayonnent.",
    turnsCount: "%{count} tours",
    autoSpin: "Rotation auto",
    pauseAuto: "Pause auto",
    hint: "Glissez ou appuyez pour tourner",
    accessibilityLabel: "Tourner le moulin à prières zen"
  }
};

export const es: TranslationShape = {
  header: { eyebrow: "Mapa del buen karma virtual", karmaLabel: "karma" },
  nav: { today: "Hoy", blessings: "Bendiciones", map: "Mapa", deeds: "Acciones", community: "Comunidad", profile: "Perfil", tabSuffix: "pestaña" },
  categories: { all: "Todo", animals: "Animales", elders: "Mayores", environment: "Naturaleza", community: "Comunidad", learning: "Aprendizaje", support: "Bendiciones" },
  moods: { calm: "En calma", heavy: "Pesado", lonely: "Solo", grateful: "Agradecido" },
  moodDeeds: {
    calm: "Liberar un pez en el lago del Este",
    heavy: "Iluminar un camino a casa",
    lonely: "Enviar una bendición anónima",
    grateful: "Ayudar a un mayor a cruzar"
  },
  today: {
    eyebrow: "Hoy",
    title: "Haz una buena acción, en silencio.",
    copy: "Registra cómo estás, elige un pequeño gesto simbólico y deja el día un poco más ligero.",
    moodTitle: "¿Cómo llegas hoy?",
    streak: "racha de %{count} días",
    recommended: "Acción recomendada",
    recommendedCopy: "Un gesto simbólico que mantiene el consuelo separado de promesas reales.",
    completeDeed: "Completar la acción",
    journalTitle: "Diario de karma",
    journalPlaceholder: "Hoy quiero soltar una preocupación y hacer algo amable."
  },
  blessings: {
    eyebrow: "Bendiciones · 祈福",
    title: "Dedica una bendición a quien amas.",
    copy: "Elige para quién es, escribe unas palabras y recibe un deseo cálido. Solo consuelo simbólico.",
    categories: {
      family: "Familia",
      health: "Salud",
      study: "Estudios",
      travel: "Viaje",
      remembrance: "Recuerdo",
      gratitude: "Gratitud"
    },
    recipientPlaceholder: "¿Para quién? (opcional)",
    messagePlaceholder: "Un deseo o preocupación que deseas soltar (opcional)",
    receive: "Recibir bendición",
    generating: "Reuniendo serenidad...",
    source: "Reflexión bondadosa de Foobow",
    save: "Guardar esta bendición (+1 mérito)",
    saved: "Guardada en el corazón",
    lampEyebrow: "Lámpara de deseos · 心灯",
    lampTitle: "Enciende una pequeña lámpara.",
    lampPlaceholder: "Un deseo en silencio...",
    lightLamp: "Encender la lámpara (+1 mérito)",
    lampsCount: "%{count} lámparas encendidas",
    safety: "Esto es solo consuelo simbólico. No garantiza suerte, virtud ni sanación."
  },
  map: {
    eyebrow: "Mapa del mundo",
    title: "Explora lugares que necesitan un poco de luz.",
    spotLabel: "Lugar de buena acción: %{name}"
  },
  deeds: {
    eyebrow: "Catálogo de acciones",
    title: "Pequeños rituales, categorías claras.",
    shown: "%{count} mostradas",
    ritualPreview: "Vista del ritual",
    performRitual: "Realizar el ritual",
    dedication: "Un acto de bondad genera ondas de serenidad. (Mérito +%{points})"
  },
  calm: {
    eyebrow: "Ritual de calma",
    title: "Tómate primero un momento de presencia.",
    copy: "Usa un breve temporizador, un paisaje sonoro opcional y una reflexión tranquila antes de registrar una acción simbólica.",
    ready: "listo",
    optional: "opcional",
    soundscapes: { water: "Agua", rain: "Lluvia", forest: "Bosque", bell: "Campana" },
    guidedStepOne: "1. Respira una vez y nombra tu intención.",
    guidedStepTwo: "2. Sostén el gesto con suavidad hasta que termine el temporizador.",
    guidedStepThree: "3. Anota cómo te sientes, sin presión.",
    startFocus: "Iniciar 20 s de presencia",
    completeFocused: "Completar con presencia"
  },
  safety: {
    notice: "Esto es solo consuelo simbólico. No garantiza suerte, virtud, salud ni resultados reales."
  },
  community: {
    eyebrow: "Comunidad",
    title: "Un muro de bondad sin presiones.",
    modeShare: "Compartir acción",
    modeAsk: "Pedir ayuda",
    selectDeed: "Elegir una acción bondadosa",
    notePlaceholder: "Añadir una breve reflexión (opcional)",
    askPlaceholder: "¿Qué apoyo bondadoso necesitas hoy?",
    blessingPlaceholder: "Que tu camino se sienta más ligero hoy.",
    sendBlessing: "Publicar",
    bless: "Bendecir",
    report: "Reportar"
  },
  account: {
    eyebrow: "Cuenta",
    signInTitle: "Bienvenido de nuevo, con calma.",
    signUpTitle: "Lleva tu karma contigo.",
    copy: "Una cuenta guarda tu karma y tu racha en todos tus dispositivos. Sin presión: el modo invitado siempre funciona.",
    usernamePlaceholder: "Nombre de usuario",
    passwordPlaceholder: "Contraseña",
    signIn: "Iniciar sesión",
    signUp: "Crear cuenta",
    switchToSignUp: "¿Primera vez? Crea una cuenta tranquila",
    switchToSignIn: "¿Ya tienes cuenta? Inicia sesión",
    signedInAs: "Sesión iniciada como %{name}",
    signedInCopy: "Tu karma y tu racha te acompañan. Tu diario se queda en este dispositivo.",
    signOut: "Cerrar sesión",
    gentleError: "No funcionó — sin prisa, inténtalo otra vez.",
    guestNote: "Puedes seguir usando Foobow sin una cuenta."
  },
  profile: {
    eyebrow: "Perfil y preferencias",
    title: "Tu huella virtual.",
    statistics: "Estadísticas",
    totalKarma: "Karma total",
    dayStreak: "Días seguidos",
    deedsDone: "Acciones hechas",
    badgesUnlocked: "Insignias",
    verifiedDonated: "Donaciones",
    preferences: "Preferencias",
    quietMode: "Modo discreto",
    quietModeCopy: "Reduce notificaciones y efectos de sonido.",
    privateJournal: "Diario privado",
    privateJournalCopy: "Guarda tus reflexiones solo en este dispositivo.",
    seniorMode: "Modo de alta legibilidad",
    seniorModeCopy: "Amplía el texto y las zonas táctiles para leer con comodidad.",
    language: "Idioma",
    languageCopy: "Elige el idioma de la app o sigue el ajuste del dispositivo.",
    languageSystem: "Sistema",
    dataControls: "Gestión de datos",
    exportBackup: "Exportar copia local"
  },
  muyu: {
    eyebrow: "Muyu Zen · Pez de madera",
    title: "Toca para la paz mental.",
    copy: "Toca suavemente para calmar preocupaciones y cultivar mérito sereno. Cada golpe trae presencia.",
    knocks: "%{count} toques",
    accessibilityLabel: "Tocar el pez de madera"
  },
  incense: {
    eyebrow: "Incienso virtual · 电子焚香",
    title: "Enciende un incienso para la calma interior.",
    copy: "Elige una intención, enciende la varilla aromática y deja que el humo suave calme tus pensamientos.",
    light: "Encender incienso (+1 karma)",
    burning: "Ardiendo con serenidad y presencia",
    count: "%{count} inciensos encendidos",
    peace: "Paz · 平安",
    clarity: "Claridad · 清心",
    gratitude: "Gratitud · 感恩",
    release: "Liberar · 释怀"
  },
  pond: {
    eyebrow: "Estanque de loto Zen · 荷塘游鲤",
    title: "Liberar en el agua tranquila.",
    copy: "Observa los peces nadar grácilmente entre flores de loto. Cada acto crea ondas de bondad.",
    releaseAction: "Liberar en el estanque (+5 mérito)",
    releasedToast: "Un pez dorado nada alegremente en el agua cristalina · 善念涟漪"
  },
  wheel: {
    eyebrow: "Rueda de oración zen · 转经轮",
    title: "Gira la rueda para serenar la mente.",
    copy: "Gira la rueda sagrada en el sentido de las agujas del reloj. Con cada giro, la paz y el mérito se expanden.",
    turnsCount: "%{count} giros",
    autoSpin: "Giro automático",
    pauseAuto: "Pausar giro",
    hint: "Desliza o toca para girar en sentido horario",
    accessibilityLabel: "Girar la rueda de oración zen"
  }
};

export const th: TranslationShape = {
  header: { eyebrow: "แผนที่กุศลเสมือน", karmaLabel: "กุศล" },
  nav: { today: "วันนี้", blessings: "คำอวยพร", map: "แผนที่", deeds: "ความดี", community: "ชุมชน", profile: "โปรไฟล์", tabSuffix: "แท็บ" },
  categories: { all: "ทั้งหมด", animals: "สัตว์", elders: "ผู้สูงวัย", environment: "ธรรมชาติ", community: "ชุมชน", learning: "การเรียนรู้", support: "คำอวยพร" },
  moods: { calm: "สงบ", heavy: "หนักอึ้ง", lonely: "เหงา", grateful: "ซาบซึ้ง" },
  moodDeeds: {
    calm: "ปล่อยปลาที่ทะเลสาบตะวันออก",
    heavy: "จุดไฟส่องทางกลับบ้าน",
    lonely: "ส่งคำอวยพรแบบไม่ระบุชื่อ",
    grateful: "ช่วยผู้สูงวัยข้ามถนน"
  },
  today: {
    eyebrow: "วันนี้",
    title: "ทำความดีเงียบๆ สักอย่าง",
    copy: "บันทึกความรู้สึก เลือกการกระทำเชิงสัญลักษณ์เล็กๆ แล้วทำให้วันนี้เบาลงสักนิด",
    moodTitle: "วันนี้คุณมาถึงด้วยความรู้สึกใด?",
    streak: "ต่อเนื่อง %{count} วัน",
    recommended: "การกระทำที่แนะนำ",
    recommendedCopy: "การกระทำเชิงสัญลักษณ์ที่แยกความปลอบใจออกจากคำสัญญาในโลกจริง",
    completeDeed: "ทำให้สำเร็จ",
    journalTitle: "บันทึกกุศล",
    journalPlaceholder: "วันนี้ฉันอยากปล่อยวางความกังวลหนึ่งอย่าง และทำสิ่งดีสักอย่าง"
  },
  blessings: {
    eyebrow: "การอวยพร · 祈福",
    title: "มอบคำอวยพรแด่คนที่คุณรัก",
    copy: "เลือกผู้รับ เขียนความในใจสั้นๆ และรับคำอวยพรอันอบอุ่น เพื่อความสงบใจเชิงสัญลักษณ์เท่านั้น",
    categories: {
      family: "ครอบครัว",
      health: "สุขภาพ",
      study: "การเรียน",
      travel: "การเดินทาง",
      remembrance: "รำลึก",
      gratitude: "กตัญญู"
    },
    recipientPlaceholder: "เพื่อใคร? (ไม่บังคับ)",
    messagePlaceholder: "ความปรารถนาหรือความกังวลที่อยากปลดปล่อย (ไม่บังคับ)",
    receive: "รับคำอวยพร",
    generating: "กำลังรวบรวมความอบอุ่น...",
    source: "ถ้อยคำอวยพรจาก Foobow",
    save: "เก็บคำอวยพรนี้ (+1 บุญ)",
    saved: "เก็บไว้ในใจแล้ว",
    lampEyebrow: "ประทีปอธิษฐาน · 心灯",
    lampTitle: "จุดประทีปดวงน้อย",
    lampPlaceholder: "ความปรารถนาอันสงบ...",
    lightLamp: "จุดประทีป (+1 บุญ)",
    lampsCount: "%{count} ดวงประทีปสว่างไสว",
    safety: "นี่คือความสงบใจเชิงสัญลักษณ์เท่านั้น ไม่ได้รับประกันโชคลาภหรือผลทางการแพทย์"
  },
  map: {
    eyebrow: "แผนที่โลก",
    title: "สำรวจสถานที่ที่ต้องการแสงสว่างสักนิด",
    spotLabel: "จุดทำความดี: %{name}"
  },
  deeds: {
    eyebrow: "รายการความดี",
    title: "พิธีเล็กๆ หมวดหมู่ชัดเจน",
    shown: "แสดง %{count} รายการ",
    ritualPreview: "ตัวอย่างพิธี",
    performRitual: "ทำพิธี",
    dedication: "การกระทำที่เปี่ยมด้วยเมตตาสร้างคลื่นแห่งความสงบสุข (บุญ +%{points})"
  },
  calm: {
    eyebrow: "พิธีสงบใจ",
    title: "ใช้เวลาสงบสักครู่ก่อน",
    copy: "ใช้การจับเวลาสั้นๆ เสียงบรรยากาศ (ถ้าต้องการ) และการใคร่ครวญอย่างเงียบสงบ ก่อนบันทึกการกระทำเชิงสัญลักษณ์",
    ready: "พร้อม",
    optional: "ไม่บังคับ",
    soundscapes: { water: "สายน้ำ", rain: "สายฝน", forest: "ป่าไม้", bell: "ระฆัง" },
    guidedStepOne: "1. หายใจหนึ่งครั้ง แล้วบอกความตั้งใจ",
    guidedStepTwo: "2. ประคองการกระทำอย่างอ่อนโยนจนหมดเวลา",
    guidedStepThree: "3. บันทึกความรู้สึกโดยไม่กดดัน",
    startFocus: "เริ่มสมาธิ 20 วินาที",
    completeFocused: "ทำให้สำเร็จอย่างมีสมาธิ"
  },
  safety: {
    notice: "นี่เป็นเพียงความปลอบใจเชิงสัญลักษณ์ ไม่รับประกันโชค คุณธรรม สุขภาพ หรือผลลัพธ์ที่แท้จริง"
  },
  community: {
    eyebrow: "ชุมชน",
    title: "กำแพงแห่งความเมตตาอันผ่อนคลาย",
    modeShare: "แบ่งปันความดี",
    modeAsk: "ขอความช่วยเหลือ",
    selectDeed: "เลือกการกระทำความดีเพื่อแบ่งปัน",
    notePlaceholder: "เพิ่มข้อคิดอันอ่อนโยน (ไม่บังคับ)",
    askPlaceholder: "วันนี้คุณต้องการกำลังใจหรือความช่วยเหลือใด?",
    blessingPlaceholder: "ขอให้ก้าวต่อไปของคุณเบาสบายขึ้นในวันนี้",
    sendBlessing: "โพสต์ลงกำแพง",
    bless: "อวยพร",
    report: "รายงาน"
  },
  account: {
    eyebrow: "บัญชี",
    signInTitle: "ยินดีต้อนรับกลับมาอย่างสงบ",
    signUpTitle: "เก็บกุศลของคุณไว้กับตัว",
    copy: "บัญชีช่วยเก็บกุศลและความต่อเนื่องของคุณไว้ข้ามอุปกรณ์ ไม่มีแรงกดดัน — โหมดผู้เยี่ยมชมใช้ได้เสมอ",
    usernamePlaceholder: "ชื่อผู้ใช้",
    passwordPlaceholder: "รหัสผ่าน",
    signIn: "เข้าสู่ระบบ",
    signUp: "สร้างบัญชี",
    switchToSignUp: "เพิ่งมาใหม่? สร้างบัญชีอย่างเงียบๆ",
    switchToSignIn: "มีบัญชีแล้ว? เข้าสู่ระบบ",
    signedInAs: "เข้าสู่ระบบในชื่อ %{name}",
    signedInCopy: "กุศลและความต่อเนื่องจะติดตามคุณไป บันทึกส่วนตัวยังอยู่ในเครื่องนี้",
    signOut: "ออกจากระบบ",
    gentleError: "ครั้งนี้ยังไม่สำเร็จ — ไม่ต้องรีบ ลองอีกครั้ง",
    guestNote: "คุณใช้ Foobow ต่อได้โดยไม่ต้องมีบัญชี"
  },
  profile: {
    eyebrow: "โปรไฟล์และการตั้งค่า",
    title: "ร่องรอยเสมือนของคุณ",
    statistics: "สถิติ",
    totalKarma: "กุศลสะสม",
    dayStreak: "วันต่อเนื่อง",
    deedsDone: "ทำความดีแล้ว",
    badgesUnlocked: "เหรียญตรา",
    verifiedDonated: "ยอดบริจาค",
    preferences: "การตั้งค่า",
    quietMode: "โหมดเงียบ",
    quietModeCopy: "ลดการแจ้งเตือนและเสียงประกอบ",
    privateJournal: "บันทึกส่วนตัว",
    privateJournalCopy: "เก็บบันทึกไว้ในเครื่องของคุณเท่านั้น",
    seniorMode: "โหมดอ่านง่ายสำหรับผู้สูงวัย",
    seniorModeCopy: "ขยายขนาดตัวอักษรและพื้นที่สัมผัสให้อ่านสบายขึ้น",
    language: "ภาษา",
    languageCopy: "เลือกภาษาของแอป หรือใช้ตามการตั้งค่าอุปกรณ์",
    languageSystem: "ตามระบบ",
    dataControls: "การจัดการข้อมูล",
    exportBackup: "ส่งออกข้อมูลสำรองในเครื่อง"
  },
  muyu: {
    eyebrow: "ปลาม้าไม้เซน · สะสมบุญ",
    title: "เคาะเพื่อความสงบแห่งใจ",
    copy: "เคาะเบาๆ เพื่อคลายกังวลและสั่งสมบุญกุศลอันสงบ ทุกครั้งที่เคาะนำมาซึ่งสติ",
    knocks: "เคาะ %{count} ครั้ง",
    accessibilityLabel: "เคาะปลาม้าไม้เสมือน"
  },
  incense: {
    eyebrow: "จุดธูปเสมือน · 电子焚香",
    title: "จุดธูปหอมเพื่อความสงบแห่งใจ",
    copy: "เลือกเจตนา จุดก้านธูปหอม และปล่อยให้ควันลอยขึ้นอย่างนุ่มนวลเพื่อสงบจิตใจ",
    light: "จุดธูปหอม (+1 บุญ)",
    burning: "เผาไหม้อย่างสงบพร้อมสติอันบริสุทธิ์",
    count: "จุดธูป %{count} ดอก",
    peace: "สันติ · 平安",
    clarity: "ความกระจ่าง · 清心",
    gratitude: "ความกตัญญู · 感恩",
    release: "ปล่อยวาง · 释怀"
  },
  pond: {
    eyebrow: "สระบัวเซนและปลาคราฟ · 荷塘游鲤",
    title: "ปล่อยปลาสู่น้ำอันสงบนิ่ง",
    copy: "ชมปลาว่ายอย่างสง่างามท่ามกลางดอกบัว ทุกการปล่อยสร้างคลื่นแห่งความดีงาม",
    releaseAction: "ปล่อยปลาลงสระ (+5 บุญ)",
    releasedToast: "ปลาสีทองว่ายอย่างเป็นสุขในสายน้ำใส · 善念涟漪"
  },
  wheel: {
    eyebrow: "กงล้อมนต์เซน · 菩提转经轮",
    title: "หมุนกงล้อมนต์เพื่อความสงบใจ",
    copy: "หมุนกงล้อมนต์ศักดิ์สิทธิ์ตามเข็มนาฬิกา ทุกรอบที่หมุน แผ่ความเมตตาและความสงบสุขสู่สรรพสัตว์",
    turnsCount: "%{count} รอบ",
    autoSpin: "หมุนอัตโนมัติ",
    pauseAuto: "หยุดชั่วคราว",
    hint: "ลากหรือแตะเพื่อหมุนตามเข็มนาฬิกา",
    accessibilityLabel: "หมุนกงล้อมนต์เซน"
  }
};

export const ja: TranslationShape = {
  header: { eyebrow: "バーチャル善縁マップ", karmaLabel: "善縁" },
  nav: { today: "今日", blessings: "祈願", map: "マップ", deeds: "善行", community: "コミュニティ", profile: "プロフィール", tabSuffix: "タブ" },
  categories: { all: "すべて", animals: "放生・動物", elders: "敬老", environment: "自然", community: "助け合い", learning: "学び", support: "祈願" },
  moods: { calm: "穏やか", heavy: "重い", lonely: "さびしい", grateful: "ありがたい" },
  moodDeeds: {
    calm: "東湖で魚を放つ",
    heavy: "帰り道に灯りをともす",
    lonely: "匿名の祝福を送る",
    grateful: "お年寄りの横断を手伝う"
  },
  today: {
    eyebrow: "今日",
    title: "静かな善いことを、ひとつ。",
    copy: "気持ちを記録し、小さな象徴的な行いを選んで、今日を少し軽くしましょう。",
    moodTitle: "今日はどんな気持ちですか？",
    streak: "連続 %{count} 日",
    recommended: "おすすめの行い",
    recommendedCopy: "現実の約束とは切り離された、象徴的な行いです。",
    completeDeed: "行いを完了する",
    journalTitle: "善縁の日記",
    journalPlaceholder: "今日はひとつ心配を手放して、やさしいことをひとつしたい。"
  },
  blessings: {
    eyebrow: "祈願・福徳 · 祈福",
    title: "大切な人のために、祈りを捧げる。",
    copy: "祈る相手を選び、静かな言葉を添えて、温かな祝福を受け取ります。心の安らぎのための象徴であり、現世利益を保証するものではありません。",
    categories: {
      family: "家内安全",
      health: "無病息災",
      study: "学業成就",
      travel: "道中安全",
      remembrance: "追善供養",
      gratitude: "報恩感謝"
    },
    recipientPlaceholder: "祈る相手（任意）",
    messagePlaceholder: "心の手放したい願いや気がかり（任意）",
    receive: "祝福の言葉をいただく",
    generating: "温もりを紡いでいます...",
    source: "Foobow 祈願の言葉",
    save: "この祝福を心に留める (+1 功徳)",
    saved: "静かに胸に収めました",
    lampEyebrow: "心灯 · 願いの灯火",
    lampTitle: "小さな灯りを点す。",
    lampPlaceholder: "静かな願いごと...",
    lightLamp: "心灯を点す (+1 功徳)",
    lampsCount: "%{count} 箇所の灯火",
    safety: "これは象徴的な心の安らぎであり、運気や健康の保証をするものではありません。"
  },
  map: {
    eyebrow: "世界地図",
    title: "すこしの光を必要とする場所を訪ねる。",
    spotLabel: "善行の場所：%{name}"
  },
  deeds: {
    eyebrow: "行いの一覧",
    title: "小さな儀式、わかりやすい分類。",
    shown: "%{count} 件を表示",
    ritualPreview: "儀式のプレビュー",
    performRitual: "儀式を行う",
    dedication: "心に善念あれば、静かな波紋が平和を広げる。（功徳 +%{points}）"
  },
  calm: {
    eyebrow: "静けさの儀式",
    title: "まず、集中するひとときを。",
    copy: "象徴的な行いを記録する前に、短いタイマー、任意の音の風景、静かな内省を。",
    ready: "準備完了",
    optional: "任意",
    soundscapes: { water: "水", rain: "雨", forest: "森", bell: "禅の鐘" },
    guidedStepOne: "1. ひと呼吸して、心づもりを言葉に。",
    guidedStepTwo: "2. タイマーが終わるまで、そっと保ちます。",
    guidedStepThree: "3. 気持ちを、無理なく記録します。",
    startFocus: "20秒の集中を始める",
    completeFocused: "集中して完了する"
  },
  safety: {
    notice: "これは象徴的な慰めにすぎません。幸運・徳・健康・現実の結果を保証しません。"
  },
  community: {
    eyebrow: "コミュニティ",
    title: "気負わないやさしさの壁。",
    modeShare: "善行を分かち合う",
    modeAsk: "助けを求める",
    selectDeed: "分かち合う善行カードを選ぶ",
    notePlaceholder: "やさしいひと言を添える（任意）",
    askPlaceholder: "今日、どのような支えを必要としていますか？",
    blessingPlaceholder: "今日、あなたの道が少し軽くなりますように。",
    sendBlessing: "善意の壁に届ける",
    bless: "祝福する",
    report: "報告"
  },
  account: {
    eyebrow: "アカウント",
    signInTitle: "おかえりなさい、静かに。",
    signUpTitle: "善縁を、あなたとともに。",
    copy: "アカウントがあれば、善縁と連続日数を端末をまたいで保てます。無理はいりません——ゲストのままでも使えます。",
    usernamePlaceholder: "ユーザー名",
    passwordPlaceholder: "パスワード",
    signIn: "ログイン",
    signUp: "アカウントを作成",
    switchToSignUp: "はじめてですか？静かなアカウントを作る",
    switchToSignIn: "アカウントをお持ちですか？ログイン",
    signedInAs: "%{name} としてログイン中",
    signedInCopy: "善縁と連続日数が引き継がれます。日記はこの端末に残ります。",
    signOut: "ログアウト",
    gentleError: "うまくいきませんでした——急がず、もう一度どうぞ。",
    guestNote: "アカウントがなくても Foobow は使えます。"
  },
  profile: {
    eyebrow: "プロフィールと設定",
    title: "あなたのバーチャルな足あと。",
    statistics: "統計",
    totalKarma: "累計の善縁",
    dayStreak: "連続日数",
    deedsDone: "善行達成",
    badgesUnlocked: "獲得バッジ",
    verifiedDonated: "寄付実績",
    preferences: "設定",
    quietMode: "静かなモード",
    quietModeCopy: "通知や効果音をひかえめにします。",
    privateJournal: "非公開の日記",
    privateJournalCopy: "振り返りはこの端末だけに保存します。",
    seniorMode: "高可読モード",
    seniorModeCopy: "文字とタップ領域を大きくして読みやすくします。",
    language: "言語",
    languageCopy: "アプリの言語を選ぶか、端末の設定に従います。",
    languageSystem: "システム",
    dataControls: "データ管理",
    exportBackup: "端末のバックアップを書き出す"
  },
  muyu: {
    eyebrow: "禅の木魚 · 功徳を積む",
    title: "木魚を叩き、心を清らかに。",
    copy: "静かに木魚を叩いて悩みを鎮め、穏やかな功徳を積みます。一叩き一念、心安らかに。",
    knocks: "%{count} 回の祈り",
    accessibilityLabel: "電子木魚を叩く"
  },
  incense: {
    eyebrow: "電子のお香 · 静心燃香",
    title: "心静かにお香を焚く。",
    copy: "願いを選び、清らかな香を焚き、立ちのぼる煙とともに心を整えましょう。",
    light: "お香を焚く（善縁 +1）",
    burning: "静かな煙とともに、心を今ここに安らげます",
    count: "%{count} 本のお香",
    peace: "平安 · 安らぎ",
    clarity: "清心 · 澄んだ心",
    gratitude: "感謝 · 喜び",
    release: "放下 · 手放す"
  },
  pond: {
    eyebrow: "蓮池の鯉 · 荷塘游鲤",
    title: "清らかな水に放生する。",
    copy: "蓮の花咲く池を悠々と泳ぐ鯉を見守ります。やさしい行いは静かな波紋を広げます。",
    releaseAction: "池へ放生する（功徳 +5）",
    releasedToast: "金色の鯉が清らかな水へ優雅に泳ぎ出しました · 善念涟漪"
  },
  wheel: {
    eyebrow: "菩提マニ車 · 禅意流転",
    title: "マニ車を回し、心を穏やかに整える。",
    copy: "聖なるマニ車を時計回りに回します。一回転ごとに、慈悲と功徳が穏やかに広がります。",
    turnsCount: "%{count} 回転",
    autoSpin: "自動回転",
    pauseAuto: "一時停止",
    hint: "スワイプまたはタップして時計回りに回転",
    accessibilityLabel: "電子マニ車を時計回りに回す"
  }
};
