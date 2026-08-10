/* ─────────────────────────────────────────────────────────────
   Auto Wala — Animated Auto Rickshaw & Player Logic
   Daytime Highway Edition — Seamless Parallax & 4-Horn Sequential Player
   Using User's Vector Auto Artwork (7923563.svg)
   Playlist: RDCLAK5uy_n7VIYx-oWOJQanlpBG6GRyLZxpWYMltB8
   ───────────────────────────────────────────────────────────── */

const PLAYLIST_ID = 'RDCLAK5uy_n7VIYx-oWOJQanlpBG6GRyLZxpWYMltB8';

const $ = (id) => document.getElementById(id);

const el = {
  player: $('player'),
  cover: $('cover'),
  title: $('title'),
  artist: $('artist'),
  seek: $('seek'),
  seekFill: $('seekFill'),
  seekKnob: $('seekKnob'),
  tCur: $('tCur'),
  tDur: $('tDur'),
  play: $('play'),
  prev: $('prev'),
  next: $('next'),
  shuffle: $('shuffle'),
  listBtn: $('listBtn'),
  list: $('list'),
  listItems: $('listItems'),
  clock: $('clock'),
  listeners: $('listeners'),
  bumperText: $('bumperText'),
  bumperNext: $('bumperNext'),
  horn: $('horn'),
  logo: document.querySelector('.logo'),
  canvas: $('roadCanvas'),
};

const state = {
  tracks: [],
  order: [],
  pos: 0,
  shuffle: false,
  ready: false,
  playing: false,
  started: false,
  scrubbing: false,
  hornFlashing: 0,
};

let yt = null;

/* ── 100% Seamless Infinite Looping Canvas Engine ───────────── */

(function initRoadCanvas() {
  const canvas = el.canvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let roadY = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    roadY = height * 0.68;
  }
  window.addEventListener('resize', resize);
  resize();

  // Load User's Custom Vector SVG Auto
  const autoImg = new Image();
  autoImg.src = './assets/auto-custom.svg';
  let autoImgLoaded = false;
  autoImg.onload = () => {
    autoImgLoaded = true;
  };

  // Drifting Daytime Clouds (Seamless Infinite Wrapping)
  const clouds = Array.from({ length: 7 }, (_, i) => ({
    x: (width / 7) * i + Math.random() * 80,
    y: Math.random() * (height * 0.25) + 25,
    scale: Math.random() * 0.5 + 0.55,
    speed: Math.random() * 0.35 + 0.25,
  }));

  const smokeParticles = [];
  let distance = 0;

  function animate(timestamp) {
    requestAnimationFrame(animate);

    const speed = state.playing ? 4.5 : 1.8;
    distance += speed;

    // 1. Bright Sunny Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, roadY);
    skyGrad.addColorStop(0, '#3a88e9'); // Azure Blue Top
    skyGrad.addColorStop(0.5, '#68b4f8'); // Bright Sky Blue
    skyGrad.addColorStop(0.85, '#a0d8fb'); // Soft Light Blue
    skyGrad.addColorStop(1, '#ffe4b5'); // Warm Sunny Horizon
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Bright Golden Sun with Soft Flare
    const sunX = width * 0.82;
    const sunY = height * 0.18;
    
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 110);
    sunGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    sunGlow.addColorStop(0.3, 'rgba(255, 235, 130, 0.6)');
    sunGlow.addColorStop(1, 'rgba(255, 235, 130, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 110, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 28, 0, Math.PI * 2);
    ctx.fill();

    // 3. Drifting Clouds (Seamless Edge Re-entry)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    clouds.forEach((c) => {
      c.x -= c.speed;
      if (c.x < -180) {
        c.x = width + 180;
        c.y = Math.random() * (height * 0.25) + 25;
      }

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(c.scale, c.scale);
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0, Math.PI * 2);
      ctx.arc(20, -12, 28, 0, Math.PI * 2);
      ctx.arc(45, -5, 22, 0, Math.PI * 2);
      ctx.arc(60, 5, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 4. Distant Mountain Range (Layer 1 - Continuous Multi-Harmonic Function)
    ctx.fillStyle = '#4fa86c';
    ctx.beginPath();
    ctx.moveTo(0, roadY);
    const step1 = 12;
    const dist1 = distance * 0.15;
    for (let x = 0; x <= width + step1; x += step1) {
      const gx = x + dist1;
      const hY = 40 + Math.sin(gx * 0.0035) * 28 + Math.sin(gx * 0.008 + 1.5) * 16 + Math.cos(gx * 0.015) * 8;
      ctx.lineTo(x, roadY - hY);
    }
    ctx.lineTo(width, roadY);
    ctx.lineTo(0, roadY);
    ctx.closePath();
    ctx.fill();

    // 5. Foreground Hills (Layer 2 - Continuous Multi-Harmonic Function)
    ctx.fillStyle = '#2d7a46';
    ctx.beginPath();
    ctx.moveTo(0, roadY);
    const step2 = 10;
    const dist2 = distance * 0.35;
    for (let x = 0; x <= width + step2; x += step2) {
      const gx = x + dist2;
      const hY = 22 + Math.sin(gx * 0.006 + 0.8) * 18 + Math.cos(gx * 0.014 + 2.1) * 10;
      ctx.lineTo(x, roadY - hY);
    }
    ctx.lineTo(width, roadY);
    ctx.lineTo(0, roadY);
    ctx.closePath();
    ctx.fill();

    // Roadside Grass Embankment
    ctx.fillStyle = '#3a8c50';
    ctx.fillRect(0, roadY - 6, width, 6);

    // 6. Daytime Asphalt Highway Surface
    ctx.fillStyle = '#424a4d';
    ctx.fillRect(0, roadY, width, height - roadY);

    // Road Top Yellow Curb Line
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(0, roadY - 4, width, 4);

    // 7. Bright White Dashed Lane Lines (Seamless Index Wrapping)
    ctx.fillStyle = '#ffffff';
    const dashLength = 55;
    const dashGap = 45;
    const dashPeriod = dashLength + dashGap;
    const dashSpeed = distance * 2.2;
    const firstDashIdx = Math.floor((dashSpeed - width - 100) / dashPeriod);
    const lastDashIdx = Math.ceil((dashSpeed + 100) / dashPeriod);
    const dashY = roadY + (height - roadY) * 0.42;

    for (let i = firstDashIdx; i <= lastDashIdx; i++) {
      const dx = i * dashPeriod - dashSpeed + width;
      ctx.fillRect(dx, dashY, dashLength, 6);
    }

    // ── PERFECT HORIZONTALLY CENTERED AUTO RICKSHAW ─────────────
    const autoW = Math.min(width * 0.8, 340);
    const autoH = autoW;
    const autoX = (width - autoW) / 2; // EXACT HORIZONTAL CENTER!
    
    const bounceY = Math.sin(timestamp * (state.playing ? 0.025 : 0.01)) * (state.playing ? 4.5 : 1.5);
    const autoY = roadY - autoH * 0.76 + bounceY;

    // Headlight Cone (Flashes bright when horn is sounded)
    const isHorn = state.hornFlashing > 0;
    if (isHorn) state.hornFlashing--;

    const headX = autoX + autoW * 0.85;
    const headY = autoY + autoH * 0.62;

    if (isHorn) {
      const headBeam = ctx.createLinearGradient(headX, headY, headX + 350, headY + 20);
      headBeam.addColorStop(0, 'rgba(255, 255, 220, 0.95)');
      headBeam.addColorStop(1, 'rgba(255, 240, 160, 0)');
      ctx.fillStyle = headBeam;
      ctx.beginPath();
      ctx.moveTo(headX, headY - 10);
      ctx.lineTo(width + 100, headY - 100);
      ctx.lineTo(width + 100, headY + 160);
      ctx.closePath();
      ctx.fill();
    }

    // Silencer Smoke Particles
    if (Math.random() < (state.playing ? 0.6 : 0.2)) {
      smokeParticles.push({
        x: autoX + autoW * 0.1,
        y: autoY + autoH * 0.76,
        r: Math.random() * 4 + 3,
        alpha: 0.55,
        vx: -Math.random() * 2.2 - 1,
        vy: -Math.random() * 0.8,
      });
    }

    // Draw Centered Vector Auto Rickshaw Image
    if (autoImgLoaded) {
      ctx.drawImage(autoImg, autoX, autoY, autoW, autoH);
    }

    // Rotating Wheel Spoke Accents
    const wheelAngle = (distance * 0.12) % (Math.PI * 2);
    function drawWheelOverlay(wx, wy, radius) {
      ctx.save();
      ctx.translate(wx, wy);
      ctx.rotate(wheelAngle);
      ctx.strokeStyle = '#ffd000';
      ctx.lineWidth = 2.5;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawWheelOverlay(autoX + autoW * 0.18, autoY + autoH * 0.794, autoW * 0.045);
    drawWheelOverlay(autoX + autoW * 0.843, autoY + autoH * 0.796, autoW * 0.045);

    // Equalizer music waves
    if (state.playing) {
      ctx.strokeStyle = '#00e676';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const h = Math.sin(timestamp * 0.02 + i) * 16 + 14;
        ctx.moveTo(autoX + autoW * 0.42 + i * 10, autoY + autoH * 0.28);
        ctx.lineTo(autoX + autoW * 0.42 + i * 10, autoY + autoH * 0.28 - h);
      }
      ctx.stroke();
    }

    // Render Smoke Particles
    for (let i = smokeParticles.length - 1; i >= 0; i--) {
      const p = smokeParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.r += 0.2;
      p.alpha -= 0.016;

      if (p.alpha <= 0) {
        smokeParticles.splice(i, 1);
        continue;
      }

      ctx.fillStyle = `rgba(140, 160, 150, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  requestAnimationFrame(animate);
})();

/* ── Helpers ─────────────────────────────────────────────────── */

const fmt = (s) => {
  if (!Number.isFinite(s) || s < 0) s = 0;
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const currentTrack = () => state.tracks[state.pos] || {};

/* ── Track & Playlist Syncing ───────────────────────────────── */

let swapTimer = null;

function renderTrack() {
  const t = currentTrack();
  if (!t.title) return;

  if (el.title.dataset.rendered) {
    el.player.classList.add('is-swapping');
    clearTimeout(swapTimer);
    swapTimer = setTimeout(() => el.player.classList.remove('is-swapping'), 40);
  }
  el.title.dataset.rendered = '1';

  el.title.textContent = t.title;
  el.artist.textContent = t.artist || 'Bollywood Retro Bangers';
  el.cover.src = t.cover || `https://i.ytimg.com/vi/${t.id}/hqdefault.jpg`;
  el.cover.alt = `${t.title} artwork`;
  
  if (state.started) document.title = `${t.title} — Auto Wala`;

  [...el.listItems.children].forEach((li, i) =>
    li.classList.toggle('is-current', i === state.pos),
  );
  const active = el.listItems.children[state.pos];
  if (active && el.list.classList.contains('is-open')) {
    active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

function updateTrackFromYT() {
  if (!yt || typeof yt.getVideoData !== 'function') return;
  const data = yt.getVideoData();
  if (!data || !data.video_id) return;

  const currentIdx = typeof yt.getPlaylistIndex === 'function' ? yt.getPlaylistIndex() : state.pos;
  if (currentIdx >= 0) state.pos = currentIdx;

  const title = data.title || 'Bollywood Highway Track';
  const artist = data.author || 'Retro Highway Collection';
  const id = data.video_id;
  const cover = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  if (!state.tracks[state.pos]) {
    state.tracks[state.pos] = { id, title, artist, cover };
  } else {
    state.tracks[state.pos].title = title;
    state.tracks[state.pos].artist = artist;
    state.tracks[state.pos].cover = cover;
  }

  renderTrack();
}

function syncPlaylistFromYT() {
  if (!yt || typeof yt.getPlaylist !== 'function') return;
  const playlistIds = yt.getPlaylist();
  if (Array.isArray(playlistIds) && playlistIds.length > 0) {
    state.tracks = playlistIds.map((id, idx) => ({
      id,
      title: state.tracks[idx]?.title || `Track ${idx + 1}`,
      artist: state.tracks[idx]?.artist || 'Bollywood Retro',
      cover: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    }));
    renderList();
  }
}

function renderList() {
  el.listItems.innerHTML = '';
  state.tracks.forEach((t, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';

    const title = document.createElement('span');
    title.className = 't-title';
    title.textContent = t.title;

    const artist = document.createElement('span');
    artist.className = 't-artist';
    artist.textContent = t.artist || '';

    btn.append(title, artist);
    btn.addEventListener('click', () => go(i));
    li.append(btn);
    el.listItems.append(li);
  });
}

function renderPlaying(on) {
  state.playing = on;
  el.player.classList.toggle('is-playing', on);
  el.play.setAttribute('aria-label', on ? 'Pause' : 'Play');
}

/* ── Playback Controls ───────────────────────────────────────── */

function go(newPos) {
  state.pos = newPos;
  if (yt && typeof yt.playVideoAt === 'function') {
    state.started = true;
    yt.playVideoAt(newPos);
  }
  renderTrack();
}

function toggle() {
  if (!yt || !state.ready) return;
  if (state.playing) {
    yt.pauseVideo();
  } else {
    state.started = true;
    yt.playVideo();
  }
}

/* ── Progress Loop ───────────────────────────────────────────── */

const poll = { at: 0, time: 0, duration: 0 };
let lastSecond = -1;
let lastDuration = -1;

function samplePlayer() {
  if (!yt || typeof yt.getCurrentTime !== 'function') return;
  poll.time = yt.getCurrentTime() || 0;
  poll.duration = yt.getDuration() || 0;
  poll.at = performance.now();
  updateTrackFromYT();
}

function paintProgress() {
  requestAnimationFrame(paintProgress);
  if (!yt || state.scrubbing || !poll.duration) return;

  const drift = state.playing ? (performance.now() - poll.at) / 1000 : 0;
  const cur = Math.min(poll.duration, poll.time + drift);
  const frac = Math.min(1, Math.max(0, cur / poll.duration));

  el.seekFill.style.transform = `scaleX(${frac})`;
  el.seekKnob.style.transform = `translate(-50%, -50%) translateX(${
    frac * el.seek.clientWidth
  }px)`;

  const second = Math.floor(cur);
  if (second !== lastSecond) {
    lastSecond = second;
    el.tCur.textContent = fmt(cur);
    el.seek.setAttribute('aria-valuenow', String(Math.round(frac * 100)));
  }
  if (poll.duration !== lastDuration) {
    lastDuration = poll.duration;
    el.tDur.textContent = fmt(poll.duration);
  }
}

/* ── Seeking ─────────────────────────────────────────────────── */

function fractionFromEvent(e) {
  const r = el.seek.getBoundingClientRect();
  return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
}

function previewSeek(frac) {
  el.seekFill.style.transform = `scaleX(${frac})`;
  el.seekKnob.style.transform = `translate(-50%, -50%) translateX(${
    frac * el.seek.clientWidth
  }px)`;
  if (yt && typeof yt.getDuration === 'function') {
    el.tCur.textContent = fmt((yt.getDuration() || 0) * frac);
  }
}

el.seek.addEventListener('pointerdown', (e) => {
  if (!yt) return;
  state.scrubbing = true;
  el.seek.setPointerCapture(e.pointerId);
  previewSeek(fractionFromEvent(e));
});

el.seek.addEventListener('pointermove', (e) => {
  if (state.scrubbing) previewSeek(fractionFromEvent(e));
});

el.seek.addEventListener('pointerup', (e) => {
  if (!state.scrubbing) return;
  state.scrubbing = false;
  el.seek.releasePointerCapture(e.pointerId);
  const dur = yt?.getDuration?.() || 0;
  if (dur) yt.seekTo(dur * fractionFromEvent(e), true);
  samplePlayer();
});

el.seek.addEventListener('keydown', (e) => {
  const step = e.key === 'ArrowRight' ? 5 : e.key === 'ArrowLeft' ? -5 : 0;
  if (!step || !yt) return;
  e.preventDefault();
  yt.seekTo(Math.max(0, (yt.getCurrentTime() || 0) + step), true);
});

/* ── Button Listeners ────────────────────────────────────────── */

el.play.addEventListener('click', toggle);

el.prev.addEventListener('click', () => {
  if (yt && typeof yt.previousVideo === 'function') {
    state.started = true;
    yt.previousVideo();
  }
});

el.next.addEventListener('click', () => {
  if (yt && typeof yt.nextVideo === 'function') {
    state.started = true;
    yt.nextVideo();
  }
});

el.shuffle.addEventListener('click', () => {
  state.shuffle = !state.shuffle;
  el.shuffle.classList.toggle('is-on', state.shuffle);
  el.shuffle.setAttribute('aria-pressed', String(state.shuffle));
  if (yt && typeof yt.setShuffle === 'function') {
    yt.setShuffle(state.shuffle);
  }
});

el.listBtn.addEventListener('click', () => {
  const open = !el.list.classList.contains('is-open');
  el.list.classList.toggle('is-open', open);
  el.listBtn.classList.toggle('is-on', open);
  el.listBtn.setAttribute('aria-expanded', String(open));
  if (open) {
    el.listItems.children[state.pos]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
});

document.addEventListener('keydown', (e) => {
  if (e.target.matches('input, textarea, [contenteditable]')) return;
  if (e.key === ' ' || e.key === 'k') {
    e.preventDefault();
    toggle();
  } else if (e.key === 'n' || e.key === 'ArrowRight') {
    if (e.target !== el.seek && yt?.nextVideo) yt.nextVideo();
  } else if (e.key === 'p' || e.key === 'ArrowLeft') {
    if (e.target !== el.seek && yt?.previousVideo) yt.previousVideo();
  } else if (e.key === 'h') {
    honk();
  }
});

/* ── 4-Sound Sequential Horn System ──────────────────────────── */

const HORN_SOUND_PATHS = [
  './assets/HornSound1.mp3',
  './assets/HornSound2.mp3',
  './assets/HornSound3.mp3',
  './assets/HornSound4.mp3',
];

// Preload all 4 horn sound audio files
const hornAudios = HORN_SOUND_PATHS.map((path) => {
  const a = new Audio(path);
  a.preload = 'auto';
  return a;
});

let currentHornIdx = 0;
let duckTimer = null;
let duckedFrom = null;

function duckMusic(ms) {
  if (!yt || typeof yt.getVolume !== 'function') return;
  if (duckedFrom === null) duckedFrom = yt.getVolume();
  yt.setVolume(Math.round(duckedFrom * 0.35));

  clearTimeout(duckTimer);
  duckTimer = setTimeout(() => {
    if (duckedFrom !== null) yt.setVolume(duckedFrom);
    duckedFrom = null;
  }, ms + 150);
}

function honk() {
  // Stop all currently playing horn sounds instantly (prevent simultaneous overlap)
  hornAudios.forEach((a) => {
    a.pause();
    a.currentTime = 0;
  });

  // Select sound in sequence: 1 -> 2 -> 3 -> 4 -> 1 -> 2 -> 3 -> 4...
  const soundToPlay = hornAudios[currentHornIdx];
  currentHornIdx = (currentHornIdx + 1) % hornAudios.length;

  // Play selected audio file
  soundToPlay.currentTime = 0;
  soundToPlay.play().catch(() => {});

  // Calculate volume ducking duration based on sound file duration
  const ms = soundToPlay.duration && Number.isFinite(soundToPlay.duration)
    ? Math.min(soundToPlay.duration * 1000, 2500)
    : 1200;
  duckMusic(ms);

  state.hornFlashing = 25;

  if (el.horn) {
    el.horn.classList.remove('is-blaring');
    void el.horn.offsetWidth;
    el.horn.classList.add('is-blaring');
    setTimeout(() => el.horn.classList.remove('is-blaring'), 450);
  }

  if (el.logo) {
    el.logo.classList.remove('is-shaking');
    void el.logo.offsetWidth;
    el.logo.classList.add('is-shaking');
    setTimeout(() => el.logo.classList.remove('is-shaking'), 650);
  }
}

el.horn.addEventListener('click', honk);

/* ── Auto Rickshaw Bumper Lines / Shayari ──────────────────── */

const BUMPER_LINES = [
  'ऑटो वाला!',
  'हंस मत पगली, प्यार हो जाएगा!',
  'बुरी नज़र वाले तेरा मुँह काला',
  'देख मगर प्यार से!',
  'चालक की ज़िंदगी, मस्त ज़िंदगी!',
  'माँ का आशीर्वाद',
  'किराया मीटर से चलेगा!',
  'लटक मत, पटक दूंगा!',
  'चलती है गाड़ी, उड़ती है धूल... जलने वाले जलते रहो!',
  'धीमी रफ़्तार, लम्बा सफ़र!',
  '१, २, ३... ऑटो में सीट खाली है!',
  'सौ में से नब्बे बेईमान, फिर भी मेरा भारत महान!',
  'गुरू का ध्यान कर, फिर सवारी बिठा!',
  'जल मत पगली, किस्तों पे आई है!',
  'भगवान बचाए इन तीनों से: पुलिस, डॉक्टर और हसीनों से!',
  'ओके टाटा, फिर मिलेंगे!',
  'सामने से हट जा, ऑटो आया रे!',
  'धीरे चलोगे तो बार-बार मिलोगे, तेज चलोगे तो हरिद्वार मिलोगे!'
];

let bumperOrder = [];
let bumperPos = 0;
let bumperTimer = null;

function shuffleLines() {
  bumperOrder = shuffle(BUMPER_LINES.map((_, i) => i));
}

function nextBumper() {
  bumperPos += 1;
  if (bumperPos >= bumperOrder.length) {
    const last = bumperOrder[bumperOrder.length - 1];
    shuffleLines();
    if (bumperOrder[0] === last && bumperOrder.length > 1) {
      [bumperOrder[0], bumperOrder[1]] = [bumperOrder[1], bumperOrder[0]];
    }
    bumperPos = 0;
  }

  el.bumperText.classList.add('is-swapping');
  setTimeout(() => {
    el.bumperText.textContent = BUMPER_LINES[bumperOrder[bumperPos]];
    el.bumperText.classList.remove('is-swapping');
  }, 250);

  clearInterval(bumperTimer);
  bumperTimer = setInterval(nextBumper, 12000);
}

shuffleLines();
el.bumperText.textContent = BUMPER_LINES[0];
bumperTimer = setInterval(nextBumper, 12000);
el.bumperNext.addEventListener('click', nextBumper);

/* ── Ambient Chrome ─────────────────────────────────────────── */

function tickClock() {
  el.clock.textContent = new Date()
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toLowerCase();
}
tickClock();
setInterval(tickClock, 15000);

(function trackPresence() {
  const presenceCount = Math.floor(Math.random() * 35) + 42;
  el.listeners.textContent = String(presenceCount);
})();

/* ── YouTube IFrame API Initialization ───────────────────────── */

function preferAudio() {
  try {
    yt?.setPlaybackQuality?.('tiny');
  } catch {}
}

window.onYouTubeIframeAPIReady = () => {
  yt = new YT.Player('yt-player', {
    height: '1',
    width: '1',
    playerVars: {
      listType: 'playlist',
      list: PLAYLIST_ID,
      playsinline: 1,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      rel: 0,
    },
    events: {
      onReady: () => {
        state.ready = true;
        el.play.disabled = false;
        preferAudio();
        syncPlaylistFromYT();
        updateTrackFromYT();
      },
      onStateChange: (e) => {
        const S = YT.PlayerState;
        if (e.data === S.PLAYING) {
          renderPlaying(true);
          preferAudio();
          updateTrackFromYT();
        } else if (e.data === S.PAUSED || e.data === S.BUFFERING) {
          renderPlaying(e.data === S.BUFFERING && state.playing);
        } else if (e.data === S.ENDED) {
          if (typeof yt.nextVideo === 'function') yt.nextVideo();
        }
      },
      onError: () => {
        if (state.started && typeof yt.nextVideo === 'function') yt.nextVideo();
      },
    },
  });

  setInterval(samplePlayer, 250);
  requestAnimationFrame(paintProgress);
};

/* ── Boot Scripts ───────────────────────────────────────────── */

(async function init() {
  try {
    const res = await fetch('./tracks.json');
    state.tracks = await res.json();
    renderList();
    renderTrack();
  } catch {}

  const s = document.createElement('script');
  s.src = 'https://www.youtube.com/iframe_api';
  document.head.append(s);
})();
