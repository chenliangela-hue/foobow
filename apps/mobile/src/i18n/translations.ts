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

export const fr: TranslationShape = {
  header: { eyebrow: "Carte du bon karma virtuel", karmaLabel: "karma" },
  nav: { today: "Aujourd'hui", map: "Carte", deeds: "Actions", community: "Communauté", profile: "Profil", tabSuffix: "onglet" },
  categories: { all: "Tout", animals: "Animaux", elders: "Aînés", environment: "Nature", support: "Bénédictions" },
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
    performRitual: "Accomplir le rituel"
  },
  calm: {
    eyebrow: "Rituel de calme",
    title: "Prenez d'abord un moment de présence.",
    copy: "Utilisez une courte minuterie, une ambiance sonore facultative et une réflexion tranquille avant d'enregistrer une action symbolique.",
    ready: "prêt",
    optional: "facultatif",
    soundscapes: { water: "Eau", rain: "Pluie", forest: "Forêt" },
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
    title: "Un mur de bonté sans pression.",
    blessingPlaceholder: "Que votre route vous semble moins lourde aujourd'hui.",
    sendBlessing: "Envoyer la bénédiction",
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
  }
};

export const es: TranslationShape = {
  header: { eyebrow: "Mapa del buen karma virtual", karmaLabel: "karma" },
  nav: { today: "Hoy", map: "Mapa", deeds: "Acciones", community: "Comunidad", profile: "Perfil", tabSuffix: "pestaña" },
  categories: { all: "Todo", animals: "Animales", elders: "Mayores", environment: "Naturaleza", support: "Bendiciones" },
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
    performRitual: "Realizar el ritual"
  },
  calm: {
    eyebrow: "Ritual de calma",
    title: "Tómate primero un momento de presencia.",
    copy: "Usa un breve temporizador, un paisaje sonoro opcional y una reflexión tranquila antes de registrar una acción simbólica.",
    ready: "listo",
    optional: "opcional",
    soundscapes: { water: "Agua", rain: "Lluvia", forest: "Bosque" },
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
    title: "Un muro de bondad sin presión.",
    blessingPlaceholder: "Que tu camino se sienta menos pesado hoy.",
    sendBlessing: "Enviar bendición",
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
  }
};

export const th: TranslationShape = {
  header: { eyebrow: "แผนที่กุศลเสมือน", karmaLabel: "กุศล" },
  nav: { today: "วันนี้", map: "แผนที่", deeds: "ความดี", community: "ชุมชน", profile: "โปรไฟล์", tabSuffix: "แท็บ" },
  categories: { all: "ทั้งหมด", animals: "สัตว์", elders: "ผู้สูงวัย", environment: "ธรรมชาติ", support: "คำอวยพร" },
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
    performRitual: "ทำพิธี"
  },
  calm: {
    eyebrow: "พิธีสงบใจ",
    title: "ใช้เวลาสงบสักครู่ก่อน",
    copy: "ใช้การจับเวลาสั้นๆ เสียงบรรยากาศ (ถ้าต้องการ) และการใคร่ครวญอย่างเงียบสงบ ก่อนบันทึกการกระทำเชิงสัญลักษณ์",
    ready: "พร้อม",
    optional: "ไม่บังคับ",
    soundscapes: { water: "สายน้ำ", rain: "สายฝน", forest: "ป่าไม้" },
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
    title: "กำแพงแห่งความเมตตาที่ไม่กดดัน",
    blessingPlaceholder: "ขอให้เส้นทางของคุณวันนี้เบาสบายขึ้น",
    sendBlessing: "ส่งคำอวยพร",
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
  }
};

export const ja: TranslationShape = {
  header: { eyebrow: "バーチャル善縁マップ", karmaLabel: "善縁" },
  nav: { today: "今日", map: "地図", deeds: "行い", community: "コミュニティ", profile: "プロフィール", tabSuffix: "タブ" },
  categories: { all: "すべて", animals: "動物", elders: "お年寄り", environment: "自然", support: "祝福" },
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
    performRitual: "儀式を行う"
  },
  calm: {
    eyebrow: "静けさの儀式",
    title: "まず、集中するひとときを。",
    copy: "象徴的な行いを記録する前に、短いタイマー、任意の音の風景、静かな内省を。",
    ready: "準備完了",
    optional: "任意",
    soundscapes: { water: "水", rain: "雨", forest: "森" },
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
    blessingPlaceholder: "今日、あなたの道が少し軽くなりますように。",
    sendBlessing: "祝福を送る",
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
  }
};
