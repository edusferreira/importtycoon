// Harness de balanceamento: carrega o motor de o-importador.html em um contexto vm sem DOM
// e roda bots com perfis distintos em N seeds. Uso: node sim.mjs [seeds] [--verbose]
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const src = html.split('<script>')[1].split('</script>')[0];
const N = +(process.argv[2] || 300);
const VERBOSE = process.argv.includes('--verbose');

function makeEngine() {
  const noop=new Proxy({},{get:()=>()=>noop,set:()=>true});
  const stubEl = () => new Proxy({}, { get: (t, k) => (k === 'querySelectorAll' ? () => [] : k === 'querySelector' ? () => stubEl() : k === 'remove' ? () => {} : k === 'getContext' ? () => noop : k === 'toDataURL' ? () => '' : k === 'value' ? '0' : t[k]), set: (t, k, v) => { t[k] = v; return true; } });
  const ctx = {
    console, Math, Date, JSON, Object, Array, Number, String, Infinity, NaN, Intl, Proxy, performance: { now: () => 0 }, requestAnimationFrame: () => 0, cancelAnimationFrame() {}, addEventListener() {}, removeEventListener() {},
    document: { querySelector: () => stubEl(), querySelectorAll: () => [], createElement: () => stubEl(), body: { appendChild() {}, contains: () => false }, documentElement: { dataset: {} }, addEventListener() {}, removeEventListener() {}, head: { appendChild() {} } },
    window: {}, navigator: {}, localStorage: { getItem: () => null, setItem() {} },
    matchMedia: () => ({ matches: false }), getComputedStyle: () => ({ color: '#000' }),
  };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  // neutraliza UI
  vm.runInContext('renderGame=()=>{};openModal=(m)=>{queue.push(m)};showNext=()=>{};closeModal=()=>{};drawCard=()=>{};', ctx);
  return ctx;
}

function run(bot, seed, seg = 'eletronicos') {
  const c = makeEngine();
  const g = (code) => vm.runInContext(code, c);
  g(`newGame('sandbox','bot',0,'${seg}'); S.seedStr='sim:${seed}'; S.rng=hash(S.seedStr); queue=[]; for(const p of PRODUCTS) if(p.anu) doLicenca(p.id);`);
  const S = g('S');
  const api = {
    S, c, g, seg, main: seg === 'eletronicos' ? 'fone' : seg === 'pet' ? 'coleira' : 'serum',
    P: (id) => g('PRODUCTS').find((p) => p.id === id),
    SUP: (id) => g('SUPPLIERS').find((s) => s.id === id),
    MODAIS: g('MODAIS'), SEASON: g('SEASON'), RADAR: g('RADAR'), WAREHOUSES: g('WAREHOUSES'),
    marketPrice: (pid) => g('marketPrice')(S, pid),
    buy(pid, sid, qty, modal, lock, seguro, neg, insp = false) {
      g('ui').buy = { pid, sid, qty, modal, lock, seguro, insp };
      const pv = g('buyPreview')();
      if (pv.err) return pv.err;
      const st = S.stock[pid];
      if (st.ncm === null) { const p = api.P(pid); const o = neg === 'bad' ? p.ncm.find((n) => !n.ok) : p.ncm.find((n) => n.ok); st.ncm = o.c; st.ncmOk = o.ok; }
      const o = api.SUP(sid).opts.find((x) => x.k === neg);
      g('finishBuy')(pv, neg, o, false);
      return null;
    },
    close(acceptOffers) {
      g('closeMonth')();
      const q = g('queue');
      for (const m of q) for (const b of m.buttons || []) if (b.label === 'Aceitar' && acceptOffers && b.onClick) b.onClick();
      q.length = 0;
    },
    inTransitM3: () => S.ships.reduce((a, x) => a + x.qty * api.P(x.pid).m3, 0),
    stockM3: () => g('stockM3')(S),
    committed: () => S.ships.reduce((a, x) => a + x.fobUSD * (1 - api.SUP(x.sid).deposit) * (x.lockRate || S.dollar) + x.fobUSD * S.dollar * 1.15 + 5000, 0),
    pat: () => g('patrimonio')(S),
  };
  while (!S.over) { bot(api); api.close(bot.acceptOffers !== false); }
  return { pat: api.pat(), broke: S.negMonths >= 2, turn: S.turn, rev: S.hist.reduce((a, h) => a + h.m.rev, 0), imports: S.imports, cash: S.cash };
}

/* ---------- BOTS ---------- */
const months = (api, eta) => api.SEASON[(eta - 1) % 12];

// Prudente: planeja 2 meses de demanda, trava câmbio, seguro, reserva de caixa, galpão quando precisa, Mainô cedo.
function prudente(api) {
  const { S } = api; const t = S.turn;
  if (t === 2 && !S.up.maino && S.cash > 40000) api.g('doMaino')();
  for (const p of api.g('PRODUCTS')) { const st = S.stock[p.id]; st.price = Math.round(api.marketPrice(p.id) * ((t >= 11) ? 1.08 : 1.0)); st.channel = 'ambos'; }
  // radar
  const nx = api.RADAR[S.radar.level + 1];
  if (nx && S.imports >= nx.req && S.cash - api.committed() > nx.cost + 30000) api.g('doRadar')();
  // compras: produto com maior margem estimada, cobrindo 2 meses a partir da chegada
  for (const pid of api.g('PRODUCTS').map((p) => p.id)) {
    const p = api.P(pid); const st = S.stock[pid];
    const eta = t + 2; const need = Math.round(p.base * months(api, eta) * 2 + p.base * months(api, eta + 1));
    const pipeline = st.qty + S.ships.filter((x) => x.pid === pid).reduce((a, x) => a + x.qty, 0);
    let qty = need - pipeline; if (qty < 200) continue;
    qty = Math.min(qty, 4000);
    const free = S.cash - api.committed() - 20000;
    const unitBRL = p.fob * S.dollar * 2.3; // custo nacionalizado estimado
    const afford = Math.floor(free / unitBRL);
    qty = Math.min(qty, afford); if (qty < 200) continue;
    // radar
    const limit = api.RADAR[S.radar.level].limit - S.radar.used; qty = Math.min(qty, Math.floor(limit / p.fob)); if (qty < 200) continue;
    const m3 = qty * p.m3; let modal = m3 >= 20 ? 'fcl' : 'lcl'; if (modal === 'fcl' && m3 > 33) qty = Math.floor(33 / p.m3);
    if (modal === 'lcl' && m3 > 19) qty = Math.floor(19 / p.m3);
    const needCap = api.stockM3() + api.inTransitM3() + qty * p.m3;
    if (needCap > api.WAREHOUSES[S.wh].cap) { const w = needCap <= 80 ? 1 : 2; if (w > S.wh && S.cash > 60000) api.g('doWarehouse')(w); }
    api.buy(pid, 'guangzhou', qty, modal, true, true, 'good');
  }
  if (S.loans.giro > 0 && S.cash - api.committed() > S.loans.giro + 30000) api.g('doLoan')('giro', -S.loans.giro);
  if (S.cash - api.committed() < 0 && S.loans.giro < 80000) api.g('doLoan')('giro', Math.min(80000 - S.loans.giro, -(S.cash - api.committed()) + 10000));
}

// Passivo: um pedido no mês 1, vende a preço de mercado, nunca mais compra.
function passivo(api) {
  const { S } = api;
  if (S.turn === 1) api.g('doSistema')(1);
  if (S.imports === 0 && S.ships.length === 0 && S.turn <= 4) api.buy(api.main, 'guangzhou', 1500, 'lcl', false, true, 'neutral');
  for (const p of api.g('PRODUCTS')) { S.stock[p.id].price = api.marketPrice(p.id); S.stock[p.id].channel = 'ambos'; }
}

// Afobado: compra aéreo sempre que tem caixa pro sinal, sem trava, sem seguro, Shenzhen, preço 10% abaixo do mercado, sem galpão.
function afobado(api) {
  const { S } = api;
  for (const p of api.g('PRODUCTS')) { S.stock[p.id].price = Math.round(api.marketPrice(p.id) * 0.9); S.stock[p.id].channel = 'ambos'; }
  const pids = api.g('PRODUCTS').map((p) => p.id);
  for (const pid of pids) {
    const p = api.P(pid); const sup = api.SUP('shenzhen');
    let qty = Math.floor((S.cash - 5000) / (p.fob * sup.mult * S.dollar * sup.deposit));
    qty = Math.min(qty, Math.floor(12 / p.m3), Math.floor((api.RADAR[S.radar.level].limit - S.radar.used) / (p.fob * sup.mult)));
    if (qty < sup.moq) continue;
    let err = api.buy(pid, 'shenzhen', qty, 'aereo', false, false, 'bad'); while (err && qty > sup.moq) { qty = Math.floor(qty * 0.9); err = api.buy(pid, 'shenzhen', qty, 'aereo', false, false, 'bad'); } if (!err) break;
  }
}

// Imprudente: tudo no mês 1, Shenzhen, aéreo, sem trava, preço abaixo do custo pra girar, nunca pega crédito.
function imprudente(api) {
  const { S } = api;
  if (S.imports === 0 && S.ships.length === 0 && S.turn <= 4) { const p = api.P(api.main); const sup = api.SUP('shenzhen'); let qty = Math.floor(S.cash / (p.fob * sup.mult * S.dollar * sup.deposit)); qty = Math.min(qty, Math.floor(10 / p.m3), Math.floor(50000 / (p.fob * sup.mult))); let err = api.buy(api.main, 'shenzhen', qty, 'aereo', false, false, 'bad'); while (err && qty > 300) { qty = Math.floor(qty * 0.9); err = api.buy(api.main, 'shenzhen', qty, 'aereo', false, false, 'bad'); } }
  for (const p of api.g('PRODUCTS')) { S.stock[p.id].price = Math.round(api.marketPrice(p.id) * 0.8); S.stock[p.id].channel = 'marketplace'; }
}
imprudente.acceptOffers = false;


// Agressivo: prudente com Radar o mais cedo possível, Galpão G, 3 meses de demanda, Mainô e comprador.
function agressivo(api) {
  const { S } = api; const t = S.turn;
  if (t === 1) api.g('doWarehouse')(1);
  if (S.wh === 1 && api.stockM3() + api.inTransitM3() > 70) api.g('doWarehouse')(2);
  if (t === 1 && !S.up.maino) api.g('doMaino')();
  
  for (const p of api.g('PRODUCTS')) { const st = S.stock[p.id]; st.price = Math.round(api.marketPrice(p.id) * ((t >= 11) ? 1.1 : 1.0)); st.channel = 'ambos'; }
  const nx = api.RADAR[S.radar.level + 1];
  if (nx && S.imports >= nx.req && S.cash > nx.cost + 10000) api.g('doRadar')();
  for (const pid of api.g('PRODUCTS').map((p) => p.id)) {
    const p = api.P(pid); const st = S.stock[pid];
    const eta = t + 2; const need = Math.round(p.base * (months(api, eta) + months(api, eta + 1) + months(api, eta + 2)));
    const pipeline = st.qty + S.ships.filter((x) => x.pid === pid).reduce((a, x) => a + x.qty, 0);
    let qty = need - pipeline; if (qty < 200) continue;
    const free = S.cash - api.committed() - 8000 + Math.max(0, 80000 - S.loans.giro) * 0.5;
    qty = Math.min(qty, Math.floor(free / (p.fob * S.dollar * 2.3)));
    const limit = api.RADAR[S.radar.level].limit - S.radar.used; qty = Math.min(qty, Math.floor(limit / p.fob)); if (qty < 200) continue;
    let m3 = qty * p.m3; let modal = m3 >= 20 ? 'fcl' : 'lcl'; if (modal === 'fcl' && m3 > 33) qty = Math.floor(33 / p.m3); if (modal === 'lcl' && m3 > 19) qty = Math.floor(19 / p.m3);
    api.buy(pid, 'guangzhou', qty, modal, true, true, 'good');
  }
  if (S.loans.giro > 0 && S.cash - api.committed() > S.loans.giro + 30000) api.g('doLoan')('giro', -S.loans.giro);
  if (S.cash - api.committed() < 0 && S.loans.giro < 80000) api.g('doLoan')('giro', Math.min(80000 - S.loans.giro, -(S.cash - api.committed()) + 10000));
}


// Mestre: pipeline contínuo. Cobre 2 meses de vendas após a chegada usando o próprio modelo de demanda,
// confere o caixa projetado na chegada com buyPreview, usa giro só como ponte e quita quando sobra.
function mestre(api) {
  const { S } = api; const t = S.turn;
  if (t === 1) { api.g('doWarehouse')(1); api.g('doMaino')(); }
  if (S.wh === 1 && api.stockM3() + api.inTransitM3() > 70) api.g('doWarehouse')(2);
  const demandFor = api.g('demandFor');
  for (const p of api.g('PRODUCTS')) { const st = S.stock[p.id]; st.price = Math.round(api.marketPrice(p.id) * ((t >= 11) ? 1.08 : 1.0)); st.channel = 'ambos'; }
  const nx = api.RADAR[S.radar.level + 1];
  if (nx && S.imports >= nx.req && S.cash > nx.cost + 20000) api.g('doRadar')();
  const expected = (pid, month) => { const st = S.stock[pid]; const save = S.turn; S.turn = month; const d = demandFor(S, pid, st.price, 'ambos', 1); S.turn = save; return Math.round(d.mp + d.b2b); };
  const arrivalOutlay = () => S.ships.reduce((a, x) => a + x.fobUSD * (1 - api.SUP(x.sid).deposit) * (x.lockRate || S.dollar) + x.fobUSD * S.dollar * 1.12 + 4500, 0);
  if (t >= 11) { /* não compra mais: não chega a tempo */ }
  else for (const pid of api.g('PRODUCTS').slice().sort((a, b) => b.market * b.base - a.market * a.base).map((p) => p.id)) {
    const p = api.P(pid); const st = S.stock[pid]; const eta = t + 2;
    const horizon = Math.min(12, eta + 1);
    let needed = 0; for (let m = t; m <= horizon; m++) needed += expected(pid, m);
    const pipeline = st.qty + S.ships.filter((x) => x.pid === pid).reduce((a, x) => a + x.qty, 0);
    let qty = needed - pipeline; if (qty < 200) continue;
    const limit = api.RADAR[S.radar.level].limit - S.radar.used; qty = Math.min(qty, Math.floor(limit / (p.fob * 0.94))); if (qty < 200) continue;
    let m3 = qty * p.m3; let modal = m3 >= 20 ? 'fcl' : 'lcl'; if (modal === 'fcl' && m3 > 33) qty = Math.floor(33 / p.m3); if (modal === 'lcl' && m3 > 19) qty = Math.floor(19 / p.m3);
    // caixa: reduz até caber
    for (let k = 0; k < 8 && qty >= 200; k++) {
      api.g('ui').buy = { pid, sid: 'guangzhou', qty, modal, lock: true, seguro: true }; const pv = api.g('buyPreview')();
      if (pv.err) { qty = Math.floor(qty * 0.8); continue; }
      const chegada = pv.c.total - pv.c.fobBRL + pv.sh.fobUSD * 0.7 * pv.rate;
      const salesCash = Math.round(0.5 * [t, t + 1].reduce((a, m) => a + api.g('PRODUCTS').reduce((b, q) => b + Math.min(S.stock[q.id].qty / 2, expected(q.id, m)) * S.stock[q.id].price * 0.82, 0), 0));
      const projected = S.cash - pv.sinal - arrivalOutlay() - 10200 * 2 + salesCash + (80000 - S.loans.giro);
      if (projected >= chegada + 10000) { api.buy(pid, 'guangzhou', qty, modal, true, true, 'good'); break; }
      qty = Math.floor(qty * 0.8);
    }
  }
  const spare = S.cash - arrivalOutlay() - 15000;
  if (S.loans.giro > 0 && spare > 0) api.g('doLoan')('giro', -Math.min(S.loans.giro, spare));
  if (S.cash - arrivalOutlay() < 0 && S.loans.giro < 80000) api.g('doLoan')('giro', Math.min(80000 - S.loans.giro, -(S.cash - arrivalOutlay()) + 5000));
}


// Ingênuo: jogador iniciante típico. Fornecedor barato, sem trava, sem seguro, sem Mainô, repõe por aéreo quando acaba,
// mas só compra se tiver caixa pra 3x o sinal. Preço de mercado.
function ingenuo(api) {
  const { S } = api; const t = S.turn;
  for (const p of api.g('PRODUCTS')) { S.stock[p.id].price = api.marketPrice(p.id); S.stock[p.id].channel = 'ambos'; }
  if (t === 1) api.g('doSistema')(1);
  if (S.imports === 0 && S.ships.length === 0) { if (t <= 4) api.buy(api.main, 'shenzhen', 2000, 'lcl', false, false, 'neutral'); return; }
  if (t >= 11) return;
  const st = S.stock[api.main]; const transit = S.ships.filter((x) => x.pid === api.main).reduce((a, x) => a + x.qty, 0);
  if (st.qty + transit < 400) {
    const p = api.P(api.main); const sup = api.SUP('shenzhen');
    let qty = Math.min(1500, Math.floor(S.cash / 3 / (p.fob * sup.mult * S.dollar * sup.deposit)));
    qty = Math.min(qty, Math.floor((api.RADAR[S.radar.level].limit - S.radar.used) / (p.fob * sup.mult)));
    if (qty >= sup.moq) api.buy(api.main, 'shenzhen', qty, p.m3 > 0.01 ? 'lcl' : 'aereo', false, false, 'neutral');
  }
}


// Variantes do ingênuo pra medir cada instrumento de prudência isoladamente
const variant = (o) => { const f = (api) => { const { S } = api; const t = S.turn;
  if (t === 1) api.g('doSistema')(o.sys != null ? o.sys : (o.maino ? 2 : 1));
  for (const p of api.g('PRODUCTS')) { S.stock[p.id].price = api.marketPrice(p.id); S.stock[p.id].channel = 'ambos'; }
  if (S.imports === 0 && S.ships.length === 0) { if (t <= 4) api.buy(api.main, o.sid, 2000, 'lcl', o.lock, o.seguro, o.neg, !!o.insp); return; }
  if (t >= 11) return;
  const st = S.stock[api.main]; const transit = S.ships.filter((x) => x.pid === api.main).reduce((a, x) => a + x.qty, 0);
  if (st.qty + transit < 400) { const p = api.P(api.main); const sup = api.SUP(o.sid);
    let qty = Math.min(1500, Math.floor(S.cash / 3 / (p.fob * sup.mult * S.dollar * sup.deposit)));
    qty = Math.min(qty, Math.floor((api.RADAR[S.radar.level].limit - S.radar.used) / (p.fob * sup.mult)));
    if (qty >= sup.moq) api.buy(api.main, o.sid, qty, 'aereo', o.lock, o.seguro, o.neg, !!o.insp); } }; return f; };
const base = { sid: 'shenzhen', lock: false, seguro: false, sys: 1, neg: 'neutral' };

/* ---------- EXECUÇÃO ---------- */
const mestreFilial = (api) => { const { S } = api; if (S.turn >= 3 && S.filial && S.filial.status === 'none' && S.imports >= 2 && S.radar.level >= 1 && S.cash > 90000) api.g('doFilial')(); mestre(api); };
const mestreMkt = (api) => { api.S.mkt = api.S.turn >= 3 ? 6000 : 0; mestre(api); };
const ingenuoMkt = (api) => { api.S.mkt = api.S.turn >= 3 ? 6000 : 0; ingenuo(api); };
const mestreMktSmart = (api) => { const { S } = api; const est = api.g('PRODUCTS').reduce((a, p) => a + S.stock[p.id].qty, 0); const dem = api.g('PRODUCTS').reduce((a, p) => { const st = S.stock[p.id]; if (!(st.qty > 0)) return a; const save = S.mkt; S.mkt = 0; const d = api.g('demandFor')(S, p.id, st.price, 'ambos', 1); S.mkt = save; return a + d.mp + d.b2b; }, 0); S.mkt = (S.turn >= 3 && est > dem * 1.4) ? 6000 : 0; mestre(api); };
const bots = process.argv.includes('--insp') ? { shenzhenSem: variant(base), shenzhenCom: variant({ ...base, insp: true }), guangzhouSem: variant({ ...base, sid: 'guangzhou' }), guangzhouCom: variant({ ...base, sid: 'guangzhou', insp: true }), taipeiSem: variant({ ...base, sid: 'taipei' }), taipeiCom: variant({ ...base, sid: 'taipei', insp: true }) } : process.argv.includes('--mkt') ? { mestre, mestreMkt, mestreMktSmart, ingenuo, ingenuoMkt } : process.argv.includes('--filial') ? { mestre, mestreFilial } : process.argv.includes('--instrumentos') ? { sys0: variant({ ...base, sys: 0 }), sys1: variant(base), sys2: variant({ ...base, sys: 2 }), sys3: variant({ ...base, sys: 3 }), sys4: variant({ ...base, sys: 4 }), lock: variant({ ...base, lock: true }), seguro: variant({ ...base, seguro: true }), guangzhou: variant({ ...base, sid: 'guangzhou' }), guangzhouGood: variant({ ...base, sid: 'guangzhou', neg: 'good' }), tudo: variant({ sid: 'guangzhou', lock: true, seguro: true, sys: 2, neg: 'good' }) } : { mestre, agressivo, prudente, ingenuo, passivo, afobado, imprudente };
const q = (arr, p) => arr.slice().sort((a, b) => a - b)[Math.floor(p * (arr.length - 1))];
const out = {};
for (const [name, bot] of Object.entries(bots)) {
  const rs = []; for (let i = 0; i < N; i++) rs.push(run(bot, i));
  const pats = rs.map((r) => r.pat);
  out[name] = { broke: +(rs.filter((r) => r.broke).length / N * 100).toFixed(0) + '%', lucro: +(rs.filter((r) => r.pat > 150000 && !r.broke).length / N * 100).toFixed(0) + '%',
    p10: Math.round(q(pats, 0.1) / 1000) + 'k', med: Math.round(q(pats, 0.5) / 1000) + 'k', p90: Math.round(q(pats, 0.9) / 1000) + 'k',
    fat: Math.round(q(rs.map((r) => r.rev), 0.5) / 1000) + 'k', imp: q(rs.map((r) => r.imports), 0.5), turnoFal: q(rs.filter((r) => r.broke).map((r) => r.turn), 0.5) || '-' };
  if (VERBOSE) console.log(name, rs.slice(0, 5));
}
console.table(out);
if (process.argv.includes('--segmentos')) {
  const segs = ['pet', 'eletronicos', 'beleza']; const tbl = {};
  for (const seg of segs) for (const name of ['mestre', 'prudente', 'ingenuo', 'passivo', 'afobado']) {
    const rs = []; for (let i = 0; i < N; i++) rs.push(run({ mestre, prudente, ingenuo, passivo, afobado }[name], i, seg));
    const pats = rs.map((r) => r.pat); tbl[seg + ' / ' + name] = { broke: Math.round(rs.filter((r) => r.broke).length / N * 100) + '%', lucro: Math.round(rs.filter((r) => r.pat > 150000 && !r.broke).length / N * 100) + '%', p10: Math.round(q(pats, 0.1) / 1000) + 'k', med: Math.round(q(pats, 0.5) / 1000) + 'k', p90: Math.round(q(pats, 0.9) / 1000) + 'k', fat: Math.round(q(rs.map((r) => r.rev), 0.5) / 1000) + 'k' };
  }
  console.table(tbl);
}

if (process.argv.includes('--diag')) {
  const name = process.argv[process.argv.indexOf('--diag') + 1] || 'agressivo';
  const c = makeEngine(); const g = (x) => vm.runInContext(x, c);
  // reexecuta 1 seed guardando o estado
  const seed = +(process.argv[process.argv.indexOf('--diag') + 2] || 0);
  let last;
  const origRun = run;
  const r = (function () { const bot = bots[name]; const cc = makeEngine(); const gg = (x) => vm.runInContext(x, cc); gg(`newGame('sandbox','bot',0,'eletronicos'); S.seedStr='sim:${seed}'; S.rng=hash(S.seedStr); queue=[]; for(const p of PRODUCTS) if(p.anu) doLicenca(p.id);`); const S = gg('S');
    const api = { S, c: cc, g: gg, seg: 'eletronicos', main: 'fone', P: (id) => gg('PRODUCTS').find((p) => p.id === id), SUP: (id) => gg('SUPPLIERS').find((s) => s.id === id), MODAIS: gg('MODAIS'), SEASON: gg('SEASON'), RADAR: gg('RADAR'), WAREHOUSES: gg('WAREHOUSES'), marketPrice: (pid) => gg('marketPrice')(S, pid),
      buy(pid, sid, qty, modal, lock, seguro, neg) { gg('ui').buy = { pid, sid, qty, modal, lock, seguro }; const pv = gg('buyPreview')(); if (pv.err) return pv.err; const st = S.stock[pid]; if (st.ncm === null) { const p = api.P(pid); const o = neg === 'bad' ? p.ncm.find((n) => !n.ok) : p.ncm.find((n) => n.ok); st.ncm = o.c; st.ncmOk = o.ok; } const o = api.SUP(sid).opts.find((x) => x.k === neg); gg('finishBuy')(pv, neg, o, false); return null; },
      close(a) { gg('closeMonth')(); const q = gg('queue'); for (const m of q) for (const b of m.buttons || []) if (b.label === 'Aceitar' && a && b.onClick) b.onClick(); q.length = 0; },
      inTransitM3: () => S.ships.reduce((a, x) => a + x.qty * api.P(x.pid).m3, 0), stockM3: () => gg('stockM3')(S), committed: () => S.ships.reduce((a, x) => a + x.fobUSD * (1 - api.SUP(x.sid).deposit) * (x.lockRate || S.dollar) + x.fobUSD * S.dollar * 1.15 + 5000, 0), pat: () => gg('patrimonio')(S) };
    while (!S.over) { bot(api); api.close(bot.acceptOffers !== false); } return S; })();
  console.table(r.hist.map((h) => ({ m: h.month, rev: Math.round(h.m.rev), cmv: Math.round(h.m.cmv), fees: Math.round(h.m.fees), margin: Math.round(h.m.margin), fixed: Math.round(h.m.fixed), pl: h.m.pl, int: h.m.interest, other: Math.round(h.m.other), nfe: h.m.nfe, res: Math.round(h.m.result), cash: Math.round(h.m.cashEnd), landed: Math.round(h.m.landed), units: h.m.units })));
  console.log('stock', Object.fromEntries(Object.entries(r.stock).map(([k, v]) => [k, { qty: v.qty, avg: Math.round(v.avg), price: v.price }])), 'loans', r.loans, 'recv', r.recv.reduce((a, x) => a + x.amount, 0), 'pat', Math.round(g('patrimonio')(r)), 'wh', r.wh, 'radar', r.radar);
  console.log(r.log.slice().reverse().map((l) => l.turn + ': ' + l.t).join('\n'));
}
