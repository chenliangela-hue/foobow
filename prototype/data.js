window.FOOBOW_DATA = {
  defaultState: {
    karma: 68,
    deeds: 42,
    streak: 7,
    language: "en",
    theme: "light",
    mood: "calm",
    selectedDeed: "release-fish",
    selectedSpot: "east-lake",
    journal: "",
    settings: {
      privateJournal: true,
      quietRanking: true,
      donationReceipts: true
    },
    blessings: [
      {
        id: "vancouver-path",
        body: "Someone in Vancouver lit a path home for a stranger.",
        reaction: "Bless",
        reported: false
      },
      {
        id: "wuhan-ripple",
        body: "Someone in Wuhan released a fish and wrote: let worry return to water.",
        reaction: "Support",
        reported: false
      }
    ]
  },
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
      text: "Release a digital fish into the lake and add one ripple to the shared kindness map."
    },
    "toronto-crosswalk": {
      name: "Toronto crosswalk",
      category: "Elder care",
      text: "Guide an elder safely across a winter street and add care to the elder-support layer."
    },
    "amazon-grove": {
      name: "Amazon restoration grove",
      category: "Environment",
      text: "Water a young tree in a shared digital forest connected to environmental campaigns."
    },
    "night-corridor": {
      name: "Night walk corridor",
      category: "Emotional support",
      text: "Light a path for someone walking home with worry, grief, or loneliness."
    }
  },
  deeds: [
    {
      id: "release-fish",
      title: "Virtual \u653e\u751f",
      description: "Release a digital fish into a selected lake or river.",
      shortDescription: "Release a digital fish without ecological harm.",
      mark: "water"
    },
    {
      id: "elder-crosswalk",
      title: "\u6276\u8001\u5976\u5976\u8fc7\u9a6c\u8def",
      description: "Guide an elder through a calm crosswalk scene.",
      shortDescription: "Guide an elder through a safe crosswalk.",
      mark: "elder"
    },
    {
      id: "anonymous-blessing",
      title: "Anonymous blessing",
      description: "Send one quiet supportive sentence to another user.",
      shortDescription: "Send support without pressure or identity exposure.",
      mark: "blessing"
    },
    {
      id: "coastline-cleanup",
      title: "Clean a coastline",
      description: "Remove virtual litter from a beach and add to a city mission.",
      shortDescription: "Restore a shared beach, park, or riverbank.",
      mark: "earth"
    }
  ]
};

