// ===================== FULL CAMPAIGN =====================
// The optional deeper game, carried over from Battleground: a weekly schedule (three candidate stops and two
// running-mate stops), money, TV ads, field offices, fundraisers, debate prep, early voting and round-by-round
// debates. None of this runs in the quick game. Only data and function declarations live at the top level here,
// because this file is loaded before game.js.
const FULL_SLOTS = { cand: 3, vp: 2 };
const DIM_F = [1, .6, .35, .2];
const DONOR_STATES = ['CA', 'NY', 'TX', 'FL', 'IL', 'MA', 'NJ', 'CT', 'WA', 'DC'];
// Campaign money is tracked in 2028 dollars and shown in the dollars of the year being played.
const MONEY_SCALE = { 2028: 1, 2000: .55, 1992: .4, 1980: .3, 1976: .22, 1968: .15, 1960: .1, 1948: .06 };
const FUND_OF = { perot: 1.8, nader: .35, anderson: .5, wallace: .7, thurmond: .45 };
// Share of each state's vote cast early, by turn. Before the 1990s almost everyone voted on Election Day.
const BANK_OF = { 2028: [0, 0, 0, 0, .03, .07, .09, .10, .11, .11], 2000: [0, 0, 0, 0, 0, 0, .02, .03, .04, .05], 1992: [0, 0, 0, 0, 0, 0, 0, .02, .02, .03] };
const AI_SD_F = { easy: 3.0, normal: 1.6, hard: 0.9, hist: 1.6 };
const AI_MULT_F = { easy: .85, normal: 1, hard: 1.08, hist: 1 };
const STRATS_F = {
  policy: { label: 'Lay out your plan', short: 'plan', desc: 'Specifics and numbers. Steady and credible.', sd: 1.25 },
  attack: { label: 'Go on offense', short: 'attack', desc: 'Hit their record. High risk, high reward.', sd: 2.3 },
  story: { label: 'Tell a personal story', short: 'story', desc: 'Connect with viewers at home.', sd: 1.7 },
  pivot: { label: 'Pivot to your message', short: 'pivot', desc: 'Stay on your theme. Safe but limited.', sd: 0.9 }
};
const BEATS_F = { attack: 'pivot', story: 'attack', policy: 'story' };
const STRAT_LINE_F = {
  policy: ['walked through a detailed plan on {T}', 'rattled off specifics on {T}', 'laid out a five-point agenda on {T}'],
  attack: ['went straight at {O}\'s record on {T}', 'accused {O} of saying one thing and doing another on {T}', 'turned to the camera and went after {O} on {T}'],
  story: ['told the story of a family they met on the trail', 'talked about their own parents\' struggles', 'shared a personal story about a hard year at home'],
  pivot: ['steered the answer back to the campaign\'s central message', 'sidestepped the question and went back to the stump speech', 'pivoted to the theme of the campaign']
};
const FIT_FROM = { plan: 'policy', story: 'story', attack: 'attack' };
const TOPICS_MODERN = {
  economy: { name: 'the economy', q: 'Families say they cannot keep up with the cost of living. What will you do in your first year to change that?', fit: { policy: .9, attack: .6, story: .6, pivot: .7 } },
  immigration: { name: 'immigration', q: 'How would you secure the border while dealing with the millions of people already here?', fit: { policy: .7, attack: .8, story: .5, pivot: .6 } },
  healthcare: { name: 'health care', q: 'Premiums and drug prices keep rising. What is your plan?', fit: { policy: .8, attack: .5, story: .9, pivot: .5 } },
  foreign: { name: 'foreign policy', q: 'A major ally is under military threat. What should America\'s role be?', fit: { policy: .9, attack: .6, story: .4, pivot: .5 } },
  character: { name: 'character', q: 'Your opponent says you lack the judgment to be commander in chief. Your response?', fit: { policy: .3, attack: .7, story: .9, pivot: .6 } },
  energy: { name: 'energy', q: 'How do you bring down energy prices while preparing for the future?', fit: { policy: .8, attack: .6, story: .4, pivot: .7 } },
  crime: { name: 'public safety', q: 'Many voters say they do not feel safe in their own cities. What would you do?', fit: { policy: .6, attack: .8, story: .7, pivot: .5 } },
  ai: { name: 'jobs and AI', q: 'Automation is reshaping work. What do you owe the workers it displaces?', fit: { policy: .85, attack: .5, story: .7, pivot: .6 } }
};
const TOPICS_PAST = {
  economy: { name: 'the economy', q: 'Prices and jobs are on every voter\'s mind. What would you do about the economy?', fit: { policy: .9, attack: .6, story: .6, pivot: .7 } },
  foreign: { name: 'foreign policy', q: 'What should America\'s role in the world be over the next four years?', fit: { policy: .9, attack: .6, story: .4, pivot: .5 } },
  spending: { name: 'taxes and spending', q: 'How would you handle taxes and the federal budget?', fit: { policy: .85, attack: .7, story: .4, pivot: .6 } },
  character: { name: 'leadership', q: 'Your opponent questions your judgment. Why should voters trust you?', fit: { policy: .3, attack: .7, story: .9, pivot: .6 } },
  farm: { name: 'working families', q: 'A farmer and a factory worker in this audience both say they are falling behind. What would you do for them?', fit: { policy: .7, attack: .5, story: .9, pivot: .6 } }
};

let GF = 0.5; // share of field-office strength that shows in the polls; all of it counts on Election Day

// ---------- basics ----------
function fullOn() { return !!(G && G.full); }
const emptyPlan = () => ({ cand: [], vp: [], ads: {}, off: [] });
function actors() { return isT() ? ['T', 'D', 'R'] : [G.party, G.opp]; }
function fundOf(p) { const c = candOf(p); let f = FUND_OF[c.id] || 1; if (!S.modern && S.h.incumbent === p) f *= 1.1; return f; }
function moneyTxt(x) {
  const v = Math.max(0, x) * (MONEY_SCALE[S.year] || 1);
  if (v < 0.005) return '$0';
  return '$' + (v >= 10 ? String(Math.round(v)) : v >= 1 ? f1(v) : (Math.round(v * 100) / 100).toFixed(2)) + 'M';
}
function vNorm() { if (!S.vN) { let t = 0; STATEWIDE.forEach(u => { t += u.votes; }); S.vN = 155 / t; } return S.vN; }
const nv = u => u.votes * vNorm();
function effEV(u) { return u.ev + u.kids.reduce((a, k) => a + U[k].ev, 0) * 0.5; }
function rallyPowF(u, n, who) { return 0.6 / (1 + nv(u) / 5) * DIM_F[Math.min(n, 3)] * (who.home === u.state ? 1.2 : 1) * (who.perk === 'visits' ? 1.25 : 1); }
function adPowF(u, amt) { return amt > 0 ? 0.85 * Math.log(1 + amt / (1.3 * nv(u))) : 0; }
function officeCost(u) { return Math.round((1.2 + 0.35 * nv(U[u.state])) * 10) / 10; }
function officeStrength(t) { const n = S.turns.length - 1; return 0.4 + 0.6 * Math.max(0, n - t) / n; }
function groundPow(arr) { if (!arr || !arr.length) return 0; let s = 0; for (const x of arr) s += x; return 1.6 * (1 - Math.exp(-0.5 * s)); }
function gp(p, u) { return G.full && G.off[p] ? groundPow(G.off[p][u.state]) : 0; }
function fundAmt(p, u) { return (6 + (DONOR_STATES.includes(u.state) ? 3 : 0)) * fundOf(p); }
function weeklyIncome(p) { return 22 * fundOf(p); }
function campOf(map, u) { return (map[u.id] || 0) + (u.parent ? (map[u.parent] || 0) : 0); }
function planCost(pl) { let c = 0; for (const a of Object.values(pl.ads)) c += a; for (const id of pl.off) c += officeCost(U[id]); return Math.round(c * 10) / 10; }
function debateNextTurn() { const T = S.turns[G.turn + 1]; return !!T && T.kind === 'debate'; }
function officesIn(p, id) { const st = U[id].state; return (G.off[p][st] || []).length + G.plan.off.filter(x => U[x].state === st).length; }

// ---------- what the full campaign adds to the vote model ----------
// Extra D-minus-R margin from schedules, ads and field offices.
function fullDR(u) {
  if (!G.full) return 0;
  let m = GF * (gp('D', u) - gp('R', u));
  m += isT() ? campOf(G.campDR, u) : SG[G.party] * campOf(G.camp, u);
  return m;
}
// Extra share for a third-party player's own campaign.
function fullT(u) { return G.full && isT() ? campOf(G.camp, u) + GF * gp('T', u) : 0; }

function initFull() {
  G.full = true; G.camp = {}; G.campDR = {}; G.bank = {}; G.plan = emptyPlan(); G.deb = null; G.lastPlans = null;
  G.cash = {}; G.raised = {}; G.spentAds = {}; G.prep = {}; G.off = {}; G.stats = {};
  for (const p of actors()) {
    G.cash[p] = Math.round(120 * fundOf(p)); G.raised[p] = G.cash[p]; G.spentAds[p] = 0; G.prep[p] = 0; G.off[p] = {};
    G.stats[p] = { rallies: 0, vp: 0, ads: 0, off: 0, fund: 0 };
  }
}

// ---------- applying a week's plan ----------
function applyPlanF(p, pl, mult) {
  const c = candOf(p), v = mateOf(p), kc = {}, kv = {}; let first = null, tot = 0;
  const visitKey = p === G.party ? 'me' : isT() ? p : 'op';
  const add = (id, x) => {
    if (isT()) { if (p === 'T') G.camp[id] = (G.camp[id] || 0) + x; else G.campDR[id] = (G.campDR[id] || 0) + SG[p] * x; }
    else G.camp[id] = (G.camp[id] || 0) + (p === G.party ? x : -x);
  };
  for (const sl of pl.cand) {
    if (sl.t === 'rally' && U[sl.u]) {
      const u = U[sl.u], n = kc[u.id] || 0; kc[u.id] = n + 1;
      const x = rallyPowF(u, n, c) * mult; add(u.id, x); tot += x; if (!first) first = u.id;
      G.visits[visitKey][u.id] = (G.visits[visitKey][u.id] || 0) + 1; G.stats[p].rallies++;
    } else if (sl.t === 'fund' && U[sl.u]) { const amt = fundAmt(p, U[sl.u]); G.cash[p] += amt; G.raised[p] += amt; G.stats[p].fund++; }
    else if (sl.t === 'prep') G.prep[p] = Math.min(3, (G.prep[p] || 0) + 1);
  }
  for (const sl of pl.vp) {
    if (sl.t !== 'rally' || !U[sl.u]) continue;
    const u = U[sl.u], n = kv[u.id] || 0; kv[u.id] = n + 1;
    const x = rallyPowF(u, n, v) * 0.55 * mult; add(u.id, x); tot += x; if (!first) first = u.id; G.stats[p].vp++;
  }
  for (const [id, amt] of Object.entries(pl.ads)) {
    if (!(amt > 0) || !U[id]) continue;
    add(id, adPowF(U[id], amt) * mult); G.cash[p] -= amt; G.spentAds[p] += amt; G.stats[p].ads += amt;
  }
  for (const id of pl.off) {
    const u = U[id]; G.cash[p] -= officeCost(u);
    (G.off[p][u.state] = G.off[p][u.state] || []).push(officeStrength(G.turn)); G.stats[p].off++;
  }
  G.cash[p] = Math.max(0, Math.round(G.cash[p] * 10) / 10);
  return { first, tot };
}

// ---------- computer-run campaigns ----------
// How a campaign sees each state: its own margin (or, for a third party, its own lead) plus some guesswork.
function aiViewF(p) {
  const sd = AI_SD_F[G.diff] || 1.6, v = {};
  UNITS.forEach(u => { const sh = sharesTrue(u); v[u.id] = (isT() && p !== 'T' ? SG[p] * (sh.D - sh.R) : marginOf(sh, p)) + gauss() * sd; });
  return v;
}
function aiWeights(view) { const w = {}; UNITS.forEach(u => { w[u.id] = u.ev ? effEV(u) / 10 * Math.exp(-Math.pow(view[u.id] / 5, 2)) + 0.0005 : 0; }); return w; }
function stateWF(w, u) { let t = w[u.id] || 0; for (const k of u.kids) t += w[k] || 0; return t; }
function makePlanF(p, w) {
  const c = candOf(p), v = mateOf(p), pl = emptyPlan(); let cash = G.cash[p], nC = FULL_SLOTS.cand, nV = FULL_SLOTS.vp;
  if (debateNextTurn() && (G.prep[p] || 0) < 2 && Math.random() < 0.85) { pl.cand.push({ t: 'prep' }); nC--; }
  if (cash < 30 * fundOf(p)) {
    const d = DONOR_STATES.filter(id => U[id] && U[id].ev).sort((a, b) => (w[b] || 0) - (w[a] || 0))[0];
    if (d) { pl.cand.push({ t: 'fund', u: d }); nC--; }
  }
  const kc = {}, kv = {};
  const best = (who, k) => { let b = null, bv = -1; for (const u of UNITS) { if (!u.ev) continue; const val = w[u.id] * rallyPowF(u, k[u.id] || 0, who); if (val > bv) { bv = val; b = u; } } return b; };
  for (let i = 0; i < nC; i++) { const u = best(c, kc); if (!u) break; pl.cand.push({ t: 'rally', u: u.id }); kc[u.id] = (kc[u.id] || 0) + 1; }
  for (let i = 0; i < nV; i++) { const u = best(v, kv); if (!u) break; pl.vp.push({ t: 'rally', u: u.id }); kv[u.id] = (kv[u.id] || 0) + 1; }
  if (G.turn <= 5 && cash > 35 * Math.min(1, fundOf(p))) {
    let budget = cash * 0.16, n = 0;
    for (const u of STATEWIDE.filter(x => x.ev).sort((a, b) => stateWF(w, b) - stateWF(w, a)).slice(0, 10)) {
      if (n >= 3) break;
      const cost = officeCost(u);
      if ((G.off[p][u.id] || []).length < 2 && cost <= budget && stateWF(w, u) > 0.01) { pl.off.push(u.id); budget -= cost; cash -= cost; n++; }
    }
  }
  const left = S.turns.length - G.turn;
  let budget = Math.floor(Math.min(cash, left <= 1 ? cash : cash * clamp(1.5 / left, 0.12, 0.6)));
  const alloc = {};
  for (let i = 0; i < budget; i++) {
    let b = null, bv = 0;
    for (const u of UNITS) { if (!u.ev) continue; const a = alloc[u.id] || 0; if (a >= 40) continue; const val = w[u.id] * (adPowF(u, a + 1) - adPowF(u, a)); if (val > bv) { bv = val; b = u; } }
    if (!b) break; alloc[b.id] = (alloc[b.id] || 0) + 1;
  }
  pl.ads = alloc;
  return pl;
}
// The player's own manager plans from the polls the player sees.
function autoPlan() {
  const w = isT() ? tVisitWeights() : aiWeights(G.polls);
  G.plan = makePlanF(G.party, w);
}

// ---------- ending a week ----------
function bankTurn() {
  const b = (BANK_OF[S.year] || [])[G.turn] || 0; if (!b) return;
  GF = 1;
  try {
    UNITS.forEach(u => { const sh = sharesTrue(u); const k = G.bank[u.id] || (G.bank[u.id] = { s: 0, D: 0, R: 0, T: 0 }); k.s += b; k.D += b * sh.D; k.R += b * sh.R; k.T += b * sh.T; });
  } finally { GF = 0.5; }
}
function endWeekFull() {
  if (!G.full || G.phase !== 'r') return false;
  const P = G.party; if (planCost(G.plan) > G.cash[P] + 1e-6) return false;
  for (const k in G.camp) G.camp[k] *= 0.72;
  for (const k in G.campDR) G.campDR[k] *= 0.72;
  const ai = isT() ? ['D', 'R'] : [G.opp];
  const plans = {}; plans[P] = G.plan;
  ai.forEach(q => { plans[q] = makePlanF(q, aiWeights(aiViewF(q))); });
  const mine = applyPlanF(P, plans[P], 1);
  const out = {}; ai.forEach(q => { out[q] = applyPlanF(q, plans[q], AI_MULT_F[G.diff] || 1); });
  for (const p of actors()) { const inc = weeklyIncome(p) * (0.9 + 0.2 * Math.random()); G.cash[p] = Math.round((G.cash[p] + inc) * 10) / 10; G.raised[p] += inc; }
  const homeOf = c => U[c.home] ? c.home : null, prev = G.last || {};
  const stop = (q, k) => out[q].first || prev[k] || homeOf(candOf(q)) || STATEWIDE[0].id;
  G.last = { me: mine.first || prev.me || homeOf(me()) || STATEWIDE[0].id, mePow: mine.tot, op: stop(ai[0], 'op'), opPow: out[ai[0]].tot,
    op2: isT() ? stop('R', 'op2') : undefined, op2Pow: isT() ? out.R.tot : undefined, opQ: G.res ? G.res.opQ : null, trail: null, full: true };
  G.lastPlans = plans; G.plan = emptyPlan();
  bankTurn();
  turnTail();
  return true;
}

// ---------- round-by-round debates ----------
function debateQs(d) {
  const fit = { policy: .6, attack: .6, story: .6, pivot: .6 }; fit[FIT_FROM[d.fit] || 'policy'] = .9;
  const T = S.modern ? TOPICS_MODERN : TOPICS_PAST;
  const first = { name: S.modern ? d.title.toLowerCase() : 'the opening question', q: d.body, fit };
  return [first].concat(shuffle(Object.keys(T)).slice(0, 2).map(k => T[k]));
}
function ensureDebate(d) {
  if (G.deb && G.deb.turn === G.turn) return G.deb;
  G.deb = { turn: G.turn, round: 0, qs: debateQs(d), results: [], tot: {}, stage: 'choose' };
  return G.deb;
}
function aiStratF(q) { let b = 'pivot', bv = -Infinity; for (const k of Object.keys(STRATS_F)) { const v = q.fit[k] + gauss() * 0.15; if (v > bv) { bv = v; b = k; } } return b; }
function debRoundF(strat) {
  const d = turnDef(); if (!STRATS_F[strat] || d.kind !== 'debate') return;
  const D = ensureDebate(d); if (D.stage !== 'choose') return;
  const q = D.qs[D.round], P = G.party, rivals = debRivals(d);
  const skill = c => c.perk === 'debate' ? 8 : 5;
  const score = (c, st, prep, beat) => q.fit[st] * 6 * (0.6 + 0.05 * skill(c)) + Math.min(prep || 0, 3) * 0.35 + gauss() * STRATS_F[st].sd + beat * 0.8;
  const rs = {}; rivals.forEach(r => { rs[r] = aiStratF(q); });
  const mineBeat = rivals.filter(r => BEATS_F[strat] === rs[r]).length / rivals.length;
  const sc = { [P]: score(me(), strat, G.prep[P], mineBeat) };
  rivals.forEach(r => { sc[r] = score(candOf(r), rs[r], G.prep[r], BEATS_F[rs[r]] === strat ? 1 : 0); });
  const pickLine = (st, other) => STRAT_LINE_F[st][Math.floor(Math.random() * 3)].replace('{T}', q.name).replace('{O}', other.last);
  const lines = [{ p: P, t: `${me().last} ${pickLine(strat, candOf(rivals[0]))}.` }].concat(rivals.map(r => ({ p: r, t: `${candOf(r).last} ${pickLine(rs[r], me())}.` })));
  const best = Math.max(...rivals.map(r => sc[r]));
  D.results.push({ q: q.name, ms: strat, rs, sc, lines, edge: sc[P] - best });
  for (const k in sc) D.tot[k] = (D.tot[k] || 0) + sc[k];
  D.round++; D.stage = 'result'; save();
}

// ---------- full-campaign screens ----------
const gainTxt = x => (x < 1 ? (Math.round(x * 100) / 100).toFixed(2) : f1(x));
function listJoinF(a) { if (a.length <= 1) return a.join(''); if (a.length === 2) return a[0] + ' and ' + a[1]; return a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }
function adWord() { return S.year < 1952 ? 'radio ads' : 'TV ads'; }
const AD_STEP = 2;
function planSummary(p, pl) {
  const c = candOf(p), v = mateOf(p), parts = [];
  const uniq = a => [...new Set(a)];
  const r = uniq(pl.cand.filter(s => s.t === 'rally').map(s => s.u)), vr = uniq(pl.vp.filter(s => s.t === 'rally').map(s => s.u));
  const ads = Object.entries(pl.ads).filter(([, a]) => a > 0).sort((a, b) => b[1] - a[1]), adT = ads.reduce((a, x) => a + x[1], 0);
  if (r.length) parts.push(`held rallies in ${listJoinF(r.map(id => esc(unitName(U[id]))))}`);
  if (vr.length) parts.push(`sent ${esc(v.last)} to ${listJoinF(vr.map(id => esc(unitName(U[id]))))}`);
  if (adT) parts.push(`spent ${moneyTxt(adT)} on ${adWord()}, most of it in ${esc(unitName(U[ads[0][0]]))}`);
  if (pl.off.length) parts.push(`opened field offices in ${listJoinF(uniq(pl.off).map(id => esc(U[id].name)))}`);
  if (pl.cand.some(s => s.t === 'fund')) parts.push('held a fundraiser');
  if (pl.cand.some(s => s.t === 'prep')) parts.push('prepped for the debate');
  return parts.length ? `<b>${esc(c.last)}</b> ${listJoinF(parts)}.` : `<b>${esc(c.last)}</b> had a quiet week.`;
}
function slotLabel(s) { return s.t === 'rally' ? `Rally · ${esc(unitName(U[s.u]))}` : s.t === 'fund' ? `Fundraiser · ${esc(unitName(U[s.u]))}` : 'Debate prep'; }
function adsChips(ads) {
  const s = ads.slice().sort((a, b) => b[1] - a[1]), top = s.slice(0, 5), rest = s.slice(5);
  return top.map(([id, a]) => `<button class="slot on" data-a="plAdDel" data-v="${id}" title="Remove">${esc(unitName(U[id]))} ${moneyTxt(a)}<span class="x" aria-hidden="true">✕</span></button>`).join('')
    + (rest.length ? `<span class="slot more">${rest.length} more state${rest.length > 1 ? 's' : ''} · ${moneyTxt(rest.reduce((t, x) => t + x[1], 0))}</span>` : '');
}
function plannerHTML() {
  const P = G.party, pl = G.plan, c = me(), v = mate(), cost = planCost(pl), left = Math.round((G.cash[P] - cost) * 10) / 10;
  const unit = isT() ? ' to your share' : '';
  const slots = (arr, n, who) => { let h = ''; for (let i = 0; i < n; i++) { const s = arr[i]; h += s ? `<button class="slot on" data-a="plDel" data-v="${who}|${i}" title="Remove">${slotLabel(s)}<span class="x" aria-hidden="true">✕</span></button>` : '<span class="slot empty">Open</span>'; } return h; };
  const ads = Object.entries(pl.ads).filter(([, a]) => a > 0);
  let h = `<div class="planner"><div class="pl-head"><h3>Plan the week</h3><span class="pl-cash">Cash <b>${moneyTxt(G.cash[P])}</b> · this plan <b>${moneyTxt(cost)}</b> · left <b class="${left < 0 ? 'down' : ''}">${moneyTxt(left)}</b></span></div>
    <div class="pl-rows">
      <div class="pl-row"><span class="pl-l">${esc(c.last)}</span><span class="pl-s">${slots(pl.cand, FULL_SLOTS.cand, 'cand')}</span></div>
      <div class="pl-row"><span class="pl-l">${esc(v.last)}</span><span class="pl-s">${slots(pl.vp, FULL_SLOTS.vp, 'vp')}</span></div>
      <div class="pl-row"><span class="pl-l">${S.year < 1952 ? 'Radio' : 'Ads'}</span><span class="pl-s">${ads.length ? adsChips(ads) : '<span class="slot empty">None yet</span>'}</span></div>
      <div class="pl-row"><span class="pl-l">Offices</span><span class="pl-s">${pl.off.length ? pl.off.map((id, i) => `<button class="slot on" data-a="plOffDel" data-v="${i}" title="Remove">${esc(U[id].name)}<span class="x" aria-hidden="true">✕</span></button>`).join('') : '<span class="slot empty">None this week</span>'}</span></div>
    </div>`;
  const id = UI.pick && U[UI.pick] && U[UI.pick].ev ? UI.pick : null;
  if (id) {
    const u = U[id], st = U[u.state];
    const nC = pl.cand.filter(s => s.t === 'rally' && s.u === id).length, nV = pl.vp.filter(s => s.t === 'rally' && s.u === id).length, ad = pl.ads[id] || 0;
    const candFull = pl.cand.length >= FULL_SLOTS.cand, vpFull = pl.vp.length >= FULL_SLOTS.vp;
    const offCost = officeCost(u), have = (G.off[P][u.state] || []), nOff = officesIn(P, id);
    const offGain = groundPow(have.concat(pl.off.filter(x => U[x].state === u.state).map(() => officeStrength(G.turn)), [officeStrength(G.turn)])) - groundPow(have.concat(pl.off.filter(x => U[x].state === u.state).map(() => officeStrength(G.turn))));
    const donor = DONOR_STATES.includes(u.state);
    const lead = isT() ? `You ${f1(G.psh[id].T)}%, ${esc(tGapTxt(G.psh[id]))}` : esc(plainLeadSh(G.psh[id]));
    const btn = (a, v2, label, gain, dis) => `<button class="pl-act" data-a="${a}" data-v="${v2}" ${dis ? 'disabled' : ''}><b>${label}</b><span>${gain}</span></button>`;
    const offBal = (P === 'D' && u.noD) || (P === 'T' && u.noT);
    h += `<div class="pl-sel"><div class="pl-st">${silhouette(id)}<span><b>${esc(unitName(u))}</b><span>${u.ev} EV · ${lead}${have.length ? ` · ${have.length} office${have.length > 1 ? 's' : ''} open` : ''}</span></span><button class="pl-x" data-a="plUnpick" aria-label="Close">✕</button></div>
      ${offBal ? `<p class="hint" style="margin:0"><b>You're not on the ballot here.</b> Campaigning won't win you any votes in ${esc(u.name)}.</p>` : ''}
      <div class="pl-acts">
        ${btn('plRally', id, `Rally with ${esc(c.last)}`, `+${gainTxt(rallyPowF(u, nC, c))}${unit}`, candFull)}
        ${btn('plVp', id, `Send ${esc(v.last)}`, `+${gainTxt(rallyPowF(u, nV, v) * 0.55)}${unit}`, vpFull)}
        ${btn('plAd', id + '|' + AD_STEP, `${moneyTxt(AD_STEP)} in ${adWord()}`, `+${gainTxt(adPowF(u, ad + AD_STEP) - adPowF(u, ad))}${unit}`, left < AD_STEP)}
        ${btn('plOff', id, `Open a field office · ${moneyTxt(offCost)}`, nOff >= 2 ? 'Two is the limit' : `+${gainTxt(offGain)} on Election Day`, nOff >= 2 || left < offCost)}
        ${donor ? btn('plFund', id, 'Hold a fundraiser', `+${moneyTxt(fundAmt(P, u))} next week`, candFull) : ''}
      </div></div>`;
  } else {
    h += `<div class="pl-sel"><p class="hint">Tap a state on the map, or start with one of these:</p><div class="pl-sug">${suggestions().map(x => `<button class="slot" data-a="key" data-v="${x}">${esc(unitName(U[x]))}</button>`).join('')}</div></div>`;
  }
  const prep = debateNextTurn();
  h += `<div class="pl-foot"><span class="pl-q">${prep ? `<button class="btn" data-a="plPrep" ${pl.cand.length >= FULL_SLOTS.cand ? 'disabled' : ''}>Debate prep (${G.prep[P] || 0} so far)</button>` : ''}<button class="btn" data-a="plAuto">Let the manager plan it</button>${cost || pl.cand.length || pl.vp.length ? '<button class="btn" data-a="plClear">Clear</button>' : ''}</span>
    <button class="btn btn-ink btn-lg" data-a="endWeek" ${left < 0 ? 'disabled' : ''}>End the week <span class="kbd" style="background:transparent;color:inherit;border-color:currentColor">Enter</span></button></div></div>`;
  return h;
}
function debateFullHTML(d) {
  const D = ensureDebate(d), P = G.party, rivals = debRivals(d);
  const done = D.round >= D.qs.length;
  const cur = D.qs[Math.min(D.round, D.qs.length - 1)];
  let h = `<div class="rounds">${D.qs.map((q, i) => { const r = D.results[i]; return `<span class="rd ${r ? (r.edge > 0.5 ? 'w' : r.edge < -0.5 ? 'l' : 'e') : i === D.round ? 'now' : ''}">Round ${i + 1}${r ? ' · ' + (r.edge > 0.5 ? 'won' : r.edge < -0.5 ? 'lost' : 'even') : ''}</span>`; }).join('')}</div>`;
  if (D.stage === 'choose' && !done) {
    h += `<div class="qbox"><small>Round ${D.round + 1} of ${D.qs.length} · ${esc(cur.name)}</small>${esc(cur.q)}</div>
      <p class="hint">Counters: attacking beats a pivot, a personal story beats an attack, and a plan beats a story. Debate prep: ${G.prep[P] || 0} session${(G.prep[P] || 0) === 1 ? '' : 's'}.</p></div>
      <div class="ballot-sub"><span>Your approach</span><span>Vote for one</span></div>
      <div class="choices">${Object.entries(STRATS_F).map(([k, s], i) => `<button class="choice" data-a="debPick" data-v="${k}">${ovalHTML()}<span>${esc(s.label)}<small>${esc(s.desc)}</small></span><span class="kbd">${i + 1}</span></button>`).join('')}</div>
      <p class="instr">Mark an oval, or press 1–4.</p></div>`;
  } else {
    const r = D.results[D.results.length - 1];
    const verdict = r.edge > 0.5 ? 'You won the round.' : r.edge < -0.5 ? 'You lost the round.' : 'The round was even.';
    h += `<div class="qbox"><small>Round ${D.results.length} · ${esc(r.q)}</small>${r.lines.map(l => `<span class="dline c-${l.p}">${esc(l.t)}</span>`).join('')}</div>
      <p class="lede" style="margin-top:12px"><b>${verdict}</b></p></div>
      <div class="choices"><button class="choice" data-a="debNext">${ovalHTML()}<span>${done ? 'See how the debate played' : 'Next question'}</span><span class="kbd">Enter</span></button></div></div>`;
  }
  return h;
}
function numbersHTML() {
  const ps = actors().filter(p => G.stats[p]);
  return `<div class="numbers"><h3 class="label" style="color:var(--ink)">The campaign by the numbers</h3>
    <div class="cmp" style="grid-template-columns:minmax(0,1fr) repeat(${ps.length},auto)"><span></span>${ps.map(p => `<span class="label c-${p}">${esc(candOf(p).last)}</span>`).join('')}
      <span>Money raised</span>${ps.map(p => `<b>${moneyTxt(G.raised[p])}</b>`).join('')}
      <span>Spent on ${adWord()}</span>${ps.map(p => `<b>${moneyTxt(G.spentAds[p])}</b>`).join('')}
      <span>Rallies</span>${ps.map(p => `<b>${G.stats[p].rallies + G.stats[p].vp}</b>`).join('')}
      <span>Field offices</span>${ps.map(p => `<b>${G.stats[p].off}</b>`).join('')}</div></div>`;
}
