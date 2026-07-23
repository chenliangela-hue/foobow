import { LocaleTag } from "./LocaleContext";

// One gentle line per day, rotating deterministically by day of year so the
// prototype and mobile app surface the same thought on the same date.
// Tone rules: warm, no pressure, no promises of luck or outcomes.

const thoughts: Record<LocaleTag, string[]> = {
  en: [
    "A small kindness is still kindness.",
    "You can begin the day again at any hour.",
    "Let one worry rest; it will keep without you.",
    "Quiet effort counts, even unseen.",
    "Breathe once for yourself, once for someone far away.",
    "Today does not need to be heavy to matter.",
    "One gentle act can soften a whole afternoon.",
    "You are allowed to move slowly.",
    "Light a small lamp; darkness handles itself.",
    "Rest is also a good deed."
  ],
  "zh-Hans": [
    "微小的善意，也是善意。",
    "一天中的任何时刻，都可以重新开始。",
    "放下一件担心，它自己会安好。",
    "安静的努力，即使无人看见，也算数。",
    "为自己呼吸一次，也为远方的人呼吸一次。",
    "今天不必沉重，也一样有意义。",
    "一个温和的举动，能柔软整个下午。",
    "你可以慢慢来。",
    "点一盏小灯，黑暗自会退让。",
    "休息，也是一件善事。"
  ]
};

export function dailyThoughtFor(locale: LocaleTag, date: Date = new Date()): string {
  const list = thoughts[locale] ?? thoughts.en;
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start) / 86400000);
  return list[dayOfYear % list.length];
}
