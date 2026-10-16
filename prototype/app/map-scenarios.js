(function registerWorldJourneys() {
  const appData = window.FOOBOW_DATA;
  const appI18n = window.FOOBOW_APP_I18N;
  if (!appData || !appI18n?.ui) return;

  Object.assign(appData.spots, {
    "lake-merritt": {
      name: "Lake Merritt, Oakland",
      category: "Animal kindness",
      categoryKey: "animals",
      text: "Release a digital fish beside Oakland's historic urban wildlife refuge and send a virtual ripple across the bay.",
      deedId: "release-fish",
      deedKey: "release-fish",
      ripples: 764,
      lat: 37.8012,
      lng: -122.2583,
      zoom: 15,
      coordinates: "37.8012° N, 122.2583° W",
      sanctuary: "Lake Merritt Wildlife Refuge",
      environment: "Tidal lagoon, migratory bird refuge, and urban lakeside park",
      journey: {
        flag: "🇺🇸",
        region: "United States",
        sourceName: "City of Oakland",
        sourceUrl: "https://www.oaklandca.gov/Community/Parks-Facilities/Parks/Lakeside-Park"
      }
    },
    "lake-biwa": {
      name: "Lake Biwa, Shiga",
      category: "Animal kindness",
      categoryKey: "animals",
      text: "Release a digital fish into Japan's largest freshwater lake and dedicate the ripple to its ancient living ecosystem.",
      deedId: "release-fish",
      deedKey: "release-fish",
      ripples: 1408,
      lat: 35.0179,
      lng: 135.8546,
      zoom: 12,
      coordinates: "35.0179° N, 135.8546° E",
      sanctuary: "Lake Biwa Living Waters",
      environment: "Ancient freshwater lake, endemic species habitat, and regional water source",
      journey: {
        flag: "🇯🇵",
        region: "Japan",
        sourceName: "Shiga Prefecture",
        sourceUrl: "https://www.pref.shiga.lg.jp/biwako-system/18934.html"
      }
    }
  });

  const copy = {
    en: {
      mapJourneyEyebrow: "WORLD JOURNEYS",
      mapJourneyTitle: "Choose a real place. Leave a virtual ripple.",
      mapJourneySubtitle: "Travel through living waters in the United States and Japan, then complete a location-aware symbolic deed.",
      mapJourneyVisit: "Travel here",
      mapJourneySource: "Place context",
      mapJourneyCount: "%{count} virtual deed",
      mapJourneyCountPlural: "%{count} virtual deeds",
      mapJourneySafety: "Every release here is entirely virtual. No animals are moved, purchased, or introduced into real ecosystems.",
      spot_name_lake_merritt: "Lake Merritt, Oakland",
      spot_category_lake_merritt: "Urban wildlife refuge",
      spot_desc_lake_merritt: "Release a digital fish beside Oakland's historic urban wildlife refuge and send a virtual ripple across the bay.",
      spot_env_lake_merritt: "Tidal lagoon, migratory bird refuge, and urban lakeside park",
      journey_fact_lake_merritt: "A celebrated Oakland lake and stopover for thousands of migratory birds.",
      spot_name_lake_biwa: "Lake Biwa, Shiga",
      spot_category_lake_biwa: "Ancient freshwater ecosystem",
      spot_desc_lake_biwa: "Release a digital fish into Japan's largest freshwater lake and dedicate the ripple to its ancient living ecosystem.",
      spot_env_lake_biwa: "Ancient freshwater lake, endemic species habitat, and regional water source",
      journey_fact_lake_biwa: "Japan's largest freshwater lake and one of the world's ancient lakes."
    },
    "zh-Hans": {
      mapJourneyEyebrow: "世界善意之旅", mapJourneyTitle: "选择真实地点，留下虚拟涟漪。", mapJourneySubtitle: "前往美国与日本的真实水域，完成与地点相连的象征性善举。", mapJourneyVisit: "前往此地", mapJourneySource: "地点资料", mapJourneyCount: "%{count} 次虚拟善举", mapJourneyCountPlural: "%{count} 次虚拟善举", mapJourneySafety: "这里的放生完全是虚拟体验。不会购买、移动或向真实生态系统投放任何动物。",
      spot_name_lake_merritt: "美国奥克兰梅里特湖", spot_category_lake_merritt: "城市野生动物保护地", spot_desc_lake_merritt: "在奥克兰历史悠久的城市野生动物保护地旁放归一尾数字鱼，让善意涟漪传向海湾。", spot_env_lake_merritt: "潮汐潟湖、候鸟保护地与城市湖畔公园", journey_fact_lake_merritt: "奥克兰著名湖泊，也是数千只候鸟的停歇地。",
      spot_name_lake_biwa: "日本滋贺琵琶湖", spot_category_lake_biwa: "古老淡水生态系统", spot_desc_lake_biwa: "在日本最大的淡水湖中放归一尾数字鱼，把涟漪献给古老而鲜活的生态系统。", spot_env_lake_biwa: "古老淡水湖、特有物种栖息地与区域水源", journey_fact_lake_biwa: "日本最大的淡水湖，也是世界古代湖之一。"
    },
    fr: {
      mapJourneyEyebrow: "VOYAGES DU MONDE", mapJourneyTitle: "Choisissez un lieu réel. Laissez une onde virtuelle.", mapJourneySubtitle: "Parcourez les eaux vivantes des États-Unis et du Japon, puis accomplissez un geste symbolique lié au lieu.", mapJourneyVisit: "Voyager ici", mapJourneySource: "Contexte du lieu", mapJourneyCount: "%{count} geste virtuel", mapJourneyCountPlural: "%{count} gestes virtuels", mapJourneySafety: "Chaque libération est entièrement virtuelle. Aucun animal n'est déplacé, acheté ou introduit dans un écosystème réel.",
      spot_name_lake_merritt: "Lac Merritt, Oakland", spot_category_lake_merritt: "Refuge urbain pour la faune", spot_desc_lake_merritt: "Libérez un poisson numérique près du refuge historique d'Oakland et envoyez une onde virtuelle vers la baie.", spot_env_lake_merritt: "Lagune de marée, refuge d'oiseaux migrateurs et parc urbain", journey_fact_lake_merritt: "Un lac emblématique d'Oakland et une halte pour des milliers d'oiseaux migrateurs.",
      spot_name_lake_biwa: "Lac Biwa, Shiga", spot_category_lake_biwa: "Écosystème d'eau douce ancien", spot_desc_lake_biwa: "Libérez un poisson numérique dans le plus grand lac d'eau douce du Japon et dédiez l'onde à son ancien écosystème.", spot_env_lake_biwa: "Lac ancien, habitat d'espèces endémiques et ressource en eau régionale", journey_fact_lake_biwa: "Le plus grand lac d'eau douce du Japon et l'un des lacs anciens du monde."
    },
    es: {
      mapJourneyEyebrow: "VIAJES DEL MUNDO", mapJourneyTitle: "Elige un lugar real. Deja una onda virtual.", mapJourneySubtitle: "Recorre aguas vivas de Estados Unidos y Japón y completa una acción simbólica vinculada al lugar.", mapJourneyVisit: "Viajar aquí", mapJourneySource: "Contexto del lugar", mapJourneyCount: "%{count} acción virtual", mapJourneyCountPlural: "%{count} acciones virtuales", mapJourneySafety: "Cada liberación es totalmente virtual. No se mueve, compra ni introduce ningún animal en ecosistemas reales.",
      spot_name_lake_merritt: "Lago Merritt, Oakland", spot_category_lake_merritt: "Refugio urbano de fauna", spot_desc_lake_merritt: "Libera un pez digital junto al histórico refugio urbano de Oakland y envía una onda virtual por la bahía.", spot_env_lake_merritt: "Laguna mareal, refugio de aves migratorias y parque urbano", journey_fact_lake_merritt: "Un lago emblemático de Oakland y escala de miles de aves migratorias.",
      spot_name_lake_biwa: "Lago Biwa, Shiga", spot_category_lake_biwa: "Ecosistema antiguo de agua dulce", spot_desc_lake_biwa: "Libera un pez digital en el mayor lago de agua dulce de Japón y dedica la onda a su antiguo ecosistema.", spot_env_lake_biwa: "Lago antiguo, hábitat de especies endémicas y fuente regional de agua", journey_fact_lake_biwa: "El mayor lago de agua dulce de Japón y uno de los lagos antiguos del mundo."
    },
    th: {
      mapJourneyEyebrow: "การเดินทางรอบโลก", mapJourneyTitle: "เลือกสถานที่จริง ฝากระลอกคลื่นเสมือน", mapJourneySubtitle: "เดินทางผ่านสายน้ำในสหรัฐฯ และญี่ปุ่น แล้วทำความดีเชิงสัญลักษณ์ที่เชื่อมโยงกับสถานที่", mapJourneyVisit: "เดินทางไปที่นี่", mapJourneySource: "ข้อมูลสถานที่", mapJourneyCount: "ความดีเสมือน %{count} ครั้ง", mapJourneyCountPlural: "ความดีเสมือน %{count} ครั้ง", mapJourneySafety: "การปล่อยทุกครั้งเป็นกิจกรรมเสมือนทั้งหมด ไม่มีการซื้อ เคลื่อนย้าย หรือปล่อยสัตว์สู่ระบบนิเวศจริง",
      spot_name_lake_merritt: "ทะเลสาบเมอร์ริตต์ โอ๊คแลนด์", spot_category_lake_merritt: "เขตรักษาพันธุ์สัตว์ป่าในเมือง", spot_desc_lake_merritt: "ปล่อยปลาดิจิทัลข้างเขตรักษาพันธุ์สัตว์ป่าเก่าแก่ของโอ๊คแลนด์ และส่งระลอกเสมือนไปทั่วอ่าว", spot_env_lake_merritt: "ลากูนตามน้ำขึ้นลง แหล่งพักนกอพยพ และสวนริมทะเลสาบ", journey_fact_lake_merritt: "ทะเลสาบสำคัญของโอ๊คแลนด์และจุดพักของนกอพยพนับพันตัว",
      spot_name_lake_biwa: "ทะเลสาบบิวะ ชิงะ", spot_category_lake_biwa: "ระบบนิเวศน้ำจืดโบราณ", spot_desc_lake_biwa: "ปล่อยปลาดิจิทัลในทะเลสาบน้ำจืดที่ใหญ่ที่สุดของญี่ปุ่น และมอบระลอกให้ระบบนิเวศเก่าแก่", spot_env_lake_biwa: "ทะเลสาบโบราณ ถิ่นอาศัยของชนิดพันธุ์เฉพาะถิ่น และแหล่งน้ำระดับภูมิภาค", journey_fact_lake_biwa: "ทะเลสาบน้ำจืดที่ใหญ่ที่สุดของญี่ปุ่นและหนึ่งในทะเลสาบโบราณของโลก"
    },
    ja: {
      mapJourneyEyebrow: "世界をめぐる旅", mapJourneyTitle: "実在する場所を選び、デジタルの波紋を。", mapJourneySubtitle: "アメリカと日本の水辺を旅し、その場所に寄り添う象徴的な善行を体験します。", mapJourneyVisit: "この場所へ", mapJourneySource: "場所の資料", mapJourneyCount: "バーチャル善行 %{count} 回", mapJourneyCountPlural: "バーチャル善行 %{count} 回", mapJourneySafety: "ここでの放生はすべてバーチャルです。現実の生態系へ動物を購入、移動、放流することはありません。",
      spot_name_lake_merritt: "メリット湖・オークランド", spot_category_lake_merritt: "都市の野生生物保護区", spot_desc_lake_merritt: "オークランドの歴史ある都市型保護区のそばでデジタルの魚を放ち、湾へ仮想の波紋を届けます。", spot_env_lake_merritt: "潮汐ラグーン、渡り鳥の保護区、都市の湖畔公園", journey_fact_lake_merritt: "オークランドを象徴する湖で、数千羽の渡り鳥が立ち寄る場所です。",
      spot_name_lake_biwa: "琵琶湖・滋賀", spot_category_lake_biwa: "古代の淡水生態系", spot_desc_lake_biwa: "日本最大の淡水湖へデジタルの魚を放ち、古く豊かな生態系へ波紋を捧げます。", spot_env_lake_biwa: "古代湖、固有種の生息地、地域を支える水源", journey_fact_lake_biwa: "日本最大の淡水湖で、世界有数の古代湖です。"
    }
  };

  Object.entries(copy).forEach(([locale, entries]) => Object.assign(appI18n.ui[locale], entries));
})();
