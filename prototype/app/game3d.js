/**
 * Foobow 3D Interactive Sanctuary Mini-Game Engine
 *
 * Implements real-time 3D perspective projection, dynamic water physics,
 * articulated multi-segment swimming koi kinematics, lighting, and interactive
 * good deed scenarios (East Lake Fish Release, Toronto Safe Crosswalk,
 * Amazon Sacred Tree Planting, and Kyoto Night River Lanterns).
 *
 * Zero external dependencies — 100% offline-ready, hardware-accelerated.
 */

(function () {
  "use strict";

  const SCENARIOS = {
    "east-lake": {
      id: "east-lake",
      icon: "🐟",
      name: "East Lake Sanctuary",
      nameZh: "武汉东湖 · 慈心放生池",
      coords: "30.5539° N, 114.3644° E",
      biosphere: "Freshwater aquatic wetland sanctuary",
      targetGoal: 5,
      goalLabel: "Release 5 fish into the lake",
      goalLabelZh: "放归 5 尾锦鲤入湖",
      actionName: "Release Koi",
      actionNameZh: "放归锦鲤 (+1)",
      feedActionName: "Feed Lotus Petals",
      feedActionNameZh: "投喂莲华 (+1)",
      badgeTitle: "Lake Guardian",
      badgeTitleZh: "东湖护生使",
      story: "Guide a rescued koi from the release basket into open water.",
      storyZh: "护送获救锦鲤离开鱼篓，游入开阔湖水。",
      chapter: "A gentle return",
      chapterZh: "温柔归湖",
      defaultCam: { rotX: 0.44, rotY: 0, zoom: 1, dist: 280 }
    },
    "toronto-crosswalk": {
      id: "toronto-crosswalk",
      icon: "👵",
      name: "Toronto Crosswalk",
      nameZh: "多伦多 · 长者平安斑马线",
      coords: "43.6532° N, 79.3832° W",
      biosphere: "Mindful urban pedestrian corridor",
      targetGoal: 3,
      goalLabel: "Safely escort pedestrians across",
      goalLabelZh: "平安护送长者穿过马路",
      actionName: "Pedestrian Walk Chime",
      actionNameZh: "按通行信号灯",
      feedActionName: "Guide Elder Forward",
      feedActionNameZh: "温和护送前行",
      badgeTitle: "Kindness Escort",
      badgeTitleZh: "慈心护行使",
      story: "Make the crossing safe, then walk beside a neighbour at their pace.",
      storyZh: "先亮起安全信号，再陪邻里长者按自己的步伐过街。",
      chapter: "A safe way home",
      chapterZh: "平安归途",
      defaultCam: { rotX: 0.38, rotY: 0, zoom: 0.95, dist: 300 }
    },
    "amazon-grove": {
      id: "amazon-grove",
      icon: "🌱",
      name: "Amazon Rainforest Grove",
      nameZh: "亚马逊 · 共植圣树绿林",
      coords: "-3.4653° S, 62.2159° W",
      biosphere: "Tropical rainforest biosphere reserve",
      targetGoal: 4,
      goalLabel: "Plant & nourish 4 sacred trees",
      goalLabelZh: "播种培育 4 株参天圣树",
      actionName: "Plant Seed",
      actionNameZh: "播下菩提种",
      feedActionName: "Sprinkle Rain",
      feedActionNameZh: "细雨浇灌生机",
      badgeTitle: "Rainforest Custodian",
      badgeTitleZh: "雨林绿洲守护者",
      story: "Plant a native sapling and help its roots settle into the rainforest.",
      storyZh: "种下一株原生树苗，让根系在雨林中安稳生长。",
      chapter: "Roots of tomorrow",
      chapterZh: "明日新根",
      defaultCam: { rotX: 0.46, rotY: 0, zoom: 1.05, dist: 290 }
    },
    "night-corridor": {
      id: "night-corridor",
      icon: "🏮",
      name: "Kyoto River Lanterns",
      nameZh: "京都 · 水灯祈福照归途",
      coords: "35.0116° N, 135.7681° E",
      biosphere: "Tranquil night river & bamboo sanctuary",
      targetGoal: 5,
      goalLabel: "Float 5 wish lanterns downriver",
      goalLabelZh: "放流 5 盏祈愿水灯",
      actionName: "Float Lantern",
      actionNameZh: "奉放莲花水灯",
      feedActionName: "Gentle Breeze",
      feedActionNameZh: "微风引渡水流",
      badgeTitle: "Illumination Bearer",
      badgeTitleZh: "心灯引路人",
      story: "Choose a quiet wish and guide its lantern into Kyoto's evening current.",
      storyZh: "选择一份静心善愿，引导水灯随京都暮色缓缓远行。",
      chapter: "Light on the water",
      chapterZh: "水上心灯",
      defaultCam: { rotX: 0.42, rotY: 0, zoom: 1, dist: 285 }
    },
    "reading-room": {
      id: "reading-room",
      icon: "📖",
      name: "Oxford Wisdom Library",
      nameZh: "牛津 · 般若智慧伴读舍",
      coords: "51.7548° N, 1.2544° W",
      biosphere: "Intergenerational literacy room & archive",
      targetGoal: 3,
      goalLabel: "Turn pages & read 3 wisdom passages",
      goalLabelZh: "温习诵读 3 篇智慧善言",
      actionName: "Read Aloud / Turn Page",
      actionNameZh: "诵读开卷 (+1)",
      feedActionName: "Share Book / Light Lamp",
      feedActionNameZh: "温润案灯 · 结缘明光",
      badgeTitle: "Wisdom Keeper",
      badgeTitleZh: "般若智慧守护者",
      story: "Turn a page, read one kind thought, and share the light of learning.",
      storyZh: "翻开一页善言，诵读并分享学习之光。",
      chapter: "A story shared",
      chapterZh: "共读一页",
      defaultCam: { rotX: 0.52, rotY: 0, zoom: 1.1, dist: 270 }
    }
  };

  // ---------------------------------------------------------------------------
  // Engine State
  // ---------------------------------------------------------------------------
  let canvas = null;
  let ctx = null;
  let animFrameId = null;
  let isRunning = false;
  let currentScenarioKey = "east-lake";
  let currentTimeOfDay = "day"; // "dawn", "day", "sunset", "night"
  let currentSpecies = "yamabuki"; // "yamabuki", "kohaku", "showa", "turtle"
  let cameraMode = "orbit"; // "orbit", "follow", "topdown"
  let width = 640;
  let height = 480;
  let dpr = 1;

  // Shared painted locations keep every deed grounded in a recognizable place.
  // The canvas still owns all interaction and animation; these illustrations are
  // the quiet stage behind it rather than static replacements for the game.
  const STORYBOOK_BACKDROP_SOURCES = {
    "east-lake": "../assets/foobow/backgrounds/storybook/east-lake.webp",
    "toronto-crosswalk": "../assets/foobow/backgrounds/storybook/toronto-crosswalk.webp",
    "amazon-grove": "../assets/foobow/backgrounds/storybook/amazon-grove.webp",
    "night-corridor": "../assets/foobow/backgrounds/storybook/kyoto-river.webp",
    "reading-room": "../assets/foobow/backgrounds/storybook/oxford-reading-room.webp"
  };
  const storybookBackdrops = {};

  const STORYBOOK_SPRITE_SOURCES = {
    koi: "../assets/foobow/sprites/storybook/koi-kohaku.webp",
    escort: "../assets/foobow/sprites/storybook/toronto-escort.webp",
    sapling: "../assets/foobow/sprites/storybook/amazon-sapling.webp",
    lantern: "../assets/foobow/sprites/storybook/kyoto-lantern.webp",
    book: "../assets/foobow/sprites/storybook/oxford-book.webp"
  };
  const storybookSprites = {};
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false;

  Object.entries(STORYBOOK_BACKDROP_SOURCES).forEach(([key, src]) => {
    const image = new Image();
    image.decoding = "async";
    image.src = src;
    storybookBackdrops[key] = image;
  });

  Object.entries(STORYBOOK_SPRITE_SOURCES).forEach(([key, src]) => {
    const image = new Image();
    image.decoding = "async";
    image.src = src;
    storybookSprites[key] = image;
  });

  function drawStorybookBackdrop(key, fallbackTop, fallbackBottom, tint) {
    const image = storybookBackdrops[key];

    if (image && image.complete && image.naturalWidth > 0) {
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const sourceWidth = width / scale;
      const sourceHeight = height / scale;
      const sourceX = (image.naturalWidth - sourceWidth) / 2;
      const sourceY = (image.naturalHeight - sourceHeight) / 2;
      ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
    } else {
      const fallback = ctx.createLinearGradient(0, 0, 0, height);
      fallback.addColorStop(0, fallbackTop);
      fallback.addColorStop(1, fallbackBottom);
      ctx.fillStyle = fallback;
      ctx.fillRect(0, 0, width, height);
    }

    if (tint) {
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, width, height);
    }
  }

  // 3D Camera
  const camera = {
    rotX: 0.44,
    rotY: 0,
    zoom: 1,
    dist: 280,
    fov: 340,
    targetX: 0,
    targetY: 0,
    targetZ: 0
  };

  // Pointer dragging state
  let isDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;

  // Game Progress Counters
  const progressState = {
    "east-lake": { count: 0, score: 0, completed: false },
    "toronto-crosswalk": { count: 0, score: 0, completed: false },
    "amazon-grove": { count: 0, score: 0, completed: false },
    "night-corridor": { count: 0, score: 0, completed: false },
    "reading-room": { count: 0, score: 0, completed: false }
  };

  // Serenity Combo State
  const comboState = {
    count: 0,
    timer: 0,
    multiplier: 1
  };

  const WISH_LABELS = {
    peace: { en: "Peace · 平安", zh: "平安" },
    health: { en: "Health · 安康", zh: "安康" },
    wisdom: { en: "Wisdom · 般若", zh: "般若" },
    love: { en: "Compassion · 慈爱", zh: "慈爱" },
    release: { en: "Release · 释然", zh: "释然" }
  };
  let currentWish = "peace";

  const SCENARIO_HINTS = {
    "east-lake": "💡 Tap water to scatter food · Drag to orbit · Scroll to zoom",
    "toronto-crosswalk": "💡 Tap avenue to place safe haven beacon · Press signal to walk",
    "amazon-grove": "💡 Tap jungle floor to sprout Bodhi saplings · Rain brings full bloom",
    "night-corridor": "💡 Tap river to float wish lanterns · Guide light into the night",
    "reading-room": "💡 Tap manuscript to turn pages · Contemplate timeless wisdom proverbs"
  };

  // Gamification Celebration Badge
  const celebrationBadge = {
    active: false,
    title: "",
    titleZh: "",
    icon: "🌟",
    timer: 0,
    scale: 0
  };

  // Scenario 1: East Lake Entities
  let koiFishList = [];
  let lakeRipples = [];
  let foodCrumbs = [];
  let splashDroplets = [];
  let waterTime = 0;

  // Scenario 2: Toronto Crosswalk Entities
  let crosswalkCars = [];
  let elderPedestrian = { x: -140, z: 0, progress: 0, walking: false, frame: 0 };
  let trafficLight = { state: "red", timer: 0 }; // red, green, yellow
  let crosswalkShields = [];

  // Scenario 3: Amazon Rainforest Entities
  let sacredTrees = [];
  let rainDroplets = [];
  let butterflies = [];

  // Scenario 4: Kyoto Night River Entities
  let riverLanterns = [];
  let riverWaterOffset = 0;

  // Scenario 5: Oxford Reading Room Entities
  let readingBook = {
    x: 0,
    y: 10,
    z: 5,
    pageAngle: 0,
    isFlipping: false,
    curQuoteIdx: 0,
    quotes: [
      { en: "Kindness in words creates confidence. Kindness in giving creates love.", zh: "口出善言增信愿，慈心布施润世间。" },
      { en: "To hold onto a worry is like grasping a hot coal. Let it rest in peace.", zh: "执着忧恼如握热炭，释然放下即得清凉。" },
      { en: "A single candle loses none of its light by lighting a thousand others.", zh: "一灯燃百千灯，光明展转，无有穷尽。" },
      { en: "Step softly upon the earth. Every quiet gesture bears infinite fruit.", zh: "步履轻安践大地，纤芥善行结万功德。" }
    ]
  };
  let readingLamp = { x: -55, y: 35, z: -35, lit: true, intensity: 1.0 };
  let wisdomGlyphs = [];

  // Floating merit particles in 3D
  let meritParticles3D = [];

  // ---------------------------------------------------------------------------
  // 3D Math & Projection
  // ---------------------------------------------------------------------------
  function project(x, y, z) {
    // 1. Center relative to camera target
    const tx = x - camera.targetX;
    const ty = y - camera.targetY;
    const tz = z - camera.targetZ;

    // 2. Rotate around Y (yaw)
    const cosY = Math.cos(camera.rotY);
    const sinY = Math.sin(camera.rotY);
    const x1 = tx * cosY - tz * sinY;
    const z1 = tx * sinY + tz * cosY;

    // 3. Rotate around X (pitch)
    const cosX = Math.cos(camera.rotX);
    const sinX = Math.sin(camera.rotX);
    const y2 = ty * cosX - z1 * sinX;
    const z2 = ty * sinX + z1 * cosX;

    // 4. Camera distance offset along Z
    const camZ = z2 + camera.dist;

    if (camZ <= 10) {
      return { sx: 0, sy: 0, scale: 0, depth: -9999, visible: false };
    }

    const scale = (camera.fov * camera.zoom) / camZ;
    const sx = width / 2 + x1 * scale;
    const sy = height / 2 - y2 * scale;

    return {
      sx,
      sy,
      scale,
      depth: camZ,
      visible: sx >= -800 && sx <= width + 800 && sy >= -800 && sy <= height + 800
    };
  }

  function spriteReady(key) {
    const image = storybookSprites[key];
    return Boolean(image && image.complete && image.naturalWidth > 0);
  }

  function drawStorybookSprite(key, point, options = {}) {
    if (!point?.visible || !spriteReady(key)) return false;

    const image = storybookSprites[key];
    const spriteWidth = Math.max(28, (options.width || 120) * point.scale);
    const spriteHeight = spriteWidth * (image.naturalHeight / image.naturalWidth);
    const bob = prefersReducedMotion ? 0 : Math.sin(waterTime * (options.bobSpeed || 1.5) + (options.phase || 0)) * (options.bob || 2);
    const anchorY = options.anchorY ?? 0.78;

    ctx.save();
    ctx.globalAlpha = options.alpha ?? 1;
    ctx.translate(point.sx, point.sy + bob);
    ctx.rotate(options.rotation || 0);
    if (options.flipX) ctx.scale(-1, 1);
    if (options.filter) ctx.filter = options.filter;

    if (options.glow) {
      const glowRadius = spriteWidth * (options.glowRadius || 0.62);
      const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, glowRadius);
      glow.addColorStop(0, options.glow);
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    if (options.shadow !== false) {
      ctx.save();
      ctx.filter = "blur(5px)";
      ctx.fillStyle = options.shadowColor || "rgba(7, 26, 24, 0.28)";
      ctx.beginPath();
      ctx.ellipse(0, spriteHeight * (1 - anchorY) + 5, spriteWidth * 0.34, Math.max(4, spriteHeight * 0.08), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.drawImage(image, -spriteWidth / 2, -spriteHeight * anchorY, spriteWidth, spriteHeight);
    ctx.restore();
    return true;
  }

  function drawSceneVignette(color = "rgba(10, 35, 32, 0.2)") {
    const vignette = ctx.createRadialGradient(width / 2, height * 0.46, Math.min(width, height) * 0.2, width / 2, height * 0.48, Math.max(width, height) * 0.72);
    vignette.addColorStop(0, "rgba(255,255,255,0)");
    vignette.addColorStop(1, color);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }

  function drawWaypoint(x, y, label, active = false) {
    const pulse = prefersReducedMotion ? 0 : Math.sin(waterTime * 3) * 2;
    ctx.save();
    const halo = ctx.createRadialGradient(x, y, 2, x, y, 26 + pulse);
    halo.addColorStop(0, active ? "rgba(255, 220, 132, .55)" : "rgba(239, 247, 230, .38)");
    halo.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, 28 + pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = active ? "#f6c96b" : "rgba(255,255,255,.88)";
    ctx.strokeStyle = "rgba(28, 62, 56, .72)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (label) {
      ctx.font = "700 10px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#163b35";
      ctx.fillText(label, x, y + 0.5);
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // Scenario 1: East Lake Wuhan (3D Koi & Water)
  // ---------------------------------------------------------------------------
  function initEastLake() {
    koiFishList = [];
    lakeRipples = [];
    foodCrumbs = [];

    // Pre-populate with 3 resident serene swimming koi
    spawnKoi(20, -10, 0, "kohaku", 1.55);
    spawnKoi(-40, 25, 2.2, "showa", 1.35);
    spawnKoi(50, -40, 3.8, "yamabuki", 1.7);
  }

  function spawnKoi(x, z, heading, pattern = "kohaku", size = 1.0, isReleased = false) {
    const spineSegments = [];
    for (let i = 0; i < 6; i++) {
      spineSegments.push({ x: x - i * 4 * Math.cos(heading), z: z - i * 4 * Math.sin(heading) });
    }

    koiFishList.push({
      x,
      y: 0,
      z,
      vx: Math.cos(heading) * 0.7,
      vz: Math.sin(heading) * 0.7,
      heading,
      speed: isReleased ? 1.6 : 0.85,
      targetSpeed: 0.9,
      size,
      pattern, // kohaku, showa, yamabuki
      phase: Math.random() * Math.PI * 2,
      targetX: (Math.random() - 0.5) * 160,
      targetZ: (Math.random() - 0.5) * 160,
      spine: spineSegments,
      isReleased,
      bornAt: Date.now()
    });
  }

  function addWaterRipple(x, z, maxR = 45, intensity = 1.0) {
    lakeRipples.push({
      x,
      z,
      r: 4,
      maxR,
      intensity,
      alpha: 0.85,
      speed: 1.2
    });
  }

  function spawnWaterSplash(x, z) {
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 1.0 + Math.random() * 1.5;
      splashDroplets.push({
        x: x + Math.cos(angle) * 3,
        y: 2,
        z: z + Math.sin(angle) * 3,
        vx: Math.cos(angle) * speed,
        vy: 2.2 + Math.random() * 2.0,
        vz: Math.sin(angle) * speed,
        life: 1.0
      });
    }
  }

  function updateEastLake(dt) {
    waterTime += dt;

    // Update ripples
    for (let i = lakeRipples.length - 1; i >= 0; i--) {
      const rip = lakeRipples[i];
      rip.r += rip.speed;
      rip.alpha = (1 - rip.r / rip.maxR) * rip.intensity;
      if (rip.r >= rip.maxR || rip.alpha <= 0.02) {
        lakeRipples.splice(i, 1);
      }
    }

    // Update food crumbs
    for (let i = foodCrumbs.length - 1; i >= 0; i--) {
      const crumb = foodCrumbs[i];
      crumb.y += 0.08; // sinks very gently
      crumb.life -= dt * 0.2;
      if (crumb.life <= 0) {
        foodCrumbs.splice(i, 1);
      }
    }

    // Update water splash droplets
    for (let i = splashDroplets.length - 1; i >= 0; i--) {
      const drop = splashDroplets[i];
      drop.x += drop.vx;
      drop.y += drop.vy;
      drop.z += drop.vz;
      drop.vy -= 0.16;
      drop.life -= dt * 1.6;
      if (drop.y <= 0 || drop.life <= 0) {
        splashDroplets.splice(i, 1);
      }
    }

    // Update koi fish
    koiFishList.forEach((koi) => {
      koi.phase += dt * 6.5 * (koi.speed / 0.9);

      // Check for closest food
      let nearestFood = null;
      let minDist = 75;
      foodCrumbs.forEach((crumb) => {
        const dx = crumb.x - koi.x;
        const dz = crumb.z - koi.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < minDist) {
          minDist = dist;
          nearestFood = crumb;
        }
      });

      if (nearestFood) {
        koi.targetX = nearestFood.x;
        koi.targetZ = nearestFood.z;
        koi.speed = 1.6;
        if (minDist < 8) {
          // Eats food
          const idx = foodCrumbs.indexOf(nearestFood);
          if (idx !== -1) foodCrumbs.splice(idx, 1);
          addWaterRipple(koi.x, koi.z, 22, 0.7);
          spawnWaterSplash(koi.x, koi.z);
          spawnFloatingMerit3D(koi.x, 8, koi.z, `Harmony +${5 * comboState.multiplier} · 悦纳`);
          progressState["east-lake"].score += 5 * comboState.multiplier;
          recordComboAction();
          updateHUD();
        }
      } else {
        // Normal wandering
        const dx = koi.targetX - koi.x;
        const dz = koi.targetZ - koi.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 12 || Math.random() < 0.005) {
          koi.targetX = (Math.random() - 0.5) * 180;
          koi.targetZ = (Math.random() - 0.5) * 180;
        }
        koi.speed += (koi.targetSpeed - koi.speed) * 0.05;
      }

      // Steer heading towards target
      const targetAngle = Math.atan2(koi.targetZ - koi.z, koi.targetX - koi.x);
      let angleDiff = targetAngle - koi.heading;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      koi.heading += angleDiff * 0.065;

      // Forward motion
      koi.x += Math.cos(koi.heading) * koi.speed;
      koi.z += Math.sin(koi.heading) * koi.speed;

      // Keep in lake bounds
      const bound = 110;
      if (Math.abs(koi.x) > bound) {
        koi.x = Math.sign(koi.x) * bound;
        koi.targetX = -koi.x * 0.6;
      }
      if (Math.abs(koi.z) > bound) {
        koi.z = Math.sign(koi.z) * bound;
        koi.targetZ = -koi.z * 0.6;
      }

      // Update spine chain
      koi.spine[0].x = koi.x;
      koi.spine[0].z = koi.z;
      const segDist = 5.2 * koi.size;
      for (let s = 1; s < koi.spine.length; s++) {
        const prev = koi.spine[s - 1];
        const cur = koi.spine[s];
        const sDx = cur.x - prev.x;
        const sDz = cur.z - prev.z;
        const curDist = Math.sqrt(sDx * sDx + sDz * sDz) || 0.001;
        // Natural spinal sinusoidal wave
        const wiggleAngle = Math.sin(koi.phase - s * 0.65) * 0.28;
        const angle = Math.atan2(sDz, sDx) + wiggleAngle * 0.2;
        cur.x = prev.x + Math.cos(angle) * segDist;
        cur.z = prev.z + Math.sin(angle) * segDist;
      }
    });
  }

  function drawEastLake() {
    const isDark = document.body.classList.contains("dark");

    drawStorybookBackdrop(
      "east-lake",
      isDark ? "#163c3c" : "#8bc8c2",
      isDark ? "#071919" : "#287f79",
      isDark ? "rgba(3, 20, 23, 0.34)" : "rgba(20, 111, 104, 0.08)"
    );

    // 1. Transparent water light preserves the real East Lake shoreline.
    const waterGrad = ctx.createRadialGradient(width / 2, height * 0.48, 20, width / 2, height * 0.48, Math.max(width, height) * 0.85);
    if (currentTimeOfDay === "dawn") {
      waterGrad.addColorStop(0, isDark ? "rgba(27, 68, 64, 0.3)" : "rgba(255, 225, 166, 0.14)");
      waterGrad.addColorStop(0.5, isDark ? "rgba(16, 45, 44, 0.25)" : "rgba(31, 110, 103, 0.08)");
      waterGrad.addColorStop(1, isDark ? "rgba(6, 21, 23, 0.34)" : "rgba(14, 58, 54, 0.12)");
    } else if (currentTimeOfDay === "sunset") {
      waterGrad.addColorStop(0, isDark ? "rgba(42, 57, 74, 0.35)" : "rgba(247, 174, 108, 0.18)");
      waterGrad.addColorStop(0.5, isDark ? "rgba(23, 35, 50, 0.3)" : "rgba(38, 82, 103, 0.1)");
      waterGrad.addColorStop(1, isDark ? "rgba(8, 16, 26, 0.42)" : "rgba(17, 42, 56, 0.16)");
    } else if (currentTimeOfDay === "night") {
      waterGrad.addColorStop(0, "rgba(12, 32, 51, 0.58)");
      waterGrad.addColorStop(0.5, "rgba(6, 19, 32, 0.62)");
      waterGrad.addColorStop(1, "rgba(2, 7, 14, 0.72)");
    } else { // day
      waterGrad.addColorStop(0, isDark ? "rgba(21, 82, 78, 0.3)" : "rgba(214, 249, 235, 0.04)");
      waterGrad.addColorStop(0.5, isDark ? "rgba(12, 51, 50, 0.28)" : "rgba(23, 120, 110, 0.06)");
      waterGrad.addColorStop(1, isDark ? "rgba(4, 21, 23, 0.4)" : "rgba(10, 62, 57, 0.12)");
    }
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, 0, width, height);

    // 1b. Distant Lakeside Shorebank & Bamboo Reeds (far behind water)
    drawDistantShore();

    // 2. Animated Sunlight / Moonlight Caustics on Pond Floor (Smooth organic 3D light web)
    ctx.save();
    const causticAlpha = currentTimeOfDay === "night" ? 0.08 : (isDark ? 0.13 : 0.20);
    ctx.strokeStyle = currentTimeOfDay === "night" ? `rgba(180, 225, 255, ${causticAlpha})` : `rgba(255, 255, 225, ${causticAlpha})`;
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Soft organic sunlit water caustics dancing on the pond floor (smooth drifting light pools)
    const causticPatches = 16;
    for (let i = 0; i < causticPatches; i++) {
      const cx = Math.sin(i * 1.35 + waterTime * 0.9) * 135;
      const cz = Math.cos(i * 1.85 - waterTime * 0.7) * 110;
      const cp = project(cx, -11, cz);
      if (!cp.visible) continue;
      const cRadius = (24 + Math.sin(waterTime * 2.1 + i * 1.5) * 8) * cp.scale;
      const patchGrad = ctx.createRadialGradient(cp.sx, cp.sy, 2, cp.sx, cp.sy, cRadius);
      const alpha = currentTimeOfDay === "night" ? 0.08 : (isDark ? 0.12 : 0.18);
      patchGrad.addColorStop(0, currentTimeOfDay === "night" ? `rgba(180, 225, 255, ${alpha})` : `rgba(255, 255, 220, ${alpha})`);
      patchGrad.addColorStop(0.6, currentTimeOfDay === "night" ? `rgba(180, 225, 255, ${(alpha * 0.4).toFixed(3)})` : `rgba(255, 255, 220, ${(alpha * 0.4).toFixed(3)})`);
      patchGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = patchGrad;
      ctx.beginPath();
      ctx.arc(cp.sx, cp.sy, cRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Soft glowing radial convergence nodes (specular caustic highlights)
    const causticNodes = 12;
    for (let i = 0; i < causticNodes; i++) {
      const nx = Math.sin(i * 1.7 + waterTime * 0.85) * 115;
      const nz = Math.cos(i * 2.1 - waterTime * 0.75) * 95;
      const nPt = project(nx, -11, nz);
      if (nPt.visible) {
        const nR = (18 + Math.sin(waterTime * 1.8 + i) * 7) * nPt.scale;
        const nGrad = ctx.createRadialGradient(nPt.sx, nPt.sy, 0, nPt.sx, nPt.sy, nR);
        const nodeAlpha = currentTimeOfDay === "night" ? 0.16 : (isDark ? 0.20 : 0.28);
        nGrad.addColorStop(0, currentTimeOfDay === "night" ? `rgba(180, 230, 255, ${nodeAlpha})` : `rgba(255, 255, 215, ${nodeAlpha})`);
        nGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = nGrad;
        ctx.beginPath();
        ctx.arc(nPt.sx, nPt.sy, nR, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // 5. Draw 3D Water Ripples
    lakeRipples.forEach((rip) => {
      const segs = 20;
      ctx.beginPath();
      for (let s = 0; s <= segs; s++) {
        const theta = (s / segs) * Math.PI * 2;
        const rx = rip.x + Math.cos(theta) * rip.r;
        const rz = rip.z + Math.sin(theta) * rip.r;
        const pt = project(rx, 1, rz);
        if (s === 0) ctx.moveTo(pt.sx, pt.sy);
        else ctx.lineTo(pt.sx, pt.sy);
      }
      ctx.strokeStyle = isDark
        ? `rgba(239, 201, 120, ${rip.alpha.toFixed(3)})`
        : `rgba(212, 175, 55, ${rip.alpha.toFixed(3)})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    });

    // 6. Floating Lotus Pads & Flowers
    const lotusPads = [
      { x: -112, z: -54, r: 11, flower: true },
      { x: 112, z: 48, r: 13, flower: true },
      { x: -94, z: 88, r: 10, flower: false },
      { x: 104, z: -76, r: 11, flower: false }
    ];

    lotusPads.forEach((pad) => {
      const center = project(pad.x, 2, pad.z);
      if (!center.visible) return;

      const padRadius = pad.r * center.scale;
      // Lotus Pad Shadow
      ctx.beginPath();
      ctx.ellipse(center.sx + 4, center.sy + 8, padRadius * 1.05, padRadius * 0.85, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 20, 20, 0.28)";
      ctx.fill();

      // Green lily pad with gentle notch
      ctx.beginPath();
      ctx.arc(center.sx, center.sy, padRadius, 0.25, Math.PI * 2 - 0.25);
      ctx.lineTo(center.sx, center.sy);
      ctx.closePath();
      const padGrad = ctx.createRadialGradient(center.sx, center.sy, 2, center.sx, center.sy, padRadius);
      padGrad.addColorStop(0, isDark ? "#247a62" : "#38a383");
      padGrad.addColorStop(1, isDark ? "#14483a" : "#1f6b54");
      ctx.fillStyle = padGrad;
      ctx.strokeStyle = isDark ? "#2e9175" : "#1b5a47";
      ctx.lineWidth = 1.6;
      ctx.fill();
      ctx.stroke();

      // Dew drop on pad
      ctx.beginPath();
      ctx.arc(center.sx + padRadius * 0.28, center.sy - padRadius * 0.22, padRadius * 0.13, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fill();

      // Blooming Lotus Flower
      if (pad.flower) {
        const flowerR = padRadius * 0.9;
        const petals = 7;
        for (let p = 0; p < petals; p++) {
          const pAngle = (p / petals) * Math.PI * 2;
          ctx.save();
          ctx.translate(center.sx, center.sy);
          ctx.rotate(pAngle);
          ctx.beginPath();
          ctx.ellipse(0, -flowerR * 0.42, flowerR * 0.25, flowerR * 0.58, 0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 203, 215, 0.96)";
          ctx.fill();
          ctx.restore();
        }
        // Golden flower center
        ctx.beginPath();
        ctx.arc(center.sx, center.sy, flowerR * 0.26, 0, Math.PI * 2);
        ctx.fillStyle = "#ffd166";
        ctx.fill();
      }
    });

    // 7. Food Crumbs (Golden Pellets / Floating Lotus Petals)
    foodCrumbs.forEach((crumb) => {
      const p = project(crumb.x, crumb.y, crumb.z);
      if (!p.visible) return;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, 4.2 * p.scale, 0, Math.PI * 2);
      ctx.fillStyle = "#ffd166";
      ctx.shadowColor = "#fca311";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 7b. Water Splash Droplets
    splashDroplets.forEach((drop) => {
      const p = project(drop.x, drop.y, drop.z);
      if (!p.visible) return;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, Math.max(1.4, 2.6 * p.scale), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.shadowColor = "#8ecae6";
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 8. Draw 3D Articulated Swimming Koi Fish (sorted by depth)
    const sortedKoi = [...koiFishList].sort((a, b) => {
      const pa = project(a.x, 0, a.z);
      const pb = project(b.x, 0, b.z);
      return pb.depth - pa.depth;
    });

    sortedKoi.forEach((koi) => {
      draw3DKoi(koi);
    });

    // 9. Lake water surface remains serene and completely open
  }

  function draw3DKoi(koi) {
    const headPt = project(koi.spine[0].x, 0, koi.spine[0].z);
    if (!headPt.visible) return;

    if (koi.pattern === "turtle") {
      draw3DTurtle(koi, headPt);
      return;
    }

    const spriteFilter = koi.pattern === "yamabuki"
      ? "sepia(.75) saturate(1.35) hue-rotate(350deg) brightness(1.05)"
      : koi.pattern === "showa"
        ? "saturate(.55) contrast(1.16) brightness(.9)"
        : "none";
    if (drawStorybookSprite("koi", headPt, {
      width: 54 * koi.size,
      anchorY: 0.52,
      rotation: koi.heading + camera.rotY - 0.7,
      phase: koi.phase,
      bob: 1.2,
      shadowColor: "rgba(2, 35, 43, .3)",
      filter: spriteFilter,
      glow: koi.isReleased && Date.now() - koi.bornAt < 6000 ? "rgba(255, 216, 111, .32)" : null
    })) return;

    const isDark = document.body.classList.contains("dark");

    // 0. Drop Shadow onto pond bed
    const shadowCenter = project(koi.x + 8, -8, koi.z + 10);
    if (shadowCenter.visible) {
      ctx.save();
      ctx.translate(shadowCenter.sx, shadowCenter.sy);
      ctx.rotate(koi.heading);
      ctx.beginPath();
      ctx.ellipse(0, 0, 19 * shadowCenter.scale * koi.size, 7 * shadowCenter.scale * koi.size, 0, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "rgba(2, 10, 12, 0.45)" : "rgba(10, 35, 38, 0.35)";
      ctx.fill();
      ctx.restore();
    }

    // Body segments width profile
    const widths = [6.8, 8.2, 7.5, 5.8, 3.8, 2.0];

    // Colors according to Nishikigoi pattern
    let bodyColor = "#fdf0d5";
    let markColor = "#e63946";
    let finColor = "rgba(255, 255, 255, 0.75)";

    if (koi.pattern === "yamabuki") {
      bodyColor = "#ffd166";
      markColor = "#f77f00";
      finColor = "rgba(255, 243, 176, 0.85)";
    } else if (koi.pattern === "showa") {
      bodyColor = "#ffffff";
      markColor = "#1a1410";
      finColor = "rgba(240, 240, 240, 0.7)";
    }

    // Connect segments to form smooth tapered fish body
    const leftPoints = [];
    const rightPoints = [];

    for (let i = 0; i < koi.spine.length; i++) {
      const cur = koi.spine[i];
      const next = koi.spine[Math.min(i + 1, koi.spine.length - 1)];
      const prev = koi.spine[Math.max(0, i - 1)];

      const angle = Math.atan2(next.z - prev.z, next.x - prev.x);
      const perp = angle + Math.PI / 2;
      const w = widths[i] * koi.size;

      const lx = cur.x + Math.cos(perp) * w;
      const lz = cur.z + Math.sin(perp) * w;
      const rx = cur.x - Math.cos(perp) * w;
      const rz = cur.z - Math.sin(perp) * w;

      leftPoints.push(project(lx, 0, lz));
      rightPoints.push(project(rx, 0, rz));
    }

    // Render Fish Body Polygon
    ctx.beginPath();
    ctx.moveTo(leftPoints[0].sx, leftPoints[0].sy);
    for (let i = 1; i < leftPoints.length; i++) {
      ctx.lineTo(leftPoints[i].sx, leftPoints[i].sy);
    }
    for (let i = rightPoints.length - 1; i >= 0; i--) {
      ctx.lineTo(rightPoints[i].sx, rightPoints[i].sy);
    }
    ctx.closePath();

    ctx.fillStyle = bodyColor;
    ctx.fill();

    // Red / Gold Pattern Marks on Back
    const markPt = project(koi.spine[1].x, 0.5, koi.spine[1].z);
    ctx.beginPath();
    ctx.arc(markPt.sx, markPt.sy, 5.2 * headPt.scale * koi.size, 0, Math.PI * 2);
    ctx.fillStyle = markColor;
    ctx.fill();

    // Round Fish Head Cap
    ctx.beginPath();
    ctx.arc(headPt.sx, headPt.sy, 6.2 * headPt.scale * koi.size, 0, Math.PI * 2);
    ctx.fillStyle = koi.pattern === "yamabuki" ? "#f6c445" : "#e63946";
    ctx.fill();

    // Tiny Eyes
    const eyeDist = 4.2 * koi.size;
    const perpHeading = koi.heading + Math.PI / 2;
    const eye1 = project(koi.x + Math.cos(perpHeading) * eyeDist, 1, koi.z + Math.sin(perpHeading) * eyeDist);
    const eye2 = project(koi.x - Math.cos(perpHeading) * eyeDist, 1, koi.z - Math.sin(perpHeading) * eyeDist);
    [eye1, eye2].forEach((ep) => {
      ctx.beginPath();
      ctx.arc(ep.sx, ep.sy, 1.4 * headPt.scale, 0, Math.PI * 2);
      ctx.fillStyle = "#1b0805";
      ctx.fill();
    });

    // Pectoral Fins (Flapping on sides)
    const finAngle = Math.sin(koi.phase * 1.5) * 0.35;
    const fin1 = project(
      koi.spine[1].x + Math.cos(perpHeading + finAngle) * 11 * koi.size,
      0,
      koi.spine[1].z + Math.sin(perpHeading + finAngle) * 11 * koi.size
    );
    const fin2 = project(
      koi.spine[1].x - Math.cos(perpHeading - finAngle) * 11 * koi.size,
      0,
      koi.spine[1].z - Math.sin(perpHeading - finAngle) * 11 * koi.size
    );

    [fin1, fin2].forEach((fp) => {
      ctx.beginPath();
      ctx.arc(fp.sx, fp.sy, 4.5 * headPt.scale * koi.size, 0, Math.PI * 2);
      ctx.fillStyle = finColor;
      ctx.fill();
    });

    // Swaying Caudal Tail Fin
    const tailTip = koi.spine[koi.spine.length - 1];
    const tailPt = project(tailTip.x, 0, tailTip.z);
    const tailAngle = koi.heading + Math.sin(koi.phase - 3.8) * 0.6 + Math.PI;
    const finTip1 = project(
      tailTip.x + Math.cos(tailAngle - 0.45) * 12 * koi.size,
      0,
      tailTip.z + Math.sin(tailAngle - 0.45) * 12 * koi.size
    );
    const finTip2 = project(
      tailTip.x + Math.cos(tailAngle + 0.45) * 12 * koi.size,
      0,
      tailTip.z + Math.sin(tailAngle + 0.45) * 12 * koi.size
    );

    ctx.beginPath();
    ctx.moveTo(tailPt.sx, tailPt.sy);
    ctx.lineTo(finTip1.sx, finTip1.sy);
    ctx.lineTo(tailPt.sx, tailPt.sy);
    ctx.lineTo(finTip2.sx, finTip2.sy);
    ctx.strokeStyle = markColor;
    ctx.lineWidth = 2.8 * headPt.scale * koi.size;
    ctx.stroke();

    // Golden release aura for fish freed by player
    if (koi.isReleased && Date.now() - koi.bornAt < 6000) {
      ctx.beginPath();
      ctx.arc(headPt.sx, headPt.sy, 16 * headPt.scale, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 215, 0, 0.55)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function drawDistantShore() {
    const isDark = document.body.classList.contains("dark");
    // Soft distant lakeshore embankment at z = -180 to -240
    const s0 = project(-320, 4, -240);
    const s1 = project(320, 4, -240);
    const s2 = project(320, 0, -175);
    const s3 = project(-320, 0, -175);
    if (!s0.visible && !s1.visible) return;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(s0.sx, s0.sy);
    ctx.lineTo(s1.sx, s1.sy);
    ctx.lineTo(s2.sx, s2.sy);
    ctx.lineTo(s3.sx, s3.sy);
    ctx.closePath();
    const bankGrad = ctx.createLinearGradient(0, s0.sy, 0, s2.sy);
    bankGrad.addColorStop(0, isDark ? "#081b19" : "#1b3f36");
    bankGrad.addColorStop(0.5, isDark ? "#061513" : "#14332b");
    bankGrad.addColorStop(1, isDark ? "#04100f" : "#0d2620");
    ctx.fillStyle = bankGrad;
    ctx.fill();

    // Embankment shoreline stones
    [-200, -130, -60, 20, 95, 170, 230].forEach((sx, idx) => {
      const sp = project(sx, 1, -176);
      if (sp.visible) {
        ctx.beginPath();
        ctx.ellipse(sp.sx, sp.sy, (14 + (idx % 3) * 5) * sp.scale, 7 * sp.scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "#172b27" : "#2f4f46";
        ctx.fill();
        ctx.strokeStyle = isDark ? "#0f1c1a" : "#203630";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Subtle distant bamboo reed stalks along the far bank
    ctx.strokeStyle = isDark ? "rgba(112, 214, 176, 0.35)" : "rgba(35, 130, 100, 0.45)";
    ctx.lineWidth = 1.3;
    for (let rx = -260; rx <= 260; rx += 22) {
      const sway = Math.sin(waterTime * 1.6 + rx * 0.12) * 4;
      const bBase = project(rx, 2, -180);
      const bTop = project(rx + sway, 28, -185);
      if (bBase.visible && bTop.visible) {
        ctx.beginPath();
        ctx.moveTo(bBase.sx, bBase.sy);
        ctx.lineTo(bTop.sx, bTop.sy);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function draw3DTurtle(koi, headPt) {
    const centerPt = project(koi.x, 1, koi.z);
    if (!centerPt.visible) return;

    const scale = headPt.scale * (koi.size || 1.0);
    const heading = koi.heading;
    const isDark = document.body.classList.contains("dark");

    // 0. Drop Shadow onto pond bed
    const shadowPt = project(koi.x + 8, -8, koi.z + 10);
    if (shadowPt.visible) {
      ctx.save();
      ctx.translate(shadowPt.sx, shadowPt.sy);
      ctx.rotate(koi.heading);
      ctx.beginPath();
      ctx.ellipse(0, 0, 17 * shadowPt.scale * (koi.size || 1), 12 * shadowPt.scale * (koi.size || 1), 0, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "rgba(2, 10, 12, 0.45)" : "rgba(10, 35, 38, 0.35)";
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.translate(centerPt.sx, centerPt.sy);
    ctx.rotate(heading);

    // 1. Oval Shell Carapace with Gold Border
    ctx.beginPath();
    ctx.ellipse(0, 0, 16 * scale, 12 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1e4d3a";
    ctx.strokeStyle = "#e5b869";
    ctx.lineWidth = 2 * scale;
    ctx.fill();
    ctx.stroke();

    // Hexagonal shell plates
    ctx.strokeStyle = "rgba(229, 184, 105, 0.45)";
    ctx.lineWidth = 1.2 * scale;
    [-6, 0, 6].forEach((ox) => {
      ctx.beginPath();
      ctx.ellipse(ox * scale, 0, 3.8 * scale, 3.2 * scale, 0, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 2. Head & Neck
    ctx.beginPath();
    ctx.arc(19 * scale, 0, 4.2 * scale, 0, Math.PI * 2);
    ctx.fillStyle = "#2d6a4f";
    ctx.fill();

    // Eyes
    ctx.fillStyle = "#1b0805";
    ctx.beginPath();
    ctx.arc(20 * scale, -2.5 * scale, 1 * scale, 0, Math.PI * 2);
    ctx.arc(20 * scale, 2.5 * scale, 1 * scale, 0, Math.PI * 2);
    ctx.fill();

    // 3. Four Swimming Paddle Flippers (animated flapping)
    const flap = Math.sin(koi.phase * 1.6) * 0.35;
    [
      { x: 9 * scale, y: -13 * scale, angle: -0.6 + flap },
      { x: 9 * scale, y: 13 * scale, angle: 0.6 - flap },
      { x: -11 * scale, y: -10 * scale, angle: -1.8 - flap * 0.5 },
      { x: -11 * scale, y: 10 * scale, angle: 1.8 + flap * 0.5 }
    ].forEach((f) => {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, 6.5 * scale, 3 * scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#2d6a4f";
      ctx.fill();
      ctx.restore();
    });

    // 4. Little Tail
    ctx.beginPath();
    ctx.moveTo(-16 * scale, 0);
    ctx.lineTo(-21 * scale, 0);
    ctx.strokeStyle = "#2d6a4f";
    ctx.lineWidth = 2.5 * scale;
    ctx.stroke();

    ctx.restore();

    // Golden release blessing aura
    if (koi.isReleased && Date.now() - koi.bornAt < 6000) {
      ctx.beginPath();
      ctx.arc(centerPt.sx, centerPt.sy, 22 * scale, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 215, 0, 0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // ---------------------------------------------------------------------------
  // Scenario 2: Toronto Crosswalk (3D Pedestrian Street)
  // ---------------------------------------------------------------------------
  function initTorontoCrosswalk() {
    trafficLight = { state: "red", timer: 0 };
    elderPedestrian = { x: -90, z: 0, progress: 0, walking: false, frame: 0 };
    crosswalkCars = [
      { x: -160, z: -55, vx: 2.2, color: "#d90429", stopped: false },
      { x: 140, z: 55, vx: -2.0, color: "#2b2d42", stopped: false }
    ];
    crosswalkShields = [
      { x: -45, z: 0, collected: false },
      { x: 0, z: 0, collected: false },
      { x: 45, z: 0, collected: false }
    ];
  }

  function updateTorontoCrosswalk(dt) {
    trafficLight.timer += dt;
    if (trafficLight.state === "red" && trafficLight.timer > 8) {
      trafficLight.state = "green";
      trafficLight.timer = 0;
    } else if (trafficLight.state === "green" && trafficLight.timer > 7) {
      trafficLight.state = "red";
      trafficLight.timer = 0;
    }

    // Car kinematics
    crosswalkCars.forEach((car) => {
      const distToStopLine = Math.abs(car.x);
      const shouldStop = trafficLight.state === "green" && distToStopLine < 70 && distToStopLine > 15;
      car.stopped = shouldStop;

      if (!car.stopped) {
        car.x += car.vx;
        if (car.vx > 0 && car.x > 180) car.x = -180;
        if (car.vx < 0 && car.x < -180) car.x = 180;
      }
    });

    // Pedestrian escort walking
    if (elderPedestrian.walking) {
      elderPedestrian.frame += dt * 5;
      elderPedestrian.x += 0.85;

      // Collect kindness shields
      crosswalkShields.forEach((shield) => {
        if (!shield.collected && Math.abs(elderPedestrian.x - shield.x) < 14) {
          shield.collected = true;
          spawnFloatingMerit3D(shield.x, 15, 0, "Kindness Shield · 善护念");
          progressState["toronto-crosswalk"].score += 10;
          updateHUD();
        }
      });

      if (elderPedestrian.x >= 90) {
        elderPedestrian.x = 90;
        elderPedestrian.walking = false;
        progressState["toronto-crosswalk"].count += 1;
        spawnFloatingMerit3D(90, 25, 0, "Safe Crossing Achieved · 功德圆满");
        awardKarma(10, "Escorted elder safely across crosswalk");
        updateHUD();
      }
    }
  }

  function drawTorontoCrosswalk() {
    const isDark = document.body.classList.contains("dark");

    drawStorybookBackdrop(
      "toronto-crosswalk",
      isDark ? "#263849" : "#d6d6cf",
      isDark ? "#121a24" : "#8b6544",
      isDark ? "rgba(10, 18, 28, 0.42)" : "rgba(255, 245, 226, 0.06)"
    );

    // 0. Distant Toronto Skyline Silhouette (CN Tower & Financial District)
    ctx.save();
    const towers = [
      { x: -280, w: 45, h: 70 },
      { x: -210, w: 35, h: 90 },
      { x: -150, w: 50, h: 110 },
      { x: -80, w: 40, h: 80 },
      { x: 30, w: 14, h: 180, isCNTower: true },
      { x: 80, w: 45, h: 125 },
      { x: 150, w: 50, h: 95 },
      { x: 230, w: 40, h: 75 }
    ];
    towers.forEach((tw) => {
      const b0 = project(tw.x - tw.w / 2, 0, -290);
      const b1 = project(tw.x + tw.w / 2, 0, -290);
      const t0 = project(tw.x - tw.w / 2, tw.h, -290);
      const t1 = project(tw.x + tw.w / 2, tw.h, -290);
      if (!b0.visible && !b1.visible) return;

      if (tw.isCNTower) {
        // CN Tower needle spire
        const tip = project(tw.x, tw.h + 50, -290);
        const pod = project(tw.x, tw.h, -290);
        if (tip.visible && pod.visible) {
          ctx.beginPath();
          ctx.moveTo(b0.sx + (b1.sx - b0.sx) * 0.35, b0.sy);
          ctx.lineTo(tip.sx, tip.sy);
          ctx.lineTo(b0.sx + (b1.sx - b0.sx) * 0.65, b0.sy);
          ctx.fillStyle = isDark ? "#121b24" : "#4a5568";
          ctx.fill();
          // Observation pod
          ctx.beginPath();
          ctx.ellipse(pod.sx, pod.sy, 16 * pod.scale, 8 * pod.scale, 0, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? "#1e293b" : "#64748b";
          ctx.fill();
          // Flashing red beacon
          const beaconAlpha = Math.sin(waterTime * 4) > 0 ? 1 : 0.2;
          ctx.beginPath();
          ctx.arc(tip.sx, tip.sy, 3 * tip.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239, 68, 68, ${beaconAlpha})`;
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      } else {
        // Office Tower
        ctx.beginPath();
        ctx.moveTo(b0.sx, b0.sy);
        ctx.lineTo(b1.sx, b1.sy);
        ctx.lineTo(t1.sx, t1.sy);
        ctx.lineTo(t0.sx, t0.sy);
        ctx.closePath();
        ctx.fillStyle = isDark ? "#0f172a" : "#334155";
        ctx.fill();

        // Glowing office window grid
        const winCols = 3;
        const winRows = 6;
        for (let r = 0; r < winRows; r++) {
          for (let c = 0; c < winCols; c++) {
            const wx = tw.x - tw.w * 0.35 + c * (tw.w * 0.35);
            const wy = 12 + r * 14;
            const wp = project(wx, wy, -289);
            if (wp.visible && (Math.sin(tw.x + r * 13 + c * 7) > -0.2)) {
              ctx.fillStyle = (r + c) % 2 === 0 ? "rgba(253, 224, 71, 0.45)" : "rgba(147, 197, 253, 0.35)";
              ctx.fillRect(wp.sx - 1.5 * wp.scale, wp.sy - 2 * wp.scale, 3 * wp.scale, 4 * wp.scale);
            }
          }
        }
      }
    });
    ctx.restore();

    // Full Ground Urban Pavement Base (from horizon down to canvas bottom)
    const groundGrad = ctx.createLinearGradient(0, height * 0.4, 0, height);
    groundGrad.addColorStop(0, isDark ? "rgba(30, 41, 59, 0.36)" : "rgba(71, 85, 105, 0.12)");
    groundGrad.addColorStop(1, isDark ? "rgba(15, 23, 42, 0.48)" : "rgba(30, 41, 59, 0.2)");
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, height * 0.42, width, height * 0.58);

    // 1. Continuous Ground Plane: Sidewalks & Road spanning edge to edge
    // North Sidewalk (z = -280 to -80)
    const ns0 = project(-1400, 4, -280);
    const ns1 = project(1400, 4, -280);
    const ns2 = project(1400, 4, -80);
    const ns3 = project(-1400, 4, -80);
    if (ns0.visible || ns2.visible || ns1.visible || ns3.visible) {
      ctx.beginPath();
      ctx.moveTo(ns0.sx, ns0.sy);
      ctx.lineTo(ns1.sx, ns1.sy);
      ctx.lineTo(ns2.sx, ns2.sy);
      ctx.lineTo(ns3.sx, ns3.sy);
      ctx.closePath();
      ctx.fillStyle = isDark ? "rgba(30, 41, 59, 0.42)" : "rgba(100, 116, 139, 0.18)";
      ctx.fill();
    }

    // South Sidewalk (z = 80 to 600)
    const ss0 = project(-1400, 4, 80);
    const ss1 = project(1400, 4, 80);
    const ss2 = project(1400, 4, 600);
    const ss3 = project(-1400, 4, 600);
    if (ss0.visible || ss2.visible || ss1.visible || ss3.visible) {
      ctx.beginPath();
      ctx.moveTo(ss0.sx, ss0.sy);
      ctx.lineTo(ss1.sx, ss1.sy);
      ctx.lineTo(ss2.sx, ss2.sy);
      ctx.lineTo(ss3.sx, ss3.sy);
      ctx.closePath();
      ctx.fillStyle = isDark ? "rgba(30, 41, 59, 0.42)" : "rgba(100, 116, 139, 0.18)";
      ctx.fill();
    }

    // Asphalt Road Plane (z = -80 to 80)
    const r0 = project(-1400, 0, -80);
    const r1 = project(1400, 0, -80);
    const r2 = project(1400, 0, 80);
    const r3 = project(-1400, 0, 80);
    ctx.beginPath();
    ctx.moveTo(r0.sx, r0.sy);
    ctx.lineTo(r1.sx, r1.sy);
    ctx.lineTo(r2.sx, r2.sy);
    ctx.lineTo(r3.sx, r3.sy);
    ctx.closePath();
    ctx.fillStyle = isDark ? "rgba(15, 23, 42, 0.62)" : "rgba(31, 41, 55, 0.46)";
    ctx.fill();

    // Sidewalk curb bevels
    [-80, 80].forEach((cz) => {
      const c0 = project(-1400, 4.5, cz);
      const c1 = project(1400, 4.5, cz);
      if (c0.visible || c1.visible) {
        ctx.beginPath();
        ctx.moveTo(c0.sx, c0.sy);
        ctx.lineTo(c1.sx, c1.sy);
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }
    });

    // Warm street lamps on sidewalk curb casting radial illumination pools
    [-150, -50, 50, 150].forEach((lx) => {
      [-88, 88].forEach((lz) => {
        const lBase = project(lx, 4, lz);
        const lHead = project(lx, 36, lz);
        if (lBase.visible && lHead.visible) {
          // Warm pool on pavement
          const poolGrad = ctx.createRadialGradient(lBase.sx, lBase.sy, 2, lBase.sx, lBase.sy, 32 * lBase.scale);
          poolGrad.addColorStop(0, "rgba(254, 240, 138, 0.28)");
          poolGrad.addColorStop(1, "rgba(254, 240, 138, 0)");
          ctx.fillStyle = poolGrad;
          ctx.beginPath();
          ctx.arc(lBase.sx, lBase.sy, 32 * lBase.scale, 0, Math.PI * 2);
          ctx.fill();

          // Lamp post
          ctx.beginPath();
          ctx.moveTo(lBase.sx, lBase.sy);
          ctx.lineTo(lHead.sx, lHead.sy);
          ctx.strokeStyle = "#475569";
          ctx.lineWidth = 2.5 * lHead.scale;
          ctx.stroke();

          // Glowing lantern fixture
          ctx.beginPath();
          ctx.arc(lHead.sx, lHead.sy, 4 * lHead.scale, 0, Math.PI * 2);
          ctx.fillStyle = "#fef08a";
          ctx.shadowColor = "#facc15";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
    });

    // Double Solid Yellow Center Line
    [-2, 2].forEach((offsetZ) => {
      const y0 = project(-1400, 0.4, offsetZ);
      const y1 = project(1400, 0.4, offsetZ);
      ctx.beginPath();
      ctx.moveTo(y0.sx, y0.sy);
      ctx.lineTo(y1.sx, y1.sy);
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = 1.8;
      ctx.stroke();
    });

    // 2. White Zebra Crossing Stripes
    for (let s = -80; s <= 80; s += 20) {
      const z0 = project(s - 6, 0.6, -38);
      const z1 = project(s + 6, 0.6, -38);
      const z2 = project(s + 6, 0.6, 38);
      const z3 = project(s - 6, 0.6, 38);

      ctx.beginPath();
      ctx.moveTo(z0.sx, z0.sy);
      ctx.lineTo(z1.sx, z1.sy);
      ctx.lineTo(z2.sx, z2.sy);
      ctx.lineTo(z3.sx, z3.sy);
      ctx.closePath();
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }

    // Stop lines painted before crosswalk
    [-75, 75].forEach((sx) => {
      const st0 = project(sx, 0.5, sx > 0 ? 5 : -45);
      const st1 = project(sx, 0.5, sx > 0 ? 45 : -5);
      ctx.beginPath();
      ctx.moveTo(st0.sx, st0.sy);
      ctx.lineTo(st1.sx, st1.sy);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3.5;
      ctx.stroke();
    });

    // 4. Cars in 3D
    crosswalkCars.forEach((car) => {
      const cp = project(car.x, 6, car.z);
      if (!cp.visible) return;
      const carW = 28 * cp.scale;
      const carH = 14 * cp.scale;

      ctx.fillStyle = car.color;
      ctx.fillRect(cp.sx - carW / 2, cp.sy - carH, carW, carH);

      // Windows
      ctx.fillStyle = "#e0fbfc";
      ctx.fillRect(cp.sx - carW * 0.35, cp.sy - carH * 0.9, carW * 0.7, carH * 0.45);

      // Headlights / Brake lights
      ctx.fillStyle = car.stopped ? "#ff0054" : "#ffd166";
      ctx.beginPath();
      ctx.arc(car.vx > 0 ? cp.sx + carW * 0.45 : cp.sx - carW * 0.45, cp.sy - carH * 0.3, 3 * cp.scale, 0, Math.PI * 2);
      ctx.fill();
    });

    // 5. Traffic Signal Post
    const lightPost = project(60, 45, -70);
    const postBase = project(60, 0, -70);
    ctx.beginPath();
    ctx.moveTo(postBase.sx, postBase.sy);
    ctx.lineTo(lightPost.sx, lightPost.sy);
    ctx.strokeStyle = "#495057";
    ctx.lineWidth = 4 * lightPost.scale;
    ctx.stroke();

    // Traffic Signal Box
    const boxW = 12 * lightPost.scale;
    const boxH = 26 * lightPost.scale;
    ctx.fillStyle = "#111";
    ctx.fillRect(lightPost.sx - boxW / 2, lightPost.sy - boxH / 2, boxW, boxH);

    // Active Lamp Glow
    ctx.beginPath();
    ctx.arc(lightPost.sx, lightPost.sy - 5 * lightPost.scale, 4 * lightPost.scale, 0, Math.PI * 2);
    ctx.fillStyle = trafficLight.state === "red" ? "#ff0054" : "#555";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(lightPost.sx, lightPost.sy + 5 * lightPost.scale, 4 * lightPost.scale, 0, Math.PI * 2);
    ctx.fillStyle = trafficLight.state === "green" ? "#06d6a0" : "#555";
    ctx.fill();

    // 6. Walking Pedestrian (Elder + Helper)
    const elderPt = project(elderPedestrian.x, 12, elderPedestrian.z);
    if (elderPt.visible) {
      const legSwing = Math.sin(elderPedestrian.frame) * 4 * elderPt.scale;

      // Elder (Warm lavender coat & walking cane)
      ctx.beginPath();
      ctx.arc(elderPt.sx - 6 * elderPt.scale, elderPt.sy - 16 * elderPt.scale, 4.5 * elderPt.scale, 0, Math.PI * 2);
      ctx.fillStyle = "#fed9b7";
      ctx.fill();

      ctx.fillStyle = "#9d4edd";
      ctx.fillRect(elderPt.sx - 10 * elderPt.scale, elderPt.sy - 11 * elderPt.scale, 8 * elderPt.scale, 14 * elderPt.scale);

      // Walking stick
      ctx.beginPath();
      ctx.moveTo(elderPt.sx - 12 * elderPt.scale, elderPt.sy - 3 * elderPt.scale);
      ctx.lineTo(elderPt.sx - 15 * elderPt.scale, elderPt.sy + 8 * elderPt.scale);
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 2 * elderPt.scale;
      ctx.stroke();

      // Companion Helper (Kind jade coat, holding hand)
      ctx.beginPath();
      ctx.arc(elderPt.sx + 6 * elderPt.scale, elderPt.sy - 18 * elderPt.scale, 4.5 * elderPt.scale, 0, Math.PI * 2);
      ctx.fillStyle = "#fed9b7";
      ctx.fill();

      ctx.fillStyle = "#2a9d8f";
      ctx.fillRect(elderPt.sx + 2 * elderPt.scale, elderPt.sy - 13 * elderPt.scale, 8 * elderPt.scale, 16 * elderPt.scale);

      // Holding hands connection
      ctx.beginPath();
      ctx.moveTo(elderPt.sx - 2 * elderPt.scale, elderPt.sy - 4 * elderPt.scale);
      ctx.lineTo(elderPt.sx + 2 * elderPt.scale, elderPt.sy - 4 * elderPt.scale);
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 7. Floating Kindness Shields along crosswalk
    crosswalkShields.forEach((shield) => {
      if (shield.collected) return;
      const sp = project(shield.x, 16 + Math.sin(waterTime * 3) * 3, shield.z);
      if (!sp.visible) return;

      ctx.beginPath();
      ctx.arc(sp.sx, sp.sy, 9 * sp.scale, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 209, 102, 0.35)";
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = 1.8;
      ctx.fill();
      ctx.stroke();

      ctx.font = `${Math.round(10 * sp.scale)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🛡️", sp.sx, sp.sy);
    });
  }

  // ---------------------------------------------------------------------------
  // Scenario 3: Amazon Rainforest (Sacred Tree Growth)
  // ---------------------------------------------------------------------------
  function initAmazonGrove() {
    sacredTrees = [
      { x: 0, z: 0, stage: 1, height: 18, targetHeight: 55, foliageR: 24, bloom: false }
    ];
    rainDroplets = [];
    butterflies = [
      { x: -20, y: 30, z: -10, angle: 0 },
      { x: 25, y: 35, z: 15, angle: 1.8 }
    ];
  }

  function updateAmazonGrove(dt) {
    // Tree growth interpolation
    sacredTrees.forEach((tree) => {
      if (tree.height < tree.targetHeight) {
        tree.height += dt * 4;
        tree.foliageR = Math.min(38, tree.height * 0.65);
        if (tree.height >= 50 && !tree.bloom) {
          tree.bloom = true;
          progressState["amazon-grove"].count += 1;
          spawnFloatingMerit3D(tree.x, tree.height + 15, tree.z, "Sacred Tree Flourishes · 万木春生");
          awardKarma(10, "Nourished sacred rainforest tree to full bloom");
          updateHUD();
        }
      }
    });

    // Rain droplets
    for (let i = rainDroplets.length - 1; i >= 0; i--) {
      const drop = rainDroplets[i];
      drop.y -= 3.5;
      if (drop.y <= 0) {
        rainDroplets.splice(i, 1);
        addWaterRipple(drop.x, drop.z, 14, 0.4);
      }
    }

    // Fluttering butterflies
    butterflies.forEach((b) => {
      b.angle += dt * 3;
      b.x += Math.cos(b.angle) * 0.8;
      b.z += Math.sin(b.angle) * 0.8;
      b.y = 28 + Math.sin(b.angle * 2) * 6;
    });
  }

  function drawAmazonGrove() {
    const isDark = document.body.classList.contains("dark");

    drawStorybookBackdrop(
      "amazon-grove",
      isDark ? "#153929" : "#79a66e",
      isDark ? "#07150e" : "#274f37",
      isDark ? "rgba(3, 17, 10, 0.4)" : "rgba(25, 86, 52, 0.08)"
    );

    // 1. Transparent jungle atmosphere keeps the restoration clearing visible.
    const groveGrad = ctx.createRadialGradient(width / 2, height * 0.45, 30, width / 2, height * 0.45, Math.max(width, height) * 0.85);
    groveGrad.addColorStop(0, isDark ? "rgba(23, 67, 47, 0.18)" : "rgba(218, 244, 187, 0.04)");
    groveGrad.addColorStop(0.5, isDark ? "rgba(13, 44, 30, 0.25)" : "rgba(27, 67, 50, 0.08)");
    groveGrad.addColorStop(1, isDark ? "rgba(5, 22, 14, 0.4)" : "rgba(8, 28, 21, 0.16)");
    ctx.fillStyle = groveGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Diagonal Volumetric Sunbeams / God Rays
    ctx.save();
    const beamGrad = ctx.createLinearGradient(0, 0, width * 0.7, height);
    beamGrad.addColorStop(0, isDark ? "rgba(255, 235, 170, 0.12)" : "rgba(255, 245, 200, 0.22)");
    beamGrad.addColorStop(0.6, isDark ? "rgba(255, 235, 170, 0.04)" : "rgba(255, 245, 200, 0.08)");
    beamGrad.addColorStop(1, "rgba(255, 245, 200, 0)");
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width * 0.45, 0);
    ctx.lineTo(width, height);
    ctx.lineTo(width * 0.3, height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 3. Distant Rainforest Canopy Silhouettes & Expansive Forest Floor
    // Distant background canopy layer (z = -260)
    ctx.save();
    for (let tx = -280; tx <= 280; tx += 45) {
      const dp = project(tx, 32 + (Math.sin(tx * 0.1) * 12), -260);
      if (dp.visible) {
        ctx.beginPath();
        ctx.arc(dp.sx, dp.sy, 32 * dp.scale, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "rgba(9, 32, 23, 0.2)" : "rgba(20, 65, 48, 0.1)";
        ctx.fill();
      }
    }

    // Expansive Rainforest Floor Terrace (edge to edge)
    const gf0 = project(-1600, 0, -280);
    const gf1 = project(1600, 0, -280);
    const gf2 = project(1600, 0, 700);
    const gf3 = project(-1600, 0, 700);
    if (gf0.visible || gf2.visible || gf1.visible || gf3.visible) {
      ctx.beginPath();
      ctx.moveTo(gf0.sx, gf0.sy);
      ctx.lineTo(gf1.sx, gf1.sy);
      ctx.lineTo(gf2.sx, gf2.sy);
      ctx.lineTo(gf3.sx, gf3.sy);
      ctx.closePath();
      const floorGrad = ctx.createLinearGradient(0, gf0.sy, 0, gf2.sy);
      floorGrad.addColorStop(0, isDark ? "rgba(13, 40, 30, 0.34)" : "rgba(26, 77, 59, 0.08)");
      floorGrad.addColorStop(0.5, isDark ? "rgba(8, 28, 21, 0.28)" : "rgba(20, 61, 47, 0.06)");
      floorGrad.addColorStop(1, isDark ? "rgba(4, 16, 12, 0.42)" : "rgba(14, 41, 32, 0.12)");
      ctx.fillStyle = floorGrad;
      ctx.fill();
    }

    // Organic Moss Garden Stepping Stones through the grove
    const steppingStones = [
      { x: -55, z: 75, r: 16 },
      { x: -25, z: 45, r: 19 },
      { x: 5, z: 20, r: 22 },
      { x: -10, z: -15, r: 18 },
      { x: 25, z: -40, r: 20 },
      { x: -20, z: -70, r: 17 }
    ];
    steppingStones.forEach((st) => {
      const sp = project(st.x, 1, st.z);
      if (sp.visible) {
        ctx.beginPath();
        ctx.ellipse(sp.sx, sp.sy, st.r * sp.scale, st.r * 0.7 * sp.scale, 0.15, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "rgba(31, 59, 50, 0.48)" : "rgba(59, 110, 91, 0.35)";
        ctx.fill();
        ctx.strokeStyle = isDark ? "#142822" : "#2a5243";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    });

    // Tropical Fern Leaves in foreground and edges
    [-110, -70, 75, 120].forEach((fx) => {
      const fp = project(fx, 2, 25);
      if (fp.visible) {
        ctx.font = `${Math.round(20 * fp.scale)}px sans-serif`;
        ctx.fillText("🌿", fp.sx, fp.sy);
      }
    });
    ctx.restore();

    // 4. Sacred Bodhi Trees in 3D with Roots & Shadow
    sacredTrees.forEach((tree) => {
      const base = project(tree.x, 0, tree.z);
      const top = project(tree.x, tree.height, tree.z);
      if (!base.visible && !top.visible) return;

      // Tree Trunk Drop Shadow
      ctx.beginPath();
      ctx.ellipse(base.sx + 10, base.sy + 6, tree.foliageR * 0.8 * base.scale, tree.foliageR * 0.35 * base.scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 20, 10, 0.35)";
      ctx.fill();

      // Twisted Wooden Trunk with Roots
      ctx.beginPath();
      ctx.moveTo(base.sx - 8 * base.scale, base.sy);
      ctx.lineTo(top.sx - 4 * top.scale, top.sy);
      ctx.lineTo(top.sx + 4 * top.scale, top.sy);
      ctx.lineTo(base.sx + 8 * base.scale, base.sy);
      ctx.closePath();
      ctx.fillStyle = isDark ? "#4d290c" : "#75451e";
      ctx.fill();

      // Canopy Foliage Spheres
      const folR = tree.foliageR * top.scale;
      const canopyClusters = [
        { ox: 0, oy: 0, r: folR, angle: 0.08 },
        { ox: -folR * 0.48, oy: folR * 0.22, r: folR * 0.78, angle: -0.55 },
        { ox: folR * 0.48, oy: folR * 0.22, r: folR * 0.78, angle: 0.55 },
        { ox: 0, oy: -folR * 0.3, r: folR * 0.65, angle: -0.12 }
      ];

      canopyClusters.forEach((c) => {
        ctx.beginPath();
        ctx.ellipse(top.sx + c.ox, top.sy - c.oy, c.r * 0.58, c.r, c.angle, 0, Math.PI * 2);
        const canGrad = ctx.createRadialGradient(top.sx + c.ox, top.sy - c.oy, 2, top.sx + c.ox, top.sy - c.oy, c.r);
        canGrad.addColorStop(0, isDark ? "#388e6e" : "#70cca0");
        canGrad.addColorStop(1, isDark ? "#1d533d" : "#2d7a5b");
        ctx.fillStyle = canGrad;
        ctx.fill();
      });

      // Golden Bodhi Fruits / Orchid Blossom radiance
      if (tree.bloom) {
        for (let b = 0; b < 8; b++) {
          const bAngle = (b / 8) * Math.PI * 2;
          const bx = top.sx + Math.cos(bAngle) * folR * 0.7;
          const by = top.sy - folR * 0.15 + Math.sin(bAngle) * folR * 0.5;
          ctx.beginPath();
          ctx.arc(bx, by, 4 * top.scale, 0, Math.PI * 2);
          ctx.fillStyle = "#ffd166";
          ctx.shadowColor = "#ffb703";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    });

    // 5. Falling Tropical Rain Droplets
    ctx.strokeStyle = "rgba(180, 225, 255, 0.8)";
    ctx.lineWidth = 1.6;
    rainDroplets.forEach((drop) => {
      const p1 = project(drop.x, drop.y, drop.z);
      const p2 = project(drop.x - 2, drop.y - 10, drop.z);
      if (p1.visible && p2.visible) {
        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.stroke();
      }
    });

    // 6. Fluttering 3D Morpho Butterflies
    butterflies.forEach((b) => {
      const bp = project(b.x, b.y, b.z);
      if (bp.visible) {
        ctx.font = `${Math.round(15 * bp.scale)}px sans-serif`;
        ctx.fillText("🦋", bp.sx, bp.sy);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Scenario 4: Kyoto Night River (Floating Wish Lanterns)
  // ---------------------------------------------------------------------------
  function initKyotoLanterns() {
    riverLanterns = [];
    spawnRiverLantern(0, -60, "Peace · 平安");
    spawnRiverLantern(25, -20, "Health · 康宁");
  }

  function spawnRiverLantern(x, z, wish = "Peace · 平安") {
    riverLanterns.push({
      x,
      y: 0,
      z,
      vz: 0.55 + Math.random() * 0.35,
      driftX: (Math.random() - 0.5) * 0.2,
      flamePhase: Math.random() * Math.PI * 2,
      wish
    });
  }

  function updateKyotoLanterns(dt) {
    riverWaterOffset += dt * 0.8;

    riverLanterns.forEach((lantern) => {
      lantern.flamePhase += dt * 8;
      lantern.z += lantern.vz;
      lantern.x += Math.sin(lantern.z * 0.05) * 0.35;

      if (lantern.z > 240) {
        lantern.z = -220;
        lantern.x = (Math.random() - 0.5) * 40;
      }
    });
  }

  function drawKyotoLanterns() {
    const isDark = document.body.classList.contains("dark");

    drawStorybookBackdrop(
      "night-corridor",
      "#16304b",
      "#050c18",
      isDark ? "rgba(2, 7, 16, 0.42)" : "rgba(4, 16, 31, 0.2)"
    );

    // 1. Transparent night glaze preserves the Kyoto river and old town.
    const riverGrad = ctx.createLinearGradient(0, 0, 0, height);
    riverGrad.addColorStop(0, "rgba(8, 27, 46, 0.12)");
    riverGrad.addColorStop(0.6, "rgba(4, 16, 30, 0.18)");
    riverGrad.addColorStop(1, "rgba(2, 7, 16, 0.34)");
    ctx.fillStyle = riverGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Stone Riverbanks & Bamboo Groves on Left and Right
    [-1, 1].forEach((side) => {
      const bx0 = side * 80;
      const bx1 = side * 1400;
      const b0 = project(bx0, 4, -220);
      const b1 = project(bx1, 4, -220);
      const b2 = project(bx1, 4, 240);
      const b3 = project(bx0, 4, 240);

      ctx.beginPath();
      ctx.moveTo(b0.sx, b0.sy);
      ctx.lineTo(b1.sx, b1.sy);
      ctx.lineTo(b2.sx, b2.sy);
      ctx.lineTo(b3.sx, b3.sy);
      ctx.closePath();
      ctx.fillStyle = isDark ? "rgba(13, 27, 30, 0.24)" : "rgba(26, 44, 48, 0.13)";
      ctx.fill();

      // Stone Embankment Border
      ctx.beginPath();
      ctx.moveTo(b0.sx, b0.sy);
      ctx.lineTo(b3.sx, b3.sy);
      ctx.strokeStyle = "#4a6268";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Traditional Japanese Stone Lantern (Tōrō) on each bank
      const tPos = project(side * 110, 16, -20);
      if (tPos.visible) {
        // Warm glow pool from lantern
        const tGlow = ctx.createRadialGradient(tPos.sx, tPos.sy, 2, tPos.sx, tPos.sy, 38 * tPos.scale);
        tGlow.addColorStop(0, "rgba(255, 190, 80, 0.55)");
        tGlow.addColorStop(1, "rgba(255, 190, 80, 0)");
        ctx.beginPath();
        ctx.arc(tPos.sx, tPos.sy, 38 * tPos.scale, 0, Math.PI * 2);
        ctx.fillStyle = tGlow;
        ctx.fill();

        // Stone roof & pillar
        ctx.fillStyle = "#6c757d";
        ctx.fillRect(tPos.sx - 7 * tPos.scale, tPos.sy - 12 * tPos.scale, 14 * tPos.scale, 4 * tPos.scale);
        ctx.fillRect(tPos.sx - 3 * tPos.scale, tPos.sy - 8 * tPos.scale, 6 * tPos.scale, 14 * tPos.scale);
        // Amber light chamber
        ctx.fillStyle = "#ffb703";
        ctx.fillRect(tPos.sx - 4 * tPos.scale, tPos.sy - 7 * tPos.scale, 8 * tPos.scale, 5 * tPos.scale);
      }
    });

    // 3. Central Flowing Night River in 3D
    const riverLen = 24;
    for (let r = 0; r < riverLen; r++) {
      const z0 = -220 + r * 19;
      const z1 = z0 + 19;
      const curveX0 = Math.sin((z0 + riverWaterOffset * 22) * 0.03) * 16;
      const curveX1 = Math.sin((z1 + riverWaterOffset * 22) * 0.03) * 16;

      const p0 = project(-80 + curveX0, 0, z0);
      const p1 = project(80 + curveX0, 0, z0);
      const p2 = project(80 + curveX1, 0, z1);
      const p3 = project(-80 + curveX1, 0, z1);

      if (!p0.visible && !p1.visible && !p2.visible && !p3.visible) continue;

      ctx.beginPath();
      ctx.moveTo(p0.sx, p0.sy);
      ctx.lineTo(p1.sx, p1.sy);
      ctx.lineTo(p2.sx, p2.sy);
      ctx.lineTo(p3.sx, p3.sy);
      ctx.closePath();

      const waveLight = Math.sin((z0 + riverWaterOffset * 30) * 0.08) > 0.4;
      ctx.fillStyle = waveLight ? "rgba(82, 151, 190, 0.12)" : "rgba(8, 30, 48, 0.1)";
      ctx.fill();
    }

    // 4. 3D Floating Lotus Lanterns (sorted by depth)
    const sortedLanterns = [...riverLanterns].sort((a, b) => {
      const pa = project(a.x, 0, a.z);
      const pb = project(b.x, 0, b.z);
      return pb.depth - pa.depth;
    });

    sortedLanterns.forEach((lantern) => {
      const lp = project(lantern.x, 3, lantern.z);
      if (!lp.visible) return;

      const lanternR = 15 * lp.scale;

      // Radial warm light reflection on water
      const glowGrad = ctx.createRadialGradient(lp.sx, lp.sy, 2, lp.sx, lp.sy, lanternR * 2.8);
      glowGrad.addColorStop(0, "rgba(255, 183, 3, 0.65)");
      glowGrad.addColorStop(0.5, "rgba(255, 183, 3, 0.2)");
      glowGrad.addColorStop(1, "rgba(255, 183, 3, 0)");
      ctx.beginPath();
      ctx.arc(lp.sx, lp.sy, lanternR * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // Lotus Flower Base Petals
      for (let p = 0; p < 8; p++) {
        const theta = (p / 8) * Math.PI * 2;
        const px = lp.sx + Math.cos(theta) * lanternR * 0.85;
        const py = lp.sy + Math.sin(theta) * lanternR * 0.45;
        ctx.beginPath();
        ctx.arc(px, py, lanternR * 0.48, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 117, 143, 0.95)";
        ctx.fill();
      }

      // Wooden candle box
      ctx.fillStyle = "#8b5e34";
      ctx.fillRect(lp.sx - lanternR * 0.35, lp.sy - lanternR * 0.45, lanternR * 0.7, lanternR * 0.5);

      // Flickering Candle Flame
      const flicker = Math.sin(lantern.flamePhase) * 1.5;
      ctx.beginPath();
      ctx.arc(lp.sx, lp.sy - lanternR * 0.6 + flicker, 4.8 * lp.scale, 0, Math.PI * 2);
      ctx.fillStyle = "#ffb703";
      ctx.shadowColor = "#fb8500";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Wish tag label
      ctx.font = `bold ${Math.round(9 * lp.scale)}px 'Noto Serif SC', serif`;
      ctx.fillStyle = "#fffaf0";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 4;
      ctx.fillText(lantern.wish, lp.sx, lp.sy + lanternR * 0.95);
      ctx.shadowBlur = 0;
    });

    // 5. Floating Fireflies in the night mist
    for (let f = 0; f < 8; f++) {
      const fx = (Math.sin(waterTime * 1.5 + f * 47) * 0.5 + 0.5) * width;
      const fy = (Math.cos(waterTime * 1.2 + f * 31) * 0.35 + 0.45) * height;
      const fAlpha = (Math.sin(waterTime * 4 + f * 17) * 0.5 + 0.5) * 0.8;
      ctx.beginPath();
      ctx.arc(fx, fy, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(239, 201, 120, ${fAlpha.toFixed(2)})`;
      ctx.shadowColor = "#efc978";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // ---------------------------------------------------------------------------
  // Scenario 5: Oxford Wisdom Reading Room (3D Manuscript & Desk)
  // ---------------------------------------------------------------------------
  function initReadingRoom() {
    wisdomGlyphs = [];
    readingBook.pageAngle = 0;
    readingBook.isFlipping = false;
    readingBook.curQuoteIdx = 0;
    spawnWisdomGlyphs(0, 12, 5);
  }

  function spawnWisdomGlyphs(x, y, z) {
    const chars = ["智", "慧", "明", "心", "慈", "悲", "善", "愿", "清", "安"];
    for (let i = 0; i < 6; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      wisdomGlyphs.push({
        x: x + (Math.random() - 0.5) * 45,
        y: y + Math.random() * 5,
        z: z + (Math.random() - 0.5) * 35,
        char,
        alpha: 1.0,
        vy: 0.4 + Math.random() * 0.35,
        scale: 0.9 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function updateReadingRoom(dt) {
    // Animate page turn
    if (readingBook.isFlipping) {
      readingBook.pageAngle += dt * 3.8;
      if (readingBook.pageAngle >= Math.PI) {
        readingBook.pageAngle = 0;
        readingBook.isFlipping = false;
      }
    }

    // Update wisdom glyphs
    for (let i = wisdomGlyphs.length - 1; i >= 0; i--) {
      const g = wisdomGlyphs[i];
      g.y += g.vy;
      g.x += Math.sin(g.phase + g.y * 0.1) * 0.2;
      g.alpha -= dt * 0.35;
      if (g.alpha <= 0) {
        wisdomGlyphs.splice(i, 1);
      }
    }
  }

  function drawReadingRoom() {
    const isDark = document.body.classList.contains("dark");

    drawStorybookBackdrop(
      "reading-room",
      isDark ? "#21100b" : "#7e4c2a",
      isDark ? "#0d0604" : "#2e160c",
      isDark ? "rgba(12, 5, 3, 0.45)" : "rgba(75, 33, 12, 0.08)"
    );

    // Warm archival glaze keeps the illustrated shelves and arched windows.
    const wallGrad = ctx.createLinearGradient(0, 0, 0, height);
    wallGrad.addColorStop(0, isDark ? "rgba(18, 9, 7, 0.3)" : "rgba(43, 20, 14, 0.06)");
    wallGrad.addColorStop(0.65, isDark ? "rgba(28, 13, 10, 0.34)" : "rgba(61, 28, 20, 0.08)");
    wallGrad.addColorStop(1, isDark ? "rgba(13, 6, 4, 0.5)" : "rgba(31, 13, 9, 0.14)");
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, width, height);

    // 1. Full-Canvas Polished Mahogany Study Desk (from horizon to canvas bottom)
    const deskHorizonY = height * 0.46;
    const deskGrad = ctx.createLinearGradient(0, deskHorizonY, 0, height);
    deskGrad.addColorStop(0, isDark ? "rgba(42, 21, 14, 0.42)" : "rgba(84, 46, 24, 0.12)");
    deskGrad.addColorStop(0.5, isDark ? "rgba(31, 15, 10, 0.46)" : "rgba(67, 35, 17, 0.16)");
    deskGrad.addColorStop(1, isDark ? "rgba(20, 10, 6, 0.55)" : "rgba(48, 24, 11, 0.22)");
    ctx.fillStyle = deskGrad;
    ctx.fillRect(0, deskHorizonY, width, height - deskHorizonY);

    // Polished Gold/Brass Trim along the Desk Horizon
    ctx.beginPath();
    ctx.moveTo(0, deskHorizonY);
    ctx.lineTo(width, deskHorizonY);
    ctx.strokeStyle = "#c69214";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Subtle Desk Wood Inlay Line
    ctx.beginPath();
    ctx.moveTo(0, deskHorizonY + 4);
    ctx.lineTo(width, deskHorizonY + 4);
    ctx.strokeStyle = isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(36, 16, 6, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 2. Banker's Library Lamp with Warm Radial Light
    const lampPos = project(readingLamp.x, readingLamp.y, readingLamp.z);
    if (lampPos.visible) {
      // Warm Radial Illumination Pool onto Desk
      if (readingLamp.lit) {
        const poolCenter = project(readingLamp.x + 18, 9, readingLamp.z + 18);
        const poolGrad = ctx.createRadialGradient(poolCenter.sx, poolCenter.sy, 5, poolCenter.sx, poolCenter.sy, 110 * poolCenter.scale);
        poolGrad.addColorStop(0, `rgba(255, 235, 150, ${(0.45 * readingLamp.intensity).toFixed(2)})`);
        poolGrad.addColorStop(1, "rgba(255, 235, 150, 0)");
        ctx.beginPath();
        ctx.arc(poolCenter.sx, poolCenter.sy, 110 * poolCenter.scale, 0, Math.PI * 2);
        ctx.fillStyle = poolGrad;
        ctx.fill();
      }

      // Brass Stand & Curved Neck
      const basePos = project(readingLamp.x, 9, readingLamp.z);
      ctx.beginPath();
      ctx.ellipse(basePos.sx, basePos.sy, 12 * basePos.scale, 6 * basePos.scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#c69214";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(basePos.sx, basePos.sy);
      ctx.lineTo(lampPos.sx, lampPos.sy);
      ctx.strokeStyle = "#c69214";
      ctx.lineWidth = 4 * lampPos.scale;
      ctx.stroke();

      // Emerald Green Glass Shade
      ctx.beginPath();
      ctx.ellipse(lampPos.sx, lampPos.sy, 18 * lampPos.scale, 9 * lampPos.scale, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = "#1e4d3a";
      ctx.strokeStyle = "#2d7a5b";
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();

      // Glowing Lamp Bulb
      if (readingLamp.lit) {
        ctx.beginPath();
        ctx.arc(lampPos.sx, lampPos.sy + 4 * lampPos.scale, 5 * lampPos.scale, 0, Math.PI * 2);
        ctx.fillStyle = "#fffaa0";
        ctx.shadowColor = "#ffea75";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // 3. Open Ancient Manuscript Book
    const bW = 42;
    const bL = 30;
    const bY = 10;
    // Left Page
    const lp0 = project(-bW, bY, -bL);
    const lp1 = project(0, bY, -bL);
    const lp2 = project(0, bY, bL);
    const lp3 = project(-bW, bY, bL);

    // Right Page
    const rp0 = project(0, bY, -bL);
    const rp1 = project(bW, bY, -bL);
    const rp2 = project(bW, bY, bL);
    const rp3 = project(0, bY, bL);

    if (lp0.visible && rp1.visible) {
      // Draw Book Cover Rim
      ctx.beginPath();
      ctx.moveTo(lp0.sx - 3, lp0.sy);
      ctx.lineTo(rp1.sx + 3, rp1.sy);
      ctx.lineTo(rp2.sx + 3, rp2.sy);
      ctx.lineTo(lp3.sx - 3, lp3.sy);
      ctx.closePath();
      ctx.fillStyle = "#4a1c14";
      ctx.fill();

      // Left Parchment Page
      ctx.beginPath();
      ctx.moveTo(lp0.sx, lp0.sy);
      ctx.lineTo(lp1.sx, lp1.sy);
      ctx.lineTo(lp2.sx, lp2.sy);
      ctx.lineTo(lp3.sx, lp3.sy);
      ctx.closePath();
      ctx.fillStyle = "#faf3dd";
      ctx.fill();
      ctx.strokeStyle = "#d8c292";
      ctx.stroke();

      // Right Parchment Page
      ctx.beginPath();
      ctx.moveTo(rp0.sx, rp0.sy);
      ctx.lineTo(rp1.sx, rp1.sy);
      ctx.lineTo(rp2.sx, rp2.sy);
      ctx.lineTo(rp3.sx, rp3.sy);
      ctx.closePath();
      ctx.fillStyle = "#fdf9ec";
      ctx.fill();
      ctx.strokeStyle = "#d8c292";
      ctx.stroke();

      // Central Spine Shadow
      ctx.beginPath();
      ctx.moveTo(lp1.sx, lp1.sy);
      ctx.lineTo(lp2.sx, lp2.sy);
      ctx.strokeStyle = "rgba(70, 40, 20, 0.4)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Turning Middle Page (when flipping)
      if (readingBook.isFlipping) {
        const midX = Math.cos(readingBook.pageAngle) * bW;
        const midY = bY + Math.sin(readingBook.pageAngle) * 16;
        const tp0 = project(0, bY, -bL);
        const tp1 = project(midX, midY, -bL);
        const tp2 = project(midX, midY, bL);
        const tp3 = project(0, bY, bL);

        ctx.beginPath();
        ctx.moveTo(tp0.sx, tp0.sy);
        ctx.lineTo(tp1.sx, tp1.sy);
        ctx.lineTo(tp2.sx, tp2.sy);
        ctx.lineTo(tp3.sx, tp3.sy);
        ctx.closePath();
        ctx.fillStyle = "rgba(253, 249, 236, 0.95)";
        ctx.fill();
        ctx.strokeStyle = "#c69214";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Wisdom Quote Calligraphy on Pages
      const isZh = document.documentElement.lang.startsWith("zh");
      const quote = readingBook.quotes[readingBook.curQuoteIdx] || readingBook.quotes[0];
      const text = isZh ? quote.zh : quote.en;

      const pageCenter = project(0, bY + 2, 0);
      const fontSize = Math.max(9, Math.round(9 * pageCenter.scale));
      const maxTextWidth = Math.max(90, Math.abs(rp1.sx - lp0.sx) - 18);
      const tokens = isZh ? Array.from(text) : text.split(" ");
      const joiner = isZh ? "" : " ";
      const lines = [];
      let line = "";
      ctx.font = `italic ${fontSize}px 'Noto Serif SC', serif`;
      tokens.forEach((token) => {
        const candidate = line ? `${line}${joiner}${token}` : token;
        if (ctx.measureText(candidate).width > maxTextWidth && line) {
          lines.push(line);
          line = token;
        } else {
          line = candidate;
        }
      });
      if (line) lines.push(line);
      ctx.fillStyle = "#3d271d";
      ctx.textAlign = "center";
      const visibleLines = lines.slice(0, 3);
      const lineHeight = fontSize + 2;
      const startY = pageCenter.sy - ((visibleLines.length - 1) * lineHeight) / 2;
      visibleLines.forEach((quoteLine, index) => {
        const clippedLine = index === 2 && lines.length > 3 ? `${quoteLine}…` : quoteLine;
        ctx.fillText(clippedLine, pageCenter.sx, startY + index * lineHeight);
      });
    }

    // 4. Floating 3D Wisdom Glyphs
    wisdomGlyphs.forEach((g) => {
      const gp = project(g.x, g.y, g.z);
      if (!gp.visible) return;

      ctx.font = `bold ${Math.max(12, Math.round(16 * gp.scale * g.scale))}px 'Noto Serif SC', serif`;
      ctx.fillStyle = `rgba(255, 215, 0, ${g.alpha.toFixed(3)})`;
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(255, 180, 0, 0.8)";
      ctx.shadowBlur = 8;
      ctx.fillText(g.char, gp.sx, gp.sy);
      ctx.shadowBlur = 0;
    });
  }

  function drawModernTorontoCrosswalk() {
    const isDark = document.body.classList.contains("dark");
    drawStorybookBackdrop(
      "toronto-crosswalk",
      isDark ? "#263849" : "#d6d6cf",
      isDark ? "#121a24" : "#8b6544",
      isDark ? "rgba(10, 18, 28, 0.36)" : "rgba(255, 245, 226, 0.02)"
    );
    drawSceneVignette(isDark ? "rgba(7, 14, 25, .48)" : "rgba(62, 48, 31, .16)");

    const routeY = height * 0.73;
    const routeStart = width * 0.23;
    const routeEnd = width * 0.76;
    const progress = Math.max(0, Math.min(1, elderPedestrian.progress || (elderPedestrian.x + 140) / 230));
    const escortX = routeStart + (routeEnd - routeStart) * progress;

    ctx.save();
    ctx.lineCap = "round";
    ctx.setLineDash([8, 10]);
    ctx.strokeStyle = trafficLight.state === "green" ? "rgba(34, 145, 111, .82)" : "rgba(255, 255, 255, .72)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(routeStart, routeY);
    ctx.lineTo(routeEnd, routeY);
    ctx.stroke();
    ctx.setLineDash([]);
    drawWaypoint(routeStart, routeY, "1", true);
    drawWaypoint(width * 0.5, routeY, "2", trafficLight.state === "green");
    drawWaypoint(routeEnd, routeY, "3", progress > 0.72);
    ctx.restore();

    drawStorybookSprite("escort", { sx: escortX, sy: routeY + 8, scale: Math.max(.62, height / 560), visible: true }, {
      width: 128,
      anchorY: .89,
      flipX: true,
      phase: elderPedestrian.frame,
      bob: elderPedestrian.walking ? 2.6 : .8,
      bobSpeed: elderPedestrian.walking ? 4 : 1.3,
      shadowColor: "rgba(44, 31, 20, .28)"
    });

    const signalX = width * .62;
    const signalY = height * .41;
    const signalGlow = trafficLight.state === "green" ? "rgba(52, 211, 153, .45)" : "rgba(251, 113, 133, .42)";
    const signalGradient = ctx.createRadialGradient(signalX, signalY, 3, signalX, signalY, 38);
    signalGradient.addColorStop(0, signalGlow);
    signalGradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = signalGradient;
    ctx.beginPath();
    ctx.arc(signalX, signalY, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(25, 39, 41, .9)";
    ctx.beginPath();
    ctx.roundRect(signalX - 15, signalY - 24, 30, 48, 11);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(signalX, signalY, 7, 0, Math.PI * 2);
    ctx.fillStyle = trafficLight.state === "green" ? "#43d9a3" : "#ff6f86";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawModernAmazonGrove() {
    const isDark = document.body.classList.contains("dark");
    drawStorybookBackdrop(
      "amazon-grove",
      isDark ? "#153929" : "#79a66e",
      isDark ? "#07150e" : "#274f37",
      isDark ? "rgba(3, 17, 10, .36)" : "rgba(25, 86, 52, .04)"
    );
    drawSceneVignette(isDark ? "rgba(4, 20, 12, .46)" : "rgba(15, 57, 33, .16)");

    const tree = sacredTrees[0];
    const growth = tree ? Math.max(.24, Math.min(1, tree.height / 65)) : .24;
    const groundX = width * .51;
    const groundY = height * .76;

    const rootGlow = ctx.createRadialGradient(groundX, groundY, 4, groundX, groundY, 110 * growth);
    rootGlow.addColorStop(0, tree?.bloom ? "rgba(255, 221, 120, .32)" : "rgba(141, 207, 135, .22)");
    rootGlow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rootGlow;
    ctx.beginPath();
    ctx.ellipse(groundX, groundY, 130 * growth, 38 * growth, 0, 0, Math.PI * 2);
    ctx.fill();

    drawStorybookSprite("sapling", { sx: groundX, sy: groundY, scale: .62 + growth * .42, visible: true }, {
      width: 190,
      anchorY: .91,
      bob: tree?.bloom ? 2 : .7,
      bobSpeed: 1,
      glow: tree?.bloom ? "rgba(255, 224, 132, .24)" : null,
      shadowColor: "rgba(16, 47, 25, .32)"
    });

    rainDroplets.forEach((drop) => {
      const x = width * .5 + drop.x * 2.4;
      const y = height * .2 + (60 - drop.y) * 4.5;
      const rain = ctx.createLinearGradient(x, y - 14, x, y + 4);
      rain.addColorStop(0, "rgba(206, 241, 255, 0)");
      rain.addColorStop(1, "rgba(206, 241, 255, .85)");
      ctx.strokeStyle = rain;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 5, y - 14);
      ctx.lineTo(x, y + 4);
      ctx.stroke();
    });

    butterflies.forEach((butterfly, index) => {
      const wing = 5 + (prefersReducedMotion ? 0 : Math.abs(Math.sin(butterfly.angle)) * 4);
      const bx = width * .5 + butterfly.x * 2.1;
      const by = height * .5 - butterfly.y * 2.4;
      ctx.save();
      ctx.translate(bx, by);
      ctx.fillStyle = index % 2 ? "rgba(255, 198, 103, .9)" : "rgba(76, 191, 224, .92)";
      ctx.beginPath();
      ctx.ellipse(-wing * .55, 0, wing, wing * .55, -.45, 0, Math.PI * 2);
      ctx.ellipse(wing * .55, 0, wing, wing * .55, .45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawModernKyotoLanterns() {
    const isDark = document.body.classList.contains("dark");
    drawStorybookBackdrop("night-corridor", "#16304b", "#050c18", isDark ? "rgba(2, 7, 16, .42)" : "rgba(4, 16, 31, .18)");
    drawSceneVignette("rgba(1, 8, 20, .58)");

    [...riverLanterns].sort((a, b) => b.z - a.z).forEach((lantern, index) => {
      const travel = Math.max(0, Math.min(1, (lantern.z + 110) / 330));
      const point = {
        sx: width * .5 + lantern.x * (1.9 - travel * .7),
        sy: height * (.79 - travel * .43),
        scale: .55 + (1 - travel) * .34,
        visible: true
      };
      drawStorybookSprite("lantern", point, {
        width: 76,
        anchorY: .58,
        phase: lantern.flamePhase + index,
        bob: 2.6,
        glow: "rgba(255, 178, 72, .4)",
        glowRadius: .9,
        shadow: false
      });
      ctx.save();
      ctx.font = "700 11px 'Noto Serif SC', serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255, 248, 226, .96)";
      ctx.shadowColor = "rgba(0,0,0,.75)";
      ctx.shadowBlur = 6;
      ctx.fillText(lantern.wish, point.sx, point.sy + 25 * point.scale);
      ctx.restore();
    });

    for (let i = 0; i < 14; i++) {
      const fx = (Math.sin(waterTime * .6 + i * 12.7) * .42 + .5) * width;
      const fy = (Math.cos(waterTime * .48 + i * 7.3) * .22 + .45) * height;
      const alpha = prefersReducedMotion ? .42 : .22 + Math.abs(Math.sin(waterTime * 2 + i)) * .64;
      ctx.fillStyle = `rgba(255, 220, 118, ${alpha.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(fx, fy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function wrapCanvasText(text, maxWidth) {
    const words = document.documentElement.lang.startsWith("zh") ? Array.from(text) : text.split(" ");
    const spacer = document.documentElement.lang.startsWith("zh") ? "" : " ";
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const candidate = line ? `${line}${spacer}${word}` : word;
      if (line && ctx.measureText(candidate).width > maxWidth) {
        lines.push(line);
        line = word;
      } else line = candidate;
    });
    if (line) lines.push(line);
    return lines;
  }

  function drawModernReadingRoom() {
    const isDark = document.body.classList.contains("dark");
    drawStorybookBackdrop(
      "reading-room",
      isDark ? "#21100b" : "#7e4c2a",
      isDark ? "#0d0604" : "#2e160c",
      isDark ? "rgba(12, 5, 3, .42)" : "rgba(75, 33, 12, .06)"
    );
    drawSceneVignette(isDark ? "rgba(24, 8, 4, .56)" : "rgba(60, 26, 9, .2)");

    const flipLift = readingBook.isFlipping && !prefersReducedMotion ? Math.sin(readingBook.pageAngle) * 8 : 0;
    drawStorybookSprite("book", { sx: width * .5, sy: height * .79 - flipLift, scale: Math.max(.7, height / 520), visible: true }, {
      width: 260,
      anchorY: .72,
      bob: .7,
      glow: readingLamp.lit ? "rgba(255, 218, 132, .28)" : null,
      shadowColor: "rgba(36, 14, 5, .38)"
    });

    const isZh = document.documentElement.lang.startsWith("zh");
    const quote = readingBook.quotes[readingBook.curQuoteIdx] || readingBook.quotes[0];
    const quoteText = isZh ? quote.zh : quote.en;
    const cardW = Math.min(330, width * .38);
    const cardX = width - cardW - 28;
    const cardY = height * .25;
    ctx.save();
    ctx.fillStyle = isDark ? "rgba(28, 17, 12, .76)" : "rgba(255, 249, 231, .82)";
    ctx.strokeStyle = isDark ? "rgba(241, 201, 120, .32)" : "rgba(115, 78, 35, .28)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, 112, 22);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = isDark ? "#f5d99a" : "#755126";
    ctx.font = "700 11px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(isZh ? "今日善言" : "TODAY'S KIND THOUGHT", cardX + 20, cardY + 27);
    ctx.fillStyle = isDark ? "#fff7df" : "#382619";
    ctx.font = `${isZh ? "600" : "italic 600"} 14px 'Noto Serif SC', serif`;
    wrapCanvasText(quoteText, cardW - 40).slice(0, 3).forEach((line, index) => {
      ctx.fillText(line, cardX + 20, cardY + 55 + index * 20);
    });
    ctx.restore();

    wisdomGlyphs.forEach((glyph) => {
      const gp = project(glyph.x, glyph.y, glyph.z);
      if (!gp.visible) return;
      ctx.font = `700 ${Math.max(14, 18 * glyph.scale)}px 'Noto Serif SC', serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = `rgba(255, 222, 139, ${glyph.alpha.toFixed(2)})`;
      ctx.fillText(glyph.char, gp.sx, gp.sy);
    });
  }

  // ---------------------------------------------------------------------------
  // Atmospheric Sky & Dynamic Lighting
  // ---------------------------------------------------------------------------
  function drawAtmosphere(dt) {
    const isDark = document.body.classList.contains("dark");
    let topColor = "#0d2b2c";
    let botColor = "#031517";

    if (currentTimeOfDay === "dawn") {
      topColor = isDark ? "#2b1b24" : "#ffeedd";
      botColor = isDark ? "#542c33" : "#fcd5b5";
    } else if (currentTimeOfDay === "day") {
      topColor = isDark ? "#0d2b2c" : "#e8f4f2";
      botColor = isDark ? "#031517" : "#cbe3de";
    } else if (currentTimeOfDay === "sunset") {
      topColor = isDark ? "#1b0a2a" : "#fae1dd";
      botColor = isDark ? "#4d1938" : "#f38375";
    } else if (currentTimeOfDay === "night") {
      topColor = "#040914";
      botColor = "#0a192f";
    }

    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, topColor);
    grad.addColorStop(1, botColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Stars at night
    if (currentTimeOfDay === "night") {
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      for (let s = 0; s < 35; s++) {
        const sx = ((s * 97 + waterTime * 5) % width);
        const sy = (s * 31) % (height * 0.45);
        const r = (s % 3 === 0) ? 1.5 : 1.0;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Gamification Celebration Badge Renderer
  // ---------------------------------------------------------------------------
  function drawCelebrationBadge(dt) {
    if (!celebrationBadge.active) return;
    celebrationBadge.timer -= dt;
    if (celebrationBadge.timer <= 0) {
      celebrationBadge.active = false;
      return;
    }

    celebrationBadge.scale = Math.min(1.0, celebrationBadge.scale + dt * 4);
    const cx = width / 2;
    const cy = height / 2 - 25;
    const s = celebrationBadge.scale;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(s, s);

    // Rotating golden sunburst rays
    const rot = (performance.now() / 1000) * 0.6;
    ctx.save();
    ctx.rotate(rot);
    const rays = 12;
    for (let r = 0; r < rays; r++) {
      const angle = (r / rays) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * 75, Math.sin(angle) * 75);
      ctx.strokeStyle = "rgba(239, 201, 120, 0.35)";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    ctx.restore();

    // Central circular mandala medallion
    const medGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 55);
    medGrad.addColorStop(0, "rgba(255, 235, 170, 0.95)");
    medGrad.addColorStop(0.7, "rgba(239, 201, 120, 0.9)");
    medGrad.addColorStop(1, "rgba(184, 137, 42, 0.95)");

    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, Math.PI * 2);
    ctx.fillStyle = medGrad;
    ctx.shadowColor = "rgba(239, 201, 120, 0.8)";
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = "#fff2b2";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Badge Icon
    ctx.font = "32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(celebrationBadge.icon, 0, -2);

    // Title banner beneath
    ctx.font = "bold 15px 'Noto Serif SC', serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 6;
    ctx.fillText(celebrationBadge.title, 0, 72);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#ffe7ad";
    ctx.fillText("Sanctuary Goal Dedicated · 功德圆满", 0, 92);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  function triggerBadgeUnlock(scenarioKey) {
    const scen = SCENARIOS[scenarioKey];
    const isZh = document.documentElement.lang.startsWith("zh");
    const title = isZh ? (scen.badgeTitleZh || scen.nameZh) : (scen.badgeTitle || scen.name);

    celebrationBadge.active = true;
    celebrationBadge.title = title;
    celebrationBadge.icon = scen.icon;
    celebrationBadge.timer = 4.5;
    celebrationBadge.scale = 0;

    awardKarma(10, `Dedicated Sanctuary Guardian Badge: ${title}`);
    playSound("chime");

    const badgeToast = document.getElementById("gameBadgeToast");
    if (badgeToast) {
      badgeToast.textContent = `🌟 ${isZh ? "荣膺净域守护勋章" : "Guardian Badge Unlocked"}: ${title}`;
      badgeToast.hidden = false;
      badgeToast.classList.add("show");
      window.setTimeout(() => {
        badgeToast.classList.remove("show");
        badgeToast.hidden = true;
      }, 4500);
    }
  }

  // ---------------------------------------------------------------------------
  // Floating Merit 3D Particle Text
  // ---------------------------------------------------------------------------
  function spawnFloatingMerit3D(x, y, z, text) {
    meritParticles3D.push({
      x,
      y,
      z,
      text,
      alpha: 1.0,
      vy: 0.65,
      life: 1.0
    });
  }

  function updateAndDrawMerit3D(dt) {
    for (let i = meritParticles3D.length - 1; i >= 0; i--) {
      const p = meritParticles3D[i];
      p.y += p.vy;
      p.life -= dt * 0.7;
      p.alpha = Math.max(0, p.life);

      const pt = project(p.x, p.y, p.z);
      if (pt.visible) {
        ctx.font = `bold ${Math.max(11, Math.round(14 * pt.scale))}px 'Noto Serif SC', serif`;
        ctx.fillStyle = `rgba(255, 215, 0, ${p.alpha.toFixed(3)})`;
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
        ctx.shadowBlur = 4;
        ctx.fillText(p.text, pt.sx, pt.sy);
        ctx.shadowBlur = 0;
      }

      if (p.life <= 0) {
        meritParticles3D.splice(i, 1);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Audio & Merit Helpers
  // ---------------------------------------------------------------------------
  function playSound(type) {
    if (type === "water" && typeof window.playWaterSplash === "function") {
      window.playWaterSplash();
    } else if (type === "chime" && typeof window.playZenChime === "function") {
      window.playZenChime();
    } else if (type === "muyu" && typeof window.playMuyuSound === "function") {
      window.playMuyuSound();
    }
  }

  function awardKarma(points, reason) {
    if (typeof window.updateKarma === "function") {
      const btn = document.getElementById("gamePrimaryActionBtn");
      window.updateKarma(points, btn);
    }
    if (typeof window.pushActivity === "function") {
      window.pushActivity(`${reason} (+${points} karma)`);
    }
    playSound("chime");
  }

  // ---------------------------------------------------------------------------
  // Main Render Loop
  // ---------------------------------------------------------------------------
  let lastTime = 0;

  function renderLoop(time) {
    if (!isRunning) return;

    const dt = Math.min(0.1, (time - lastTime) / 1000 || 0.016);
    lastTime = time;

    // 0. Serenity Combo Decay
    if (comboState.timer > 0) {
      comboState.timer -= dt;
      if (comboState.timer <= 0) {
        comboState.count = 0;
        comboState.multiplier = 1;
        updateHUD();
      }
    }

    // 1. Atmosphere / Dynamic Sky & Stars
    drawAtmosphere(dt);

    // 2. Camera Follow / Mode Updates
    if (cameraMode === "follow") {
      let targetEntity = null;
      if (currentScenarioKey === "east-lake" && koiFishList.length > 0) {
        targetEntity = koiFishList[koiFishList.length - 1];
      } else if (currentScenarioKey === "toronto-crosswalk") {
        targetEntity = elderPedestrian;
      } else if (currentScenarioKey === "night-corridor" && riverLanterns.length > 0) {
        targetEntity = riverLanterns[riverLanterns.length - 1];
      } else if (currentScenarioKey === "reading-room") {
        targetEntity = readingBook;
      }
      if (targetEntity) {
        camera.targetX += (targetEntity.x - camera.targetX) * 0.06;
        camera.targetZ += (targetEntity.z - camera.targetZ) * 0.06;
      }
    } else if (cameraMode === "topdown") {
      camera.rotX = 1.35;
      camera.rotY = 0;
    }

    // 3. Update and draw according to active scenario
    if (currentScenarioKey === "east-lake") {
      updateEastLake(dt);
      drawEastLake();
    } else if (currentScenarioKey === "toronto-crosswalk") {
      updateTorontoCrosswalk(dt);
      drawModernTorontoCrosswalk();
    } else if (currentScenarioKey === "amazon-grove") {
      updateAmazonGrove(dt);
      drawModernAmazonGrove();
    } else if (currentScenarioKey === "night-corridor") {
      updateKyotoLanterns(dt);
      drawModernKyotoLanterns();
    } else if (currentScenarioKey === "reading-room") {
      updateReadingRoom(dt);
      drawModernReadingRoom();
    }

    // 4. Draw 3D Floating Merit Particles
    updateAndDrawMerit3D(dt);

    // 5. Draw 3D Celebration Badge
    drawCelebrationBadge(dt);

    animFrameId = requestAnimationFrame(renderLoop);
  }

  // ---------------------------------------------------------------------------
  // Resize Handler
  // ---------------------------------------------------------------------------
  function handleResize() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  // ---------------------------------------------------------------------------
  // Scenario Switching & HUD
  // ---------------------------------------------------------------------------
  function setScenario(key) {
    if (!SCENARIOS[key]) return;
    currentScenarioKey = key;

    const scen = SCENARIOS[key];
    camera.rotX = scen.defaultCam.rotX;
    camera.rotY = scen.defaultCam.rotY;
    camera.zoom = scen.defaultCam.zoom;
    camera.dist = scen.defaultCam.dist;
    camera.targetX = 0;
    camera.targetY = 0;
    camera.targetZ = 0;

    // Automatically suggest atmosphere per scenario
    if (key === "night-corridor") {
      setTimeOfDay("night");
    } else if (key === "reading-room") {
      setTimeOfDay("sunset");
    } else {
      setTimeOfDay("day");
    }

    // Init entities
    if (key === "east-lake") initEastLake();
    else if (key === "toronto-crosswalk") initTorontoCrosswalk();
    else if (key === "amazon-grove") initAmazonGrove();
    else if (key === "night-corridor") initKyotoLanterns();
    else if (key === "reading-room") initReadingRoom();

    updateHUD();
  }

  function setTimeOfDay(tod) {
    currentTimeOfDay = tod;
    document.querySelectorAll(".tod-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.tod === tod);
    });
  }

  function setSpecies(sp) {
    currentSpecies = sp;
    document.querySelectorAll(".species-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.species === sp);
    });
  }

  function toggleCameraMode() {
    if (cameraMode === "orbit") {
      cameraMode = "follow";
    } else if (cameraMode === "follow") {
      cameraMode = "topdown";
      camera.rotX = 1.35;
      camera.rotY = 0;
    } else {
      cameraMode = "orbit";
      const scen = SCENARIOS[currentScenarioKey];
      camera.rotX = scen.defaultCam.rotX;
      camera.rotY = scen.defaultCam.rotY;
      camera.targetX = 0;
      camera.targetZ = 0;
    }
    updateHUD();
  }

  function recordComboAction() {
    if (comboState.timer > 0) {
      comboState.count += 1;
    } else {
      comboState.count = 1;
    }
    comboState.timer = 4.2;
    if (comboState.count >= 5) comboState.multiplier = 5;
    else if (comboState.count >= 3) comboState.multiplier = 3;
    else if (comboState.count >= 2) comboState.multiplier = 2;
    else comboState.multiplier = 1;
    updateHUD();
  }

  function updateHUD() {
    const scen = SCENARIOS[currentScenarioKey];
    const isZh = document.documentElement.lang.startsWith("zh");

    // Title & Telemetry
    const titleEl = document.getElementById("gameScenarioTitle");
    if (titleEl) titleEl.textContent = isZh ? scen.nameZh : scen.name;

    const storyEl = document.getElementById("gameScenarioStory");
    if (storyEl) storyEl.textContent = isZh ? scen.storyZh : scen.story;

    const chapterEl = document.getElementById("gameScenarioChapter");
    if (chapterEl) chapterEl.textContent = isZh ? scen.chapterZh : scen.chapter;

    const dialog = document.getElementById("sanctuary3DGameModal");
    if (dialog) dialog.dataset.scenario = currentScenarioKey;

    const coordsEl = document.getElementById("gameScenarioCoords");
    if (coordsEl) coordsEl.textContent = `📍 ${scen.coords} · ${scen.biosphere}`;

    // Action button labels
    const primaryBtn = document.getElementById("gamePrimaryActionBtn");
    if (primaryBtn) {
      primaryBtn.textContent = `${scen.icon} ${isZh ? scen.actionNameZh : scen.actionName}`;
    }

    const secondaryBtn = document.getElementById("gameSecondaryActionBtn");
    if (secondaryBtn) {
      secondaryBtn.textContent = isZh ? scen.feedActionNameZh : scen.feedActionName;
    }

    // Progress counter and bar
    const prog = progressState[currentScenarioKey];
    const goalEl = document.getElementById("gameGoalCounter");
    if (goalEl) {
      const badgeText = prog.completed ? ` · 🏅 ${isZh ? scen.badgeTitleZh : scen.badgeTitle}` : "";
      goalEl.textContent = `${isZh ? scen.goalLabelZh : scen.goalLabel}: ${prog.count}/${scen.targetGoal} · 功德 +${prog.score || 0}${badgeText}`;
    }

    const fillEl = document.getElementById("gameGoalBarFill");
    if (fillEl) {
      const pct = Math.min(100, Math.round((prog.count / scen.targetGoal) * 100));
      fillEl.style.width = `${pct}%`;
    }

    // Combo badge
    const comboBadge = document.getElementById("gameComboBadge");
    const comboMultiplier = document.getElementById("gameComboMultiplier");
    if (comboBadge && comboMultiplier) {
      if (comboState.multiplier > 1 && comboState.timer > 0) {
        comboBadge.hidden = false;
        comboMultiplier.textContent = String(comboState.multiplier);
      } else {
        comboBadge.hidden = true;
      }
    }

    // Dynamic scenario hint
    const hintEl = document.getElementById("gameCanvasHint");
    if (hintEl && SCENARIO_HINTS[currentScenarioKey]) {
      hintEl.textContent = SCENARIO_HINTS[currentScenarioKey];
    }

    // Active pill styling
    document.querySelectorAll(".game-scenario-tab").forEach((tab) => {
      const active = tab.dataset.scenario === currentScenarioKey;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    // Species picker: only shown for East Lake
    const spPicker = document.getElementById("gameSpeciesPicker");
    if (spPicker) {
      spPicker.style.display = currentScenarioKey === "east-lake" ? "inline-flex" : "none";
    }

    // Wish picker: only shown for Kyoto
    const wishPicker = document.getElementById("gameWishPicker");
    if (wishPicker) {
      wishPicker.style.display = currentScenarioKey === "night-corridor" ? "inline-flex" : "none";
    }

    // Camera Mode button label
    const camModeLabel = document.getElementById("gameCamModeLabel");
    if (camModeLabel) {
      camModeLabel.textContent = cameraMode.charAt(0).toUpperCase() + cameraMode.slice(1);
    }
  }

  // ---------------------------------------------------------------------------
  // Interactive Gameplay Handlers
  // ---------------------------------------------------------------------------
  function performPrimaryAction() {
    const scen = SCENARIOS[currentScenarioKey];
    const prog = progressState[currentScenarioKey];
    recordComboAction();

    if (currentScenarioKey === "east-lake") {
      // Release fish / turtle into East Lake
      const rx = (Math.random() - 0.5) * 80;
      const rz = -60 + Math.random() * 40;
      spawnKoi(rx, rz, Math.random() * Math.PI * 2, currentSpecies, 1.5, true);
      addWaterRipple(rx, rz, 55, 1.2);
      spawnWaterSplash(rx, rz);
      playSound("water");
      const label = currentSpecies === "turtle" ? "Terrapin Freed · 龟放深潭 (+1)" : "Liberation · 善念放生 (+1)";
      spawnFloatingMerit3D(rx, 12, rz, label);

      prog.count += 1;
      prog.score += 5 * comboState.multiplier;
      awardKarma(2 * comboState.multiplier, "Released digital koi into East Lake");

      if (prog.count >= scen.targetGoal && !prog.completed) {
        prog.completed = true;
        triggerBadgeUnlock("east-lake");
      }
      updateHUD();
    } else if (currentScenarioKey === "toronto-crosswalk") {
      // Press walk signal
      trafficLight.state = "green";
      trafficLight.timer = 0;
      elderPedestrian.walking = true;
      playSound("muyu");
      spawnFloatingMerit3D(elderPedestrian.x, 20, 0, "Walk Signal Activated · 慈心护行");
      prog.count += 1;
      prog.score += 5 * comboState.multiplier;
      awardKarma(2 * comboState.multiplier, "Activated safe walk chime in Toronto");
      if (prog.count >= scen.targetGoal && !prog.completed) {
        prog.completed = true;
        triggerBadgeUnlock("toronto-crosswalk");
      }
      updateHUD();
    } else if (currentScenarioKey === "amazon-grove") {
      // Plant seed / nurture tree
      const tree = sacredTrees[0];
      if (tree) {
        tree.targetHeight = Math.min(65, tree.targetHeight + 15);
        playSound("chime");
        spawnFloatingMerit3D(tree.x, tree.height + 10, tree.z, "Tree Nurtured · 繁荣生机");
      }
      prog.count += 1;
      prog.score += 5 * comboState.multiplier;
      awardKarma(2 * comboState.multiplier, "Nurtured sacred Bodhi tree in Amazon grove");
      if (prog.count >= scen.targetGoal && !prog.completed) {
        prog.completed = true;
        triggerBadgeUnlock("amazon-grove");
      }
      updateHUD();
    } else if (currentScenarioKey === "night-corridor") {
      // Float new wish lantern with chosen wish
      const isZh = document.documentElement.lang.startsWith("zh");
      const wishObj = WISH_LABELS[currentWish] || WISH_LABELS.peace;
      const wishText = isZh ? wishObj.zh : wishObj.en;
      spawnRiverLantern((Math.random() - 0.5) * 30, -110, wishText);
      addWaterRipple(0, -110, 40, 1.0);
      playSound("water");
      spawnFloatingMerit3D(0, 15, -110, `${wishText} · 善愿通天`);
      prog.count += 1;
      prog.score += 5 * comboState.multiplier;
      awardKarma(2 * comboState.multiplier, "Sent gentle wish lantern down Kyoto river");
      if (prog.count >= scen.targetGoal && !prog.completed) {
        prog.completed = true;
        triggerBadgeUnlock("night-corridor");
      }
      updateHUD();
    } else if (currentScenarioKey === "reading-room") {
      // Turn page and read aloud
      readingBook.isFlipping = true;
      readingBook.pageAngle = 0;
      readingBook.curQuoteIdx = (readingBook.curQuoteIdx + 1) % readingBook.quotes.length;
      spawnWisdomGlyphs(0, 14, 5);
      playSound("chime");
      spawnFloatingMerit3D(0, 24, 5, "Wisdom Inscribed · 般若生辉 (+1)");

      prog.count += 1;
      prog.score += 5 * comboState.multiplier;
      awardKarma(2 * comboState.multiplier, "Contemplated wisdom quote in Oxford Reading Room");
      if (prog.count >= scen.targetGoal && !prog.completed) {
        prog.completed = true;
        triggerBadgeUnlock("reading-room");
      }
      updateHUD();
    }
  }

  function performSecondaryAction() {
    if (currentScenarioKey === "east-lake") {
      // Feed lotus petals
      for (let f = 0; f < 3; f++) {
        foodCrumbs.push({
          x: (Math.random() - 0.5) * 100,
          y: 0,
          z: (Math.random() - 0.5) * 100,
          life: 1.0
        });
      }
      playSound("water");
      spawnFloatingMerit3D(0, 10, 0, "Fed Lotus Petals · 欢喜结缘");
    } else if (currentScenarioKey === "toronto-crosswalk") {
      // Prompt elder forward
      elderPedestrian.walking = true;
      elderPedestrian.x += 12;
      playSound("muyu");
    } else if (currentScenarioKey === "amazon-grove") {
      // Sprinkle rain drops
      for (let r = 0; r < 20; r++) {
        rainDroplets.push({
          x: (Math.random() - 0.5) * 90,
          y: 40 + Math.random() * 20,
          z: (Math.random() - 0.5) * 90
        });
      }
      playSound("water");
    } else if (currentScenarioKey === "night-corridor") {
      // Gentle wind breeze
      riverLanterns.forEach((l) => (l.vz += 0.4));
      playSound("chime");
    } else if (currentScenarioKey === "reading-room") {
      // Dim or brighten banker's reading lamp
      readingLamp.lit = !readingLamp.lit;
      readingLamp.intensity = readingLamp.lit ? 1.4 : 0;
      playSound("muyu");
      spawnFloatingMerit3D(readingLamp.x, 30, readingLamp.z, readingLamp.lit ? "Lamp Illuminated · 智光普照" : "Lamp Softened · 恬淡");
    }
  }

  // ---------------------------------------------------------------------------
  // Modal Lifecycle & Event Bindings
  // ---------------------------------------------------------------------------
  function openGame(scenarioKey = "east-lake") {
    const dialog = document.getElementById("sanctuary3DGameModal");
    canvas = document.getElementById("sanctuary3DCanvas");
    if (!dialog || !canvas) return;

    ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "true");
    }

    handleResize();
    requestAnimationFrame(() => handleResize());
    setScenario(scenarioKey);

    isRunning = true;
    lastTime = performance.now();
    animFrameId = requestAnimationFrame(renderLoop);
  }

  function closeGame() {
    const dialog = document.getElementById("sanctuary3DGameModal");
    if (dialog && typeof dialog.close === "function") {
      dialog.close();
    } else if (dialog) {
      dialog.removeAttribute("open");
    }
    isRunning = false;
    if (animFrameId) cancelAnimationFrame(animFrameId);
  }

  function renderStillFrame() {
    if (!ctx || !canvas) return;
    isRunning = false;
    if (animFrameId) cancelAnimationFrame(animFrameId);
    setScenario(currentScenarioKey);
    ctx.clearRect(0, 0, width, height);
    drawAtmosphere(0);

    if (currentScenarioKey === "east-lake") drawEastLake();
    else if (currentScenarioKey === "toronto-crosswalk") drawModernTorontoCrosswalk();
    else if (currentScenarioKey === "amazon-grove") drawModernAmazonGrove();
    else if (currentScenarioKey === "night-corridor") drawModernKyotoLanterns();
    else if (currentScenarioKey === "reading-room") drawModernReadingRoom();
  }

  function setupBindings() {
    // Buttons to launch game
    const mapLaunchBtn = document.getElementById("launch3DGameBtn");
    if (mapLaunchBtn) {
      mapLaunchBtn.addEventListener("click", () => {
        const spotId = (window.FOOBOW_DATA && window.FOOBOW_DATA.defaultState && window.FOOBOW_DATA.defaultState.selectedSpot) || "east-lake";
        const targetScen = SCENARIOS[spotId] ? spotId : "east-lake";
        openGame(targetScen);
      });
    }

    const deedLaunchBtn = document.getElementById("open3DDeedGameBtn");
    if (deedLaunchBtn) {
      deedLaunchBtn.addEventListener("click", () => openGame("east-lake"));
    }

    const todayLaunchBtn = document.getElementById("launchSanctuaryFromTodayBtn");
    if (todayLaunchBtn) {
      todayLaunchBtn.addEventListener("click", () => openGame("east-lake"));
    }

    document.querySelectorAll(".sanctuary-quick-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        openGame(pill.dataset.scenario || "east-lake");
      });
    });

    // Modal Close Buttons
    const closeTopBtn = document.getElementById("close3DGameTopBtn");
    const closeBottomBtn = document.getElementById("close3DGameBottomBtn");
    if (closeTopBtn) closeTopBtn.addEventListener("click", closeGame);
    if (closeBottomBtn) closeBottomBtn.addEventListener("click", closeGame);

    // Scenario Tabs
    document.querySelectorAll(".game-scenario-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        setScenario(tab.dataset.scenario || "east-lake");
      });
    });

    // Time of Day Buttons
    document.querySelectorAll(".tod-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        setTimeOfDay(btn.dataset.tod || "day");
      });
    });

    // Species Buttons
    document.querySelectorAll(".species-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        setSpecies(btn.dataset.species || "yamabuki");
      });
    });

    // Wish Intention Buttons (Kyoto)
    document.querySelectorAll(".wish-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentWish = btn.dataset.wish || "peace";
        document.querySelectorAll(".wish-btn").forEach((b) => {
          b.classList.toggle("active", b.dataset.wish === currentWish);
        });
      });
    });

    // Camera Mode Button
    const camModeBtn = document.getElementById("gameCamModeBtn");
    if (camModeBtn) {
      camModeBtn.addEventListener("click", toggleCameraMode);
    }

    // Action Buttons
    const primaryBtn = document.getElementById("gamePrimaryActionBtn");
    if (primaryBtn) primaryBtn.addEventListener("click", performPrimaryAction);

    const secondaryBtn = document.getElementById("gameSecondaryActionBtn");
    if (secondaryBtn) secondaryBtn.addEventListener("click", performSecondaryAction);

    const resetCamBtn = document.getElementById("gameResetCamBtn");
    if (resetCamBtn) {
      resetCamBtn.addEventListener("click", () => {
        const scen = SCENARIOS[currentScenarioKey];
        camera.rotX = scen.defaultCam.rotX;
        camera.rotY = scen.defaultCam.rotY;
        camera.zoom = scen.defaultCam.zoom;
        camera.dist = scen.defaultCam.dist;
        camera.targetX = 0;
        camera.targetY = 0;
        camera.targetZ = 0;
      });
    }

    // Canvas Pointer Interactions (Rotating Camera & Dropping Ripples)
    if (canvas) {
      canvas.addEventListener("pointerdown", (e) => {
        isDragging = true;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
      });

      window.addEventListener("pointermove", (e) => {
        if (!isDragging || !isRunning) return;
        const dx = e.clientX - lastPointerX;
        const dy = e.clientY - lastPointerY;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;

        camera.rotY += dx * 0.008;
        camera.rotX = Math.max(0.15, Math.min(1.2, camera.rotX - dy * 0.008));
      });

      window.addEventListener("pointerup", () => {
        isDragging = false;
      });

      // Tap / Click on Canvas to trigger interactive gameplay across all scenarios
      canvas.addEventListener("click", (e) => {
        if (!isRunning) return;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left - width / 2;
        const clickY = e.clientY - rect.top - height / 2;

        const worldX = (clickX / (camera.fov * camera.zoom)) * camera.dist;
        const worldZ = (clickY / (camera.fov * camera.zoom)) * camera.dist;

        recordComboAction();

        if (currentScenarioKey === "east-lake") {
          addWaterRipple(worldX, worldZ, 50, 1.2);
          foodCrumbs.push({ x: worldX, y: 0, z: worldZ, life: 1.2 });
          spawnWaterSplash(worldX, worldZ);
          playSound("water");
        } else if (currentScenarioKey === "toronto-crosswalk") {
          crosswalkShields.push({ x: worldX, z: worldZ, collected: false });
          elderPedestrian.walking = true;
          playSound("muyu");
          spawnFloatingMerit3D(worldX, 15, worldZ, "Safe Beacon · 善护念");
        } else if (currentScenarioKey === "amazon-grove") {
          sacredTrees.push({
            x: worldX,
            z: worldZ,
            height: 6,
            targetHeight: 38 + Math.random() * 25,
            foliageR: 8,
            bloom: false
          });
          playSound("chime");
          spawnFloatingMerit3D(worldX, 14, worldZ, "Forest Sprout · 生机 (+1)");
          progressState["amazon-grove"].count += 1;
          updateHUD();
        } else if (currentScenarioKey === "night-corridor") {
          const isZh = document.documentElement.lang.startsWith("zh");
          const wishObj = WISH_LABELS[currentWish] || WISH_LABELS.peace;
          const wishText = isZh ? wishObj.zh : wishObj.en;
          spawnRiverLantern(worldX, worldZ, wishText);
          addWaterRipple(worldX, worldZ, 40, 1.0);
          playSound("water");
          spawnFloatingMerit3D(worldX, 12, worldZ, `${wishText} · 善愿 (+1)`);
          progressState["night-corridor"].count += 1;
          updateHUD();
        } else if (currentScenarioKey === "reading-room") {
          if (Math.abs(worldX) < 65 && Math.abs(worldZ) < 45) {
            readingBook.isFlipping = true;
            readingBook.pageAngle = 0;
            readingBook.curQuoteIdx = (readingBook.curQuoteIdx + 1) % readingBook.quotes.length;
            spawnWisdomGlyphs(0, 14, 5);
            playSound("chime");
            spawnFloatingMerit3D(0, 24, 5, "Wisdom Inscribed · 般若 (+1)");
          } else if (Math.abs(worldX - readingLamp.x) < 40) {
            readingLamp.lit = !readingLamp.lit;
            readingLamp.intensity = readingLamp.lit ? 1.4 : 0;
            playSound("muyu");
            spawnFloatingMerit3D(readingLamp.x, 30, readingLamp.z, readingLamp.lit ? "Lamp Glowing · 智光" : "Lamp Softened · 恬静");
          } else {
            spawnWisdomGlyphs(worldX, 12, worldZ);
            playSound("chime");
            spawnFloatingMerit3D(worldX, 16, worldZ, "Calligraphy · 慧笔 (+1)");
          }
        }
      });

      // Mouse Wheel Zoom
      canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        const zoomDelta = e.deltaY * -0.001;
        camera.zoom = Math.max(0.7, Math.min(1.6, camera.zoom + zoomDelta));
      }, { passive: false });
    }

    window.addEventListener("resize", () => {
      if (isRunning) handleResize();
    });
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      canvas = document.getElementById("sanctuary3DCanvas");
      setupBindings();
    });
  } else {
    canvas = document.getElementById("sanctuary3DCanvas");
    setupBindings();
  }

  // Public API
  window.FoobowGame3D = {
    open: openGame,
    close: closeGame,
    setScenario,
    setTimeOfDay,
    setSpecies,
    toggleCameraMode,
    performPrimary: performPrimaryAction,
    performSecondary: performSecondaryAction,
    renderStill: renderStillFrame
  };
})();
