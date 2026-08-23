/* КУЗНЕЦ — merge-физика в кузнице.
 *
 * Роняешь заготовки, одинаковые сплавляются в следующий металл.
 * Своё поверх жанра — «перековка»: накопленный жар тратится на удар молотом,
 * который сваривает выбранный слиток с ближайшим таким же где угодно на поле.
 * Это лечит главную боль жанра — намертво зажатую одинокую заготовку.
 */

(() => {
  "use strict";

  const { Engine, Composite, Bodies, Body, Events } = Matter;

  // ── Константы поля ──────────────────────────────────────────────

  const W = 480;              // логическая ширина, вся отрисовка в этих единицах
  let H = 640;                // высота горна подстраивается под форму экрана
  const H_MIN = 540, H_MAX = 720;
  const DROP_Y = 62;          // высота, с которой падает заготовка
  const DEATH_Y = 108;        // линия горна: выше неё нельзя залёживаться
  const DEATH_HOLD = 1000;    // мс над линией до проигрыша
  const SPAWN_GRACE = 900;    // мс неприкосновенности после броска
  const DROP_COOLDOWN = 320;
  const MAX_TIER = 8;

  const R = [0, 30, 36, 44, 53, 65, 78, 95, 115];
  const SCORE = [0, 0, 2, 5, 9, 15, 24, 38, 60];
  const HEAT = [0, 0, 6, 9, 13, 18, 24, 32, 42];
  const CHAIN_MS = 800;
  const POP_SCORE = 150;      // два мифрила гасят друг друга — потолок лестницы

  const TINT = [
    "", "#c2410c", "#38bdf8", "#f59e0b", "#e2e8f0",
    "#facc15", "#a855f7", "#ef4444", "#2dd4bf",
  ];

  const FILES = [
    "", "tier_01_copper", "tier_02_steel", "tier_03_bronze", "tier_04_silver",
    "tier_05_gold", "tier_06_amethyst", "tier_07_ruby", "tier_08_mithril",
  ];

  // ── Языки ───────────────────────────────────────────────────────

  const STR = {
    ru: {
      score: "Счёт", best: "Рекорд", heat: "Жар", next: "Далее", reforge: "Перековка",
      tagline: "Роняй заготовки. Одинаковые сплавляются.",
      rule1: "Веди курсор и жми, чтобы бросить.",
      rule2: "Два одинаковых слитка сплавляются в следующий металл.",
      rule3: "Жар копится от сплавов. Полный жар — удар молотом.",
      play: "Ковать", again: "Ещё раз", overKicker: "Горн погас",
      newBest: "Новый рекорд",
      pickTarget: "Выбери слиток для перековки",
      noPair: "Пары для этого слитка на поле нет",
      missed: "Мимо — целься в слиток",
      needHeat: "Жар ещё не набран",
      popped: "Мифрил схлопнулся",
      tiers: ["", "Медь", "Сталь", "Бронза", "Серебро", "Золото", "Аметист", "Рубин", "Мифрил"],
      reached: (t) => `Дошёл до: ${STR.ru.tiers[t]}`,
    },
    en: {
      score: "Score", best: "Best", heat: "Heat", next: "Next", reforge: "Reforge",
      tagline: "Drop the billets. Matching ones fuse.",
      rule1: "Move the cursor and click to drop.",
      rule2: "Two equal ingots fuse into the next metal.",
      rule3: "Heat builds up from fusions. Full heat — one hammer strike.",
      play: "Forge", again: "Again", overKicker: "The forge went cold",
      newBest: "New best",
      pickTarget: "Pick an ingot to reforge",
      noPair: "No matching ingot on the field",
      missed: "Missed — aim at an ingot",
      needHeat: "Not enough heat yet",
      popped: "Mithril collapsed",
      tiers: ["", "Copper", "Steel", "Bronze", "Silver", "Gold", "Amethyst", "Ruby", "Mithril"],
      reached: (t) => `Reached: ${STR.en.tiers[t]}`,
    },
  };

  let L = STR.ru;

  // ── DOM ─────────────────────────────────────────────────────────

  const $ = (id) => document.getElementById(id);
  const cv = $("c");
  const ctx = cv.getContext("2d");
  const stage = $("stage");
  const elScore = $("score");
  const elBest = $("best");
  const elHeatFill = $("heat-fill");
  const elHeatTrack = $("heat-track");
  const elNextImg = $("next-img");
  const elHammer = $("hammer");
  const elHint = $("hint");
  const elLadder = $("ladder");

  // ── Состояние ───────────────────────────────────────────────────

  const S = {
    running: false,
    score: 0,
    best: +(localStorage.getItem("kuznets.best") || 0),
    heat: 0,
    armed: false,          // молот занесён, ждём цель
    holdTier: 1,
    nextTier: 1,
    lastDrop: -1e9,
    aimX: W / 2,
    deathT: 0,
    shake: 0,
    ptr: { x: W / 2, y: -1 },
    seen: new Set(),
    games: 0,
    chain: 0,          // слияния подряд в пределах CHAIN_MS дают множитель
    chainAt: 0,
  };

  const engine = Engine.create();
  engine.gravity.y = 1.05;
  engine.positionIterations = 8;
  engine.velocityIterations = 8;
  const world = engine.world;

  const orbs = [];
  const particles = [];
  const rings = [];
  const arcs = [];
  const floats = [];
  const consumed = new Set();
  const pendingMerges = [];

  const floor = Bodies.rectangle(W / 2, H + 30, W + 240, 60, { isStatic: true });
  Composite.add(world, [
    floor,
    Bodies.rectangle(-30, 400, 60, 2600, { isStatic: true }),
    Bodies.rectangle(W + 30, 400, 60, 2600, { isStatic: true }),
  ]);

  // ── Картинки ────────────────────────────────────────────────────

  const IMG = [];

  function preload() {
    return Promise.all(FILES.slice(1).map((f, i) => new Promise((res) => {
      const im = new Image();
      im.onload = im.onerror = () => { IMG[i + 1] = im; res(); };
      im.src = `assets/${f}.png`;
    })));
  }

  // ── Звук: синтез, ни одного файла ───────────────────────────────

  const SND = {
    ac: null,
    muted: localStorage.getItem("kuznets.muted") === "1",
    suspended: false,
  };

  function ac() {
    if (!SND.ac) SND.ac = new (window.AudioContext || window.webkitAudioContext)();
    if (SND.ac.state === "suspended" && !SND.suspended) SND.ac.resume();
    return SND.ac;
  }

  function noiseBuffer(a, dur) {
    const n = Math.floor(a.sampleRate * dur);
    const buf = a.createBuffer(1, n, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    return buf;
  }

  /** Удар металла: шумовой транзиент через полосовой + два расстроенных тона. */
  function clang(tier, gain = 1) {
    if (SND.muted || SND.suspended) return;
    const a = ac();
    const t = a.currentTime;
    const base = 200 * Math.pow(2, (MAX_TIER - tier) / 5.5);

    const src = a.createBufferSource();
    src.buffer = noiseBuffer(a, 0.16);
    const bp = a.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = base * 3.4;
    bp.Q.value = 1.6;
    const ng = a.createGain();
    ng.gain.setValueAtTime(0.16 * gain, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    src.connect(bp).connect(ng).connect(a.destination);
    src.start(t);

    for (const [mult, vol, dur] of [[1, 0.2, 0.5], [2.71, 0.09, 0.34]]) {
      const o = a.createOscillator();
      o.type = "triangle";
      o.frequency.setValueAtTime(base * mult, t);
      o.frequency.exponentialRampToValueAtTime(base * mult * 0.94, t + dur);
      const g = a.createGain();
      g.gain.setValueAtTime(vol * gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(a.destination);
      o.start(t);
      o.stop(t + dur);
    }
  }

  function thud() {
    if (SND.muted || SND.suspended) return;
    const a = ac();
    const t = a.currentTime;
    const src = a.createBufferSource();
    src.buffer = noiseBuffer(a, 0.07);
    const lp = a.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    const g = a.createGain();
    g.gain.setValueAtTime(0.09, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    src.connect(lp).connect(g).connect(a.destination);
    src.start(t);
  }

  // Требование площадки: звук замолкает на рекламе и при уходе со вкладки.
  function setSuspended(v) {
    SND.suspended = v;
    if (SND.ac) v ? SND.ac.suspend() : SND.ac.resume();
  }

  document.addEventListener("visibilitychange", () => setSuspended(document.hidden));

  // ── Яндекс SDK: работает и без него ─────────────────────────────

  const YS = { sdk: null, lb: false };

  /** SDK живёт только на площадке: вне её тег ничего не грузит и не сорит в консоль. */
  function loadSdkScript() {
    const YA = /(^|\.)yandex\.(ru|net|com)$/i;
    // на площадке игра лежит на *.yandex.net; при внешнем хостинге — во фрейме Яндекса
    const parent = (location.ancestorOrigins && location.ancestorOrigins[0]) || document.referrer || "";
    const onPlatform = YA.test(location.hostname) || /yandex\.(ru|net|com)/i.test(parent);
    if (!onPlatform || typeof YaGames !== "undefined") return Promise.resolve();
    return new Promise((res) => {
      const el = document.createElement("script");
      el.src = "/sdk.js";
      el.onload = el.onerror = () => res();
      document.head.appendChild(el);
    });
  }

  async function initSdk() {
    await loadSdkScript();
    if (typeof YaGames === "undefined") return;
    try {
      YS.sdk = await YaGames.init();
      const lang = YS.sdk.environment?.i18n?.lang;
      if (lang && STR[lang]) L = STR[lang];
      // getLeaderboards() устарел и бросает — метод проверяем через isAvailableMethod
      try { YS.lb = await YS.sdk.isAvailableMethod("leaderboards.setScore"); } catch { YS.lb = false; }
    } catch { /* играем без платформы */ }
  }

  function sdkReady() { try { YS.sdk?.features?.LoadingAPI?.ready(); } catch {} }
  function sdkStart() { try { YS.sdk?.features?.GameplayAPI?.start(); } catch {} }
  function sdkStop() { try { YS.sdk?.features?.GameplayAPI?.stop(); } catch {} }

  function sdkScore(v) {
    if (!YS.lb) return;
    // требует авторизованного игрока и не чаще раза в секунду — отказ тут не беда
    Promise.resolve(YS.sdk.leaderboards.setScore("kuznets", v)).catch(() => {});
  }

  /** Межстраничная реклама через игру — не в каждом заходе, чтобы не бесить. */
  function sdkAd(after) {
    const adv = YS.sdk?.adv;
    if (!adv || S.games % 2 !== 0) return after();
    let done = false;
    const finish = () => { if (done) return; done = true; setSuspended(false); after(); };
    try {
      adv.showFullscreenAdv({
        callbacks: { onOpen: () => setSuspended(true), onClose: finish, onError: finish },
      });
      setTimeout(finish, 12000);   // страховка, если колбэк не придёт
    } catch { finish(); }
  }

  // ── Раскладка ───────────────────────────────────────────────────

  let px = 1; // логических единиц на CSS-пиксель

  function layout() {
    const cab = $("cabinet");
    const gap = 10;
    const availH = cab.clientHeight - $("hud").offsetHeight - $("bar").offsetHeight - gap * 2;
    const availW = cab.clientWidth;

    // тянем горн по форме окна: на вытянутом экране бассейн глубже
    H = Math.max(H_MIN, Math.min(H_MAX, Math.round(W * availH / availW)));
    Body.setPosition(floor, { x: W / 2, y: H + 30 });

    const s = Math.min(availW / W, availH / H);
    const cssW = Math.max(160, Math.floor(W * s));
    const cssH = Math.floor(cssW * H / W);
    stage.style.width = cssW + "px";
    stage.style.height = cssH + "px";
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.floor(cssW * dpr);
    cv.height = Math.floor(cssH * dpr);
    px = cv.width / W;
  }

  window.addEventListener("resize", layout);
  window.addEventListener("orientationchange", () => setTimeout(layout, 120));

  // ── Частицы ─────────────────────────────────────────────────────

  function sparks(x, y, n, tier) {
    const tint = TINT[tier] || "#ffae5a";
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 2 + Math.random() * 6;
      particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 1.5,
        life: 1,
        decay: 0.012 + Math.random() * 0.02,
        r: 1 + Math.random() * 2.4,
        c: Math.random() < 0.45 ? tint : "#ffd08a",
      });
    }
  }

  function pop(x, y, text, tint) {
    floats.push({ x, y, text, tint, t: 0 });
  }

  function stepParticles() {
    for (let i = floats.length - 1; i >= 0; i--) {
      floats[i].t += 0.013;
      if (floats[i].t >= 1) floats.splice(i, 1);
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.22; p.vx *= 0.985; p.vy *= 0.985;
      p.life -= p.decay;
      if (p.life <= 0) particles.splice(i, 1);
    }
    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i];
      r.t += 0.055;
      if (r.t >= 1) rings.splice(i, 1);
    }
    for (let i = arcs.length - 1; i >= 0; i--) {
      arcs[i].t += 0.06;
      if (arcs[i].t >= 1) arcs.splice(i, 1);
    }
  }

  // ── Заготовки ───────────────────────────────────────────────────

  function rollTier() {
    const r = Math.random();
    return r < 0.45 ? 1 : r < 0.8 ? 2 : 3;
  }

  function spawn(tier, x, y, vx = 0, vy = 0) {
    const b = Bodies.circle(x, y, R[tier], {
      restitution: 0.12,
      friction: 0.36,
      frictionStatic: 0.6,
      density: 0.0011,
      slop: 0.02,
    });
    b.tier = tier;
    b.born = performance.now();
    Body.setVelocity(b, { x: vx, y: vy });
    Composite.add(world, b);
    orbs.push(b);
    markSeen(tier);
    return b;
  }

  function despawn(b) {
    Composite.remove(world, b);
    const i = orbs.indexOf(b);
    if (i >= 0) orbs.splice(i, 1);
    consumed.delete(b.id);
  }

  function markSeen(tier) {
    if (S.seen.has(tier)) return;
    S.seen.add(tier);
    const img = elLadder.children[tier - 1];
    if (!img) return;
    img.classList.add("seen", "fresh");
    setTimeout(() => img.classList.remove("fresh"), 380);
  }

  function fuse(a, b, at) {
    const tier = a.tier;
    const now = performance.now();
    S.chain = now - S.chainAt < CHAIN_MS ? S.chain + 1 : 1;
    S.chainAt = now;
    const pos = at || { x: (a.position.x + b.position.x) / 2, y: (a.position.y + b.position.y) / 2 };
    const vx = (a.velocity.x + b.velocity.x) / 2;
    const vy = (a.velocity.y + b.velocity.y) / 2;
    despawn(a); despawn(b);

    if (tier >= MAX_TIER) {
      addScore(POP_SCORE * S.chain);
      pop(pos.x, pos.y - R[MAX_TIER] * 0.7, `+${POP_SCORE * S.chain}`, TINT[MAX_TIER]);
      sparks(pos.x, pos.y, 90, MAX_TIER);
      rings.push({ x: pos.x, y: pos.y, r0: R[MAX_TIER], t: 0, c: TINT[MAX_TIER] });
      S.shake = 16;
      clang(MAX_TIER, 1.4);
      flash(L.popped);
      return;
    }

    const next = tier + 1;
    const gain = SCORE[next] * S.chain;
    spawn(next, pos.x, pos.y, vx * 0.5, vy * 0.5);
    addScore(gain);
    pop(pos.x, pos.y - R[next] * 0.75,
        S.chain > 1 ? `+${gain} ×${S.chain}` : `+${gain}`, TINT[next]);
    addHeat(HEAT[next]);
    sparks(pos.x, pos.y, 12 + next * 4, next);
    rings.push({ x: pos.x, y: pos.y, r0: R[next], t: 0, c: TINT[next] });
    S.shake = Math.min(10, 1.6 + next * 0.9);
    clang(next);
  }

  // ── Счёт, жар ───────────────────────────────────────────────────

  function addScore(v) {
    S.score += v;
    elScore.textContent = S.score;
    elScore.classList.remove("bump");
    void elScore.offsetWidth;
    elScore.classList.add("bump");
  }

  function addHeat(v) {
    S.heat = Math.min(100, S.heat + v);
    renderHeat();
  }

  function renderHeat() {
    elHeatFill.style.width = S.heat + "%";
    const full = S.heat >= 100;
    elHeatTrack.classList.toggle("full", full);
    elHammer.disabled = !full || !S.running;
    if (!full) disarm();
  }

  // ── Перековка ───────────────────────────────────────────────────

  let hintTimer = 0;

  function flash(msg) {
    elHint.textContent = msg;
    elHint.classList.remove("hidden");
    elHint.style.opacity = "1";
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => { elHint.style.opacity = "0"; }, 1600);
  }

  function arm() {
    if (S.heat < 100 || !S.running) { flash(L.needHeat); return; }
    S.armed = true;
    elHammer.classList.add("armed");
    stage.classList.add("aim");
    flash(L.pickTarget);
  }

  function disarm() {
    S.armed = false;
    elHammer.classList.remove("armed");
    stage.classList.remove("aim");
  }

  function orbAt(x, y) {
    for (let i = orbs.length - 1; i >= 0; i--) {
      const o = orbs[i];
      if (Math.hypot(o.position.x - x, o.position.y - y) <= o.circleRadius) return o;
    }
    return null;
  }

  /** Сваривает выбранный слиток с ближайшим таким же — где бы тот ни лежал. */
  function reforge(x, y) {
    const target = orbAt(x, y);
    if (!target) { flash(L.missed); return false; }   // молот остаётся занесён

    let mate = null, bd = Infinity;
    for (const o of orbs) {
      if (o === target || o.tier !== target.tier) continue;
      const d = Math.hypot(o.position.x - target.position.x, o.position.y - target.position.y);
      if (d < bd) { bd = d; mate = o; }
    }
    if (!mate) { flash(L.noPair); return false; }

    arcs.push({
      x1: mate.position.x, y1: mate.position.y,
      x2: target.position.x, y2: target.position.y, t: 0,
    });
    sparks(mate.position.x, mate.position.y, 18, mate.tier);
    fuse(target, mate, { x: target.position.x, y: target.position.y });

    S.heat = 0;
    renderHeat();
    disarm();
    return true;
  }

  // ── Управление ──────────────────────────────────────────────────

  function toLogical(e) {
    const r = stage.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * W / r.width,
      y: (e.clientY - r.top) * H / r.height,
    };
  }

  function clampAim(x) {
    const r = R[S.holdTier];
    return Math.max(r + 4, Math.min(W - r - 4, x));
  }

  function drop() {
    const now = performance.now();
    if (!S.running || now - S.lastDrop < DROP_COOLDOWN) return;
    S.lastDrop = now;
    spawn(S.holdTier, S.aimX, DROP_Y, 0, 1);
    thud();
    S.holdTier = S.nextTier;
    S.nextTier = rollTier();
    elNextImg.src = `assets/${FILES[S.nextTier]}.png`;
    S.aimX = clampAim(S.aimX);
  }

  stage.addEventListener("pointermove", (e) => {
    const p = toLogical(e);
    S.ptr = p;
    if (!S.armed) S.aimX = clampAim(p.x);
  });

  stage.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    const p = toLogical(e);
    S.ptr = p;
    if (S.armed) { reforge(p.x, p.y); return; }
    S.aimX = clampAim(p.x);
  });

  stage.addEventListener("pointerup", (e) => {
    if (S.armed) return;
    const p = toLogical(e);
    S.aimX = clampAim(p.x);
    drop();
  });

  stage.addEventListener("pointercancel", () => {});

  elHammer.addEventListener("click", () => (S.armed ? disarm() : arm()));

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") S.aimX = clampAim(S.aimX - 22);
    else if (e.key === "ArrowRight") S.aimX = clampAim(S.aimX + 22);
    else if (e.key === " " || e.key === "Enter") { e.preventDefault(); S.running ? drop() : start(); }
    else if (e.key === "h" || e.key === "H" || e.key === "р" || e.key === "Р") arm();
    else if (e.key === "Escape") disarm();
  });

  $("sound").addEventListener("click", (e) => {
    SND.muted = !SND.muted;
    localStorage.setItem("kuznets.muted", SND.muted ? "1" : "0");
    e.currentTarget.classList.toggle("off", SND.muted);
  });

  // ── Отрисовка ───────────────────────────────────────────────────

  function draw(now) {
    ctx.setTransform(px, 0, 0, px, 0, 0);
    ctx.imageSmoothingEnabled = true;    // спрайт 192 px тянется на 60..230 — сглаживание нужно
    ctx.clearRect(0, 0, W, H);

    let sx = 0, sy = 0;
    if (S.shake > 0.3) {
      sx = (Math.random() - 0.5) * S.shake;
      sy = (Math.random() - 0.5) * S.shake;
      S.shake *= 0.86;
    }
    ctx.save();
    ctx.translate(sx, sy);

    // горн: холодные стены, раскалённое дно
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#151009");
    bg.addColorStop(0.55, "#0e0b08");
    bg.addColorStop(1, "#191009");
    ctx.fillStyle = bg;
    ctx.fillRect(-20, -20, W + 40, H + 40);

    const glow = 0.1 + (S.heat / 100) * 0.22 + Math.sin(now / 620) * 0.02;
    const eg = ctx.createRadialGradient(W / 2, H + 40, 10, W / 2, H + 40, W * 0.85);
    eg.addColorStop(0, `rgba(255,122,24,${glow.toFixed(3)})`);
    eg.addColorStop(1, "rgba(255,122,24,0)");
    ctx.fillStyle = eg;
    ctx.fillRect(-20, H * 0.4, W + 40, H * 0.6 + 40);

    // линия горна
    const danger = S.deathT > 220;
    ctx.save();
    ctx.setLineDash([9, 9]);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = danger
      ? `rgba(239,68,68,${(0.45 + Math.sin(now / 90) * 0.35).toFixed(3)})`
      : "rgba(255,255,255,.11)";
    ctx.beginPath();
    ctx.moveTo(0, DEATH_Y);
    ctx.lineTo(W, DEATH_Y);
    ctx.stroke();
    ctx.restore();

    // прицел и заготовка в руке
    if (S.running) {
      ctx.save();
      ctx.setLineDash([3, 8]);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(255,170,90,.28)";
      ctx.beginPath();
      ctx.moveTo(S.aimX, DROP_Y + R[S.holdTier]);
      ctx.lineTo(S.aimX, H - 8);
      ctx.stroke();
      ctx.restore();
      drawOrb(S.holdTier, S.aimX, DROP_Y, 0, S.armed ? 0.35 : 1);
    }

    for (const b of orbs) {
      drawOrb(b.tier, b.position.x, b.position.y, b.angle, 1,
        S.armed && orbAt(S.ptr.x, S.ptr.y) === b);
    }

    // сварочная дуга перековки
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const a of arcs) {
      ctx.globalAlpha = 1 - a.t;
      ctx.strokeStyle = "#ffd08a";
      ctx.lineWidth = 3 * (1 - a.t) + 0.6;
      ctx.beginPath();
      ctx.moveTo(a.x1, a.y1);
      ctx.lineTo(a.x2, a.y2);
      ctx.stroke();
    }
    for (const r of rings) {
      ctx.globalAlpha = (1 - r.t) * 0.75;
      ctx.strokeStyle = r.c;
      ctx.lineWidth = 3 * (1 - r.t) + 0.5;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r0 * (1 + r.t * 1.15), 0, Math.PI * 2);
      ctx.stroke();
    }
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    for (const f of floats) {
      const rise = f.t * 46;
      ctx.save();
      ctx.globalAlpha = f.t < 0.15 ? f.t / 0.15 : 1 - (f.t - 0.15) / 0.85;
      ctx.font = "700 26px 'Segoe UI', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(8,6,5,.85)";
      ctx.strokeText(f.text, f.x, f.y - rise);
      ctx.fillStyle = f.tint;
      ctx.fillText(f.text, f.x, f.y - rise);
      ctx.restore();
    }

    ctx.restore();
  }

  function drawOrb(tier, x, y, angle, alpha, highlight) {
    const im = IMG[tier];
    const r = R[tier];
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    if (angle) ctx.rotate(angle);
    if (im && im.width) ctx.drawImage(im, -r, -r, r * 2, r * 2);
    else {
      ctx.fillStyle = TINT[tier];
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (highlight) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, r + 2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── Цикл ────────────────────────────────────────────────────────

  Events.on(engine, "collisionStart", (e) => {
    for (const p of e.pairs) {
      const a = p.bodyA, b = p.bodyB;
      if (!a.tier || !b.tier || a.tier !== b.tier) continue;
      if (consumed.has(a.id) || consumed.has(b.id)) continue;
      consumed.add(a.id);
      consumed.add(b.id);
      pendingMerges.push([a, b]);
    }
  });

  const STEP = 1000 / 60;     // физика идёт фиксированным тиком: одинаково на 60 и 144 Гц
  const MAX_SUBSTEPS = 4;
  let last = 0;
  let acc = 0;

  function resolveMerges() {
    while (pendingMerges.length) {
      const [a, b] = pendingMerges.shift();
      if (orbs.includes(a) && orbs.includes(b)) fuse(a, b);
      else { consumed.delete(a.id); consumed.delete(b.id); }
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(100, now - last || STEP);
    last = now;

    if (S.running) {
      acc += dt;
      let n = 0;
      while (acc >= STEP && n < MAX_SUBSTEPS) {
        Engine.update(engine, STEP);
        resolveMerges();
        acc -= STEP;
        n++;
      }
      if (acc > STEP * MAX_SUBSTEPS) acc = 0;   // вкладка была свёрнута — не догоняем

      // перелив через край горна
      let over = false;
      for (const b of orbs) {
        if (now - b.born < SPAWN_GRACE) continue;
        if (b.position.y - b.circleRadius < DEATH_Y && b.speed < 1.1) { over = true; break; }
      }
      S.deathT = over ? S.deathT + dt : 0;
      if (S.deathT > DEATH_HOLD) gameOver();
    }

    stepParticles();
    draw(now);
  }

  // ── Партия ──────────────────────────────────────────────────────

  function start() {
    for (const b of orbs.slice()) despawn(b);
    particles.length = rings.length = arcs.length = pendingMerges.length = 0;
    consumed.clear();
    S.running = true;
    S.score = 0;
    S.heat = 0;
    S.deathT = 0;
    S.shake = 0;
    S.aimX = W / 2;
    S.holdTier = rollTier();
    S.nextTier = rollTier();
    S.lastDrop = -1e9;
    S.chain = 0;
    S.chainAt = 0;
    floats.length = 0;
    S.seen.clear();
    acc = 0;
    for (const im of elLadder.children) im.classList.remove("seen", "fresh");
    disarm();
    elScore.textContent = "0";
    elNextImg.src = `assets/${FILES[S.nextTier]}.png`;
    renderHeat();
    $("veil").classList.add("hidden");
    $("over").classList.add("hidden");
    ac();
    sdkStart();
  }

  function gameOver() {
    S.running = false;
    S.games++;
    disarm();
    renderHeat();
    sdkStop();

    const best = S.score > S.best;
    if (best) {
      S.best = S.score;
      localStorage.setItem("kuznets.best", String(S.best));
      elBest.textContent = S.best;
    }
    sdkScore(S.score);

    const top = Math.max(...[...S.seen], 1);
    $("over-score").textContent = S.score;
    $("over-line").textContent = best ? L.newBest : L.reached(top);

    sdkAd(() => $("over").classList.remove("hidden"));
  }

  $("play").addEventListener("click", start);
  $("again").addEventListener("click", start);

  // ── Старт ───────────────────────────────────────────────────────

  function applyLang() {
    document.documentElement.lang = L === STR.en ? "en" : "ru";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = L[el.dataset.i18n];
      if (typeof v === "string") el.textContent = v;
    });
  }

  function buildLadder() {
    for (let t = 1; t <= MAX_TIER; t++) {
      const im = new Image();
      im.src = `assets/${FILES[t]}.png`;
      im.alt = L.tiers[t];
      im.title = L.tiers[t];
      elLadder.appendChild(im);
    }
  }

  (async () => {
    await initSdk();
    if (!YS.sdk && /^en/i.test(navigator.language || "")) L = STR.en;
    applyLang();
    buildLadder();
    elBest.textContent = S.best;
    $("sound").classList.toggle("off", SND.muted);
    await preload();
    $("play").disabled = false;
    layout();
    requestAnimationFrame(frame);
    sdkReady();
  })();
})();
