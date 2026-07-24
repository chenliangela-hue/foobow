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
    "Rest is also a good deed.",
    "Good begets good; blessings flow from kindness.",
    "Gather good virtue, and blessings come.",
    "Plant kind causes, harvest kind fruit.",
    "A spark of kindness blesses a lifetime.",
    "One good deed, one measure of merit."
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
    "休息，也是一件善事。",
    "善有善报，福从善来。",
    "积善德，得福报。",
    "种善因，收福果。",
    "善心一点，福泽一生。",
    "一念善心，万福临门。"
  ],
  fr: [
    "Une petite bonté reste une bonté.",
    "On peut recommencer la journée à toute heure.",
    "Laissez reposer une inquiétude ; elle tiendra sans vous.",
    "L'effort discret compte, même invisible.",
    "Respirez une fois pour vous, une fois pour quelqu'un de loin.",
    "Aujourd'hui n'a pas besoin d'être lourd pour compter.",
    "Un geste doux peut adoucir tout un après-midi.",
    "Vous avez le droit d'aller lentement.",
    "Allumez une petite lampe ; l'obscurité s'occupe d'elle-même.",
    "Se reposer est aussi une bonne action."
  ],
  es: [
    "Una pequeña bondad sigue siendo bondad.",
    "Puedes empezar el día de nuevo a cualquier hora.",
    "Deja descansar una preocupación; se sostendrá sin ti.",
    "El esfuerzo silencioso cuenta, aunque nadie lo vea.",
    "Respira una vez por ti y otra por alguien lejano.",
    "Hoy no necesita ser pesado para importar.",
    "Un gesto amable puede suavizar toda una tarde.",
    "Se te permite ir despacio.",
    "Enciende una lámpara pequeña; la oscuridad se ocupa sola.",
    "Descansar también es una buena acción."
  ],
  th: [
    "ความเมตตาเล็กๆ ก็ยังคือความเมตตา",
    "คุณเริ่มต้นวันใหม่ได้ทุกเวลา",
    "ปล่อยความกังวลหนึ่งอย่างให้พัก มันอยู่ได้โดยไม่ต้องมีคุณ",
    "ความพยายามอันเงียบงันมีค่า แม้ไม่มีใครเห็น",
    "หายใจหนึ่งครั้งเพื่อตัวเอง อีกครั้งเพื่อคนที่อยู่ไกล",
    "วันนี้ไม่ต้องหนักอึ้งก็มีความหมายได้",
    "การกระทำอ่อนโยนหนึ่งอย่าง ทำให้ทั้งบ่ายนุ่มนวลขึ้น",
    "คุณค่อยๆ ไปได้",
    "จุดตะเกียงดวงเล็ก ความมืดจะจัดการตัวเอง",
    "การพักผ่อนก็เป็นความดีอย่างหนึ่ง"
  ],
  ja: [
    "小さなやさしさも、やさしさです。",
    "一日は、どの時間からでもやり直せます。",
    "心配をひとつ休ませて。あなたがいなくても大丈夫です。",
    "静かな努力は、見えなくても意味があります。",
    "自分のためにひと呼吸、遠くの誰かのためにもうひと呼吸。",
    "今日は重くなくても、意味があります。",
    "ひとつのやさしい行いが、午後ぜんぶをやわらげます。",
    "ゆっくり進んでいいのです。",
    "小さな灯をともせば、暗さは自ずと退きます。",
    "休むことも、善い行いです。"
  ]
};

export function dailyThoughtFor(locale: LocaleTag, date: Date = new Date()): string {
  const list = thoughts[locale] ?? thoughts.en;
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start) / 86400000);
  return list[dayOfYear % list.length];
}
