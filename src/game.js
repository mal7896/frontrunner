// ===================== HELPERS =====================
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
function gauss() { let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function rng32(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function gaussR(r) { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
const pick = a => a[Math.floor(Math.random() * a.length)];
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
const f1 = x => (Math.round(x * 10) / 10).toFixed(1);
const pct = x => Math.round(x * 100) + '%';
const other = p => p === 'D' ? 'R' : 'D';
const SG = { D: 1, R: -1 };
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function dt(iso, add) { const d = new Date(iso + 'T12:00:00Z'); if (add) d.setUTCDate(d.getUTCDate() + add); return d; }
function fmtShort(iso) { const d = dt(iso); return `${DAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`; }
function fmtLong(iso, add) { const d = dt(iso, add); return `${DAYS_FULL[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`; }
function fmtFull(iso, add) { const d = dt(iso, add); return `${DAYS_FULL[d.getUTCDay()]}, ${MONTHS_FULL[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`; }
function daysBetween(a, b) { return Math.round((dt(b) - dt(a)) / 86400000); }
const calm = () => SET.motion === 'reduced';

// ===================== SETTINGS =====================
const SET_KEY = 'frontrunner-settings-v1';
const SET = { theme: 'auto', music: true, sfx: true, vol: 0.6, motion: 'full', text: 'normal', pace: 1, depth: 'quick' };
try { if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) SET.motion = 'reduced'; } catch (e) { }
try { const s = JSON.parse(localStorage.getItem(SET_KEY) || 'null'); if (s && typeof s === 'object') for (const k in SET) if (k in s) SET[k] = s[k]; } catch (e) { }
const HOST_THEME = document.documentElement.getAttribute('data-theme');
function saveSettings() { try { localStorage.setItem(SET_KEY, JSON.stringify(SET)); } catch (e) { } }
function applySettings() {
  const r = document.documentElement;
  if (SET.theme === 'auto') { if (HOST_THEME) r.setAttribute('data-theme', HOST_THEME); else r.removeAttribute('data-theme'); }
  else r.setAttribute('data-theme', SET.theme);
  r.classList.toggle('large', SET.text === 'large');
  r.classList.toggle('calm', calm());
  Music.volume();
  SFX.volume();
}

// ===================== MUSIC (Tanner Helland, CC BY 4.0) =====================
const TRACKS = {
  title: { src: 'audio/title.mp3', loop: true, name: 'Daybreak' }, trail: { src: 'audio/trail.mp3', loop: true, name: 'Familiar Roads' },
  night: { src: 'audio/night.mp3', loop: true, name: 'Now or Never' }, victory: { src: 'audio/victory.mp3', loop: false, name: 'Home' },
  defeat: { src: 'audio/defeat.mp3', loop: false, name: 'A Memory Away' }
};
const Music = {
  els: {}, cur: null, want: null, unlocked: false, broken: {}, fades: {},
  el(name) {
    if (!this.els[name]) {
      const a = new Audio(); a.preload = 'none'; a.src = TRACKS[name].src; a.loop = TRACKS[name].loop; a.volume = 0;
      a.addEventListener('error', () => { this.broken[name] = true; });
      this.els[name] = a;
    }
    return this.els[name];
  },
  level() { return SET.music ? SET.vol * 0.5 : 0; },
  fade(a, to, ms, done) {
    const key = a.src; clearInterval(this.fades[key]);
    const from = a.volume, steps = Math.max(1, Math.round(ms / 50)); let i = 0;
    this.fades[key] = setInterval(() => { i++; try { a.volume = clamp(from + (to - from) * i / steps, 0, 1); } catch (e) { } if (i >= steps) { clearInterval(this.fades[key]); if (done) done(); } }, 50);
  },
  play(name) {
    this.want = name;
    if (!SET.music) { this.stopAll(); return; }
    if (!this.unlocked || !name || this.broken[name]) return;
    if (this.cur === name) { const a = this.el(name); if (a.paused && TRACKS[name].loop) { const p = a.play(); if (p) p.catch(() => { }); this.fade(a, this.level(), 600); } return; }
    const old = this.cur ? this.el(this.cur) : null;
    if (old) this.fade(old, 0, 900, () => { old.pause(); });
    const a = this.el(name); this.cur = name;
    try { a.currentTime = 0; } catch (e) { }
    a.volume = 0; const p = a.play(); if (p) p.catch(() => { });
    this.fade(a, this.level(), 1600);
  },
  stopAll() { for (const k in this.els) { const a = this.els[k]; if (!a.paused) this.fade(a, 0, 500, () => a.pause()); } this.cur = null; },
  volume() { if (!SET.music) { this.stopAll(); return; } if (this.cur && this.els[this.cur]) this.fade(this.els[this.cur], this.level(), 300); else if (this.unlocked && this.want) this.play(this.want); },
  unlock() { if (this.unlocked) return; this.unlocked = true; this.play(this.want); },
  // Try to start the music as soon as the page opens. Browsers that allow it will play right away;
  // the rest start on the first tap, click or key press.
  tryStart() {
    if (this.unlocked || !SET.music || !this.want || this.broken[this.want]) return;
    const name = this.want, a = this.el(name); a.volume = 0;
    let p; try { p = a.play(); } catch (e) { return; }
    if (!p || !p.then) return;
    p.then(() => {
      if (this.unlocked) return;
      if (this.want !== name || !SET.music) { try { a.pause(); } catch (e) { } return; }
      this.unlocked = true; this.cur = name; this.fade(a, this.level(), 1600);
    }).catch(() => { });
  }
};

// ===================== SOUND EFFECTS (synthesized in the browser) =====================
const SFX = {
  ac: null, out: null, noise: null,
  init() {
    if (this.ac) return true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      this.ac = new AC(); this.out = this.ac.createGain(); this.out.connect(this.ac.destination); this.volume();
      const n = this.ac.sampleRate * 2, b = this.ac.createBuffer(1, n, this.ac.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      this.noise = b; return true;
    } catch (e) { return false; }
  },
  volume() { if (this.out) this.out.gain.value = SET.vol * 0.9; },
  nz(t0, dur, type, freq, q, peak, attack, endFreq) {
    const ac = this.ac, s = ac.createBufferSource(); s.buffer = this.noise; s.loop = true;
    const f = ac.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t0); if (endFreq) f.frequency.exponentialRampToValueAtTime(endFreq, t0 + dur); f.Q.value = q;
    const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + attack); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f).connect(g).connect(this.out); s.start(t0, Math.random() * 1.5); s.stop(t0 + dur + 0.05);
  },
  tone(t0, freq, dur, peak, type, vib) {
    const ac = this.ac, o = ac.createOscillator(), g = ac.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t0);
    if (vib) { const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = vib; lg.gain.value = freq * 0.012; l.connect(lg).connect(o.frequency); l.start(t0); l.stop(t0 + dur); }
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(this.out); o.start(t0); o.stop(t0 + dur + 0.05);
  },
  play(kind, x) {
    if (!SET.sfx || !this.init()) return;
    try {
      if (this.ac.state === 'suspended') this.ac.resume();
      const t = this.ac.currentTime + 0.01;
      if (kind === 'mark') { this.nz(t, .07, 'bandpass', 2600, 1.2, .35, .01); this.nz(t + .09, .08, 'bandpass', 2300, 1.2, .3, .01); }
      else if (kind === 'paper') { for (let i = 0; i < 9; i++) this.nz(t + i * .035 + Math.random() * .02, .05, 'highpass', 1800 + Math.random() * 2500, .7, .12 + Math.random() * .12, .005); }
      else if (kind === 'cheer') { const s = clamp(x || .6, .2, 1); this.nz(t, 2.2, 'bandpass', 1000, .6, .22 * s, .45); this.nz(t + .1, 1.8, 'bandpass', 2300, 1.5, .09 * s, .5); for (let i = 0; i < 4 * s; i++) this.tone(t + .3 + Math.random() * .9, 1700 + Math.random() * 900, .35, .025 * s, 'sine', 9); }
      else if (kind === 'applause') { for (let i = 0; i < 90; i++) { const d = Math.random() * 1.9; this.nz(t + d, .03, 'bandpass', 1400 + Math.random() * 2400, 1.6, Math.max(.02, .2 * (1 - d / 2.2)), .003); } }
      else if (kind === 'whoosh') { this.nz(t, 1.1, 'bandpass', 300, 2.5, .22, .5, 2200); }
      else if (kind === 'whistle') { [523.25, 622.25, 783.99].forEach(f => this.tone(t, f, 1.1, .05, 'sine', 5.5)); this.nz(t, 1.1, 'highpass', 3500, .5, .05, .2); }
      else if (kind === 'horn') { [233.08, 293.66].forEach(f => this.tone(t, f, .5, .06, 'sawtooth')); }
      else if (kind === 'ding') { this.tone(t, 880, .5, .12); this.tone(t + .09, 1318.5, .7, .09); }
      else if (kind === 'call') { this.tone(t, 1046.5, .25, .05); }
      else if (kind === 'win') { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(t + i * .13, f, .9, .1)); this.play('cheer', 1); }
      else if (kind === 'lose') { this.tone(t, 392, 1.0, .07); this.tone(t + .35, 311.13, 1.4, .06); }
      else if (kind === 'tick') { this.nz(t, .03, 'highpass', 4000, .7, .08, .003); }
    } catch (e) { }
  }
};

// ===================== PEOPLE =====================
const PERSON = {};
CANDS.forEach(c => PERSON[c.id] = c); VPS.forEach(v => PERSON[v.id] = v);
for (const y in HISTORY) for (const p of ['D', 'R']) {
  PERSON[HISTORY[y].cands[p].id] = Object.assign({ party: p }, HISTORY[y].cands[p]);
  PERSON[HISTORY[y].vps[p].id] = Object.assign({ party: p }, HISTORY[y].vps[p]);
}
for (const y in HISTORY) if (HISTORY[y].third) {
  const T = HISTORY[y].third;
  PERSON[T.cand.id] = Object.assign({ party: 'T' }, T.cand); PERSON[T.vp.id] = Object.assign({ party: 'T' }, T.vp);
}
const ini = c => c.ini || (c.first[0] + c.last[0]);
const full = c => c.first + ' ' + c.last;

// ===================== SCENARIOS =====================
const SCEN_KEYS = ['2028', '1948', '1960', '1968', '1976', '1980', '1992', '2000'];
let S = null, UNITS = [], U = {}, STATEWIDE = [], CONTEST_EV = 0, TOTAL_EV = 0, THRESH = 270, REG = {}, REG_SHORT = {}, NAT_BASE = 0;
function parseRaw(key) {
  const out = [];
  (key === '2028' ? RAW_2028 : HIST_RAW[key]).trim().split('\n').forEach(line => {
    const f = line.split('|');
    const oth = f[8] !== undefined && f[8] !== '' ? +f[8] : 1.8, tp = f[9] !== undefined && f[9] !== '' ? +f[9] : 0;
    out.push({ id: f[0], name: f[1], ev: +f[2], m: +f[3], votes: +f[4], region: f[5], parent: f[6] || null, locked: +(f[7] || 0), oth, tp, o: Math.max(0, oth - tp) });
  });
  return out;
}
// Actual three-way shares from the data file (percent of all votes cast).
function rawShares(u, three) { const pool = 100 - u.oth; return { D: (pool + u.m) / 2, R: (pool - u.m) / 2, T: three ? u.tp : 0 }; }
function setScen(key, party) {
  const modern = key === '2028';
  const H = modern ? null : HISTORY[key];
  const third = H && H.third ? H.third : null;
  S = { key, modern, h: H, third, parties: third ? ['D', 'R', 'T'] : ['D', 'R'], year: modern ? 2028 : H.year, election: modern ? '2028-11-07' : H.election, inaugural: modern ? 'January 20, 2029' : H.inaugural, ordinal: modern ? '48th' : H.ordinal,
    turns: modern ? TURNS_2028 : (party === 'T' && third ? third.turns : H.turns), startNat: modern ? 0 : H.startNat, tide: modern ? null : H.tide, vehicle: modern ? 'plane' : (H.vehicle || 'plane'), tL: 0 };
  REG = modern ? REGION_2028 : HIST_REGIONS; REG_SHORT = modern ? REGION_2028_SHORT : HIST_REGIONS_SHORT;
  UNITS = parseRaw(key); U = {};
  UNITS.forEach(u => {
    // With a live third candidate every state is contested three ways; otherwise all minor-party votes are a fixed slice.
    if (third) { if (u.locked) { u.ev += u.locked; u.locked = 0; } } else u.o = u.oth;
    // Candidates who were not on a state's ballot get no votes there.
    const off = third && third.offBallot ? third.offBallot : {};
    u.noD = !!(off.D && off.D.includes(u.id)); u.noT = !!(off.T && off.T.includes(u.id));
    u.kids = []; u.state = u.parent || u.id; u.short = u.parent ? u.parent + '-' + u.id.slice(2) : u.id; U[u.id] = u;
  });
  UNITS.forEach(u => { if (u.parent) U[u.parent].kids.push(u.id); });
  STATEWIDE = UNITS.filter(u => !u.parent);
  CONTEST_EV = UNITS.reduce((a, u) => a + u.ev, 0);
  TOTAL_EV = CONTEST_EV + UNITS.reduce((a, u) => a + u.locked, 0);
  THRESH = Math.floor(TOTAL_EV / 2) + 1;
  let s = 0, w = 0, ts = 0; STATEWIDE.forEach(u => { s += u.m * u.votes; ts += u.tp * u.votes; w += u.votes; }); NAT_BASE = s / w; S.tL = third ? ts / w : 0;
}
const labelEV = u => u.ev + u.locked + u.kids.reduce((a, k) => a + U[k].ev, 0);
const unitName = u => u.parent ? u.short : u.name;
const TOPIC_FIX = { 'Labor Day': 'Labor Day', 'Closing argument': 'the closing message', 'Final push': 'the final push', 'The press': 'the Playboy interview', 'Scandal': 'the Butz affair',
  'Running mates': 'the running mates', 'Trust': 'Watergate', 'Debates': 'the debate standoff', 'Tone': 'campaign tone', 'Independents': 'Anderson voters', 'Coalitions': 'blue-collar voters', 'Iran': 'the hostage crisis',
  'Media': 'the podcast', 'Labor': 'the strike', 'Abortion': 'abortion', 'October surprise': 'the scandal', 'Economy': 'the economy', 'Housing': 'housing', 'Jobs': 'jobs', 'Energy': 'energy',
  'Religion': 'religion', 'Civil rights': 'civil rights', 'Immigration': 'immigration', 'Health care': 'health care', 'Public safety': 'crime', 'Foreign policy': 'foreign policy', 'Defense': 'defense' };

// ===================== STATE =====================
let G = null;
const KEY = 'frontrunner2028-v2';
const SAVE_V = 3;
function save() { try { if (G) localStorage.setItem(KEY, JSON.stringify(G)); } catch (e) { } }
function load() { try { const s = localStorage.getItem(KEY); if (!s) return null; const g = JSON.parse(s); return g && g.v === SAVE_V && SCEN_KEYS.includes(g.scen) ? g : null; } catch (e) { return null; } }
function wipe() { try { localStorage.removeItem(KEY); } catch (e) { } }
const me = () => PERSON[G.tk[G.party].c], mate = () => PERSON[G.tk[G.party].v], foe = () => PERSON[G.tk[G.opp].c], foeMate = () => PERSON[G.tk[G.opp].v];
const candOf = p => PERSON[G.tk[p].c], mateOf = p => PERSON[G.tk[p].v];
const isT = () => !!G && G.party === 'T';
const pName = p => p === 'T' ? (S.third ? S.third.label : 'Independent') : PARTY[p];
const rampVar = p => p === 'D' ? 'd' : p === 'R' ? 'r' : 't';
const colorVar = p => p === 'D' ? 'dem' : p === 'R' ? 'rep' : 'ind';
const goal0 = () => S.third.goals[0];
const OPPQ = { easy: .18, normal: .27, hard: .34, hist: .22 };
const ENV = { easy: 1.1, normal: 0, hard: -1.1 };
const OPP_DEB = { easy: -.1, normal: 0, hard: .1, hist: 0 };
const OPP_SD = { easy: 2.2, normal: 1.4, hard: .8, hist: 1.4 };
// Calibrated by simulation so either side wins a fair fight about as often as a 2028 toss-up.
const FAIR_ADJ = { 1948: { D: -1.5, R: 2.7 }, 1960: { D: 0, R: .8 }, 1968: { D: .5, R: 1 }, 1976: { D: .6, R: -.9 }, 1980: { D: .8, R: .5 }, 1992: { D: -.7, R: 1 }, 2000: { D: .15, R: .9 } };

function newGame(cfg) {
  setScen(cfg.scen, cfg.party);
  const p = cfg.party, third = p === 'T';
  const o = third ? S.h.actual.winner : other(p);
  const tk = {};
  if (S.modern) {
    tk[p] = { c: cfg.cand, v: cfg.vp };
    tk[o] = { c: cfg.opp === 'random' ? pick(CANDS.filter(c => c.party === o)).id : cfg.opp, v: pick(VPS.filter(v => v.party === o)).id };
  } else {
    for (const s of ['D', 'R']) tk[s] = { c: S.h.cands[s].id, v: S.h.vps[s].id };
    if (S.third) tk.T = { c: S.third.cand.id, v: S.third.vp.id };
  }
  const diff = S.modern ? cfg.diff : 'hist';
  const fair = !S.modern && cfg.hmode === 'fair';
  // The race between the two major parties. A fair fight halves its swings and starts it even; a third-party player always faces the real one.
  const tide = S.tide ? S.tide.map(x => x * (fair && !third ? 0.5 : 1)) : null;
  const tideSum = tide ? tide.reduce((a, x) => a + x, 0) : 0;
  const baseView = {}; UNITS.forEach(u => baseView[u.id] = u.m);
  const startShift = fair && !third ? -U[tippingPoint(baseView)].m - tideSum : S.startNat - NAT_BASE;
  // The third candidate's own path. In a better break, the real slumps are half as deep.
  const ttide = S.third ? S.third.tide.map(x => third && fair && x < 0 ? x * 0.5 : x) : null;
  const t0 = S.third ? S.third.start - S.tL : 0;
  const issueTurns = TURNS_2028.map((t, i) => t.kind === 'issue' ? i : -1).filter(i => i >= 0);
  G = { v: SAVE_V, scen: cfg.scen, screen: 'game', phase: 'q', party: p, opp: o, diff, tk, seed: Math.floor(Math.random() * 1e9),
    turn: 0, shift: startShift, tide, ttide, hmode: S.modern ? null : (fair ? 'fair' : 'real'),
    env: (S.modern ? ENV[diff] : third ? 0 : fair ? FAIR_ADJ[S.year][p] : 0) + gauss() * (S.modern ? 0.6 : third ? 0.25 : 0.4), nat: 0, reg: {}, st: {},
    T: { n: t0, h: t0, reg: {}, st: {} }, DR: { n: 0, reg: {}, st: {} }, inv: {}, debated: false,
    visits: { me: {}, op: {}, D: {}, R: {} }, bias: {}, noise: {}, tb: {}, tnz: {}, polls: {}, psh: {}, pn: null, prev: {}, prevT: {}, natPoll: 0,
    pool: shuffle(ISSUES.map(x => x.id)).slice(0, issueTurns.length), issueTurns, dq: shuffle(DEBATE_Q.map((x, i) => i)).slice(0, 2),
    surprise: null, res: null, last: null, log: [], hist: [], usedQ: [], fc: null, final: null, fsh: null, night: null, result: null };
  Object.keys(REG).forEach(r => { G.reg[r] = 0; G.T.reg[r] = 0; G.DR.reg[r] = 0; });
  G.full = false; if (cfg.depth === 'full') initFull();
  const c = me(), v = mate(), oc = foe(), ov = foeMate();
  if (S.modern) {
    addSt(c.home, 2.0); addSt(v.home, 1.2); addSt(oc.home, -2.0); addSt(ov.home, -1.2);
    if (c.perk === 'region') G.reg[c.reg] += 1.0;
    if (oc.perk === 'region') G.reg[oc.reg] -= 1.0;
  }
  const nb = gauss() * 1.0;
  UNITS.forEach(u => { G.bias[u.id] = nb + gauss() * 1.0 + (u.parent ? gauss() * 0.8 : 0); });
  if (S.third) { const tnb = gauss() * 0.3; UNITS.forEach(u => { G.tb[u.id] = tnb * Math.sqrt(u.tp / 6) + gauss() * tSd(u.tp) * 0.7; }); }
  updatePolls(true); runForecast(); G.hist.push(G.fc.win);
  G.startPolls = Object.assign({}, G.polls);
  prepTurn(); save();
}
function addSt(id, v) { if (U[id]) G.st[id] = (G.st[id] || 0) + v; }

// ===================== MODEL (player's point of view: positive = player leads) =====================
// Every state is a set of vote shares (percent): D, R and, in some years, a third candidate T.
// D minus R moves with the major-party campaigns. The third candidate's share moves with its own campaign,
// and whatever it gains or loses beyond its real path comes out of the D and R columns in the proportions in S.third.a.
function tSd(t) { return 0.15 + 0.09 * Math.sqrt(Math.max(0, t)); }
function oddsT(tp, f) { const p = clamp(tp, 0, 99) / 100; return 100 * p * f / (1 - p + p * f); }
function tFactor(level) { return Math.max(0.04, level / S.tL); }
function tTrue(u, extra) {
  const P = isT(), sc = S.third.scale;
  const level = S.tL + G.T.n + (extra || 0) + (G.T.reg[u.region] || 0) + (P ? sc * (G.env + G.nat + (G.reg[u.region] || 0)) : 0);
  const t = oddsT(u.tp, tFactor(level)) + (G.T.st[u.id] || 0) + (P ? (G.st[u.id] || 0) + (u.parent ? (G.st[u.parent] || 0) : 0) + fullT(u) : 0);
  return clamp(t, 0.1, 97 - u.o);
}
function tHist(u) { return oddsT(u.tp, tFactor(S.tL + G.T.h)); }
function drTrue(u) {
  if (isT()) return u.m + G.shift + G.DR.n + (G.DR.reg[u.region] || 0) + (G.DR.st[u.id] || 0) + (u.parent ? (G.DR.st[u.parent] || 0) : 0) + fullDR(u);
  return u.m + G.shift + SG[G.party] * (G.env + G.nat + (G.reg[u.region] || 0) + (G.st[u.id] || 0) + (u.parent ? (G.st[u.parent] || 0) : 0)) + fullDR(u);
}
function drawOf(u) { const a = S.third.a[u.region]; return a === undefined ? 0.5 : a; }
function mkShares(u, m, t) {
  if (u.noT) t = 0;
  const pool = 100 - u.o - t;
  if (u.noD) return { D: 0, R: pool, T: t };
  let d = (pool + m) / 2, r = (pool - m) / 2;
  if (d < 0.2) { d = 0.2; r = pool - 0.2; } else if (r < 0.2) { r = 0.2; d = pool - 0.2; }
  return { D: d, R: r, T: t };
}
function sharesTrue(u) {
  if (!S.third) return mkShares(u, drTrue(u), 0);
  const t = tTrue(u);
  return mkShares(u, drTrue(u) - (2 * drawOf(u) - 1) * (t - tHist(u)), t);
}
function marginOf(sh, p) { let best = -1e9; for (const q of S.parties) if (q !== p && sh[q] > best) best = sh[q]; return sh[p] - best; }
function leadOf(sh) { const ps = S.parties.slice().sort((a, b) => sh[b] - sh[a]); return { p: ps[0], m: sh[ps[0]] - sh[ps[1]], second: ps[1] }; }
function truth(u) { return marginOf(sharesTrue(u), G.party); }
function updatePolls(fresh) {
  const N = { D: 0, R: 0, T: 0 }; let w = 0;
  for (const u of UNITS) {
    const sh = sharesTrue(u);
    if (fresh !== false) {
      const sd = Math.abs(marginOf(sh, G.party)) < 10 ? 0.5 : 1.0;
      G.noise[u.id] = (G.noise[u.id] || 0) * 0.4 + gauss() * sd;
      if (S.third) G.tnz[u.id] = (G.tnz[u.id] || 0) * 0.4 + gauss() * tSd(sh.T) * 0.6;
      G.prev[u.id] = G.polls[u.id] === undefined ? null : G.polls[u.id];
      G.prevT[u.id] = G.psh[u.id] ? G.psh[u.id].T : null;
    }
    const dm = sh.D - sh.R;
    const tq = S.third ? clamp(sh.T + G.tb[u.id] + G.tnz[u.id], 0.1, 97 - u.o) : 0;
    const ps = mkShares(u, dm + G.bias[u.id] + G.noise[u.id], tq);
    G.psh[u.id] = ps; G.polls[u.id] = marginOf(ps, G.party);
    if (!u.parent) {
      const pb = mkShares(u, dm + G.bias[u.id], S.third ? clamp(sh.T + G.tb[u.id], 0.1, 97 - u.o) : 0);
      for (const q of S.parties) N[q] += pb[q] * u.votes; w += u.votes;
    }
  }
  for (const q of S.parties) N[q] /= w;
  G.pn = N; G.natPoll = marginOf(N, G.party);
}
function outcomeOf(ev) { const op = CONTEST_EV - ev; return ev >= THRESH ? 1 : op >= THRESH ? 0 : 0.5; }
// o: { ev, pv, sw, above(v) } for one possible result. Returns 1, 0.5 (decided by the House) or 0 for the player.
function goalMet(g, o) {
  switch (g.kind) {
    case 'house': return o.ev.D < THRESH && o.ev.R < THRESH;
    case 'ev': return o.ev.T >= g.val;
    case 'pv': return o.pv.T >= g.val;
    case 'states': return o.sw.T >= g.val;
    case 'second': return o.pv.T > Math.min(o.pv.D, o.pv.R);
    case 'stateN': return o.above(g.val) >= g.n;
    case 'debate': return !!G.debated;
  }
  return false;
}
function evalOutcome(o) {
  const P = G.party;
  if (P === 'T') return goalMet(goal0(), o) ? 1 : 0;
  let mx = 0; for (const q of S.parties) if (q !== P) mx = Math.max(mx, o.ev[q]);
  return o.ev[P] >= THRESH ? 1 : mx >= THRESH ? 0 : 0.5;
}
function runForecast() {
  if (S.third) { runForecast3(); return; }
  const R = rng32(G.seed), gr = () => gaussR(R);
  const n = 1000, tl = Math.max(0, S.turns.length - G.turn);
  const sn = 1.4 + 0.22 * tl, sr = 0.8 + 0.05 * tl, ss = 1.3 + 0.08 * tl;
  const ahead = G.tide ? SG[G.party] * G.tide.slice(G.turn).reduce((a, x) => a + x, 0) : 0;
  let wins = 0; const regs = Object.keys(REG);
  for (let i = 0; i < n; i++) {
    const nat = gr() * sn + ahead; const reg = {}; regs.forEach(r => reg[r] = gr() * sr);
    const stn = {}; let ev = 0;
    for (const u of UNITS) {
      if (!u.ev) continue;
      if (stn[u.state] === undefined) stn[u.state] = gr() * ss;
      if (G.polls[u.id] + nat + reg[u.region] + stn[u.state] + (u.parent ? gr() * 0.8 : 0) + (G.full ? SG[G.party] * 0.5 * (gp('D', u) - gp('R', u)) : 0) > 0) ev += u.ev;
    }
    wins += outcomeOf(ev);
  }
  G.fc = { win: wins / n };
}
// Three-way forecast: simulate D-R swings and the third candidate's swing separately, then count pluralities.
// The third candidate's future swing is run through the same model the game uses, then added to today's poll.
function runForecast3() {
  const R = rng32(G.seed), gr = () => gaussR(R);
  const n = 600, tl = Math.max(0, S.turns.length - G.turn);
  const sn = 1.4 + 0.22 * tl, sr = 0.8 + 0.05 * tl, ss = 1.3 + 0.08 * tl;
  const aheadDR = G.tide ? G.tide.slice(G.turn).reduce((a, x) => a + x, 0) : 0;
  const aheadT = G.ttide ? G.ttide.slice(G.turn).reduce((a, x) => a + x, 0) : 0;
  const histT = S.third.tide.slice(G.turn).reduce((a, x) => a + x, 0);
  const k = Math.sqrt(Math.max(G.pn.T, G.pn.T + aheadT, 0.5) / 6);
  const snT = (0.3 + 0.12 * tl) * k, srT = (0.12 + 0.03 * tl) * k;
  const regs = Object.keys(REG); const g0 = isT() ? goal0() : null;
  const now = {}, base = {}; UNITS.forEach(u => { now[u.id] = tTrue(u); base[u.id] = tTrue(u, histT) - now[u.id]; });
  let wins = 0;
  for (let i = 0; i < n; i++) {
    const nat = gr() * sn + aheadDR, natT = gr() * snT;
    const reg = {}, regT = {}; regs.forEach(r => { reg[r] = gr() * sr; regT[r] = gr() * srT; });
    const stn = {}; const ev = { D: 0, R: 0, T: 0 }, pv = { D: 0, R: 0, T: 0 }, sw = { D: 0, R: 0, T: 0 }; let w = 0, above = 0;
    for (const u of UNITS) {
      if (stn[u.state] === undefined) stn[u.state] = gr() * ss;
      const ps = G.psh[u.id];
      const dT = tTrue(u, aheadT + natT + regT[u.region]) - now[u.id];
      const t = clamp(ps.T + dT + gr() * tSd(ps.T) * 0.8 + (G.full ? 0.5 * gp('T', u) : 0), 0.1, 97 - u.o);
      const m = ps.D - ps.R + nat + reg[u.region] + stn[u.state] + (u.parent ? gr() * 0.8 : 0) - (2 * drawOf(u) - 1) * (t - ps.T - base[u.id]) + (G.full ? 0.5 * (gp('D', u) - gp('R', u)) : 0);
      const sh = mkShares(u, m, t); const L = leadOf(sh).p;
      if (u.ev) ev[L] += u.ev;
      if (!u.parent) { for (const q of S.parties) pv[q] += sh[q] * u.votes; w += u.votes; if (u.ev) sw[L]++; if (g0 && g0.kind === 'stateN' && sh.T >= g0.val) above++; }
    }
    for (const q of S.parties) pv[q] /= w;
    wins += evalOutcome({ ev, pv, sw, above: () => above });
  }
  G.fc = { win: wins / n };
}
function tippingPoint(view) {
  const arr = UNITS.filter(u => u.ev).sort((a, b) => view[b.id] - view[a.id]); let acc = 0;
  for (const u of arr) { acc += u.ev; if (acc >= THRESH) return u.id; } return arr[arr.length - 1].id;
}
function catOf(m) { const a = Math.abs(m); return a < 1 ? 0 : a < 3 ? 1 : a < 7 ? 2 : a < 15 ? 3 : 4; }
function evCats(view) {
  const mine = [0, 0, 0, 0, 0], op = [0, 0, 0, 0, 0]; let toss = 0;
  UNITS.forEach(u => { if (!u.ev) return; const m = view[u.id]; const c = catOf(m); if (c === 0) toss += u.ev; else if (m > 0) mine[c] += u.ev; else op[c] += u.ev; });
  return { me: mine, op, toss, meT: mine.reduce((a, b) => a + b, 0), opT: op.reduce((a, b) => a + b, 0) };
}
// Three-way version, from vote shares: electoral votes by leader and by how safe the lead is.
function evCats3(shares) {
  const c = { D: [0, 0, 0, 0, 0], R: [0, 0, 0, 0, 0], T: [0, 0, 0, 0, 0] }; let toss = 0;
  UNITS.forEach(u => { if (!u.ev) return; const L = leadOf(shares[u.id]); const k = catOf(L.m); if (k === 0) toss += u.ev; else c[L.p][k] += u.ev; });
  const sum = q => c[q].reduce((a, b) => a + b, 0);
  return { c, toss, tot: { D: sum('D'), R: sum('R'), T: sum('T') } };
}
// ===================== TURNS =====================
function turnDef(t) {
  t = t === undefined ? G.turn : t;
  const p = G.party;
  if (!S.modern) {
    const T = S.turns[t];
    if (p === 'T') {
      if (T.kind === 'debate') {
        if (G.inv[t] === false) { const A = T.alt; return { kind: 'event', cat: A.cat, topic: A.topic, title: A.title, body: A.body, options: A.options, hist: A.hist, date: T.date, shut: true }; }
        return { kind: 'debate', cat: T.cat, title: T.cat, body: T.q, fit: T.fit, debName: T.debName, hist: T.hist, date: T.date, options: debOpts(), opp: T.opp };
      }
      return { kind: 'event', cat: T.cat, topic: T.topic, title: T.title, body: T.body, options: T.options, hist: T.hist, date: T.date };
    }
    if (T.kind === 'debate') return { kind: 'debate', cat: T.cat, title: T.cat, body: T.q, fit: T.fit, debName: T.debName, hist: T.hist[p], date: T.date, options: debOpts(), opp: S.third && S.third.onStage ? [G.opp, 'T'] : [G.opp] };
    return { kind: 'event', cat: T.cat, topic: T.topic, title: T.title, body: typeof T.body === 'string' ? T.body : T.body[p], options: T.options[p], hist: T.hist[p], date: T.date };
  }
  const T = TURNS_2028[t]; const base = { date: T.date };
  if (T.kind === 'kickoff') return Object.assign(base, { kind: T.kind }, KICKOFF);
  if (T.kind === 'closing') return Object.assign(base, { kind: T.kind }, CLOSING);
  if (T.kind === 'issue') { const ev = ISSUES.find(x => x.id === G.pool[G.issueTurns.indexOf(t)]); return Object.assign(base, { kind: T.kind }, ev, { options: Array.isArray(ev.options) ? ev.options : ev.options[p] }); }
  if (T.kind === 'debate') { const q = DEBATE_Q[G.dq[T.debName === 'first' ? 0 : 1]]; return Object.assign(base, { kind: 'debate', cat: T.name, title: q.topic, body: q.q, fit: q.fit, debName: T.debName, options: debOpts(), opp: [G.opp] }); }
  const s = SURPRISE[G.surprise.side][G.surprise.i]; const o = foe();
  return Object.assign(base, { kind: 'surprise', cat: 'October surprise', title: s.title, body: s.body.replace('{OPP}', full(o)).replace('{OPPL}', o.last), options: s.options, side: G.surprise.side });
}
// A third-party candidate makes the debate stage only by meeting the polling bar when the turn begins.
function prepTurn() {
  if (!isT() || G.turn >= S.turns.length) return;
  const T = S.turns[G.turn];
  if (T.kind === 'debate' && G.inv[G.turn] === undefined) G.inv[G.turn] = !T.need || G.pn.T >= T.need;
}
function debOpts() { return Object.entries(DEBATE_A).map(([k, a]) => ({ t: a.t, s: a.s, note: a.note, key: k })); }
function optText(o) { return o.t.replace('{HOME}', U[me().home] ? U[me().home].name : 'your home state'); }
function turnDate(t) { return S.turns[Math.min(t, S.turns.length - 1)].date; }
function startTurn() {
  G.phase = 'q'; G.res = null;
  if (S.modern && TURNS_2028[G.turn].kind === 'surprise' && !G.surprise) {
    const pSelf = G.diff === 'easy' ? 0.4 : G.diff === 'hard' ? 0.6 : 0.5;
    const side = Math.random() < pSelf ? 'self' : 'opp';
    const i = Math.floor(Math.random() * SURPRISE[side].length);
    G.surprise = { side, i };
    G.nat += SURPRISE[side][i].hit;
    updatePolls(false); runForecast();
  }
  prepTurn(); save();
}
function applyFx(fx) {
  if (!fx) return;
  if (fx.nat) G.nat += fx.nat;
  for (const r in REG) if (fx[r]) G.reg[r] += fx[r];
  if (fx.home) addSt(me().home, fx.home);
}
const RW = () => S.modern ? { RB: .3, SB: .3, NE: .2, SO: .1, WE: .1 } : { NE: .25, MW: .35, SO: .25, WE: .15 };
function fxScore(fx) { if (!fx) return 0; const w = RW(); let s = fx.nat || 0; for (const r in w) s += w[r] * (fx[r] || 0); return s + 0.15 * (fx.home || 0); }
function optVal(o, f) { return o.risk ? o.risk.p * f(o.risk.win) + (1 - o.risk.p) * f(o.risk.lose) : f(o.fx); }
function gradeOf(s) { return s >= 0.3 ? 'strong' : s >= 0.12 ? 'good' : s > -0.05 ? 'even' : 'hurt'; }

// ---------- advisers ----------
function tFocus() {
  const g = goal0();
  if (g.kind === 'house' || g.kind === 'ev' || g.kind === 'states') {
    const won = UNITS.filter(u => u.ev).sort((a, b) => G.polls[b.id] - G.polls[a.id]);
    const u = won.find(x => G.polls[x.id] < 2) || won[0];
    return { u, r: u.region };
  }
  const by = {}; STATEWIDE.forEach(u => { by[u.region] = (by[u.region] || 0) + G.psh[u.id].T * u.votes; });
  return { u: null, r: Object.keys(by).sort((a, b) => by[b] - by[a])[0] };
}
function focusRegion() { return isT() ? tFocus().r : U[tippingPoint(G.polls)].region; }
function advice(d) {
  const staff = S.modern ? STAFF[G.party] : [{ role: 'Campaign manager' }, { role: 'Pollster' }];
  const seed = G.seed + G.turn * 13;
  const coachT = { plan: 'This one\'s about policy. Give them numbers and a real plan.', story: 'This one is personal. Talk to the people watching at home, not the moderator.', attack: 'They\'re asking for a fight. Draw the contrast and don\'t hold back.' };
  if (d.kind === 'debate') {
    const rivals = debRivals(d); const ace = rivals.map(candOf).find(c => c.perk === 'debate');
    const pol = isT() ? 'Most viewers have never seen you next to them. Look like you belong on that stage and you\'ve already won something.'
      : ace ? `${ace.last} is very good at this. You won't win on style, so win on the answer.` : 'Snap polls reward whoever looks comfortable. Relax and you\'ll be fine.';
    return [{ who: staff[0], text: coachT[d.fit] }, { who: staff[1], text: pol }];
  }
  const F = isT() ? tFocus() : null;
  const tipU = F ? F.u : U[tippingPoint(G.polls)]; const tipR = F ? F.r : tipU.region;
  const opts = d.options;
  let pb = 0, pv = -9; opts.forEach((o, i) => { const v = optVal(o, fxScore); if (v > pv) { pv = v; pb = i; } });
  let mb = 0, mv = -9; opts.forEach((o, i) => { const v = optVal(o, f => (f.nat || 0) + (f[tipR] || 0) + (f.home && U[me().home] && U[me().home].region === tipR ? f.home * .5 : 0)); if (v > mv) { mv = v; mb = i; } });
  const sp = opts[pb].s, sm = opts[mb].s;
  const polT = [`Our polling likes ${sp} best with the voters we still need.`, `The numbers point to ${sp}. It's the safest gain across the map.`, `If you just want the data, go with ${sp}.`][seed % 3] + (opts[pb].risk ? ' It\'s a gamble, though.' : '');
  let manT;
  if (pb === mb) manT = [`The data and the map agree for once. Go with ${sp}.`, `I'm with the numbers on this one. Go with ${sp}.`][seed % 2];
  else if (F && !F.u) manT = [`Most of our voters are in ${REG[tipR]}. ${cap(sm)} would help most there.`, `Our support runs deepest in ${REG[tipR]}. I'd go with ${sm}.`][(seed >> 2) % 2];
  else if (F) manT = [`${unitName(tipU)} is the next state we can win, and ${sm} plays best there.`, `Think about ${REG[tipR]}. That's where ${sm} would help most.`][(seed >> 2) % 2];
  else { const tipName = unitName(tipU); manT = [`This race runs through ${tipName}, and ${sm} plays best there.`, `Think about ${REG[tipR]}. That's where ${sm} would help most.`, `I'd go with ${sm}. We need ${tipName} more than anything.`][(seed >> 2) % 3]; }
  return [{ who: staff[0], text: manT, pick: mb }, { who: staff[1], text: polT, pick: pb }];
}
// ---------- voices and headlines ----------
function peoplePool() { return (S.modern || S.year >= 1992) ? PEOPLE : PEOPLE_OLD; }
function personsIn(r) { return peoplePool().filter(x => U[x.st] && !U[x.st].parent && U[x.st].region === r); }
function pickQuote(kind, h) {
  const pool = QUOTES[kind];
  for (let k = 0; k < pool.length; k++) { const q = pool[(h + k) % pool.length]; if (!G.usedQ.includes(q)) { G.usedQ.push(q); return q; } }
  return pool[h % pool.length];
}
function makeVoices(fx, debate) {
  const out = []; const usedP = new Set();
  const take = (r, kind, k) => {
    let ps = personsIn(r); if (!ps.length) ps = peoplePool().filter(x => U[x.st] && !U[x.st].parent);
    const h = hash(G.seed + ':' + G.turn + ':' + r + ':' + k);
    let person = ps[h % ps.length]; for (let j = 0; usedP.has(person.n) && j < ps.length; j++) person = ps[(h + j) % ps.length];
    usedP.add(person.n);
    out.push({ p: person, q: pickQuote(kind, h >>> 3) });
  };
  const tipR = focusRegion();
  if (debate) { const k = debate === 'win' ? 'debWin' : debate === 'lose' ? 'debLose' : (Math.random() < .5 ? 'debWin' : 'debLose'); take(tipR, k, 0); take(Object.keys(REG).find(r => r !== tipR), debate === 'draw' ? (k === 'debWin' ? 'debLose' : 'debWin') : k, 1); return out; }
  const rs = Object.keys(REG).filter(r => Math.abs(fx[r] || 0) >= 0.1).sort((a, b) => Math.abs(fx[b]) - Math.abs(fx[a])).slice(0, 2);
  if (!rs.length) { const s = fxScore(fx); take(tipR, s >= 0 ? 'pos' : 'neg', 0); return out; }
  rs.forEach((r, k) => take(r, fx[r] > 0 ? 'pos' : 'neg', k));
  return out;
}
function makeHeadline(d, res) {
  const L = me().last, O = res.snap && res.snap.top ? candOf(res.snap.top).last : foe().last;
  const topic = d.topic || TOPIC_FIX[d.cat] || d.cat.toLowerCase();
  const h = hash(G.seed + '|' + G.turn);
  const fx = res.fx || {}; const regs = Object.keys(REG);
  const best = regs.filter(r => (fx[r] || 0) >= .15).sort((a, b) => fx[b] - fx[a])[0];
  const worst = regs.filter(r => (fx[r] || 0) <= -.15).sort((a, b) => fx[a] - fx[b])[0];
  const fill = t => t.replace(/\{L\}/g, L).replace(/\{O\}/g, O).replace(/\{Topic\}/g, cap(topic)).replace(/\{topic\}/g, topic)
    .replace(/\{nthD\}/g, 'the ' + d.debName + ' debate').replace(/\{NthD\}/g, 'The ' + d.debName + ' debate')
    .replace(/\{R\}/g, best ? REG[best] : '').replace(/\{W\}/g, worst ? REG[worst] : '');
  let pool, deck;
  if (res.snap) {
    const k = res.snap.you > res.snap.them + 2 ? 'debWin' : res.snap.them > res.snap.you + 2 ? 'debLose' : 'debDraw';
    pool = HEADLINES[k];
    const won = res.snap.list.slice().sort((a, b) => b.v - a.v)[0];
    deck = `Viewers polled after the debate picked ${candOf(won.p).last}, with ${won.v}%. ${res.snap.und}% weren't sure.`;
  } else {
    const g = gradeOf(res.score);
    pool = HEADLINES[g].filter(t => (!t.includes('{R}') || best) && (!t.includes('{W}') || worst));
    if (!pool.length) pool = HEADLINES.even;
    deck = { strong: `${L}'s aides say it is moving numbers${best ? ' in ' + REG[best] : ' everywhere'}.`, good: 'Early polls show a small gain.', even: 'The polls barely moved.', hurt: `Even allies worry it will cost votes${worst ? ' in ' + REG[worst] : ''}.` }[g];
    if (res.note) deck = res.note + ' ' + deck;
  }
  // Prefer a headline the paper hasn't already run this campaign.
  const used = new Set(G.log.map(l => l.hl)); let hl = cap(fill(pool[h % pool.length]));
  for (let k = 1; k < pool.length && used.has(hl); k++) hl = cap(fill(pool[(h + k) % pool.length]));
  return { hl, deck };
}
function makeDial(snap) {
  const R = rng32(G.seed + G.turn * 7), n = 44;
  const k = snap.list.length, mean = snap.list.reduce((a, x) => a + x.v, 0) / k;
  const walk = fin => { const a = [50]; let v = 50; for (let i = 1; i < n; i++) { const pull = (fin - v) / (n - i); v = clamp(v + pull * 1.6 + (R() - .5) * 7, 6, 94); a.push(Math.round(v)); } a[n - 1] = Math.round(fin); return a; };
  return { lines: snap.list.map(x => ({ p: x.p, a: walk(clamp(50 + (x.v - mean) * 1.8, 12, 88)) })) };
}
function debRivals(d) { return (d.opp || [G.opp]).filter(q => q !== G.party && G.tk[q]); }
// Snap poll among everyone on stage. With two candidates this matches the original two-way formula.
function snapList(perf, order, und) {
  const k = order.length, mean = order.reduce((a, q) => a + perf[q], 0) / k, lo = 0.4 / k, hi = 1 - lo * (k - 1);
  let s = order.map(q => clamp(1 / k + (perf[q] - mean) * 0.72 / k, lo, hi)); const sum = s.reduce((a, b) => a + b, 0); s = s.map(x => x / sum);
  const left = 100 - und; let used = 0;
  return order.map((q, i) => { const v = i < k - 1 ? Math.round(left * s[i]) : left - used; used += v; return { p: q, v }; });
}
function answer(i) {
  if (G.phase !== 'q') return;
  const d = turnDef(); const fullDeb = G.full && d.kind === 'debate';
  const o = fullDeb ? null : d.options[i]; if (!fullDeb && !o) return;
  if (fullDeb && (!G.deb || G.deb.turn !== G.turn || G.deb.round < G.deb.qs.length)) return;
  const before = G.fc.win; const pre = Object.assign({}, G.polls);
  const preT = {}; if (S.third) UNITS.forEach(u => { preT[u.id] = G.psh[u.id].T; });
  const res = { i, text: fullDeb ? 'Three rounds: ' + G.deb.results.map(r => STRATS_F[r.ms].short).join(', ') : optText(o), s: fullDeb ? 'the debate' : o.s, fx: null, ok: null, note: null, opQ: null, snap: null, before };
  if (fullDeb) {
    const P = G.party, rivals = debRivals(d), tot = G.deb.tot, perf = {};
    [P].concat(rivals).forEach(q => { perf[q] = (tot[q] || 0) * 0.194; });
    const und = 9 + Math.floor(Math.random() * 5);
    const list = snapList(perf, [P].concat(rivals), und);
    const top = rivals.slice().sort((a, b) => perf[b] - perf[a])[0];
    const val = q => list.find(x => x.p === q).v;
    res.snap = { you: val(P), them: val(top), und, fit: false, list, top };
    const main = isT() ? top : G.opp;
    res.fx = { nat: clamp(((tot[P] || 0) - (tot[main] || 0)) * 0.11, -1.5, 1.5) };
    if (S.third && !isT() && rivals.includes('T')) G.T.n += clamp(((tot.T || 0) - ((tot[P] || 0) + (tot[G.opp] || 0)) / 2) * 0.11, -1.2, 1.2) * S.third.scale * 0.6;
    if (isT()) { G.debated = true; if (rivals.includes('D') && rivals.includes('R')) G.DR.n += clamp(((tot.D || 0) - (tot.R || 0)) * 0.06, -0.8, 0.8); }
    res.dial = makeDial(res.snap); res.rounds = G.deb.results.map(r => ({ q: r.q, ms: r.ms, edge: r.edge }));
    [P].concat(rivals).forEach(q => { if (G.prep && G.prep[q] !== undefined) G.prep[q] = 0; });
    G.deb = null;
  } else if (d.kind === 'debate') {
    const A = DEBATE_A[o.key], P = G.party, rivals = debRivals(d), perf = {};
    perf[P] = A.base + gauss() * A.sd + (d.fit === o.key ? 0.3 : 0) + (me().perk === 'debate' ? 0.4 : 0);
    rivals.forEach(q => { perf[q] = 0.42 + gauss() * 0.4 + (candOf(q).perk === 'debate' ? 0.4 : 0) + (q === G.opp && !isT() ? OPP_DEB[G.diff] : 0); });
    const und = 9 + Math.floor(Math.random() * 5);
    const list = snapList(perf, [P].concat(rivals), und);
    const top = rivals.slice().sort((a, b) => perf[b] - perf[a])[0];
    const val = q => list.find(x => x.p === q).v;
    res.snap = { you: val(P), them: val(top), und, fit: d.fit === o.key, list, top };
    const diff = perf[P] - perf[isT() ? top : G.opp];
    res.fx = { nat: clamp(diff * 0.9, -1.2, 1.2) };
    if (S.third && !isT() && rivals.includes('T')) G.T.n += clamp((perf.T - (perf[P] + perf[G.opp]) / 2) * 0.9, -1.2, 1.2) * S.third.scale * 0.6;
    if (isT()) { G.debated = true; if (rivals.includes('D') && rivals.includes('R')) G.DR.n += clamp((perf.D - perf.R) * 0.5, -0.8, 0.8); }
    res.dial = makeDial(res.snap);
  } else if (o.risk) {
    const p = clamp(o.risk.p + (me().perk === 'steady' ? 0.12 : 0), 0.1, 0.9);
    res.ok = Math.random() < p; res.fx = res.ok ? o.risk.win : o.risk.lose; res.note = res.ok ? o.risk.winNote : o.risk.loseNote;
  } else res.fx = o.fx;
  applyFx(res.fx);
  res.score = d.kind === 'debate' ? res.fx.nat : fxScore(res.fx);
  if (d.kind !== 'debate' && d.kind !== 'surprise') {
    if (isT()) {
      // Both major parties work to pull your voters back: the "wasted vote" squeeze.
      const q = S.third.q + gauss() * 0.2; G.nat -= q; res.opQ = q;
      G.reg[pick(Object.keys(REG))] -= Math.abs(gauss()) * 0.12; G.DR.n += gauss() * 0.3;
    } else {
      const q = OPPQ[G.diff] + gauss() * 0.3 + (foe().perk === 'incumbent' ? 0.06 : 0) - (me().perk === 'incumbent' ? 0.06 : 0); G.nat -= q; res.opQ = q;
      G.reg[pick(Object.keys(REG))] -= Math.abs(gauss()) * 0.15;
    }
  }
  updatePolls(false); runForecast();
  res.after = G.fc.win;
  const sw = isT() ? UNITS.filter(u => u.ev).map(u => ({ id: u.id, d: G.psh[u.id].T - preT[u.id] })).filter(x => Math.abs(x.d) >= 0.15)
    : UNITS.filter(u => u.ev).map(u => ({ id: u.id, d: G.polls[u.id] - pre[u.id] })).filter(x => Math.abs(x.d) >= 0.15 && Math.abs(G.polls[x.id]) < 12);
  res.swings = sw.sort((a, b) => Math.abs(b.d) - Math.abs(a.d)).slice(0, 6).map(x => ({ id: x.id, d: Math.round(x.d * 10) / 10 }));
  if (d.hist) { res.hist = d.hist; const hi = d.options.findIndex(x => x.h); res.histPick = hi; res.sameAsHist = hi >= 0 && hi === i; }
  res.voices = makeVoices(res.fx, res.snap ? (res.snap.you > res.snap.them + 2 ? 'win' : res.snap.them > res.snap.you + 2 ? 'lose' : 'draw') : null);
  res.head = makeHeadline(d, res);
  G.res = res; G.phase = 'r';
  G.log.push({ turn: G.turn, date: d.date, cat: d.cat, title: d.kind === 'debate' ? d.cat : d.title, choice: res.text, score: res.score, snap: res.snap ? { you: res.snap.you, them: res.snap.them } : null, hl: res.head.hl, same: !!res.sameAsHist, isHist: !!d.hist });
  save();
}
const contestEV = u => u.ev + u.kids.reduce((a, k) => a + U[k].ev, 0);
function visitPow(u, n, who) { const e = u.parent ? u.ev : labelEV(u); return 1.1 / (1 + e / 10) * (who.perk === 'visits' ? 1.25 : 1) * Math.pow(0.75, n); }
function visitWeights(view, vis) {
  const w = {};
  UNITS.forEach(u => { w[u.id] = u.ev ? contestEV(u) * Math.exp(-Math.pow(view[u.id] / 4.5, 2)) * Math.pow(0.75, vis[u.id] || 0) * visitPow(u, 0, { perk: '' }) : 0; });
  return w;
}
// Where a third-party campaign gets the most from a stop: states it could win, or simply the most votes for it.
function tVisitWeights() {
  const g = goal0(); const w = {}; let tv = 0; STATEWIDE.forEach(u => { tv += u.votes; });
  UNITS.forEach(u => {
    if (!u.ev || u.noT) { w[u.id] = 0; return; }
    const vis = Math.pow(0.75, G.visits.me[u.id] || 0), pw = visitPow(u, 0, { perk: '' });
    w[u.id] = (g.kind === 'house' || g.kind === 'ev' || g.kind === 'states') ? contestEV(u) * Math.exp(-Math.pow(G.polls[u.id] / 6, 2)) * vis * pw
      : pw * u.votes / tv * (0.6 + 0.4 * G.psh[u.id].T / Math.max(1, G.pn.T)) * vis;
  });
  return w;
}
function suggestions() { const w = isT() ? tVisitWeights() : visitWeights(G.polls, G.visits.me); return UNITS.filter(u => u.ev).sort((a, b) => w[b.id] - w[a.id]).slice(0, 4).map(u => u.id); }
function rollTrail() {
  let r = Math.random(), acc = 0;
  for (const t of TRAIL) { acc += t.p; if (r < acc) { const n = (Math.round(9 + Math.random() * 13)) * 1000; return { k: t.k, m: t.m, n: t.k === 'crowd' ? n : t.k === 'rain' ? 400 : Math.round(3 + Math.random() * 6) * 1000, txt: t.txt.replace('{N}', n.toLocaleString('en-US')) }; } }
  const n = Math.round(3 + Math.random() * 6) * 1000;
  return { k: 'normal', m: 1, n, txt: `About ${n.toLocaleString('en-US')} people turned out.` };
}
function visit(id) {
  if (G.phase !== 'r' || G.full || !U[id] || !U[id].ev) return;
  const u = U[id]; const n = G.visits.me[id] || 0; const trail = rollTrail();
  const pw = visitPow(u, n, me()) * trail.m;
  addSt(id, pw); G.visits.me[id] = n + 1;
  if (trail.k === 'viral') G.nat += 0.1;
  if (isT()) {
    // Both major candidates campaign against each other in the closest states.
    const stop = {}, pow = {};
    for (const q of ['D', 'R']) {
      const view = {}; UNITS.forEach(x => { const sh = sharesTrue(x); view[x.id] = SG[q] * (sh.D - sh.R) + gauss() * 1.4; });
      const w = visitWeights(view, G.visits[q]); let best = null, bv = -1;
      UNITS.forEach(x => { if (w[x.id] > bv) { bv = w[x.id]; best = x; } });
      const on = G.visits[q][best.id] || 0; const op = visitPow(best, on, candOf(q));
      G.DR.st[best.id] = (G.DR.st[best.id] || 0) + SG[q] * op; G.visits[q][best.id] = on + 1;
      stop[q] = best.id; pow[q] = op;
    }
    G.last = { me: id, mePow: pw, op: stop.D, opPow: pow.D, op2: stop.R, op2Pow: pow.R, opQ: G.res ? G.res.opQ : null, trail };
  } else {
    const view = {}; UNITS.forEach(x => view[x.id] = truth(x) + gauss() * OPP_SD[G.diff]);
    const w = visitWeights(view, G.visits.op); let best = null, bv = -1;
    UNITS.forEach(x => { if (w[x.id] > bv) { bv = w[x.id]; best = x; } });
    const on = G.visits.op[best.id] || 0; const op = visitPow(best, on, foe());
    addSt(best.id, -op); G.visits.op[best.id] = on + 1;
    G.last = { me: id, mePow: pw, op: best.id, opPow: op, opQ: G.res ? G.res.opQ : null, trail };
  }
  turnTail();
}
// Everything that happens between turns, in both the quick and the full game: history's drift, luck, the third
// candidate's real path, then fresh polls.
function turnTail() {
  if (isT()) { G.DR.n += (G.tide ? G.tide[G.turn] : 0) + gauss() * 0.15; G.nat += gauss() * 0.1; }
  else { G.nat += gauss() * 0.15; if (G.tide) G.nat += SG[G.party] * G.tide[G.turn]; }
  if (S.third) {
    G.T.n += G.ttide[G.turn] || 0; G.T.h += S.third.tide[G.turn] || 0;
    if (!isT()) { G.T.n += gauss() * 0.12 * S.third.scale; G.T.reg[pick(Object.keys(REG))] += gauss() * 0.15 * S.third.scale; }
  }
  G.turn++;
  updatePolls(true); runForecast(); G.hist.push(G.fc.win);
  if (G.turn >= S.turns.length) { G.phase = 'end'; save(); return; }
  startTurn();
}
// ===================== ELECTION NIGHT =====================
const countOf = u => S.modern ? (COUNT[u.state] || [1.0, 0]) : [1.2, 0];
const NIGHT_END = 31;
function startNight() {
  const late = gauss() * 0.7; const reg = {}; for (const r in REG) reg[r] = gauss() * 0.5;
  const kT = S.third ? Math.sqrt(S.tL / 6) : 0, lateT = gauss() * 0.25 * kT; const regT = {}; for (const r in REG) regT[r] = gauss() * 0.15 * kT;
  const stn = {}; STATEWIDE.forEach(u => stn[u.id] = gauss() * 0.8);
  G.final = {}; G.fsh = {}; const call = {}, jit = {}, jitT = {}, recount = {};
  GF = 1;
  try { UNITS.forEach(u => {
    const sh = sharesTrue(u); let m = sh.D - sh.R, t = sh.T;
    if (S.third) {
      const t2 = clamp(oddsT(t, Math.max(0.04, (S.tL + lateT + regT[u.region]) / S.tL)) + gauss() * tSd(t) * 0.5, 0.1, 97 - u.o);
      m -= (2 * drawOf(u) - 1) * (t2 - t); t = t2;
    }
    m += late + reg[u.region] + stn[u.state] + (u.parent ? gauss() * 0.6 : 0);
    let fs = mkShares(u, m, t);
    const bk = G.full && G.bank ? G.bank[u.id] : null;
    if (bk && bk.s > 0) { const r = 1 - bk.s; fs = { D: bk.D + r * fs.D, R: bk.R + r * fs.R, T: bk.T + r * fs.T }; }
    G.fsh[u.id] = fs; G.final[u.id] = marginOf(fs, G.party);
    jit[u.id] = gauss(); jitT[u.id] = gauss();
    const a = leadOf(fs).m; const tau = countOf(u)[0];
    if (u.ev && a < 0.3) { recount[u.id] = 1; call[u.id] = NIGHT_END; return; }
    const need = a > 12 ? 0 : a > 6 ? .2 : a > 3 ? .55 : a > 1.5 ? .8 : .93;
    call[u.id] = Math.min(NIGHT_END - 0.2, CLOSE[u.state] + (need ? -tau * Math.log(1 - need) : 0) + Math.random() * (need ? .25 : .05));
  }); } finally { GF = 0.5; }
  G.night = { t: 18.75, call, jit, jitT, recount, called: {}, feed: [], winner: null, done: false, celebrated: false };
  G.screen = 'night'; save();
}
function reporting(u, t) { const c = CLOSE[u.state]; if (t < c) return 0; const tau = countOf(u)[0]; return Math.min(G.night.recount[u.id] ? .995 : .99, 1 - Math.exp(-(t - c) / tau)); }
function partialSh(u, t) {
  const p = reporting(u, t), k = 1 - p, fs = G.fsh[u.id];
  const m = fs.D - fs.R + countOf(u)[1] * Math.pow(k, 1.5) + G.night.jit[u.id] * 1.6 * k;
  const tt = S.third ? clamp(fs.T + G.night.jitT[u.id] * tSd(fs.T) * 1.4 * k, 0.1, 97 - u.o) : 0;
  return mkShares(u, m, tt);
}
function calledEV() { const t = { D: 0, R: 0, T: 0 }; for (const [id, p] of Object.entries(G.night.called)) if (p !== 'x') t[p] += U[id].ev; return t; }
function nightStep(dtH) {
  const N = G.night; if (N.done) return [];
  N.t = Math.min(NIGHT_END, N.t + dtH);
  const due = UNITS.filter(u => !N.called[u.id] && N.call[u.id] <= N.t).sort((a, b) => N.call[a.id] - N.call[b.id]);
  for (const u of due) {
    const p = !u.ev ? 'x' : leadOf(G.fsh[u.id]).p;
    N.called[u.id] = p; N.feed.unshift({ id: u.id, p, t: N.call[u.id], rc: !!N.recount[u.id] });
    const ev = calledEV();
    if (!N.winner) { const w = S.parties.find(q => ev[q] >= THRESH); if (w) N.winner = { p: w, t: N.call[u.id], rc: !!N.recount[u.id] }; }
  }
  if (Object.keys(N.called).length === UNITS.length) { N.done = true; N.t = Math.max(...Object.values(N.call)); }
  return due;
}
function finalOutcome() {
  const ev = { D: 0, R: 0, T: 0 }, pv = { D: 0, R: 0, T: 0 }, sw = { D: 0, R: 0, T: 0 }; let w = 0;
  UNITS.forEach(u => {
    const fs = G.fsh[u.id], L = leadOf(fs).p;
    if (u.ev) ev[L] += u.ev;
    if (!u.parent) { for (const q of S.parties) pv[q] += fs[q] * u.votes; w += u.votes; if (u.ev) sw[L]++; }
  });
  for (const q of S.parties) pv[q] /= w;
  return { ev, pv, sw, above: v => STATEWIDE.filter(u => G.fsh[u.id].T >= v).length };
}
function liveChance() {
  const N = G.night, P = G.party;
  if (N.done) return evalOutcome(finalOutcome());
  if (N.winner && (!isT() || goal0().kind === 'house')) return isT() ? (N.winner.p === 'T' ? 1 : 0) : (N.winner.p === P ? 1 : 0);
  const ev0 = calledEV(); const needPV = isT();
  let left = 0; UNITS.forEach(u => { if (u.ev && !N.called[u.id]) left += u.ev; });
  let wins = 0; const n = 200;
  for (let i = 0; i < n; i++) {
    const nat = gauss() * 1.6 * Math.min(1, left / 200), natT = S.third ? gauss() * 0.4 * Math.sqrt(S.tL / 6) : 0;
    const ev = Object.assign({}, ev0), pv = { D: 0, R: 0, T: 0 }, sw = { D: 0, R: 0, T: 0 }; let w = 0, above = 0;
    for (const u of UNITS) {
      const called = N.called[u.id];
      if (!needPV && (called || !u.ev)) continue;
      let sh;
      if (called) sh = G.fsh[u.id];
      else {
        const rp = reporting(u, N.t); const base = rp > 0 ? partialSh(u, N.t) : G.psh[u.id];
        const sd = rp > 0 ? 0.5 + (1 - rp) * 3 : 3;
        const t = S.third ? clamp(base.T + (natT + gauss() * tSd(base.T) * (rp > 0 ? 0.3 + (1 - rp) * 1.5 : 1.8)) * (1 - rp), 0.1, 97 - u.o) : 0;
        sh = mkShares(u, base.D - base.R + nat * (1 - rp) + gauss() * sd, t);
        if (u.ev) ev[leadOf(sh).p] += u.ev;
      }
      if (needPV && !u.parent) { for (const q of S.parties) pv[q] += sh[q] * u.votes; w += u.votes; if (u.ev) sw[leadOf(sh).p]++; if (sh.T >= 10) above++; }
    }
    if (needPV) for (const q of S.parties) pv[q] /= w;
    wins += evalOutcome({ ev, pv, sw, above: () => above });
  }
  return wins / n;
}
function computeResult() {
  const ev = { D: 0, R: 0, T: 0 }, sw = { D: 0, R: 0, T: 0 }, v = { D: 0, R: 0, T: 0, O: 0 };
  UNITS.forEach(u => {
    const fs = G.fsh[u.id]; const L = leadOf(fs).p;
    if (u.ev) ev[L] += u.ev;
    if (!u.parent) {
      if (u.id !== 'DC' && u.ev) sw[L]++;
      const tot = u.votes * 1e6 * (S.modern ? 1.02 : 1);
      for (const q of S.parties) v[q] += tot * fs[q] / 100;
      v.O += tot * u.o / 100;
    }
  });
  const tot = v.D + v.R + v.T + v.O; const pv = { D: v.D / tot * 100, R: v.R / tot * 100, T: v.T / tot * 100, O: v.O / tot * 100 };
  let winner = S.parties.find(q => ev[q] >= THRESH) || null, house = false;
  // No majority: the House votes by state delegation. We give it to whichever major candidate carried more states.
  if (!winner) { house = true; winner = sw.D !== sw.R ? (sw.D > sw.R ? 'D' : 'R') : (v.D > v.R ? 'D' : 'R'); }
  const view = {}; UNITS.forEach(u => { view[u.id] = marginOf(G.fsh[u.id], winner); });
  const o = { ev, pv, sw, above: val => STATEWIDE.filter(u => G.fsh[u.id].T >= val).length };
  const goals = isT() ? S.third.goals.map(g => goalMet(g, o)) : null;
  G.result = { ev, sw, pv, winner, house, tot, tip: tippingPoint(view), recounts: Object.keys(G.night.recount || {}), goals, success: isT() ? goals[0] : winner === G.party };
}
// ===================== MAP =====================
const SMALL = ['VT', 'NH', 'MA', 'RI', 'CT', 'NJ', 'DE', 'MD', 'DC'];
const DISTS = ['ME1', 'ME2', 'NE1', 'NE2', 'NE3'];
const LBL_FIX = { FL: [12, 4], MI: [10, 14], LA: [-10, -2], KY: [4, 2], WV: [-3, 4], ID: [0, 14], CA: [-6, 10], HI: [10, -6], VA: [8, 2], NC: [6, 0], SC: [2, -2], OK: [12, -6], MN: [-6, 10], TX: [8, 0], NY: [6, 0], IL: [0, 6] };
function boxPos(id) { const i = SMALL.indexOf(id); if (i >= 0) return [986, 40 + i * 33]; return [986, [384, 416, 470, 502, 534][DISTS.indexOf(id)]]; }
function labelXY(id) { const m = MAP.states[id]; const f = LBL_FIX[id] || [0, 0]; return [m.x + f[0], m.y + f[1]]; }
function mapSVG(id, live, bare) {
  let h = `<svg id="${id}" class="usmap${live ? ' live' : ''}" viewBox="0 0 1060 610" role="img" aria-label="Electoral map of the United States"><g class="paths">`;
  for (const sid of Object.keys(MAP.states)) h += `<path d="${MAP.states[sid].d}" data-u="${sid}"></path>`;
  h += '</g><g>';
  for (const sid of Object.keys(MAP.states)) {
    if (SMALL.includes(sid)) continue;
    const [x, y] = labelXY(sid); const u = bare ? null : U[sid];
    h += `<text class="lb${bare || u ? '' : ' gone'}" data-l="${sid}" x="${x}" y="${y + (bare ? 4 : 0)}">${sid}</text>${u ? `<text class="lbe" data-l="${sid}" x="${x}" y="${y + 11}">${labelEV(u)}</text>` : ''}`;
  }
  h += '</g><g>';
  const boxes = SMALL.concat(DISTS.filter(d => !bare && U[d]));
  boxes.forEach(b => {
    const [x, y] = boxPos(b); const u = bare ? null : U[b];
    h += `<g class="box" data-u="${b}"><rect x="${x}" y="${y}" width="66" height="26" rx="2"></rect><text x="${x + 8}" y="${y + 17}" data-l="${b}" class="${bare || u ? '' : 'gone'}">${u ? u.short : b}</text>${bare ? '' : `<text class="ev${u ? '' : ' gone'}" x="${x + 58}" y="${y + 17}" text-anchor="end" data-l="${b}">${u ? labelEV(u) : '–'}</text>`}</g>`;
  });
  if (!bare && U.ME1) h += `<text class="boxhd" x="986" y="377">Maine</text><text class="boxhd" x="986" y="463">Nebraska</text>`;
  h += `</g><g class="pins"></g><g class="fx"></g></svg>`;
  return h;
}
function shadeFor(m, minCat) {
  const c = Math.max(minCat || 0, catOf(m));
  const party = m > 0 ? G.party : G.opp;
  return { fill: c === 0 ? 'var(--toss)' : `var(--${party === 'D' ? 'd' : 'r'}${c})`, strong: c >= 3 };
}
// Color a state by whoever leads its vote shares, darker as the lead grows.
function shadeSh(sh, minCat) {
  const L = leadOf(sh); const c = Math.max(minCat || 0, catOf(L.m));
  return { fill: c === 0 ? 'var(--toss)' : `var(--${rampVar(L.p)}${c})`, strong: c >= 3 };
}
// Third-party support view: bands relative to the candidate's real national share.
function shareBands() { const L = S.tL; return [0.7 * L, 1.1 * L, 1.6 * L]; }
function shadeShare(t) { const b = shareBands(); const c = t >= b[2] ? 4 : t >= b[1] ? 3 : t >= b[0] ? 2 : 1; return { fill: `var(--t${c})`, strong: c >= 3 }; }
function shadeDR(m) { const c = Math.max(1, catOf(m)); return { fill: `var(--${m > 0 ? 'd' : 'r'}${c})`, strong: c >= 3 }; }
function indexSVG(svg) {
  if (!svg._i) {
    const i = { el: {}, lb: {} };
    $$('[data-u]', svg).forEach(e => { (i.el[e.dataset.u] = i.el[e.dataset.u] || []).push(e.tagName.toLowerCase() === 'g' ? e.querySelector('rect') : e); });
    $$('[data-l]', svg).forEach(e => { (i.lb[e.dataset.l] = i.lb[e.dataset.l] || []).push(e); });
    svg._i = i;
  }
  return svg._i;
}
function paintRaw(svg, fn) { if (!svg) return; const I = indexSVG(svg); for (const id of Object.keys(I.el)) { const r = fn(id); I.el[id].forEach(e => { e.style.fill = r.fill; }); (I.lb[id] || []).forEach(t => t.classList.toggle('strong', !!r.strong)); } }
function paintBy(svg, fn) { paintRaw(svg, id => { const u = U[id]; return !u ? { fill: 'var(--none)' } : !u.ev ? { fill: 'var(--locked)', strong: true } : fn(id); }); }
function markSel(svg, id) {
  if (!svg) return;
  $$('.sel', svg).forEach(e => e.classList.remove('sel'));
  if (!id) return;
  const p = $(`path[data-u="${id}"]`, svg); if (p) { p.classList.add('sel'); p.parentNode.appendChild(p); return; }
  const b = $(`g.box[data-u="${id}"]`, svg); if (b) b.classList.add('sel');
}
function ptOf(id) { if (SMALL.includes(id) || DISTS.includes(id)) { const [x, y] = boxPos(id); return [x - 11, y + 13]; } const [x, y] = labelXY(id); return [x, y - 18]; }
function drawPins(svg) {
  const g = $('.pins', svg); if (!g) return; if (!G.last) { g.innerHTML = ''; return; }
  const [mx, my] = ptOf(G.last.me), [ox, oy] = ptOf(G.last.op); const same = G.last.me === G.last.op;
  let h = `<circle class="pin-op" cx="${ox + (same ? 8 : 0)}" cy="${oy}" r="6"></circle>`;
  if (G.last.op2) { const [px, py] = ptOf(G.last.op2); const s2 = G.last.op2 === G.last.op || G.last.op2 === G.last.me; h += `<circle class="pin-op" cx="${px + (s2 ? -8 : 0)}" cy="${py + (s2 ? 8 : 0)}" r="6"></circle>`; }
  g.innerHTML = h + `<circle class="pin-me" cx="${mx - (same ? 8 : 0)}" cy="${my}" r="6.5"></circle>`;
}
function silhouette(id) {
  const s = MAP.states[U[id].state]; if (!s) return '';
  const [x0, y0, x1, y1] = s.b; const pad = 2;
  return `<svg viewBox="${x0 - pad} ${y0 - pad} ${x1 - x0 + pad * 2} ${y1 - y0 + pad * 2}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path d="${s.d}"></path></svg>`;
}
const VEHICLE = {
  plane: '<path d="M-14 0 L-4 -2 L2 -12 L6 -12 L3 -2 L10 -2 L13 -6 L15 -6 L14 0 L15 6 L13 6 L10 2 L3 2 L6 12 L2 12 L-4 2 Z"></path>',
  train: '<rect x="-14" y="-6" width="20" height="12" rx="2"></rect><rect x="6" y="-4" width="8" height="8" rx="1"></rect><rect x="-10" y="-11" width="4" height="6"></rect>',
  bus: '<rect x="-14" y="-7" width="28" height="14" rx="3"></rect><rect x="-10" y="-4" width="5" height="4" class="win"></rect><rect x="-3" y="-4" width="5" height="4" class="win"></rect><rect x="4" y="-4" width="5" height="4" class="win"></rect>'
};
function animateTravel(svg, from, to, mine, done) {
  const fx = $('.fx', svg);
  if (!fx || calm() || !from || !to || !MAP.states[from] && !SMALL.includes(from) && !DISTS.includes(from)) { if (done) done(); return; }
  const [x0, y0] = ptOf(from), [x1, y1] = ptOf(to);
  const dist = Math.hypot(x1 - x0, y1 - y0); const lift = Math.max(40, dist * 0.32);
  const cx = (x0 + x1) / 2, cy = Math.min(y0, y1) - lift;
  const ns = 'http://www.w3.org/2000/svg';
  const path = document.createElementNS(ns, 'path'); path.setAttribute('d', `M${x0},${y0} Q${cx},${cy} ${x1},${y1}`); path.setAttribute('class', 'trail ' + (mine ? 'mine' : 'theirs'));
  fx.appendChild(path); const len = Math.max(1, path.getTotalLength());
  path.style.strokeDasharray = `${len}`; path.style.strokeDashoffset = `${len}`;
  const g = document.createElementNS(ns, 'g'); g.setAttribute('class', 'veh ' + (mine ? 'mine' : 'theirs')); g.innerHTML = VEHICLE[S.vehicle] || VEHICLE.plane; fx.appendChild(g);
  const dur = clamp(700 + dist * 1.6, 900, 1800); const t0 = performance.now();
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  let finished = false;
  const finish = () => { if (finished) return; finished = true; g.remove(); path.style.strokeDasharray = '4 5'; path.style.strokeDashoffset = '0'; path.classList.add('fade'); setTimeout(() => path.remove(), 2200); if (done) done(); };
  const stepFn = now => {
    if (!path.isConnected) { finish(); return; }
    const k = clamp((now - t0) / dur, 0, 1), e = ease(k);
    const p = path.getPointAtLength(len * e), q = path.getPointAtLength(Math.min(len, len * e + 1));
    const ang = len * e + 1 > len ? Math.atan2(y1 - cy, x1 - cx) * 180 / Math.PI : Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
    const flip = S.vehicle !== 'plane' && Math.abs(ang) > 90 ? ' scale(1,-1)' : '';
    g.setAttribute('transform', `translate(${p.x.toFixed(1)},${p.y.toFixed(1)}) rotate(${ang.toFixed(1)})${flip} scale(${mine ? 1 : .8})`);
    path.style.strokeDashoffset = `${len * (1 - e)}`;
    if (k < 1) requestAnimationFrame(stepFn); else finish();
  };
  requestAnimationFrame(stepFn);
  setTimeout(finish, dur + 1500);
}
function floatText(svg, id, txt, cls) {
  const fx = $('.fx', svg); if (!fx || calm()) return;
  const [x, y] = ptOf(id); const ns = 'http://www.w3.org/2000/svg';
  const t = document.createElementNS(ns, 'text'); t.setAttribute('x', x); t.setAttribute('y', y + 4); t.setAttribute('class', 'floater ' + (cls || '')); t.textContent = txt;
  fx.appendChild(t); setTimeout(() => t.remove(), 2700);
}
function flashState(svg, id) {
  const e = svg && ($(`path[data-u="${id}"]`, svg) || $(`g.box[data-u="${id}"] rect`, svg)); if (!e || calm()) return;
  e.classList.remove('flash'); void e.getBBox(); e.classList.add('flash');
}

// ===================== UI =====================
const UI = { mapMode: 'lead', setup: null, pick: null, screen: null, modal: null, speed: SET.pace, raf: null, lastT: 0, lastList: 0, busy: false, l3: [], l3until: 0, builtFor: null, keys: null, keysFor: null, swingTurn: null, needle: { base: .5, shown: .5, t: 0 }, title: { i: 0, timer: null, hold: false } };
function show(name) {
  $$('.screen').forEach(s => { s.hidden = s.id !== 'scr-' + name; });
  if (UI.screen !== name) { UI.screen = name; window.scrollTo(0, 0); }
  $('#ticker').hidden = name !== 'game';
  document.body.classList.toggle('has-ticker', name === 'game');
  if (name !== 'title') stopTitleCycle();
  if (name === 'night') { if (!(G && G.night && G.night.celebrated)) Music.play('night'); }
  else Music.play(name === 'game' ? 'trail' : name === 'final' ? (G && G.result && G.result.success ? 'victory' : 'defeat') : 'title');
}
let toastT;
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3200); }
function leadTxt(m, final) {
  if (Math.abs(m) < 0.05 && !final) return '<span class="lead">Tied</span>';
  const p = m > 0 ? G.party : G.opp, c = m > 0 ? me() : foe();
  return `<span class="lead c-${p}">${esc(c.last)} +${Math.abs(m) < 0.05 ? '&lt;0.1' : f1(Math.abs(m))}</span>`;
}
const plainLead = m => Math.abs(m) < 0.05 ? 'Tied' : `${(m > 0 ? me() : foe()).last} +${f1(Math.abs(m))}`;
function leadTxtSh(sh, final) {
  const L = leadOf(sh);
  if (L.m < 0.05 && !final) return '<span class="lead">Tied</span>';
  return `<span class="lead c-${L.p}">${esc(candOf(L.p).last)} +${L.m < 0.05 ? '&lt;0.1' : f1(L.m)}</span>`;
}
function tGapTxt(sh) { const L = leadOf(sh); return L.p === 'T' ? `ahead by ${f1(L.m)}` : `${f1(sh[L.p] - sh.T)} behind ${candOf(L.p).last}`; }
function plainLeadSh(sh) { const L = leadOf(sh); return L.m < 0.05 ? 'Tied' : `${candOf(L.p).last} +${f1(L.m)}`; }
function natLine() { return S.parties.slice().sort((a, b) => G.pn[b] - G.pn[a]).map(q => `${candOf(q).last} ${Math.round(G.pn[q])}`).join(', '); }
const fmtPct = x => x < 10 ? f1(x) : String(Math.round(x));
function pinHTML(c, size) { const i = ini(c); return `<span class="pin p-${c.party}${size ? ' ' + size : ''}${i.length > 2 ? ' i3' : ''}" aria-hidden="true">${esc(i)}</span>`; }
const SCRIBBLE = 'M5 10 C 7 3, 23 2, 26 8 C 28 14, 9 17, 5 12 C 2 7, 18 4, 24 8 C 27 11, 15 15, 9 12 C 6 10, 14 7, 20 9';
function ovalHTML() { return `<span class="oval" aria-hidden="true"><svg viewBox="0 0 30 18"><path d="${SCRIBBLE}" pathLength="100"></path></svg></span>`; }
function soundBtn() { return `<button class="btn sndbtn" data-a="toggleMusic" aria-pressed="${SET.music}">${SET.music ? 'Music on' : 'Music off'}</button>`; }

// ---------- title ----------
function winRaw(u, three) { const s = rawShares(u, three); return three && s.T > s.D && s.T > s.R ? 'T' : s.D >= s.R ? 'D' : 'R'; }
function rawStats(key) {
  const units = parseRaw(key), three = key !== '2028' && !!HISTORY[key].third; let d = 0, r = 0, t = 0, lk = 0;
  units.forEach(u => { const ev = u.ev + (three ? u.locked : 0); if (!three) lk += u.locked; if (!ev) return; const L = winRaw(u, three); if (L === 'D') d += ev; else if (L === 'R') r += ev; else t += ev; });
  return { units, d, r, t, lk, three };
}
const TITLE_SEQ = ['1948', '1960', '1968', '1976', '1980', '1992', '2000', '2028'];
function titleCaption(key) {
  if (key === '2028') { const s = rawStats('2028'); return { yr: '2024', txt: `Trump ${s.r}, Harris ${s.d}. The 2028 game starts from this map.` }; }
  const H = HISTORY[key], A = H.actual;
  return { yr: key, txt: `${H.cands.D.last} ${A.D}, ${H.cands.R.last} ${A.R}${A.other && A.otherName && !/blank/.test(A.otherName) ? `, ${A.otherName} ${A.other}` : ''}` };
}
function paintTitleMap(key) {
  const svg = $('#map-title'); if (!svg) return;
  const three = key !== '2028' && !!HISTORY[key].third;
  const map = {}; parseRaw(key).forEach(u => map[u.id] = u);
  paintRaw(svg, id => {
    const u = map[id]; if (!u) return { fill: 'var(--none)' };
    if (three) { const s = rawShares(u, true), L = winRaw(u, true); const v = [s.D, s.R, s.T].sort((a, b) => b - a); const c = Math.max(1, catOf(v[0] - v[1])); return { fill: `var(--${rampVar(L)}${c})`, strong: c >= 3 }; }
    if (!u.ev) return { fill: 'var(--locked)', strong: true };
    return shadeDR(u.m);
  });
  const I = indexSVG(svg); for (const id in I.lb) I.lb[id].forEach(t => t.classList.toggle('gone', !map[id]));
  const c = titleCaption(key); $('#tm-year').textContent = c.yr; $('#tm-cap').textContent = c.txt;
  $$('.row-pick').forEach(r => r.classList.toggle('peek', r.dataset.v === key));
}
function startTitleCycle() {
  stopTitleCycle();
  if (calm()) return;
  UI.title.timer = setInterval(() => { if (UI.title.hold || UI.screen !== 'title') return; UI.title.i = (UI.title.i + 1) % TITLE_SEQ.length; paintTitleMap(TITLE_SEQ[UI.title.i]); }, 2600);
}
function stopTitleCycle() { if (UI.title.timer) clearInterval(UI.title.timer); UI.title.timer = null; }
function renderTitle() {
  const sv = load();
  let cont = '';
  if (sv) { setScen(sv.scen); const c = PERSON[sv.tk[sv.party].c]; cont = `${c.last} ${S.year} · ${sv.screen === 'final' ? 'results' : sv.screen === 'night' ? 'Election Night' : 'turn ' + Math.min(10, sv.turn + 1) + ' of 10'}`; }
  const rows = SCEN_KEYS.map(k => {
    if (k === '2028') return `<button class="row-pick" data-a="chooseScen" data-v="2028">${ovalHTML()}<span class="rp-main"><span class="rp-top"><span class="rp-yr">2028</span><span class="rp-who">The next election</span></span><span class="rp-desc">Made-up candidates on today's map. You pick the party, the nominee and the running mate.</span></span><span class="rp-pins"><span class="pin sm p-D">D</span><span class="pin sm p-R">R</span></span></button>`;
    const H = HISTORY[k];
    return `<button class="row-pick" data-a="chooseScen" data-v="${k}">${ovalHTML()}<span class="rp-main"><span class="rp-top"><span class="rp-yr">${k}</span><span class="rp-who">${esc(H.tagline)}</span></span><span class="rp-desc">${esc(H.blurb)}${H.third ? ` <span class="rp-also">Or run as ${esc(H.third.cand.last)}.</span>` : ''}</span></span><span class="rp-pins">${pinHTML(Object.assign({ party: 'D' }, H.cands.D), 'sm')}${pinHTML(Object.assign({ party: 'R' }, H.cands.R), 'sm')}${H.third ? pinHTML(Object.assign({ party: 'T' }, H.third.cand), 'sm') : ''}</span></button>`;
  }).join('');
  $('#scr-title').innerHTML = `<div class="tmast"><div class="wrap"><span><b>Front Runner</b><span class="tm-sub"> · A presidential campaign game</span></span><span class="tm-r"><button class="linkish" data-a="toggleMusic" aria-pressed="${SET.music}">${SET.music ? 'Music on' : 'Music off'}</button><button class="linkish" data-a="settings">Settings</button></span></div></div>
    <div class="wrap title-grid">
      <div class="title-left">
        <h1 class="wordmark"><span class="u">Front</span><span class="v">Runner</span></h1>
        <p class="title-lede">Run for president from Labor Day to Election Night. Handle the crises, get through the debates, pick your stops, and <em>find a path to 270.</em></p>
        <div class="title-actions">${sv ? `<button class="btn btn-ink btn-lg" data-a="cont">Continue: ${esc(cont)}</button>` : ''}<button class="btn btn-lg" data-a="help">How it works</button></div>
        <figure class="title-map"><div class="tm-head"><span class="tm-year" id="tm-year">2024</span><span class="tm-cap" id="tm-cap"></span></div>${mapSVG('map-title', false, true)}<figcaption class="hint">Real results by state. Point at an election on the ballot to see its map.</figcaption></figure>
      </div>
      <div class="ballot tballot"><div class="ballot-hd"><span>Official ballot</span><span>General election</span></div>
        <div class="ballot-sub"><span>Choose an election</span><span>Vote for one</span></div>
        <div class="choices">${rows}</div>
        <p class="instr">Mark the oval next to the race you want to run. The historical races use the real candidates and state results, and four of them let you run as the third-party candidate.</p></div>
    </div>
    <div class="wrap title-strip">
      <div><h3>Ten turns</h3><p>Each turn is one decision and one campaign stop. A full race takes about ten minutes.</p></div>
      <div><h3>People talk back</h3><p>Your staff argue for different answers, and voters in the states you need tell you what they thought.</p></div>
      <div><h3>The real map</h3><p>Each state starts from its actual result that year, with that year's electoral votes.</p></div>
      <div><h3>Election Night</h3><p>Polls close coast to coast, counts swing as late ballots come in, and very close states go to a recount.</p></div>
    </div>
    <footer class="wrap credits">Music by <a href="https://tannerhelland.com/music.html" target="_blank" rel="noopener">Tanner Helland</a>, CC BY 4.0. Election results from the <a href="https://www.presidency.ucsb.edu/statistics/elections" target="_blank" rel="noopener">American Presidency Project</a>.</footer>`;
  UI.title.i = TITLE_SEQ.length - 1; paintTitleMap('2028'); startTitleCycle();
  $$('.row-pick').forEach(r => {
    const on = () => { UI.title.hold = true; paintTitleMap(r.dataset.v); UI.title.i = TITLE_SEQ.indexOf(r.dataset.v); };
    const off = () => { UI.title.hold = false; };
    r.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') on(); }); r.addEventListener('focus', on); r.addEventListener('pointerleave', off); r.addEventListener('blur', off);
  });
  if (G) setScen(G.scen, G.party);
}

// ---------- setup (2028) ----------
const DEPTH_CARDS = [['quick', 'Quick', 'One decision and one campaign stop a turn. About 15 minutes.'], ['full', 'Full campaign', 'The hard mode. Each week you set a schedule for both of you, buy ads, open field offices, raise money and prep for debates that go round by round.']];
function depthHTML(n) { const d = UI.setup.depth || 'quick'; return `<section><div class="step-h"><span class="n">${n}</span><h2>How deep do you want to go?</h2></div><div class="cards two">${DEPTH_CARDS.map(([k, t, s]) => `<button class="card-pick ${d === k ? 'on' : ''}" data-a="sDepth" data-v="${k}" aria-pressed="${d === k}">${ovalHTML()}<b style="font-size:18px">${t}</b><p>${s}</p></button>`).join('')}</div></section>`; }
function renderSetup() {
  const P = UI.setup;
  let h = `<header class="topbar"><div class="wrap"><span class="wm-sm">Front Runner</span><span class="sub">2028 · New campaign</span><span style="flex:1"></span>${soundBtn()}<button class="btn" data-a="home">Back</button></div></header><div class="wrap setup">`;
  h += `<section><div class="step-h"><span class="n">01</span><h2>Pick a party</h2></div><div class="cards two">
    ${['D', 'R'].map(p => `<button class="card-pick party-pick p-${p} ${P.party === p ? 'on' : ''}" data-a="sParty" data-v="${p}" aria-pressed="${P.party === p}">${ovalHTML()}<b>${PARTY[p]}</b><p>${p === 'D' ? 'Hold Michigan, Pennsylvania and Wisconsin, then win back some of the Sun Belt.' : 'Defend what you won in 2024: the three Great Lakes states plus Georgia, Arizona, Nevada and North Carolina.'}</p></button>`).join('')}
  </div></section>`;
  if (P.party) h += `<section><div class="step-h"><span class="n">02</span><h2>Pick your nominee</h2></div><div class="cards">${CANDS.filter(c => c.party === P.party).map(c => `<button class="card-pick ${P.cand === c.id ? 'on' : ''}" data-a="sCand" data-v="${c.id}" aria-pressed="${P.cand === c.id}">${ovalHTML()}
      <span class="who">${pinHTML(c)}<span class="wt"><b>${esc(full(c))}</b><span class="ws">${esc(c.title)}</span></span></span><p>${esc(c.bio)}</p><span class="perk">${esc(c.perkText)}</span><span class="hint">Home-state boost in ${esc(U[c.home].name)}</span></button>`).join('')}</div></section>`;
  if (P.cand) h += `<section><div class="step-h"><span class="n">03</span><h2>Pick a running mate</h2><p>Each one helps you in their home state.</p></div><div class="cards">${VPS.filter(v => v.party === P.party).map(v => `<button class="card-pick ${P.vp === v.id ? 'on' : ''}" data-a="sVp" data-v="${v.id}" aria-pressed="${P.vp === v.id}">${ovalHTML()}
      <span class="who">${pinHTML(v)}<span class="wt"><b>${esc(full(v))}</b><span class="ws">${esc(v.title)}</span></span></span><p>${esc(v.bio)}</p><span class="perk">Boost in ${esc(U[v.home].name)}</span></button>`).join('')}</div></section>`;
  if (P.vp) {
    const o = other(P.party);
    h += `<section><div class="step-h"><span class="n">04</span><h2>Set the race</h2></div><p class="label" style="margin-bottom:10px">Opponent</p>
      <div class="cards four">${[['random', 'Surprise me', 'A random opponent']].concat(CANDS.filter(c => c.party === o).map(c => [c.id, full(c), c.perkText.split(':')[0]])).map(([id, n, s]) => `<button class="card-pick ${P.opp === id ? 'on' : ''}" data-a="sOpp" data-v="${id}" style="padding:14px 16px">${ovalHTML()}<b style="font-size:15.5px;padding-right:40px">${esc(n)}</b><p class="hint">${esc(s)}</p></button>`).join('')}</div>
      <p class="label" style="margin:24px 0 10px">Political climate</p>
      <div class="cards">${[['easy', 'Tailwind', 'The national mood favors you by about a point, and your opponent makes more mistakes.'], ['normal', 'Toss-up', 'A neutral year. Every battleground is in play.'], ['hard', 'Uphill', 'You start about a point behind, against a sharp opponent.']].map(([k, n, s]) => `<button class="card-pick ${P.diff === k ? 'on' : ''}" data-a="sDiff" data-v="${k}">${ovalHTML()}<b style="font-size:18px">${n}</b><p>${s}</p></button>`).join('')}</div></section>`;
    h += depthHTML('05');
  }
  h += `</div>`;
  const ready = P.party && P.cand && P.vp;
  h += `<div class="startbar"><div class="wrap"><div class="sum">${ready ? `<b>${esc(PERSON[P.cand].last)} / ${esc(PERSON[P.vp].last)}</b>${PARTY[P.party]} ticket · 2028${P.depth === 'full' ? ' · Full campaign' : ''}` : !P.party ? 'Start by picking a party.' : !P.cand ? 'Now pick your nominee.' : 'Last step: a running mate.'}</div><button class="btn btn-ink btn-lg" data-a="start" ${ready ? '' : 'disabled'}>Start the campaign</button></div></div>`;
  $('#scr-setup').innerHTML = h;
}
// ---------- setup (history) ----------
function threshFor(key) { const s = rawStats(key); return Math.floor((s.d + s.r + s.t + s.lk) / 2) + 1; }
function renderHSetup() {
  const P = UI.setup; const H = HISTORY[P.scen], T3 = H.third, isTP = P.party === 'T';
  const card = p => {
    const def = p === 'T' ? T3.cand : H.cands[p], c = Object.assign({ party: p }, def), v = p === 'T' ? T3.vp : H.vps[p];
    const real = p === 'T' ? `In real life: ${f1(T3.actual.pv)} percent of the vote and ${T3.actual.ev} electoral vote${T3.actual.ev === 1 ? '' : 's'}.` : `In real life: ${H.actual.winner === p ? 'won' : 'lost'}, with ${H.actual[p]} electoral votes.`;
    const odds = p === 'T' ? `Goal: ${T3.goals[0].short} · ${(P.hmode === 'fair' ? 'Better odds' : T3.level).toLowerCase()}` : `Odds: ${P.hmode === 'fair' ? 'even' : H.odds[p].toLowerCase()}`;
    return `<button class="card-pick ${P.party === p ? 'on' : ''}" data-a="hSide" data-v="${p}" aria-pressed="${P.party === p}">${ovalHTML()}
      <span class="who">${pinHTML(c, 'lg')}<span class="wt"><b style="font-size:22px">${esc(full(c))}</b><span class="ws">${esc(c.title)} · ${esc(p === 'T' ? T3.label : PARTY[p])}</span></span></span>
      <p>${esc(c.bio)}</p><span class="perk">${esc(c.perkText)}</span>
      <span class="hint">Running mate: ${esc(full(v))}. ${real}</span><span class="label" style="color:var(--ink)">${esc(odds)}</span></button>`;
  };
  const note = T3 ? `<b style="margin-top:6px">${esc(full(T3.cand))}</b><span>${esc(T3.note)}</span>`
    : H.locked ? `<b style="margin-top:6px">${esc(H.locked.label)}</b><span>${esc(H.locked.note)} ${threshFor(String(H.year))} electoral votes still win.</span>` : '';
  const goals = isTP ? `<section><div class="step-h"><span class="n">Goals</span><h2>What counts as a win for ${esc(T3.cand.last)}</h2><p>Nobody outside the two major parties has won the presidency, so you play for these. The first one decides whether your campaign succeeds.</p></div>
      <ol class="goals">${T3.goals.map((g, i) => `<li${i === 0 ? ' class="main"' : ''}>${esc(g.text)}</li>`).join('')}</ol></section>` : '';
  const modeTxt = isTP ? [['As it happened', `The race starts where the real polls stood, and ${T3.cand.last}'s support drifts the way it really did.`], ['A better break', `The same turning points, but the slumps that cut into ${T3.cand.last}'s support in real life are half as deep.`]]
    : [['As it happened', 'The race starts where the real polls stood and drifts the way they really moved. Some campaigns are long shots, as they were at the time.'], ['A fair fight', 'Same map and the same turning points, but history\'s currents are halved and the race starts even. Either side can win.']];
  let h = `<header class="topbar"><div class="wrap"><span class="wm-sm">Front Runner</span><span class="sub">${H.year} · ${esc(H.tagline)}</span><span style="flex:1"></span>${soundBtn()}<button class="btn" data-a="home">Back</button></div></header>
    <div class="wrap setup">
      <section><div class="step-h"><span class="n">${H.year}</span><h2>Where things stand</h2></div>
        <div class="brief"><p class="brief-text">${esc(H.open)}</p>
          <div class="note-box"><b>History's currents</b><span>The real turning points are built in, and the polls drift the way they actually moved. Your forecast already allows for that drift. Your choices, debates and stops can beat history or fall short of it.</span>${note}</div></div></section>
      <section><div class="step-h"><span class="n">Pick a side</span><h2>Whose campaign will you run?</h2></div><div class="cards${T3 ? '' : ' two'}">${card('D')}${card('R')}${T3 ? card('T') : ''}</div></section>
      ${goals}
      <section><div class="step-h"><span class="n">The odds</span><h2>How much should history weigh?</h2></div><div class="cards two">
        <button class="card-pick ${P.hmode !== 'fair' ? 'on' : ''}" data-a="hMode" data-v="real">${ovalHTML()}<b style="font-size:18px">${modeTxt[0][0]}</b><p>${esc(modeTxt[0][1])}</p></button>
        <button class="card-pick ${P.hmode === 'fair' ? 'on' : ''}" data-a="hMode" data-v="fair">${ovalHTML()}<b style="font-size:18px">${modeTxt[1][0]}</b><p>${esc(modeTxt[1][1])}</p></button></div></section>
      ${depthHTML('Depth')}
    </div>`;
  const ready = !!P.party;
  const pc = ready ? (P.party === 'T' ? T3.cand : H.cands[P.party]) : null;
  h += `<div class="startbar"><div class="wrap"><div class="sum">${ready ? `<b>${esc(full(pc))} for President</b>${H.year} · 10 turns${P.depth === 'full' ? ' · Full campaign' : ''}` : 'Pick a candidate to begin.'}</div><button class="btn btn-ink btn-lg" data-a="start" ${ready ? '' : 'disabled'}>Begin the campaign</button></div></div>`;
  $('#scr-hsetup').innerHTML = h;
}
// ---------- game ----------
function renderGame() {
  show('game');
  const tip = $('#tip'); if (tip) tip.hidden = true;
  const c = me(), v = mate(), t = Math.min(G.turn, S.turns.length - 1);
  const end = G.phase === 'end';
  const ticks = S.turns.map((x, i) => { const lg = G.log.find(l => l.turn === i); const g = lg ? gradeOf(lg.score) : null; return `<i class="${i === G.turn && !end ? 'now' : lg ? (g === 'strong' || g === 'good' ? 'g' : g === 'hurt' ? 'b' : 'done') : ''}"></i>`; }).join('');
  $('#ghead').innerHTML = `<div class="wrap">
    <span class="wm-sm">Front Runner</span>
    <span class="ticket">${pinHTML(c, 'sm')}<span class="names">${esc(c.last)} / ${esc(v.last)}<span>${S.year} · ${esc(pName(G.party))}</span></span></span>
    <div class="cal"><div class="lbl"><span><b>${end ? 'Campaign over' : 'Turn ' + (G.turn + 1) + ' of ' + S.turns.length}</b> · ${end ? fmtShort(S.election) : fmtShort(turnDate(t))}</span><span>${end ? 'Election Day' : daysBetween(turnDate(t), S.election) + ' days to go'}</span></div><div class="ticks">${ticks}</div></div>
    ${soundBtn()}<button class="btn" data-a="menu">Menu</button></div>`;
  renderRace(); renderMap(); renderKeys(); renderAct(); renderTicker(); renderModal();
}
function sparkSVG() {
  const h = G.hist; const n = h.length; const W = 96, H = 26;
  const x = i => n <= 1 ? W / 2 : 2 + i * (W - 4) / (n - 1), y = v => H - 2 - v * (H - 4);
  const pts = h.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" aria-hidden="true"><line class="mid" x1="0" y1="${y(.5)}" x2="${W}" y2="${y(.5)}"></line>${n > 1 ? `<polyline class="ln" points="${pts}"></polyline>` : ''}<circle cx="${x(n - 1)}" cy="${y(h[n - 1])}" r="2.6" fill="var(--ink)"></circle></svg>`;
}
function renderRace() {
  if (S.third) { renderRace3(); return; }
  const k = evCats(G.polls), p = G.party, o = G.opp;
  const seg = (party, c, ev) => ev ? `<i style="width:${ev / TOTAL_EV * 100}%;background:var(--${party === 'D' ? 'd' : 'r'}${c})"></i>` : '';
  const locked = TOTAL_EV - CONTEST_EV;
  const track = seg(p, 4, k.me[4]) + seg(p, 3, k.me[3]) + seg(p, 2, k.me[2]) + seg(p, 1, k.me[1]) + (k.toss ? `<i style="width:${k.toss / TOTAL_EV * 100}%;background:var(--toss)"></i>` : '') + (locked ? `<i style="width:${locked / TOTAL_EV * 100}%;background:var(--locked)"></i>` : '') + seg(o, 1, k.op[1]) + seg(o, 2, k.op[2]) + seg(o, 3, k.op[3]) + seg(o, 4, k.op[4]);
  const trend = G.hist.length > 1 ? G.hist[G.hist.length - 1] - G.hist[G.hist.length - 2] : 0;
  $('#race').innerHTML = `<div class="race-top">
      <div class="side-tally">${pinHTML(me())}<span><span class="ev c-${p}">${k.meT}</span></span><span class="nm">${esc(me().last)}<span>projected</span></span></div>
      <div class="wincol">${sparkSVG()}<span class="wc">${pct(G.fc.win)}</span><span class="l">your chance to win${Math.abs(trend) >= .01 ? ` · <span class="${trend > 0 ? 'up' : 'down'}">${trend > 0 ? '▲' : '▼'}${Math.round(Math.abs(trend) * 100)}</span>` : ''}</span></div>
      <div class="side-tally r">${pinHTML(foe())}<span><span class="ev c-${o}">${k.opT}</span></span><span class="nm">${esc(foe().last)}<span>projected</span></span></div></div>
    <div class="evbar"><div class="evtrack">${track}</div><span class="evmark" style="left:${THRESH / TOTAL_EV * 100}%"><span>${THRESH} to win</span></span></div>
    <div class="race-foot"><span>Projected from current polls · ${k.toss} electoral votes too close to call${locked ? ` · ${locked} for ${esc(S.h.locked.short)}` : ''}${G.tide && G.turn < S.turns.length ? ' · Win chance allows for the swing still to come' : ''}</span><span>National polls: ${leadTxt(G.natPoll)}</span></div>`;
}
function renderRace3() {
  const k = evCats3(G.psh), P = G.party, T = isT();
  const lp = T ? 'D' : P, rp = T ? 'R' : G.opp;
  const seg = (q, c) => k.c[q][c] ? `<i style="width:${k.c[q][c] / TOTAL_EV * 100}%;background:var(--${rampVar(q)}${c})"></i>` : '';
  const track = [4, 3, 2, 1].map(c => seg(lp, c)).join('') + (k.toss ? `<i style="width:${k.toss / TOTAL_EV * 100}%;background:var(--toss)"></i>` : '') + [4, 3, 2, 1].map(c => seg('T', c)).join('') + [1, 2, 3, 4].map(c => seg(rp, c)).join('');
  const trend = G.hist.length > 1 ? G.hist[G.hist.length - 1] - G.hist[G.hist.length - 2] : 0;
  const tr = Math.abs(trend) >= .01 ? ` · <span class="${trend > 0 ? 'up' : 'down'}">${trend > 0 ? '▲' : '▼'}${Math.round(Math.abs(trend) * 100)}</span>` : '';
  const chance = `<div class="wincol">${sparkSVG()}<span class="wc">${pct(G.fc.win)}</span><span class="l">${T ? 'chance to ' + esc(goal0().short) : 'your chance to win'}${tr}</span></div>`;
  const tally = (q, r) => `<div class="side-tally${r ? ' r' : ''}">${pinHTML(candOf(q))}<span><span class="ev c-${q}">${k.tot[q]}</span></span><span class="nm">${esc(candOf(q).last)}<span>${fmtPct(G.pn[q])}% in polls</span></span></div>`;
  const top = T ? `<div class="side-tally">${pinHTML(me())}<span><span class="ev c-T">${f1(G.pn.T)}<small>%</small></span></span><span class="nm">Your poll<span>${k.tot.T} EV projected</span></span></div>${chance}<div class="side-mini">${['D', 'R'].map(q => `<span class="sm-row">${pinHTML(candOf(q), 'sm')}<b class="c-${q}">${k.tot[q]}</b><span>${esc(candOf(q).last)} · ${Math.round(G.pn[q])}%</span></span>`).join('')}</div>`
    : tally(P) + chance + tally(G.opp, true);
  const foot = T ? `<span>Your goal: <b>${esc(goal0().text)}</b></span><span>${k.toss} electoral votes too close to call</span>`
    : `<span>Projected from current polls · ${k.toss} electoral votes too close to call · <b class="c-T">${esc(candOf('T').last)}</b> ${fmtPct(G.pn.T)}%${k.tot.T ? `, ${k.tot.T} electoral votes` : ''}${G.tide && G.turn < S.turns.length ? ' · Win chance allows for the swing still to come' : ''}</span><span>National polls: ${leadTxtSh(G.pn)}</span>`;
  $('#race').innerHTML = `<div class="race-top${T ? ' tmode' : ''}">${top}</div>
    <div class="evbar"><div class="evtrack">${track}</div><span class="evmark" style="left:${THRESH / TOTAL_EV * 100}%"><span>${THRESH} to win</span></span></div>
    <div class="race-foot">${foot}</div>`;
}
function legendHTML() {
  const ramp = q => `<span class="ramp">${[4, 3, 2, 1].map(c => `<i style="background:var(--${rampVar(q)}${c})"></i>`).join('')}</span>`;
  const lockedLbl = TOTAL_EV > CONTEST_EV ? `<span><span class="ramp"><i style="background:var(--locked)"></i></span>${esc(S.h.locked.short)}</span>` : '';
  const stops = isT() ? `<span><span class="dot" style="background:var(--ink)"></span>Your last stop</span><span><span class="dot"></span>Their last stops</span>`
    : `<span><span class="dot" style="background:var(--ink)"></span>Your last stop</span><span><span class="dot"></span>${esc(foe().last)}'s last stop</span>`;
  if (isT() && UI.mapMode === 'share') {
    const b = shareBands().map(fmtPct);
    return `<span><span class="ramp"><i style="background:var(--t1)"></i></span>Under ${b[0]}%</span><span><span class="ramp"><i style="background:var(--t2)"></i></span>${b[0]}–${b[1]}%</span><span><span class="ramp"><i style="background:var(--t3)"></i></span>${b[1]}–${b[2]}%</span><span><span class="ramp"><i style="background:var(--t4)"></i></span>${b[2]}% or more</span>${stops}`;
  }
  const parts = S.third ? S.parties.map(q => `<span>${ramp(q)}${esc(candOf(q).last)}</span>`).join('') + `<span><span class="ramp"><i style="background:var(--toss)"></i></span>Toss-up</span>`
    : `<span>${ramp(G.party)}${esc(me().last)}</span><span><span class="ramp"><i style="background:var(--toss)"></i></span>Toss-up</span><span>${ramp(G.opp)}${esc(foe().last)}</span>`;
  return parts + lockedLbl + stops;
}
function renderMap() {
  if (!$('#map-game')) {
    const head = isT() ? `<div class="segset sm" role="group" aria-label="Map view"><button data-a="mapMode" data-v="lead">Who leads</button><button data-a="mapMode" data-v="share">Your support</button></div>` : '<span class="hint">Hover or tap a state for details</span>';
    $('#mapcard').innerHTML = `<div class="maphead"><h2>The map</h2>${head}</div>${mapSVG('map-game', true)}<div class="legend" id="legend"></div><div class="tip" id="tip" hidden></div>`;
    bindMap($('#map-game'));
  }
  const svg = $('#map-game');
  const share = isT() && UI.mapMode === 'share';
  paintBy(svg, id => share ? shadeShare(G.psh[id].T) : shadeSh(G.psh[id]));
  $$('[data-a="mapMode"]').forEach(b => { const on = b.dataset.v === (share ? 'share' : 'lead'); b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
  const lg = $('#legend'); const lh = legendHTML(); if (lg.dataset.k !== lh) { lg.dataset.k = lh; lg.innerHTML = lh; }
  markSel(svg, G.phase === 'r' ? UI.pick : null);
  drawPins(svg);
  if (G.phase === 'r' && G.res && G.res.swings && UI.swingTurn !== G.turn) {
    UI.swingTurn = G.turn;
    G.res.swings.forEach((s, i) => setTimeout(() => floatText(svg, s.id, (s.d > 0 ? '+' : '−') + f1(Math.abs(s.d)), s.d > 0 ? 'up' : 'down'), 250 + i * 140));
  }
}
function tipHTML(id) {
  const u = U[id];
  if (!u) {
    const nm = id === 'DC' ? 'District of Columbia' : id === 'AK' ? 'Alaska' : id === 'HI' ? 'Hawaii' : id;
    const why = id === 'DC' ? 'The District of Columbia had no electoral votes until 1964.' : `${nm} was not yet a state. It joined the Union in 1959.`;
    return `<b>${nm}</b><p>${why}</p>`;
  }
  const lv = labelEV(u); let note = '';
  if (S.third) {
    const ps = G.psh[id], rs = rawShares(u, true), rl = leadOf(rs);
    const rows = S.parties.slice().sort((a, b) => ps[b] - ps[a]).map(q => `<div class="row"><span>${esc(candOf(q).last)}${q === G.party ? ' (you)' : ''}</span><span class="c-${q}">${f1(ps[q])}%</span></div>`).join('');
    const ch = isT() ? (G.prevT[id] == null ? null : ps.T - G.prevT[id]) : (G.prev[id] == null ? null : G.polls[id] - G.prev[id]);
    const vis = isT() ? [['You', G.visits.me[id] || 0], [candOf('D').last, G.visits.D[id] || 0], [candOf('R').last, G.visits.R[id] || 0]] : [['You', G.visits.me[id] || 0], [foe().last, G.visits.op[id] || 0]];
    return `<b>${esc(u.name)}</b><div class="row"><span>Electoral votes</span><span>${lv}</span></div><p class="tsub">Latest poll</p>${rows}${ch == null ? '' : `<div class="row"><span>Last turn</span><span>${ch > 0 ? '+' : ''}${f1(ch)} ${isT() ? 'for you' : 'net for you'}</span></div>`}<div class="row"><span>Real ${S.year} result</span><span>${esc(candOf(rl.p).last)} +${f1(rl.m)}</span></div>${vis.some(x => x[1]) ? `<div class="row"><span>Visits</span><span>${vis.map(x => esc(x[0]) + ' ' + x[1]).join(' · ')}</span></div>` : ''}`;
  }
  if (u.kids.length) note = `${u.name} gives ${u.ev} electoral votes to the statewide winner and 1 to the winner of each of its ${u.kids.length} congressional districts, ${lv} in all. The districts are listed at the right of the map.`;
  if (u.locked && !u.ev) return `<b>${esc(u.name)}</b><div class="row"><span>Electoral votes</span><span>${lv}</span></div><p>In ${S.year} these electoral votes went to ${esc(S.h.locked.who)}. They are not in play.</p>`;
  if (u.locked) note = `${u.locked} of ${u.name}'s ${lv} electoral votes went to ${S.h.locked.who}. Only ${u.ev} are at stake between the two candidates.`;
  const m = G.polls[id], ch = G.prev[id] == null ? null : m - G.prev[id];
  const mine = G.visits.me[id] || 0, theirs = G.visits.op[id] || 0;
  const hm = SG[G.party] * u.m;
  return `<b>${esc(u.name)}</b><div class="row"><span>Electoral votes</span><span>${lv}</span></div><div class="row"><span>Polls</span>${leadTxt(m)}</div>${ch == null ? '' : `<div class="row"><span>Last turn</span><span>${ch > 0 ? '+' : ''}${f1(ch)} for you</span></div>`}<div class="row"><span>${S.modern ? '2024 result' : 'Real ' + S.year + ' result'}</span><span>${S.modern ? (u.m > 0 ? 'D' : 'R') + '+' + f1(Math.abs(u.m)) : (hm > 0 ? me() : foe()).last + ' +' + f1(Math.abs(u.m))}</span></div>${mine || theirs ? `<div class="row"><span>Visits</span><span>You ${mine} · ${esc(foe().last)} ${theirs}</span></div>` : ''}${note ? `<p>${esc(note)}</p>` : ''}`;
}
function bindMap(svg) {
  const card = $('#mapcard');
  const showTip = (id, ev) => {
    const t = $('#tip'); if (!t) return;
    t.innerHTML = tipHTML(id); t.hidden = false;
    const r = card.getBoundingClientRect(); const z = parseFloat(getComputedStyle(document.body).zoom) || 1;
    const tw = t.offsetWidth, th = t.offsetHeight;
    const W = r.width / z, Hh = r.height / z;
    let x = (ev.clientX - r.left) / z + 14, y = (ev.clientY - r.top) / z + 14;
    if (x + tw > W - 8) x = x - tw - 28;
    if (y + th > Hh - 8) y = y - th - 28;
    t.style.left = Math.max(8, x) + 'px'; t.style.top = Math.max(8, y) + 'px';
  };
  const hide = () => { const t = $('#tip'); if (t) t.hidden = true; };
  svg.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const el = e.target.closest('[data-u]'); if (el) showTip(el.dataset.u, e); else hide(); });
  svg.addEventListener('pointerleave', hide);
  svg.addEventListener('click', e => {
    const el = e.target.closest('[data-u]'); if (!el) { hide(); return; }
    showTip(el.dataset.u, e);
    const u = U[el.dataset.u];
    if (G && G.phase === 'r' && u && u.ev) { UI.pick = u.id; renderAct(); markSel(svg, UI.pick); SFX.play('tick'); }
  });
}
function renderKeys() {
  if (isT()) {
    const g = goal0(), stateGoal = g.kind === 'house' || g.kind === 'ev' || g.kind === 'states';
    const rows = UNITS.filter(u => u.ev).sort((a, b) => stateGoal ? G.polls[b.id] - G.polls[a.id] : G.psh[b.id].T - G.psh[a.id].T).slice(0, 12);
    $('#keys').innerHTML = `<h2>${stateGoal ? 'Your best chances' : 'Your strongest states'}</h2><div class="keylist">${rows.map(u => {
      const ps = G.psh[u.id], L = leadOf(ps), ch = G.prevT[u.id] == null ? null : ps.T - G.prevT[u.id];
      const right = L.p === 'T' ? `<span class="lead c-T">You +${f1(L.m)}</span>` : `<span class="lead"><span class="c-T">${f1(ps.T)}%</span> <span class="kl">${esc(candOf(L.p).last)} ${Math.round(ps[L.p])}</span></span>`;
      return `<button class="krow" data-a="key" data-v="${u.id}"><span class="kn">${esc(unitName(u))}<small>${u.ev}</small></span>${right}<span class="ch ${ch == null ? '' : ch > 0.05 ? 'up' : ch < -0.05 ? 'down' : 'muted'}">${ch == null ? '' : (ch > 0.05 ? '▲' : ch < -0.05 ? '▼' : '') + f1(Math.abs(ch))}</span></button>`;
    }).join('')}</div><p class="hint" style="margin-top:10px">National poll: <b style="color:var(--ink)">${esc(natLine())}</b>. ${stateGoal ? 'Listed by how close you are to first place.' : 'Listed by your share of the vote.'} Polls can miss by a few points either way.</p>`;
    return;
  }
  const rows = UNITS.filter(u => u.ev).sort((a, b) => Math.abs(G.polls[a.id]) - Math.abs(G.polls[b.id])).slice(0, 12);
  const tip = U[tippingPoint(G.polls)];
  $('#keys').innerHTML = `<h2>Closest races</h2><div class="keylist">${rows.map(u => {
    const ch = G.prev[u.id] == null ? null : G.polls[u.id] - G.prev[u.id];
    return `<button class="krow" data-a="key" data-v="${u.id}"><span class="kn">${esc(unitName(u))}<small>${u.ev}</small></span>${leadTxtSh(G.psh[u.id])}<span class="ch ${ch == null ? '' : ch > 0.05 ? 'up' : ch < -0.05 ? 'down' : 'muted'}">${ch == null ? '' : (ch > 0.05 ? '▲' : ch < -0.05 ? '▼' : '') + f1(Math.abs(ch))}</span></button>`;
  }).join('')}</div><p class="hint" style="margin-top:10px">Tipping point: <b style="color:var(--ink)">${esc(tip.name)}</b>, the state that would put you over ${THRESH} if the election were held today. Polls can miss by a few points either way.</p>`;
}
function renderTicker() {
  const items = [];
  items.push(`<b>Latest polls</b> National: ${esc(S.third ? natLine() : plainLeadSh(G.pn))}`);
  if (isT()) UNITS.filter(u => u.ev).sort((a, b) => G.psh[b.id].T - G.psh[a.id].T).slice(0, 5).forEach(u => items.push(`${esc(u.name)}: you ${f1(G.psh[u.id].T)}%, ${esc(tGapTxt(G.psh[u.id]))}`));
  else UNITS.filter(u => u.ev).sort((a, b) => Math.abs(G.polls[a.id]) - Math.abs(G.polls[b.id])).slice(0, 6).forEach(u => items.push(`${esc(u.name)}: ${esc(plainLeadSh(G.psh[u.id]))}`));
  if (G.last) items.push(isT() ? `<b>On the trail</b> ${esc(me().last)} was in ${esc(unitName(U[G.last.me]))}. ${esc(candOf('D').last)} was in ${esc(unitName(U[G.last.op]))}, and ${esc(candOf('R').last)} in ${esc(unitName(U[G.last.op2]))}.`
    : `<b>On the trail</b> ${esc(me().last)} was in ${esc(unitName(U[G.last.me]))}. ${esc(foe().last)} was in ${esc(unitName(U[G.last.op]))}.`);
  G.log.slice(-3).reverse().forEach(l => items.push(`<b>The Morning Ledger</b> ${esc(l.hl)}`));
  if (G.phase !== 'end') items.push(`<b>${daysBetween(turnDate(G.turn), S.election)} days</b> until Election Day`);
  const line = items.map(x => `<span class="ti">${x}</span>`).join('<span class="sep" aria-hidden="true">◆</span>');
  const el = $('#ticker');
  if (el.dataset.k === line) return; el.dataset.k = line;
  el.innerHTML = `<span class="tk-label">News</span><div class="tk-track"><div class="tk-move" style="animation-duration:${Math.max(36, items.length * 8)}s">${line}<span class="sep" aria-hidden="true">◆</span><span aria-hidden="true">${line}</span><span class="sep" aria-hidden="true">◆</span></div></div>`;
}
function chipsFor(fx) {
  const out = []; if (!fx) return '';
  if (Math.abs(fx.nat || 0) >= 0.05) out.push([fx.nat > 0, 'Nationwide']);
  for (const r in REG) if (Math.abs(fx[r] || 0) >= 0.1) out.push([fx[r] > 0, REG_SHORT[r]]);
  if (fx.home && U[me().home]) out.push([true, U[me().home].name]);
  return out.map(([up, l]) => `<span class="chip ${up ? 'up' : 'down'}">${up ? '▲' : '▼'} ${esc(l)}</span>`).join('');
}
function dialSVG(d) {
  const W = 320, H = 120, n = d.lines[0].a.length, x = i => 46 + i * (W - 104) / (n - 1), y = v => 10 + (100 - v) * (H - 24) / 100;
  const line = arr => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  // End labels, nudged apart so they never overlap.
  const ends = d.lines.map((l, i) => ({ i, y: y(l.a[n - 1]) + 4 })).sort((a, b) => a.y - b.y);
  for (let k = 1; k < ends.length; k++) if (ends[k].y - ends[k - 1].y < 12) ends[k].y = ends[k - 1].y + 12;
  const over = ends.length ? Math.max(0, ends[ends.length - 1].y - (H - 2)) : 0; ends.forEach(e => { e.y -= over; });
  const ly = {}; ends.forEach(e => { ly[e.i] = e.y; });
  const paths = d.lines.map((l, i) => ({ l, i })).reverse().map(({ l, i }) => `<path class="dl${i === 0 ? ' me' : ''}" d="${line(l.a)}" style="stroke:var(--${colorVar(l.p)})" pathLength="100"></path>`).join('');
  const labels = d.lines.map((l, i) => `<text class="dend" x="${W - 52}" y="${ly[i].toFixed(1)}" style="fill:var(--${colorVar(l.p)})">${esc(candOf(l.p).last)}</text>`).join('');
  return `<svg class="dial" viewBox="0 0 ${W} ${H}" role="img" aria-label="Focus group reaction during the debate">
    <line class="dg" x1="46" x2="${W - 58}" y1="${y(50)}" y2="${y(50)}"></line><line class="dg" x1="46" x2="${W - 58}" y1="${y(85)}" y2="${y(85)}"></line><line class="dg" x1="46" x2="${W - 58}" y1="${y(15)}" y2="${y(15)}"></line>
    <text x="40" y="${y(85) + 3}" text-anchor="end">Liked it</text><text x="40" y="${y(15) + 3}" text-anchor="end">Didn't</text>
    ${paths}${labels}</svg>`;
}
function renderAct() {
  const el = $('#act'); const p = G.party;
  if (G.phase === 'end') {
    let lede;
    if (isT()) { const k = evCats3(G.psh); lede = `The last rally is done and the last ad has aired. Your final national poll is ${f1(G.pn.T)} percent, and you lead in states worth ${k.tot.T} electoral votes. The forecast gives you a ${pct(G.fc.win)} chance to reach your goal: ${esc(goal0().text.charAt(0).toLowerCase() + goal0().text.slice(1))}.`; }
    else if (S.third) { const k = evCats3(G.psh); lede = `The last rally is done and the last ad has aired. Your final polls show ${k.tot[p]} electoral votes for you, ${k.tot[G.opp]} for ${esc(foe().last)} and ${k.tot.T} for ${esc(candOf('T').last)}, with ${k.toss} too close to call. The forecast gives you a ${pct(G.fc.win)} chance.`; }
    else { const k = evCats(G.polls); lede = `The last rally is done and the last ad has aired. Your final polls show ${k.meT} electoral votes for you and ${k.opT} for ${esc(foe().last)}, with ${k.toss} too close to call. The forecast gives you a ${pct(G.fc.win)} chance.`; }
    el.innerHTML = `<div class="ballot"><div class="ballot-hd"><span>Election Day</span><span>${fmtShort(S.election)}</span></div>
      <div class="dec-body"><h2>The campaign is over</h2>
      <p class="lede">${lede}</p>
      <p class="hint">Polls can miss by a few points, so a lead under three is far from safe.</p>
      <button class="btn btn-ink btn-lg" data-a="night">Watch the returns <span class="kbd" style="background:transparent;color:inherit;border-color:currentColor">Enter</span></button></div></div>`;
    return;
  }
  const d = turnDef();
  const date = turnDate(G.turn);
  let h = '';
  if (G.phase === 'q') {
    h += `<div class="ballot"><div class="ballot-hd"><span>Turn ${G.turn + 1} of ${S.turns.length} · ${esc(d.cat)}</span><span>${fmtShort(date)}</span></div><div class="dec-body">`;
    if (G.last && G.turn > 0 && G.last.full && G.lastPlans) {
      h += `<div class="lastweek">${[G.party].concat(isT() ? ['D', 'R'] : [G.opp]).map(q => `<span>${planSummary(q, G.lastPlans[q])}</span>`).join('')}</div>`;
    } else if (G.last && G.turn > 0) {
      if (isT()) {
        const sq = G.last.opQ == null ? '' : G.last.opQ > 0.35 ? ' Both parties spent the week warning your voters not to waste their votes.' : G.last.opQ > 0.1 ? ' Both parties kept up the wasted-vote argument.' : ' The wasted-vote argument didn\'t get much traction this week.';
        h += `<div class="lastweek"><span><b>Last stop:</b> ${esc(unitName(U[G.last.me]))}. ${esc(G.last.trail ? G.last.trail.txt : '')} (+${f1(G.last.mePow)} for you there)</span><span><b>${esc(candOf('D').last)}</b> campaigned in ${esc(unitName(U[G.last.op]))}, and <b>${esc(candOf('R').last)}</b> in ${esc(unitName(U[G.last.op2]))}.${sq}</span></div>`;
      } else {
        const opRead = G.last.opQ == null ? '' : G.last.opQ > 0.45 ? 'had a strong week and ' : G.last.opQ > 0.15 ? 'had a steady week and ' : 'had a rough week but ';
        h += `<div class="lastweek"><span><b>Last stop:</b> ${esc(unitName(U[G.last.me]))}. ${esc(G.last.trail ? G.last.trail.txt : '')} (+${f1(G.last.mePow)} there)</span><span><b>${esc(foe().last)}</b> ${opRead}campaigned in ${esc(unitName(U[G.last.op]))}.</span></div>`;
      }
    }
    if (d.kind === 'debate') {
      const rivals = debRivals(d);
      const tag = c => c.perk === 'debate' ? 'Strong debater' : 'At the podium';
      const right = rivals.length > 1
        ? `<div class="dv r dv-multi">${rivals.map(q => `<div class="dv-one">${pinHTML(candOf(q), 'sm')}<div><b>${esc(candOf(q).last)}</b><span>${tag(candOf(q))}</span></div></div>`).join('')}</div>`
        : `<div class="dv r">${pinHTML(candOf(rivals[0]))}<div><b>${esc(candOf(rivals[0]).last)}</b><span>${tag(candOf(rivals[0]))}</span></div></div>`;
      h += `<div class="debate-vs"><div class="dv">${pinHTML(me())}<div><b>${esc(me().last)}</b><span>${tag(me())}</span></div></div><span class="x">VS</span>${right}</div>`;
      if (G.full) { el.innerHTML = h + debateFullHTML(d); return; }
      h += `<div class="qbox"><small>The moderator asks${S.modern ? ' · ' + esc(d.title) : ''}</small>${esc(d.body)}</div>`;
    } else {
      h += `<h2>${esc(d.title)}</h2><p class="lede">${esc(d.body)}</p>`;
      if (d.kind === 'surprise') h += `<p class="hint">${d.side === 'self' ? 'The story broke overnight and is already costing you. How you respond decides how much.' : 'The story is already hurting ' + esc(foe().last) + '. Do you pile on?'}</p>`;
    }
    const adv = advice(d);
    h += `<div class="staff">${adv.map(a => `<div class="memo"><span class="face">${a.who.name ? esc(a.who.name.split(' ').map(x => x[0]).join('')) : (a.who.role === 'Pollster' ? 'P' : 'CM')}</span><span><q>${esc(a.text)}</q><span class="by">${a.who.name ? esc(a.who.name) + ', ' + esc(a.who.role.toLowerCase()) : esc(a.who.role)}</span></span></div>`).join('')}</div>`;
    h += `</div><div class="ballot-sub"><span>${d.kind === 'debate' ? 'Your approach' : 'Your response'}</span><span>Vote for one</span></div>
      <div class="choices">${d.options.map((x, i) => `<button class="choice" data-a="ans" data-v="${i}">${ovalHTML()}<span>${esc(optText(x))}${x.note ? `<small>${esc(x.note)}</small>` : ''}</span><span class="kbd">${i + 1}</span></button>`).join('')}</div>
      <p class="instr">Mark the oval next to your choice, or press 1–${d.options.length}.</p></div>`;
  } else {
    const r = G.res;
    h += `<article class="clip"><div class="mast"><span>The Morning Ledger</span><span>${fmtLong(date, 1)}</span></div><h3>${esc(r.head.hl)}</h3><p class="deck">${esc(r.head.deck)}</p></article>`;
    h += `<div class="sheet react">`;
    const g = gradeOf(r.score);
    const tagTxt = r.snap ? (r.snap.you > r.snap.them + 2 ? 'Debate win' : r.snap.them > r.snap.you + 2 ? 'Debate loss' : 'Debate draw') : { strong: 'Strong reviews', good: 'Solid answer', even: 'Mixed reaction', hurt: 'Backfired' }[g];
    const tagCls = r.snap ? (r.snap.you > r.snap.them + 2 ? 'good' : r.snap.them > r.snap.you + 2 ? 'bad' : '') : g === 'strong' || g === 'good' ? 'good' : g === 'hurt' ? 'bad' : '';
    h += `<div class="verdict"><span class="tag ${tagCls}">${tagTxt}</span>${r.snap ? '' : chipsFor(r.fx)}</div>`;
    if (r.snap) h += `<div><p class="label">Focus group dials</p>${r.dial ? dialSVG(r.dial) : ''}</div><div class="snap"><p class="label">Snap poll: who won?</p>
      ${r.snap.list.map(x => `<div class="snaprow"><span>${esc(candOf(x.p).last)}</span><span class="bar"><i data-w="${x.v}" style="background:var(--${colorVar(x.p)})"></i></span><span class="v">${x.v}%</span></div>`).join('')}
      <div class="snaprow"><span>Not sure</span><span class="bar"><i data-w="${r.snap.und}" style="background:var(--muted)"></i></span><span class="v">${r.snap.und}%</span></div></div>`;
    h += `<div class="voices">${r.voices.map(v => `<div class="voice"><q>${esc(v.q)}</q><span><b>${esc(v.p.n)}</b>, ${v.p.a}, ${esc(v.p.j)} · ${esc(v.p.t)}</span></div>`).join('')}</div>`;
    if (r.hist) h += `<div class="history"><b>What really happened</b><p>${esc(r.hist)}</p>${r.histPick >= 0 ? `<p class="${r.sameAsHist ? 'same' : ''}">${r.sameAsHist ? 'You made the same call.' : 'You chose differently.'}</p>` : ''}</div>`;
    const dw = r.after - r.before;
    if (r.rounds) h += `<div class="rounds">${r.rounds.map((x, i) => `<span class="rd ${x.edge > 0.5 ? 'w' : x.edge < -0.5 ? 'l' : 'e'}">Round ${i + 1} · ${STRATS_F[x.ms].short} · ${x.edge > 0.5 ? 'won' : x.edge < -0.5 ? 'lost' : 'even'}</span>`).join('')}</div>`;
    h += `<div class="swing"><div><span class="big">${pct(r.before)}</span><span class="s">${isT() ? 'chance to ' + esc(goal0().short) + ', before' : 'win chance before'}</span></div><span class="arr">→</span><div><span class="big ${dw > 0.005 ? 'up' : dw < -0.005 ? 'down' : ''}">${pct(r.after)}</span><span class="s">${r.opQ == null ? 'after this turn' : isT() ? 'after the major parties answered' : 'after both campaigns answered'}</span></div></div>`;
    if (G.full) { h += plannerHTML() + '</div>'; el.innerHTML = h; requestAnimationFrame(() => requestAnimationFrame(() => $$('[data-w]', el).forEach(b => { b.style.width = b.dataset.w + '%'; }))); return; }
    const sug = suggestions(); const extra = UI.pick && !sug.includes(UI.pick) ? UI.pick : null;
    const btn = (id, i) => {
      const u = U[id]; const pw = visitPow(u, G.visits.me[id] || 0, me());
      const l1 = isT() ? `${u.ev} EV · you ${f1(G.psh[id].T)}%` : `${u.ev} EV · ${esc(S.third ? plainLeadSh(G.psh[id]) : plainLead(G.polls[id]))}`;
      const l2 = isT() ? `${cap(esc(tGapTxt(G.psh[id])))} · rally +${f1(pw)}` : `A rally here: +${f1(pw)}`;
      return `<button class="stop ${UI.pick === id ? 'mine' : ''}" data-a="visit" data-v="${id}">${silhouette(id)}<span style="min-width:0"><span class="st"><span>${esc(unitName(u))}</span>${i < 4 ? `<span class="kbd">${i + 1}</span>` : ''}</span><span class="sd">${l1}</span><span class="sd">${l2}</span></span></button>`;
    };
    h += `<div class="stops-h"><h3>Where to next?</h3><span class="hint">or tap the map</span></div><div class="stops">${sug.map((id, i) => btn(id, i)).join('')}${extra ? btn(extra, 9) : ''}</div></div>`;
  }
  el.innerHTML = h;
  requestAnimationFrame(() => requestAnimationFrame(() => $$('[data-w]', el).forEach(b => { b.style.width = b.dataset.w + '%'; })));
}
// ---------- modals ----------
const HELP = `<h2>How it works</h2><ol>
  <li><b>Ten turns.</b> Each one is an issue, a debate, a crisis or your closing argument. Mark one oval.</li>
  <li><b>Answers move regions.</b> Different parts of the country react differently, so the best answer depends on the states you need. Your campaign manager thinks about the tipping-point state. Your pollster thinks about the whole map. They often disagree.</li>
  <li><b>Then pick a campaign stop.</b> A rally moves that state's polls, and small states move the most. Going back to the same state helps a little less each time, and every stop has its own luck: big crowds, rain, hecklers.</li>
  <li><b>Your opponent plays too.</b> They answer the same questions and campaign where they need to.</li>
  <li><b>Polls aren't results.</b> They can miss by a few points, which is why the forecast gives a chance, not a certainty.</li>
  <li><b>Historical races</b> start from the real map and drift the way the real polls moved. After each choice you'll see what actually happened.</li>
  <li><b>Election Night.</b> States report as their polls close, counts shift as late ballots come in, and a state within 0.3 points goes to a recount.</li>
  <li><b>Full campaign</b> is the hard mode. Instead of one stop a turn, you plan each week: three stops for you, two for your running mate, ads, field offices and fundraisers. Rallies and ads fade over a few weeks. Field offices count most on Election Day. Debates go three rounds, and each approach beats another. In recent races some people vote early, so a lead in October is partly locked in.</li></ol>`;
function segset(k, opts) { return `<div class="segset" role="group">${opts.map(([v, l]) => `<button data-a="set" data-k="${k}" data-v="${v}" aria-pressed="${String(SET[k]) === String(v)}" class="${String(SET[k]) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`; }
function settingsHTML() {
  return `<div class="ballot-hd"><span>Settings</span><span>Saved in this browser</span></div><div class="mb settings">
    <div class="srow"><span class="sl">Theme</span>${segset('theme', [['auto', 'Match device'], ['light', 'Light'], ['dark', 'Dark']])}</div>
    <div class="srow"><span class="sl">Text size</span>${segset('text', [['normal', 'Standard'], ['large', 'Large']])}</div>
    <div class="srow"><span class="sl">Motion</span>${segset('motion', [['full', 'Full'], ['reduced', 'Reduced']])}</div>
    <div class="srow"><span class="sl">Music</span>${segset('music', [['true', 'On'], ['false', 'Off']])}</div>
    <div class="srow"><span class="sl">Sound effects</span>${segset('sfx', [['true', 'On'], ['false', 'Off']])}</div>
    <div class="srow"><label class="sl" for="vol">Volume</label><input type="range" id="vol" min="0" max="100" step="5" value="${Math.round(SET.vol * 100)}"></div>
    <div class="srow"><span class="sl">Election Night pace</span>${segset('pace', [['1', 'Normal'], ['2', 'Fast']])}</div>
    <p class="hint">Music: "Daybreak," "Familiar Roads," "Now or Never," "Home" and "A Memory Away" by <a href="https://tannerhelland.com/music.html" target="_blank" rel="noopener">Tanner Helland</a>, licensed under Creative Commons Attribution 4.0. Sound effects are generated in your browser.</p>
    <div class="mfoot"><button class="btn btn-ink" data-a="close">Done</button></div></div>`;
}
function renderModal() {
  const m = $('#modal'); let h = '';
  if (UI.modal === 'help') h = `<div class="ballot-hd"><span>Front Runner</span><span>Instructions</span></div><div class="mb">${HELP}<div class="mfoot"><button class="btn btn-ink" data-a="close">Got it</button></div></div>`;
  else if (UI.modal === 'menu') h = `<div class="ballot-hd"><span>Menu</span><span>${G ? S.year : ''}</span></div><div class="mb">${HELP}<div class="mfoot"><button class="btn" data-a="quit">Save and quit</button><button class="btn" data-a="restart">Start over</button><button class="btn" data-a="settings">Settings</button><button class="btn btn-ink" data-a="close">Keep playing</button></div></div>`;
  else if (UI.modal === 'restart') h = `<div class="ballot-hd"><span>Start over</span><span></span></div><div class="mb"><h2>Abandon this campaign?</h2><p>Your saved progress will be deleted.</p><div class="mfoot"><button class="btn" data-a="close">Cancel</button><button class="btn btn-ink" data-a="doRestart">Start over</button></div></div>`;
  else if (UI.modal === 'settings') h = settingsHTML();
  if (!h) { m.hidden = true; return; }
  const keepFocus = UI.modal === 'settings' && !m.hidden && document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.k + '|' + document.activeElement.dataset.v : null;
  $('#mcard').innerHTML = h; m.hidden = false;
  const vol = $('#vol', m); if (vol) vol.addEventListener('input', () => { SET.vol = (+vol.value) / 100; saveSettings(); Music.volume(); SFX.volume(); });
  if (keepFocus) { const [k, v] = keepFocus.split('|'); const b = $(`[data-k="${k}"][data-v="${v}"]`, m); if (b) { b.focus({ preventScroll: true }); return; } }
  const f = $('.btn-ink', m); if (f) f.focus({ preventScroll: true });
}

// ---------- election night ----------
function clock(t) { const h = Math.floor(t) % 24; const mm = Math.floor((t % 1) * 60 + 1e-6); return `${((h + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${h < 12 ? 'a.m.' : 'p.m.'}`; }
function isKey(u) {
  if (UI.keysFor !== G) {
    UI.keysFor = G;
    let ids;
    if (isT()) {
      const best = UNITS.filter(x => x.ev).sort((a, b) => G.startPolls[b.id] - G.startPolls[a.id]).slice(0, 7).map(x => x.id);
      const close = UNITS.filter(x => x.ev && !best.includes(x.id)).sort((a, b) => Math.abs(G.psh[a.id].D - G.psh[a.id].R) - Math.abs(G.psh[b.id].D - G.psh[b.id].R)).slice(0, 8).map(x => x.id);
      ids = best.concat(close);
    } else ids = UNITS.filter(x => x.ev).sort((a, b) => Math.abs(G.startPolls[a.id]) - Math.abs(G.startPolls[b.id])).slice(0, 15).map(x => x.id);
    UI.keys = new Set(ids);
  }
  return UI.keys.has(u.id);
}
const nightSides = () => isT() ? ['D', 'R'] : [G.party, G.opp];
function needleSVG() {
  const T = isT();
  const pc = `var(--${colorVar(G.party)})`, oc = T ? 'var(--muted)' : `var(--${colorVar(G.opp)})`;
  const arc = (a0, a1, r) => { const p = a => [100 - r * Math.cos(a * Math.PI), 100 - r * Math.sin(a * Math.PI)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)}`; };
  const bands = [[0, .1, oc, 1], [.1, .3, oc, .62], [.3, .45, oc, .3], [.45, .55, 'var(--toss)', 1], [.55, .7, pc, .3], [.7, .9, pc, .62], [.9, 1, pc, 1]];
  return `<svg class="needle" viewBox="0 0 200 118" role="img" aria-label="${T ? 'Live chance of reaching your goal' : 'Live chance of winning'}">
    ${bands.map(([a, b, c, o]) => `<path d="${arc(a, b, 82)}" style="stroke:${c};opacity:${o}" class="band"></path>`).join('')}
    <text x="12" y="116" class="nl">${T ? 'Miss' : esc(foe().last)}</text><text x="188" y="116" text-anchor="end" class="nl">${T ? 'Reach' : esc(me().last)}</text>
    <g id="ndl" transform="rotate(0 100 100)"><line x1="100" y1="100" x2="100" y2="30" class="hand"></line></g><circle cx="100" cy="100" r="6" class="hub"></circle></svg>`;
}
function renderNightShell() {
  const [lp, rp] = nightSides();
  const nc = (q, r) => `<div class="ncand${r ? ' r' : ''}">${pinHTML(candOf(q), 'lg')}<span class="nev c-${q}" id="n-${r ? 'R' : 'L'}">0</span><span><b>${esc(candOf(q).last)}</b><span class="np">${esc(pName(q))}${q === G.party ? ' · you' : ''}</span></span></div>`;
  const third = S.third ? `<div class="n3">${pinHTML(candOf('T'), 'sm')}<span><b id="n-T">0</b> ${esc(candOf('T').last)}${isT() ? ' (you)' : ''}</span><span class="n3pv" id="n-Tpv"></span></div>` : '';
  $('#scr-night').innerHTML = `<div class="studio"><header class="nhead"><div class="wrap">
    <div class="nrow">
      ${nc(lp)}
      <div class="nclock"><div class="k">Election Night · ${fmtShort(S.election)}</div><div class="t" id="n-clock"></div>${third}</div>
      ${nc(rp, true)}
    </div>
    <div class="ntrack"><i id="nt-L" style="left:0;width:0;background:var(--${colorVar(lp)})"></i><i id="nt-T" style="left:0;width:0;background:var(--ind)"></i><i id="nt-R" style="right:0;width:0;background:var(--${colorVar(rp)})"></i><span class="m" style="left:${THRESH / TOTAL_EV * 100}%"></span></div>
    <div class="nctrl" id="nctrl"></div></div></header>
    <div class="wrap ngrid"><div class="sheet nmap"><div id="nban"></div><div id="l3" class="l3slot" data-s="i"><div class="l3idle">The first polls close at 7 p.m. Eastern</div></div>${mapSVG('map-night', false)}
      <div class="legend"><span><span class="ramp"><i style="background:var(--land)"></i></span>Polls open</span><span><span class="ramp"><i style="background:var(--toss)"></i></span>Counting</span><span><span class="ramp"><i style="background:var(--d3)"></i><i style="background:var(--r3)"></i>${S.third ? '<i style="background:var(--t3)"></i>' : ''}</span>Projected</span>${TOTAL_EV > CONTEST_EV ? `<span><span class="ramp"><i style="background:var(--locked)"></i></span>${esc(S.h.locked.short)}</span>` : ''}</div></div>
      <aside class="nside"><div class="sheet npanel needlebox"><h2>${isT() ? 'Your goal' : 'Live forecast'} <span id="n-nlabel"></span></h2>${needleSVG()}<p class="hint">${isT() ? esc(goal0().text) + '. ' : ''}Based on the votes counted so far and the final polls.</p></div><div class="sheet npanel"><h2>Battlegrounds <span id="n-bgc"></span></h2><div id="nbg"></div></div><div class="sheet npanel"><h2>Projections <span id="n-count"></span></h2><div class="feed" id="nfeed"></div></div></aside></div></div>`;
  UI.needle = { base: .5, shown: .5, t: 0 };
}
function setNeedle(now) {
  const N = G.night; const ndl = $('#ndl'); if (!ndl) return;
  if (now - UI.needle.t > 650 || N.winner || N.done) { UI.needle.base = liveChance(); UI.needle.t = now; }
  const base = UI.needle.base, decided = N.done || (N.winner && !isT()) || base <= 0.001 || base >= 0.999;
  const jit = decided || calm() || UI.speed === 0 ? 0 : (Math.random() - .5) * 0.06 * (1 - Math.abs(base - .5) * 1.6);
  UI.needle.shown += (clamp(base + jit, 0, 1) - UI.needle.shown) * (calm() ? 1 : .25);
  ndl.setAttribute('transform', `rotate(${((UI.needle.shown - .5) * 180).toFixed(1)} 100 100)`);
  const pm = Math.round(base * 100);
  let lbl;
  if (isT()) lbl = N.done ? (base >= 0.5 ? 'Reached' : 'Missed') : `${pm}%`;
  else lbl = N.winner ? `${candOf(N.winner.p).last} wins` : pm >= 50 ? `${me().last} ${pm}%` : `${foe().last} ${100 - pm}%`;
  const el = $('#n-nlabel'); if (el && el.textContent !== lbl) el.textContent = lbl;
}
function confetti() {
  if (calm()) return;
  const c = document.createElement('canvas'); c.className = 'confetti'; c.setAttribute('aria-hidden', 'true'); document.body.appendChild(c);
  const dpr = Math.min(2, window.devicePixelRatio || 1); const W = c.width = innerWidth * dpr, H = c.height = innerHeight * dpr;
  const ctx = c.getContext('2d'); const cs = getComputedStyle(document.documentElement);
  const cols = [cs.getPropertyValue('--dem').trim() || '#1D4FC0', cs.getPropertyValue('--rep').trim() || '#C4272B', '#FFFFFF', '#E8C24A'];
  const ps = Array.from({ length: 170 }, () => ({ x: Math.random() * W, y: -Math.random() * H * .6, vx: (Math.random() - .5) * 3 * dpr, vy: (2 + Math.random() * 3) * dpr, w: (5 + Math.random() * 6) * dpr, h: (8 + Math.random() * 8) * dpr, r: Math.random() * 6.28, vr: (Math.random() - .5) * .25, c: cols[Math.floor(Math.random() * cols.length)] }));
  const t0 = performance.now();
  const fr = now => {
    const k = (now - t0) / 1000; ctx.clearRect(0, 0, W, H);
    ps.forEach(p => { p.x += p.vx + Math.sin(k * 2 + p.r) * .6 * dpr; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = clamp(4.5 - k, 0, 1); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2))); ctx.restore(); });
    if (k < 4.6) requestAnimationFrame(fr); else c.remove();
  };
  requestAnimationFrame(fr);
}
function countedPV() {
  // Third-party share of the votes counted so far.
  let t = 0, w = 0;
  for (const u of STATEWIDE) { const rp = reporting(u, G.night.t); if (rp <= 0) continue; const sh = G.night.called[u.id] ? G.fsh[u.id] : partialSh(u, G.night.t); t += sh.T * u.votes * rp; w += u.votes * rp; }
  return w ? t / w : null;
}
function celebrate(win) { if (win) { SFX.play('win'); confetti(); Music.play('victory'); } else { SFX.play('lose'); Music.play('defeat'); } }
function renderNight(force) {
  const N = G.night; if (!N || !$('#n-L')) return;
  const ev = calledEV(); const [lp, rp] = nightSides();
  $('#n-L').textContent = ev[lp]; $('#n-R').textContent = ev[rp];
  $('#nt-L').style.width = ev[lp] / TOTAL_EV * 100 + '%'; $('#nt-R').style.width = ev[rp] / TOTAL_EV * 100 + '%';
  if (S.third) {
    $('#n-T').textContent = ev.T; const nt = $('#nt-T'); nt.style.left = ev[lp] / TOTAL_EV * 100 + '%'; nt.style.width = ev.T / TOTAL_EV * 100 + '%';
    const pv = countedPV(); const e = $('#n-Tpv'); const s = pv == null ? '' : `${f1(pv)}% of the votes counted so far`; if (e.textContent !== s) e.textContent = s;
  }
  $('#n-clock').textContent = clock(N.t) + ' ET';
  paintBy($('#map-night'), id => {
    const c = N.called[id]; if (c) return shadeSh(G.fsh[id], 2);
    if (N.t >= CLOSE[U[id].state]) return { fill: 'var(--toss)' };
    return { fill: 'var(--land)' };
  });
  const now = performance.now();
  setNeedle(now);
  if (now > UI.l3until && UI.l3.length) {
    const id = UI.l3.shift(); const u = U[id]; const pp = N.called[id];
    $('#l3').innerHTML = `<div class="lower3 p-${pp}"><span class="k">${N.recount[id] ? 'Recount' : 'Projection'}</span><span class="m"><b>${esc(u.name)}</b><span>${u.ev} electoral vote${u.ev > 1 ? 's' : ''}${N.recount[id] ? ' · decided by ' + f1(leadOf(G.fsh[id]).m) + ' points' : ' · ' + clock(N.call[id]) + ' ET'}</span></span><span class="c">${esc(candOf(pp).last)}</span></div>`;
    $('#l3').dataset.s = 'p'; UI.l3until = now + 2300; SFX.play('ding');
  } else if (now > UI.l3until && $('#l3').dataset.s === 'p') {
    const left = UNITS.filter(u => isKey(u) && !N.called[u.id]).length; $('#l3').dataset.s = 'i';
    $('#l3').innerHTML = `<div class="l3idle">${left ? `${left} battleground${left > 1 ? 's' : ''} still too early or too close to call` : 'Every battleground has been called'}</div>`;
  }
  if (!force && now - UI.lastList < 200) return;
  UI.lastList = now;
  const k = N.done ? 'done' + SET.music : 's' + UI.speed + SET.music;
  if ($('#nctrl').dataset.k !== k) {
    $('#nctrl').dataset.k = k;
    $('#nctrl').innerHTML = (N.done ? `<button class="go" data-a="results">Read the morning paper</button>` : `${[[0, 'Pause'], [1, 'Normal'], [2, 'Fast']].map(([s, l]) => `<button class="${UI.speed === s ? 'on' : ''}" data-a="speed" data-v="${s}">${l}</button>`).join('')}<button data-a="skip">Skip to the end</button>`) + `<button data-a="toggleMusic" aria-pressed="${SET.music}">${SET.music ? 'Music on' : 'Music off'}</button>`;
  }
  const keys = UNITS.filter(isKey).sort((a, b) => CLOSE[a.state] - CLOSE[b.state] || b.ev - a.ev);
  $('#n-bgc').textContent = keys.filter(u => N.called[u.id]).length + ' of ' + keys.length + ' called';
  $('#nbg').innerHTML = keys.map(u => {
    const c = N.called[u.id]; const rp = reporting(u, N.t); let st, cnt = '';
    if (c) { st = `<span class="pill ${c}">${esc(candOf(c).last)}</span>`; cnt = N.recount[u.id] ? 'Recount' : 'Projected'; }
    else if (rp === 0) st = `<span class="pill wait">Polls close ${clock(CLOSE[u.state]).replace(':00', '')}</span>`;
    else if (N.recount[u.id] && rp > .9) { cnt = 'Too close'; st = `<span class="pill close">Recount</span>`; }
    else { const sh = partialSh(u, N.t); cnt = Math.floor(rp * 100) + '% in'; st = `<span class="pill ${leadOf(G.fsh[u.id]).m < 1.5 && rp > .6 ? 'close' : 'count'}">${esc(plainLeadSh(sh))}</span>`; }
    return `<div class="bg-row"><span>${esc(unitName(u))} <span class="muted">${u.ev}</span></span><span class="cnt">${cnt}</span><span class="stt">${st}</span></div>`;
  }).join('');
  $('#n-count').textContent = `${Object.keys(N.called).length} of ${UNITS.length}`;
  const feed = $('#nfeed'); const shown = +(feed.dataset.n || 0);
  if (!N.feed.length && !shown) { if (!feed.firstChild) feed.innerHTML = '<p class="hint">The first polls close at 7 p.m. Eastern in Georgia, Indiana, Kentucky, South Carolina, Vermont and Virginia.</p>'; }
  else if (N.feed.length > shown) {
    if (!shown) feed.innerHTML = '';
    N.feed.slice(0, N.feed.length - shown).reverse().forEach(f => {
      const pill = f.p === 'x' ? `<span class="pill X">${esc(S.h ? S.h.locked.short : 'Other')}</span>` : `<span class="pill ${f.p}">${esc(candOf(f.p).last)}</span>`;
      feed.insertAdjacentHTML('afterbegin', `<div class="frow"><span class="ft">${f.rc ? 'Recount' : clock(f.t)}</span><span>${esc(U[f.id].name)} <span class="muted">${U[f.id].ev || U[f.id].locked}</span></span>${pill}</div>`);
    });
    feed.dataset.n = N.feed.length;
  }
  const nb = $('#nban');
  if (isT()) {
    // A third-party campaign is judged on the whole count, so its own banner waits for the last state.
    if (N.done && nb.dataset.s !== 'g') {
      const o = finalOutcome(); const met = evalOutcome(o) === 1; const W = S.parties.find(q => o.ev[q] >= THRESH);
      nb.innerHTML = `<div class="banner p-T"><span class="k">${esc(me().last)} campaign · final count</span><b>${met ? 'Goal reached' : 'Goal missed'}: ${f1(o.pv.T)}% of the vote${o.ev.T ? `, ${o.ev.T} electoral votes` : ''}</b><span>${W ? `${esc(full(candOf(W)))} wins the presidency.` : `Nobody reached ${THRESH}. The House of Representatives will choose the president.`}</span></div>`;
      nb.dataset.s = 'g';
      if (!N.celebrated) { N.celebrated = true; save(); celebrate(met); }
    } else if (!N.done && N.winner && nb.dataset.s !== 'w') {
      const w = candOf(N.winner.p);
      nb.innerHTML = `<div class="banner p-${N.winner.p}"><span class="k">${N.winner.rc ? 'Decided by a recount' : 'Projected winner · ' + clock(N.winner.t) + ' ET'}</span><b>${esc(full(w))} wins the presidency</b><span>${N.winner.p === 'T' ? 'You have done something no third-party candidate ever has.' : goal0().kind === 'house' ? 'That ends your hope of a deadlock.' : 'Your own count is still coming in.'}</span></div>`;
      nb.dataset.s = 'w';
    }
    return;
  }
  if (N.winner && nb.dataset.s !== 'w') {
    const w = candOf(N.winner.p); const mine = N.winner.p === G.party;
    nb.innerHTML = `<div class="banner p-${N.winner.p}"><span class="k">${N.winner.rc ? 'Decided by a recount' : 'Projected winner · ' + clock(N.winner.t) + ' ET'}</span><b>${esc(full(w))} wins the presidency</b><span>${mine ? 'Your campaign has done it.' : 'Your campaign falls short.'}</span></div>`;
    nb.dataset.s = 'w';
    if (!N.celebrated) { N.celebrated = true; save(); celebrate(mine); }
  } else if (N.done && !N.winner && nb.dataset.s !== 't') {
    nb.innerHTML = `<div class="banner p-X"><span class="k">Every state called</span><b>No majority</b><span>No ticket reached ${THRESH}. The House of Representatives will choose the president.</span></div>`; nb.dataset.s = 't';
  }
}
function nightLoop(ts) {
  if (!G || G.screen !== 'night') { UI.raf = null; return; }
  const dtS = UI.lastT ? Math.min(0.25, (ts - UI.lastT) / 1000) : 0; UI.lastT = ts;
  const was = G.night.done;
  if (!G.night.done && UI.speed > 0) {
    const due = nightStep(dtS * NIGHT_SPEED[UI.speed]);
    due.forEach(u => { if (u.ev && (isKey(u) || u.ev >= 20 || G.night.recount[u.id])) UI.l3.push(u.id); else if (u.ev) SFX.play('call'); });
    if (UI.l3.length > 3) UI.l3 = UI.l3.slice(-3);
  }
  renderNight(G.night.done && !was);
  if (G.night.done) { save(); UI.raf = null; return; }
  UI.raf = requestAnimationFrame(nightLoop);
}
const NIGHT_SPEED = [0, 0.42, 1.5];
function stopNight() { if (UI.raf) cancelAnimationFrame(UI.raf); UI.raf = null; }

// ---------- front page ----------
function renderFinal() {
  if (!G.result) computeResult();
  const R = G.result, P = G.party, T = isT(), W = R.winner;
  const Wc = candOf(W), WV = mateOf(W);
  const order = T ? ['T', 'D', 'R'] : S.third ? [P, G.opp, 'T'] : [P, G.opp];
  const evM = Math.abs(R.ev.D - R.ev.R);
  const kind = R.house ? 'Decided by the House' : evM >= 150 ? 'A landslide' : evM >= 50 ? 'A clear win' : evM >= 16 ? 'A narrow win' : 'A photo finish';
  const incWin = !S.modern && S.h.incumbent === W;
  let head = incWin ? S.h.incHead : `${Wc.last} wins`;
  if (R.house) head = `${Wc.last} wins in the House`;
  const popW = S.parties.slice().sort((a, b) => R.pv[b] - R.pv[a])[0];
  const popSecond = S.parties.slice().sort((a, b) => R.pv[b] - R.pv[a])[1];
  const carried = UNITS.filter(u => u.ev && !u.parent && leadOf(G.fsh[u.id]).p === W && (T || isKey(u))).sort((a, b) => b.ev - a.ev).slice(0, 3).map(u => u.name);
  const rc = (R.recounts || []).filter(id => U[id] && U[id].ev);
  const sworn = incWin ? `will be sworn in for ${S.h.incTerm} on ${S.inaugural}` : `will be sworn in as the ${S.ordinal} president on ${S.inaugural}`;
  const deck = R.house ? `No candidate won a majority of electoral votes, so the House of Representatives voted by state delegation and chose ${full(Wc)}.`
    : `${full(Wc)} wins ${R.ev[W]} electoral votes${carried.length ? ', carrying ' + (carried.length > 1 ? carried.slice(0, -1).join(', ') + ' and ' + carried[carried.length - 1] : carried[0]) : ''}, and ${sworn}${S.modern ? `, with ${full(WV)} as vice president` : ''}.`;
  const split = popW !== W ? ` ${candOf(popW).last} won the popular vote but lost the Electoral College.` : '';
  const rcNote = rc.length ? ` ${rc.map(id => U[id].name).join(' and ')} ${rc.length > 1 ? 'were' : 'was'} decided by a recount.` : '';
  const close = UNITS.filter(u => u.ev).sort((a, b) => leadOf(G.fsh[a.id]).m - leadOf(G.fsh[b.id]).m).slice(0, 8);
  const tip = U[R.tip];
  const others = R.pv.O >= 1 ? (S.third ? ` Other candidates took ${f1(R.pv.O)}%.` : R.pv.O >= 3 ? ` ${S.h && S.h.actual.third ? esc(S.h.actual.third) : 'Other candidates'} took ${f1(R.pv.O)}%.` : '') : '';
  const thirdLine = S.third ? ` ${esc(candOf('T').last)} took ${f1(R.pv.T)}%${R.ev.T ? ` and ${R.ev.T} electoral votes` : ''}.` : '';
  let compare = '', goalsBox = '';
  if (!S.modern) {
    const A = S.h.actual;
    if (T) {
      const TA = S.third.actual; const changed = (A.winner !== W);
      compare = `<div class="compare"><h3 class="label" style="color:var(--ink)">Compared with history</h3>
        <div class="cmp"><span></span><span class="label">You</span><span class="label">${S.year}</span>
          <span>Your popular vote</span><b>${f1(R.pv.T)}%</b><b>${f1(TA.pv)}%</b>
          <span>Your electoral votes</span><b>${R.ev.T}</b><b>${TA.ev}</b>
          <span>States you carried</span><b>${R.sw.T}</b><b>${TA.states}</b></div>
        <p style="font-size:14px">${R.pv.T > TA.pv + 0.05 ? `You beat ${esc(me().last)}'s real share by ${f1(R.pv.T - TA.pv)} points.` : R.pv.T < TA.pv - 0.05 ? `You fell ${f1(TA.pv - R.pv.T)} points short of ${esc(me().last)}'s real share.` : `You matched ${esc(me().last)}'s real share.`} ${changed ? `<b>And the presidency went the other way:</b> ${esc(candOf(A.winner).last)} won in real life.` : `${esc(Wc.last)} won the presidency, as in real life.`}</p>
        <p class="hint">${esc(TA.note)}</p></div>`;
      goalsBox = `<div class="goalbox"><h3 class="label" style="color:var(--ink)">Your goals</h3><ul>${S.third.goals.map((g, i) => `<li class="${R.goals[i] ? 'met' : 'miss'}"><span class="gm" aria-hidden="true">${R.goals[i] ? '✓' : '✕'}</span><span>${esc(g.text)}${i === 0 ? ' <span class="muted">(main goal)</span>' : ''}</span></li>`).join('')}</ul>
        <p style="font-size:14px">${R.goals[0] ? `<b>Your campaign succeeded.</b>` : `<b>Your campaign fell short of its main goal.</b>`} ${R.goals.filter(Boolean).length} of ${R.goals.length} goals met.</p></div>`;
    } else {
      const histMe = A[P]; const diff = R.ev[P] - histMe; const changed = (A.winner === P) !== (W === P);
      compare = `<div class="compare"><h3 class="label" style="color:var(--ink)">Compared with history</h3>
        <div class="cmp"><span></span><span class="label">You</span><span class="label">${S.year}</span>
          <span>${esc(me().last)} electoral votes</span><b>${R.ev[P]}</b><b>${histMe}</b>
          <span>${esc(foe().last)} electoral votes</span><b>${R.ev[G.opp]}</b><b>${A[G.opp]}</b>
          ${S.third ? `<span>${esc(candOf('T').last)} electoral votes</span><b>${R.ev.T}</b><b>${S.third.actual.ev}</b>` : ''}
          <span>${esc(me().last)} popular vote</span><b>${f1(R.pv[P])}%</b><b>${f1(P === 'D' ? A.pvD : A.pvR)}%</b>
          ${S.third ? `<span>${esc(candOf('T').last)} popular vote</span><b>${f1(R.pv.T)}%</b><b>${f1(S.third.actual.pv)}%</b>` : ''}</div>
        <p style="font-size:14px">${changed ? (W === P ? `<b>You changed history.</b> ${esc(me().last)} lost in real life.` : `<b>History went the other way.</b> ${esc(me().last)} won in real life.`) : diff === 0 ? 'Your result matched history exactly.' : `You ${diff > 0 ? 'beat' : 'fell short of'} the real result by ${Math.abs(diff)} electoral vote${Math.abs(diff) === 1 ? '' : 's'}.`}</p>
        <p class="hint">${esc(A.note)}</p></div>`;
    }
  }
  const won = W === P;
  const speech = S.modern ? `<p class="fp-caption">“${esc(won ? `To everyone in ${carried[0] || 'every state'} who knocked on doors in the rain: this one is yours. Tomorrow we go to work for all of you, including the people who voted against us.` : 'We came up short. I called ' + Wc.last + ' to offer my congratulations and my help, and I meant it.')}” <span class="muted" style="font-style:normal;font-family:var(--f-sans);font-size:12px">${esc(full(me()))}, ${won ? 'victory' : 'concession'} speech</span></p>` : '';
  const diary = G.log.map(l => { const g = gradeOf(l.score); return `<div class="drow"><span class="dd">${MONTHS[dt(l.date).getUTCMonth()]} ${dt(l.date).getUTCDate()}</span><span><b>${esc(l.hl)}</b><span class="c">${esc(l.choice)}${l.snap ? ` · snap poll ${l.snap.you}–${l.snap.them}` : ''}</span></span><span style="display:grid;gap:4px;justify-items:end"><span class="grade ${g}">${{ strong: 'Strong', good: 'Good', even: 'Even', hurt: 'Hurt' }[g]}</span>${l.isHist && l.same ? '<span class="grade hist">As in history</span>' : ''}</span></div>`; }).join('');
  const score = order.map(q => `<div><b class="c-${q}">${R.ev[q]}</b><span>${esc(candOf(q).last)} electoral votes</span></div>`).join('') + order.map(q => `<div><b>${f1(R.pv[q])}%</b><span>${esc(candOf(q).last)} popular vote</span></div>`).join('');
  const others2 = S.parties.filter(q => q !== P);
  $('#scr-final').innerHTML = `<div class="wrap"><article class="front">
      <div class="fp-mast"><div class="nm">The Morning Ledger</div></div>
      <div class="fp-meta"><span>${fmtFull(S.election, 1)}</span><span>Election extra</span><span>Late edition</span></div>
      <h1 class="fp-hl">${esc(head)}</h1>
      <p class="fp-deck">${esc(deck + split + rcNote)}</p>
      <div class="fp-score${order.length === 3 ? ' three' : ''}">${score}</div>
      <div class="fp-grid">
        <div class="fp-col"><h3>The map · ${kind}</h3>${mapSVG('map-final', false)}
          <p class="fp-caption">${R.house ? `Nobody reached ${THRESH} electoral votes${R.ev.T ? `, and ${esc(candOf('T').last)}'s ${R.ev.T} held the balance` : ''}. ` : `The tipping point was ${esc(tip.name)}, decided by ${f1(leadOf(G.fsh[tip.id]).m)} points. `}${R.pv[popW] - R.pv[popSecond] < 0.05 ? 'The popular vote was tied.' : `${esc(candOf(popW).last)} won the popular vote by ${f1(R.pv[popW] - R.pv[popSecond])} points.`}${thirdLine}${others}</p>
          ${speech}
          <h3>Closest states</h3>
          <div style="overflow-x:auto"><table class="tbl"><thead><tr><th>State</th><th class="n ev">EV</th><th class="n">Final poll</th><th class="n">Result</th></tr></thead><tbody>${close.map(u => `<tr><td>${esc(unitName(u))}<span class="evm muted"> ${u.ev}</span>${(G.night.recount || {})[u.id] ? ' <span class="muted">(recount)</span>' : ''}</td><td class="n ev">${u.ev}</td><td class="n">${leadTxtSh(G.psh[u.id])}</td><td class="n">${leadTxtSh(G.fsh[u.id], true)}</td></tr>`).join('')}</tbody></table></div></div>
        <div class="fp-col">${goalsBox}${compare}${G.full ? numbersHTML() : ''}<h3>How the campaign went</h3><div class="diary">${diary}</div></div>
      </div></article>
      <div class="fp-actions"><button class="btn btn-ink btn-lg" data-a="again">Run this race again</button>${S.modern ? '' : others2.map(q => `<button class="btn btn-lg" data-a="otherSide" data-v="${q}">Play as ${esc(candOf(q).last)}</button>`).join('')}<button class="btn btn-lg" data-a="copy">Copy my result</button><button class="btn btn-lg" data-a="home">Choose another race</button></div></div>`;
  paintBy($('#map-final'), id => shadeSh(G.fsh[id], 1));
  if (R.success && !G.result.confetti) { G.result.confetti = true; save(); setTimeout(confetti, 300); }
}
function shareText() {
  const R = G.result, P = G.party;
  if (isT()) { const n = R.goals.filter(Boolean).length; return `I ran as ${full(me())} in the ${S.year} presidential election in Front Runner and won ${f1(R.pv.T)}% of the vote and ${R.ev.T} electoral vote${R.ev.T === 1 ? '' : 's'} (${n} of ${R.goals.length} goals met). In real life he won ${f1(S.third.actual.pv)}%. ${candOf(R.winner).last} won the presidency.`; }
  const won = R.winner === P;
  return `${won ? 'I won' : 'I lost'} the ${S.year} presidential election in Front Runner as ${full(me())} (${P})${R.house ? `, in the House of Representatives after nobody reached ${THRESH}. The electoral vote was ${R.ev[P]} to ${R.ev[G.opp]}` : `, ${R.ev[P]} to ${R.ev[G.opp]} electoral votes`}${S.third && R.ev.T ? `, with ${R.ev.T} for ${candOf('T').last}` : ''}.${!S.modern ? ` In real life it was ${S.h.actual[P]} for ${me().last}.` : ''}`;
}
// ---------- routing & actions ----------
function nightWon() { const N = G.night; return isT() ? evalOutcome(finalOutcome()) === 1 : !!(N.winner && N.winner.p === G.party); }
function planOK(id) { return !!(G && G.full && G.phase === 'r' && U[id] && U[id].ev); }
function planned(removed) { SFX.play(removed ? 'tick' : 'mark'); renderAct(); save(); }
function route() {
  stopNight();
  if (!G) { renderTitle(); show('title'); renderModal(); return; }
  setScen(G.scen, G.party);
  if (G.screen === 'night') { renderNightShell(); show('night'); if (G.night.celebrated) Music.play(nightWon() ? 'victory' : 'defeat'); renderNight(true); if (!G.night.done) { UI.lastT = 0; UI.raf = requestAnimationFrame(nightLoop); } }
  else if (G.screen === 'final') { renderFinal(); show('final'); }
  else { if (UI.builtFor !== G) { $('#mapcard').innerHTML = ''; UI.builtFor = G; UI.swingTurn = G.phase === 'r' ? G.turn : null; } renderGame(); }
  renderModal();
}
function markThen(el, fn, ms) { if (el) el.classList.add('marked'); SFX.play('mark'); setTimeout(fn, calm() ? 60 : ms); }
const A = {
  chooseScen(v, el) {
    if (UI.busy) return; UI.busy = true;
    markThen(el, () => {
      UI.busy = false; G = null; setScen(v);
      if (v === '2028') { UI.setup = { scen: '2028', party: null, cand: null, vp: null, opp: 'random', diff: 'normal', depth: SET.depth === 'full' ? 'full' : 'quick' }; renderSetup(); show('setup'); }
      else { UI.setup = { scen: v, party: null, hmode: 'real', depth: SET.depth === 'full' ? 'full' : 'quick' }; renderHSetup(); show('hsetup'); }
      UI.mapMode = 'lead';
    }, 340);
  },
  cont() { G = load(); UI.pick = null; route(); },
  home() { stopNight(); if (G) save(); G = null; UI.modal = null; route(); },
  help() { UI.modal = 'help'; renderModal(); },
  settings() { UI.modal = 'settings'; renderModal(); },
  close() { UI.modal = null; renderModal(); },
  menu() { UI.modal = 'menu'; renderModal(); },
  quit() { UI.modal = null; A.home(); },
  restart() { UI.modal = 'restart'; renderModal(); },
  doRestart() { UI.modal = null; wipe(); G = null; renderModal(); route(); },
  set(v, el) {
    const k = el.dataset.k; SET[k] = v === 'true' ? true : v === 'false' ? false : (k === 'pace' ? +v : v);
    if (k === 'pace') UI.speed = SET.pace;
    saveSettings(); applySettings(); renderModal(); syncMusicButtons();
    if (k === 'music' && SET.music) Music.play(Music.want);
    if (k === 'motion' && UI.screen === 'title') { if (calm()) stopTitleCycle(); else startTitleCycle(); }
    if (k === 'sfx' && SET.sfx) SFX.play('tick');
    if (G && G.screen === 'night') renderNight(true);
  },
  toggleMusic() { SET.music = !SET.music; saveSettings(); applySettings(); if (SET.music) Music.play(Music.want); syncMusicButtons(); },
  sParty(v) { SFX.play('mark'); if (UI.setup.party !== v) UI.setup = Object.assign(UI.setup, { party: v, cand: null, vp: null, opp: 'random' }); renderSetup(); },
  sCand(v) { SFX.play('mark'); UI.setup.cand = v; renderSetup(); },
  sVp(v) { SFX.play('mark'); UI.setup.vp = v; renderSetup(); },
  sOpp(v) { SFX.play('mark'); UI.setup.opp = v; renderSetup(); },
  sDiff(v) { SFX.play('mark'); UI.setup.diff = v; renderSetup(); },
  hSide(v) { if (!['D', 'R', 'T'].includes(v) || (v === 'T' && !HISTORY[UI.setup.scen].third)) return; SFX.play('mark'); UI.setup.party = v; renderHSetup(); },
  mapMode(v) { UI.mapMode = v === 'share' ? 'share' : 'lead'; SFX.play('tick'); renderMap(); },
  hMode(v) { SFX.play('mark'); UI.setup.hmode = v; renderHSetup(); },
  sDepth(v) { if (v !== 'quick' && v !== 'full') return; SFX.play('mark'); UI.setup.depth = v; SET.depth = v; saveSettings(); if (UI.setup.scen === '2028') renderSetup(); else renderHSetup(); },
  start() { const P = UI.setup; if (!P || !P.party || (P.scen === '2028' && (!P.cand || !P.vp))) return; newGame(P); UI.pick = null; route(); if (S.vehicle === 'train') SFX.play('whistle'); },
  ans(v, el) {
    if (UI.busy || G.phase !== 'q') return; UI.busy = true;
    if (!el) el = $(`.choice[data-v="${v}"]`);
    markThen(el, () => {
      UI.busy = false; if (!G || G.phase !== 'q') return;
      answer(+v); UI.pick = null; renderGame();
      SFX.play('paper');
      if (G.res && G.res.snap) setTimeout(() => SFX.play('applause'), 400);
      const a = $('#act'); if (a && window.innerWidth <= 1080) a.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'start' });
    }, 380);
  },
  visit(v) {
    if (!G || G.phase !== 'r' || !U[v] || UI.busy) return;
    const homeOf = c => U[c.home] ? c.home : null;
    const prevMe = G.last ? G.last.me : homeOf(me());
    const prevOp = G.last ? G.last.op : homeOf(isT() ? candOf('D') : foe()), prevOp2 = isT() ? (G.last ? G.last.op2 : homeOf(candOf('R'))) : null;
    visit(v); UI.pick = null; renderGame();
    const t = G.last; if (!t) return;
    const svg = $('#map-game'); const pins = svg && $('.pins', svg);
    SFX.play(S.vehicle === 'train' ? 'whistle' : S.vehicle === 'bus' ? 'horn' : 'whoosh');
    if (svg && !calm()) {
      if (pins) pins.style.opacity = '0';
      animateTravel(svg, prevOp, t.op, false);
      if (t.op2) animateTravel(svg, prevOp2, t.op2, false);
      animateTravel(svg, prevMe, t.me, true, () => {
        if (pins) pins.style.opacity = '1';
        flashState(svg, t.me); floatText(svg, t.me, '+' + f1(t.mePow), 'up');
        SFX.play('cheer', clamp(t.trail.n / 20000, .25, 1));
      });
    } else SFX.play('cheer', .5);
  },
  key(v) { if (G.phase === 'r') { UI.pick = v; renderAct(); } markSel($('#map-game'), v); },
  plUnpick() { UI.pick = null; renderAct(); markSel($('#map-game'), null); },
  plRally(v) { if (!planOK(v) || G.plan.cand.length >= FULL_SLOTS.cand) return; G.plan.cand.push({ t: 'rally', u: v }); planned(); },
  plVp(v) { if (!planOK(v) || G.plan.vp.length >= FULL_SLOTS.vp) return; G.plan.vp.push({ t: 'rally', u: v }); planned(); },
  plFund(v) { if (!planOK(v) || G.plan.cand.length >= FULL_SLOTS.cand || !DONOR_STATES.includes(U[v].state)) return; G.plan.cand.push({ t: 'fund', u: v }); planned(); },
  plPrep() { if (!G || !G.full || G.phase !== 'r' || !debateNextTurn() || G.plan.cand.length >= FULL_SLOTS.cand) return; G.plan.cand.push({ t: 'prep' }); planned(); },
  plAd(v) { const [id, s] = String(v).split('|'); const amt = +s; if (!planOK(id) || !(amt > 0) || planCost(G.plan) + amt > G.cash[G.party] + 1e-6) return; G.plan.ads[id] = (G.plan.ads[id] || 0) + amt; planned(); },
  plOff(v) { if (!planOK(v) || officesIn(G.party, v) >= 2 || planCost(G.plan) + officeCost(U[v]) > G.cash[G.party] + 1e-6) return; G.plan.off.push(v); planned(); },
  plDel(v) { if (!G || !G.full || G.phase !== 'r') return; const [who, i] = String(v).split('|'); if ((who === 'cand' || who === 'vp') && G.plan[who][+i]) { G.plan[who].splice(+i, 1); planned(true); } },
  plAdDel(v) { if (!G || !G.full || G.phase !== 'r') return; delete G.plan.ads[v]; planned(true); },
  plOffDel(v) { if (!G || !G.full || G.phase !== 'r') return; G.plan.off.splice(+v, 1); planned(true); },
  plAuto() { if (!G || !G.full || G.phase !== 'r') return; autoPlan(); SFX.play('paper'); renderAct(); save(); },
  plClear() { if (!G || !G.full || G.phase !== 'r') return; G.plan = emptyPlan(); planned(true); },
  endWeek() {
    if (!G || !G.full || G.phase !== 'r' || UI.busy) return;
    const homeOf = c => U[c.home] ? c.home : null;
    const prevMe = G.last ? G.last.me : homeOf(me());
    const prevOp = G.last ? G.last.op : homeOf(isT() ? candOf('D') : foe()), prevOp2 = isT() ? (G.last ? G.last.op2 : homeOf(candOf('R'))) : null;
    if (!endWeekFull()) return;
    UI.pick = null; renderGame();
    const t = G.last; const svg = $('#map-game'); const pins = svg && $('.pins', svg);
    SFX.play(S.vehicle === 'train' ? 'whistle' : S.vehicle === 'bus' ? 'horn' : 'whoosh');
    if (svg && !calm() && t) {
      if (pins) pins.style.opacity = '0';
      animateTravel(svg, prevOp, t.op, false);
      if (t.op2) animateTravel(svg, prevOp2, t.op2, false);
      animateTravel(svg, prevMe, t.me, true, () => { if (pins) pins.style.opacity = '1'; flashState(svg, t.me); SFX.play('cheer', .6); });
    } else SFX.play('cheer', .5);
  },
  debPick(v, el) {
    if (UI.busy || !G || !G.full || G.phase !== 'q' || !STRATS_F[v]) return; UI.busy = true;
    markThen(el || $(`.choice[data-v="${v}"]`), () => { UI.busy = false; debRoundF(v); SFX.play('tick'); renderAct(); }, 300);
  },
  debNext() {
    if (!G || !G.full || G.phase !== 'q' || !G.deb || G.deb.stage !== 'result') return;
    if (G.deb.round < G.deb.qs.length) { G.deb.stage = 'choose'; save(); renderAct(); return; }
    answer(-1); UI.pick = null; renderGame(); SFX.play('paper'); setTimeout(() => SFX.play('applause'), 400);
    const a = $('#act'); if (a && window.innerWidth <= 1080) a.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'start' });
  },
  night() { startNight(); UI.speed = SET.pace; UI.l3 = []; route(); },
  speed(v) { UI.speed = +v; renderNight(true); },
  skip() { let g = 0; while (!G.night.done && g++ < 4000) nightStep(0.05); UI.l3 = []; $('#l3').dataset.s = 'i'; $('#l3').innerHTML = '<div class="l3idle">Every state has been called</div>'; save(); renderNight(true); },
  results() { stopNight(); computeResult(); G.screen = 'final'; save(); route(); },
  again() { const cfg = { scen: G.scen, party: G.party, cand: G.tk[G.party].c, vp: G.tk[G.party].v, opp: G.tk[G.opp].c, diff: G.diff, hmode: G.hmode, depth: G.full ? 'full' : 'quick' }; wipe(); newGame(cfg); UI.pick = null; route(); },
  otherSide(v) { const party = S.parties.includes(v) ? v : G.opp; const cfg = { scen: G.scen, party, hmode: G.hmode, depth: G.full ? 'full' : 'quick' }; wipe(); newGame(cfg); UI.pick = null; UI.mapMode = 'lead'; route(); },
  copy() {
    const txt = shareText();
    try { navigator.clipboard.writeText(txt).then(() => toast('Copied. Paste it anywhere.'), () => toast(txt)); } catch (e) { toast(txt); }
  }
};
function syncMusicButtons() { $$('[data-a="toggleMusic"]').forEach(b => { b.textContent = SET.music ? 'Music on' : 'Music off'; b.setAttribute('aria-pressed', String(SET.music)); }); }
const unlockAll = () => { SFX.init(); try { if (SFX.ac && SFX.ac.state === 'suspended') SFX.ac.resume(); } catch (e) { } Music.unlock(); };
['pointerdown', 'touchend', 'click', 'keydown'].forEach(t => document.addEventListener(t, unlockAll, true));
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]');
  if (!el) { if (e.target.id === 'modal') A.close(); return; }
  if (el.disabled) return;
  const f = A[el.dataset.a]; if (!f) return;
  e.preventDefault(); f(el.dataset.v, el);
});
document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === 'Escape' && UI.modal) { A.close(); return; }
  if (UI.modal || !G || G.screen !== 'game' || UI.screen !== 'game') return;
  if (e.target && /input|select|textarea/i.test(e.target.tagName)) return;
  const onBtn = e.target && e.target.closest && e.target.closest('button');
  const n = parseInt(e.key, 10);
  if (G.phase === 'q' && G.full && turnDef().kind === 'debate') {
    const D = G.deb;
    if ((!D || D.stage === 'choose') && n >= 1 && n <= 4) { e.preventDefault(); A.debPick(Object.keys(STRATS_F)[n - 1]); }
    else if (D && D.stage === 'result' && e.key === 'Enter' && !onBtn) { e.preventDefault(); A.debNext(); }
  }
  else if (G.phase === 'q' && n >= 1) { const d = turnDef(); if (n <= d.options.length) { e.preventDefault(); A.ans(n - 1); } }
  else if (G.phase === 'r' && G.full) {
    if (n >= 1 && n <= 4) { e.preventDefault(); A.key(suggestions()[n - 1]); }
    else if (e.key === 'Enter' && !onBtn) { e.preventDefault(); A.endWeek(); }
  }
  else if (G.phase === 'r') {
    if (n >= 1 && n <= 4) { e.preventDefault(); A.visit(suggestions()[n - 1]); }
    else if (e.key === 'Enter' && UI.pick && !onBtn) { e.preventDefault(); A.visit(UI.pick); }
  } else if (G.phase === 'end' && e.key === 'Enter' && !onBtn) { e.preventDefault(); A.night(); }
});
function boot(data) {
  applySettings();
  try { if (data && data.G && data.G.v === SAVE_V) { G = data.G; route(); return; } } catch (e) { }
  renderTitle(); show('title');
}
boot({});
setTimeout(() => { try { Music.tryStart(); } catch (e) { } }, 250);
