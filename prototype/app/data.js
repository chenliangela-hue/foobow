window.FOOBOW_DATA = {
  defaultState: {
    karma: 68,
    deeds: 42,
    streak: 7,
    language: "en",
    theme: "light",
    mood: "calm",
    activeCategory: "all",
    selectedDeed: "release-fish",
    selectedSpot: "east-lake",
    soundscape: "water",
    focusProgress: 0,
    focusReady: false,
    journal: "",
    prayCategory: "family",
    keptBlessings: [],
    lamps: [],
    activity: [],
    posts: [],
    postKind: "share",
    postTag: null,
    feedFilter: "all",
    settings: {
      privateJournal: true,
      quietRanking: true,
      donationReceipts: true,
      seniorMode: false
    },
    blessings: [
      {
        id: "blessing_001",
        body: "May your next step feel lighter than the last.",
        reaction: "Bless",
        reported: false
      },
      {
        id: "blessing_002",
        body: "For anyone carrying guilt today: one kind action is still real.",
        reaction: "Support",
        reported: false
      }
    ]
  },
  // Project categories group the deed catalog. `labelKey` points into the
  // shared i18n tag strings so headers and filters localize in all locales.
  categories: [
    { id: "all", label: "All", labelKey: "feedAll", icon: "◉" },
    { id: "animals", label: "Animals", labelKey: "tagAnimals", icon: "🐾" },
    { id: "elders", label: "Elders", labelKey: "tagElders", icon: "🧓" },
    { id: "environment", label: "Environment", labelKey: "tagEnvironment", icon: "🌱" },
    { id: "community", label: "Community", labelKey: "tagCommunity", icon: "🤲" },
    { id: "learning", label: "Learning", labelKey: "tagLearning", icon: "📖" }
  ],
  soundscapes: [
    { id: "water", label: "Water", description: "Soft lake ripples for virtual release." },
    { id: "rain", label: "Rain", description: "Quiet rain for umbrella and support deeds." },
    { id: "forest", label: "Forest", description: "Low wind for tree and cleanup deeds." }
  ],
  moods: [
    { id: "calm", label: "Calm", deed: "Release fish at East Lake" },
    { id: "heavy", label: "Heavy", deed: "Light a path home" },
    { id: "lonely", label: "Lonely", deed: "Send an anonymous blessing" },
    { id: "grateful", label: "Grateful", deed: "Help elder cross safely" }
  ],
  spots: {
    "east-lake": {
      name: "East Lake, Wuhan",
      category: "Animal kindness",
      categoryKey: "animals",
      text: "Release a digital fish into the lake and add one ripple to the shared kindness map."
    },
    "toronto-crosswalk": {
      name: "Toronto crosswalk",
      category: "Elder care",
      categoryKey: "elders",
      text: "Guide an elder safely across a winter street and add care to the elder-support layer."
    },
    "amazon-grove": {
      name: "Amazon restoration grove",
      category: "Environment",
      categoryKey: "environment",
      text: "Water a young tree in a shared digital forest connected to environmental campaigns."
    },
    "night-corridor": {
      name: "Night walk corridor",
      category: "Community",
      categoryKey: "community",
      text: "Light a path for someone walking home with worry, grief, or loneliness."
    },
    "reading-room": {
      name: "Shared reading room",
      category: "Learning",
      categoryKey: "learning",
      text: "Read aloud, share a skill, or pass on a loved book in a shared learning corner."
    }
  },
  deeds: [
    {
      id: "release-fish",
      title: "Virtual \u653e\u751f",
      categoryKey: "animals",
      description: "Release a digital fish into a selected lake or river.",
      shortDescription: "Release a digital fish without ecological harm.",
      mark: "water"
    },
    {
      id: "elder-crosswalk",
      title: "\u6276\u8001\u5976\u5976\u8fc7\u9a6c\u8def",
      categoryKey: "elders",
      description: "Guide an elder through a calm crosswalk scene.",
      shortDescription: "Guide an elder through a safe crosswalk.",
      mark: "elder"
    },
    {
      id: "anonymous-blessing",
      title: "Anonymous blessing",
      categoryKey: "community",
      description: "Send one quiet supportive sentence to another user.",
      shortDescription: "Send support without pressure or identity exposure.",
      mark: "blessing"
    },
    {
      id: "coastline-cleanup",
      title: "Clean a coastline",
      categoryKey: "environment",
      description: "Remove virtual litter from a beach and add to a city mission.",
      shortDescription: "Restore a shared beach, park, or riverbank.",
      mark: "earth"
    },

    { id: "shelter-day", title: "Sponsor a shelter day", categoryKey: "animals", mark: "paw",
      shortDescription: "Cover a rescue animal's food and warmth for a day.",
      description: "Symbolically sponsor a day of food and shelter for a rescue animal." },
    { id: "walk-neighbour-dog", title: "Walk a neighbour's dog", categoryKey: "animals", mark: "paw",
      shortDescription: "Offer to walk a dog whose owner is unwell or away.",
      description: "Take a neighbour's dog for a gentle walk and let both of them rest easier." },
    { id: "winter-birds", title: "Feed the winter birds", categoryKey: "animals", mark: "bird",
      shortDescription: "Leave seed out for birds on a cold day.",
      description: "Scatter a little seed so small birds find food through the cold." },

    { id: "call-elder", title: "Call an elder to listen", categoryKey: "elders", mark: "elder",
      shortDescription: "Phone an older relative just to hear their day.",
      description: "Call an elder with no agenda but to listen — the visit is the gift." },
    { id: "teach-phone", title: "Teach a phone trick", categoryKey: "elders", mark: "phone",
      shortDescription: "Show an elder one useful thing on their phone.",
      description: "Patiently teach an older person one small thing that makes their phone kinder." },
    { id: "care-home-flowers", title: "Bring flowers to a care home", categoryKey: "elders", mark: "flower",
      shortDescription: "Leave fresh flowers where elders can enjoy them.",
      description: "Bring a few fresh flowers to a care home so residents can enjoy them." },

    { id: "plant-tree", title: "Plant a tree", categoryKey: "environment", mark: "leaf",
      shortDescription: "Add a young tree to the shared digital forest.",
      description: "Plant a young tree in the shared forest, tied to real reforestation partners." },
    { id: "unplug-devices", title: "Unplug idle devices", categoryKey: "environment", mark: "leaf",
      shortDescription: "Switch off what you are not using tonight.",
      description: "Unplug the devices quietly drawing power, and let the night be a little lighter." },
    { id: "litter-five", title: "Pick up five pieces of litter", categoryKey: "environment", mark: "earth",
      shortDescription: "Leave a small patch cleaner than you found it.",
      description: "Pick up five pieces of litter on your way and leave the path a little cleaner." },

    { id: "food-drive", title: "Add to a food drive", categoryKey: "community", mark: "meal",
      shortDescription: "Contribute a tin to a local food drive.",
      description: "Add non-perishable food to a drive so a neighbour's shelf is not empty." },
    { id: "soup-kitchen", title: "Serve at a soup kitchen", categoryKey: "community", mark: "meal",
      shortDescription: "Give an hour where warm meals are shared.",
      description: "Offer an hour at a soup kitchen where a warm meal meets a hard day." },
    { id: "carry-groceries", title: "Carry a neighbour's groceries", categoryKey: "community", mark: "hands",
      shortDescription: "Help someone home with a heavy bag.",
      description: "Notice a neighbour with heavy bags and carry them the last stretch home." },

    { id: "read-aloud", title: "Read aloud to a child", categoryKey: "learning", mark: "book",
      shortDescription: "Share a story with a child who needs one.",
      description: "Read a story aloud to a child and let the world stay small and safe for a while." },
    { id: "share-skill", title: "Teach a skill you love", categoryKey: "learning", mark: "book",
      shortDescription: "Pass on one thing you know to someone eager.",
      description: "Teach a skill you love to someone who wants to learn it — knowledge shared is doubled." },
    { id: "donate-book", title: "Donate a book you loved", categoryKey: "learning", mark: "book",
      shortDescription: "Give a loved book a second reader.",
      description: "Pass a book you loved to a library or a stranger so it finds a new reader." }
  ]
};
