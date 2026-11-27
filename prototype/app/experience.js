(() => {
  const keys = ['featured', 'koi', 'koiCopy', 'playKoi', 'browse', 'games', 'gamesCopy', 'creekCopy', 'river', 'riverCopy', 'woodCopy', 'lampCopy', 'standings', 'standingsCopy', 'seeds', 'seedsCopy', 'savedWishes', 'courtyard', 'courtyardCopy'];
  const copy = {
    en: ['Featured game', 'Beneath the Lilies', 'Guide a koi across the pond, then follow it underwater.', 'Play Beneath the Lilies', 'Browse games', 'Quiet Worlds', 'Choose a small world to spend a moment in.', 'Set three stones in a quiet creek.', 'Kyoto River of Light', 'Fold a lantern and watch it float downstream.', 'Tap carved wood in a rain-lit room.', 'Light a paper lamp and let the room warm up.'],
    'zh-Hans': ['推荐游戏', '莲叶之下', '引导锦鲤游过池塘，再跟随它潜入水中。', '游玩莲叶之下', '浏览游戏', '静谧小世界', '选一个小世界，安静地待一会儿。', '在小溪里放下三颗石子。', '京都灯河', '折一盏灯，看它顺水漂流。', '在雨中的茶室轻敲木鱼。', '点亮纸灯，让屋子慢慢暖起来。'],
    fr: ['À découvrir', 'Sous les nénuphars', 'Guidez une carpe, puis suivez-la sous l’eau.', 'Jouer sous les nénuphars', 'Voir les jeux', 'Mondes paisibles', 'Choisissez un petit monde où faire une pause.', 'Posez trois galets dans un ruisseau.', 'Rivière de lumière à Kyoto', 'Pliez une lanterne et regardez-la flotter.', 'Tapotez le bois dans un salon de thé sous la pluie.', 'Allumez une lampe en papier et réchauffez la pièce.'],
    es: ['Juego destacado', 'Bajo los nenúfares', 'Guía a un koi y síguelo bajo el agua.', 'Jugar Bajo los nenúfares', 'Ver juegos', 'Mundos tranquilos', 'Elige un pequeño mundo donde pasar un momento.', 'Coloca tres piedras en un arroyo.', 'Río de luz en Kioto', 'Dobla una linterna y mira cómo flota.', 'Toca la madera en una sala de té lluviosa.', 'Enciende una lámpara de papel y da calidez al taller.'],
    th: ['เกมแนะนำ', 'ใต้ใบบัว', 'นำปลาคาร์ปข้ามบ่อแล้วตามลงไปใต้น้ำ', 'เล่นใต้ใบบัว', 'ดูเกม', 'โลกอันสงบ', 'เลือกโลกเล็ก ๆ เพื่อหยุดพักสักครู่', 'วางหินสามก้อนในลำธาร', 'แม่น้ำแห่งแสงที่เกียวโต', 'พับโคมแล้วดูโคมลอยตามน้ำ', 'เคาะไม้แกะสลักในห้องชาท่ามกลางสายฝน', 'จุดโคมกระดาษให้ห้องค่อย ๆ อบอุ่น'],
    ja: ['おすすめのゲーム', 'ハスの葉の下', 'コイを池で導き、水中までついていきましょう。', 'ハスの葉の下で遊ぶ', 'ゲームを見る', '静かな小世界', 'ひと休みする小さな世界を選びましょう。', '小川に石を三つ置きましょう。', '京都の光の川', '灯ろうを折って、川に流しましょう。', '雨の茶室で木魚をたたきましょう。', '紙のランプを灯し、部屋を暖めましょう。'],
  };
  const participationCopy = {
    'en': ['Weekly standings', 'Standings are not live yet. The proposed boards track Quiet Play and self-reported Kindness separately, from global to city level. Public participation will be optional.', 'Seeds', 'Earn 10 Seeds on your first signed-in visit each day. The reward resets at midnight UTC.', 'Saved wishes'],
    'zh-Hans': ['每周排名', '排名尚未开放。静心游戏和自行记录的善行将分别排名，范围从全球到城市。是否公开参与由你决定。', '种子', '每天首次登录到访可获得 10 颗种子。奖励在协调世界时午夜重置。', '已保存的心愿'],
    'fr': ['Classements hebdomadaires', 'Les classements sont en préparation. Les jeux paisibles et les actes déclarés auront des tableaux distincts, du monde à la ville. La participation publique sera facultative.', 'Graines', 'Gagnez 10 graines lors de votre première visite connectée chaque jour. La récompense se renouvelle à minuit UTC.', 'Vœux enregistrés'],
    'es': ['Clasificaciones semanales', 'Las tablas están en preparación. El juego tranquilo y las buenas acciones declaradas tendrán tablas separadas, del ámbito mundial al municipal. Participar en público será opcional.', 'Semillas', 'Gana 10 semillas en tu primera visita con sesión iniciada cada día. La recompensa se renueva a medianoche UTC.', 'Deseos guardados'],
    'th': ['อันดับประจำสัปดาห์', 'กำลังเตรียมตารางอันดับ แยกเกมผ่อนคลายและการทำความดีที่บันทึกเอง ตั้งแต่ระดับโลกถึงเมือง การเข้าร่วมแบบสาธารณะเป็นทางเลือก', 'เมล็ดพันธุ์', 'รับ 10 เมล็ดในการเข้าใช้ครั้งแรกหลังลงชื่อเข้าใช้ของแต่ละวัน รางวัลจะรีเซ็ตตอนเที่ยงคืนตามเวลา UTC', 'คำอธิษฐานที่บันทึกไว้'],
    'ja': ['週間ランキング', 'ランキングは準備中です。静かな遊びと自己申告の親切を分け、世界から市区までの範囲で集計します。公開参加は任意です。', '種', 'ログインした状態で、その日最初の訪問時に種を10個受け取れます。報酬はUTCの午前0時に更新されます。', '保存した願い'],
  };
  const courtyardCopy = {
    en: ['Incense Courtyard', 'Place virtual incense or hang a wind chime.'],
    'zh-Hans': ['静香庭院', '摆放虚拟线香，或挂一串风铃。'],
    fr: ['Cour de l’encens', 'Posez un encens virtuel ou suspendez un carillon.'],
    es: ['Patio del incienso', 'Coloca incienso virtual o cuelga un carillón de viento.'],
    th: ['ลานธูปสงบใจ', 'วางธูปเสมือนหรือแขวนกระดิ่งลม'],
    ja: ['香の中庭', '仮想のお香を供えるか、風鈴をつるしましょう。'],
  };
  for (const language of Object.keys(copy)) copy[language].push(...participationCopy[language], ...courtyardCopy[language]);
  const nodes = document.querySelectorAll('[data-experience]');
  const localize = () => {
    const language = document.documentElement.lang;
    const words = copy[language] || copy.en;
    for (const node of nodes) node.textContent = words[keys.indexOf(node.dataset.experience)];
    document.querySelectorAll('a[href*="/play/"], a[href*="/sanctuary/dive/"]').forEach(link => {
      const url = new URL(link.href);
      const locale = url.pathname.includes('/sanctuary/dive/') && language === 'zh-Hans' ? 'zh' : language;
      url.searchParams.set('lang', locale);
      link.href = url.href;
    });
  };
  new MutationObserver(localize).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  localize();
})();
