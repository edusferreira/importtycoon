// Estresse: bots extremos em N seeds e 3 segmentos. Caça exceções, NaN, estoque negativo, valores absurdos. Uso: node stress.mjs [N]
import fs from 'node:fs'; import vm from 'node:vm';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');const src=html.split('<script>')[1].split('</script>')[0];
const simSrc=fs.readFileSync(new URL('./sim.mjs',import.meta.url),'utf8');const a=simSrc.indexOf('function makeEngine');const b=simSrc.indexOf('function run(');
const makeEngine=new Function('fs','vm','src',simSrc.slice(a,b)+'; return makeEngine;')(fs,vm,src);
const N=+(process.argv[2]||40);
function mk(seed,seg){const c=makeEngine();const g=x=>vm.runInContext(x,c);
  g(`newGame('semanal','p',0,'${seg}');S.seedStr='semanal:${seed}:${seg}';S.rng=hash(S.seedStr);S.rngW=hash(S.seedStr+':mundo');queue=[];modalOpen=false;`);
  const S=g('S');g("for(const p of PRODUCTS) if(p.anu) doLicenca(p.id);");const t0=1+Math.max(0,...g('PRODUCTS').filter(p=>p.anu).map(p=>p.anu.lead));const api={S,g,t0,early:n=>api.S.turn>=t0&&api.S.turn<t0+n,P:id=>g('PRODUCTS').find(p=>p.id===id),SUP:id=>g('SUPPLIERS').find(s=>s.id===id),mk:pid=>g('marketPrice')(S,pid),
    buy(pid,sid,qty,modal,o={}){g('ui').buy={pid,sid,qty,modal,lock:!!o.lock,seguro:!!o.seguro,insp:!!o.insp};const pv=g('buyPreview')();if(pv.err)return pv.err;const st=S.stock[pid];if(st.ncm===null){const p=api.P(pid);const n=o.badNcm?(p.ncm.find(x=>!x.ok)||p.ncm.find(x=>x.ok)):p.ncm.find(x=>x.ok);st.ncm=n.c;st.ncmOk=n.ok;}const k=o.neg||'neutral';const opt=api.SUP(sid).opts.find(x=>x.k===k)||{why:''};g('finishBuy')(pv,k,opt,false);return null;},
    close(accept){g('queue=[];modalOpen=false;closeMonth();');const q=g('queue');for(const m of q)for(const bt of m.buttons||[])if(bt.label==='Aceitar'&&accept&&bt.onClick)bt.onClick();q.length=0;}};
  return api;}
const main=seg=>seg==='eletronicos'?'fone':seg==='pet'?'coleira':'serum';
const prods=api=>api.g('PRODUCTS').map(p=>p.id);
const BOTS={
  courier(api){const {S}=api;const pid=main(api.seg);for(const p of prods(api)){S.stock[p].price=api.mk(p);S.stock[p].channel='ambos';}if(S.turn===1)api.g('doSistema')(1);for(let i=0;i<4;i++)api.buy(pid,'guangzhou',60,'courier');},
  mkt_only(api){const {S}=api;if(S.turn===1){api.g('doSistema')(2);}S.mkt=40000;if(api.early(2))api.buy(main(api.seg),'guangzhou',300,'aereo');},
  fcl_max(api){const {S}=api;if(S.turn===1){api.g('doSistema')(2);api.g('doWarehouse')(2);}for(const p of prods(api)){S.stock[p].price=api.mk(p);}if(api.early(3))api.buy(main(api.seg),'guangzhou',20000,'fcl');if(api.early(3))api.buy(main(api.seg),'guangzhou',5000,'fcl');},
  filial_cedo(api){const {S}=api;if(S.turn===1)api.g('doSistema')(2);if(api.early(2))api.buy(main(api.seg),'guangzhou',800,'aereo');if(S.turn===api.t0+2){try{api.g('doRadar')();}catch(e){}try{api.g('doFilial')();}catch(e){}}for(const p of prods(api)){S.stock[p].price=api.mk(p);}},
  preco_alto(api){const {S}=api;if(S.turn===1)api.g('doSistema')(1);for(const p of prods(api)){S.stock[p].price=Math.round(api.mk(p)*1.6);}if(api.early(2))api.buy(main(api.seg),'guangzhou',800,'lcl');},
  preco_baixo(api){const {S}=api;if(S.turn===1)api.g('doSistema')(1);for(const p of prods(api)){S.stock[p].price=Math.max(1,Math.round(api.mk(p)*0.4));}if(api.early(2))api.buy(main(api.seg),'guangzhou',800,'lcl');},
  credito_max(api){const {S}=api;if(S.turn===1){api.g('doSistema')(2);api.g('doLoan')('giro',80000);api.g('doLoan')('finimp',150000);}for(const p of prods(api)){S.stock[p].price=api.mk(p);}if(api.early(4))api.buy(main(api.seg),'shenzhen',3000,'lcl',{insp:false,neg:'bad'});},
  ncm_errada(api){const {S}=api;if(S.turn===1)api.g('doSistema')(1);for(const p of prods(api)){S.stock[p].price=api.mk(p);}if(api.early(6))api.buy(main(api.seg),'shenzhen',700,'aereo',{badNcm:true,neg:'bad'});},
  tudo_mes1(api){const {S}=api;if(S.turn===1){api.g('doSistema')(4);api.g('doWarehouse')(2);api.g('doAnalista')(3);api.g('doConsultoria')(3);try{api.g('doRadar')();}catch(e){}}for(const p of prods(api)){S.stock[p].price=api.mk(p);}if(api.early(3))api.buy(main(api.seg),'guangzhou',500,'aereo');},
  troca_consult(api){const {S}=api;if(S.turn===1)api.g('doSistema')(3);api.g('doConsultoria')(1+(S.turn%3));api.g('queue=[];modalOpen=false;aplicarPlano();');const q=api.g('queue');const md=q[q.length-1];if(md){const bt=(md.buttons||[]).find(x=>x.label==='Aplicar');if(bt&&bt.onClick)bt.onClick();}},
  promessa_quebrada(api){const {S}=api;if(S.turn===1)api.g('doSistema')(1);for(const p of prods(api)){S.stock[p].price=api.mk(p);}if(S.turn===api.t0||S.turn===api.t0+6)api.buy(main(api.seg),'guangzhou',600,'lcl',{neg:'good'});},
  undo_spam(api){const {S}=api;if(S.turn===1)api.g('doSistema')(1);for(const p of prods(api)){S.stock[p].price=api.mk(p);}api.buy(main(api.seg),'guangzhou',500,'aereo');api.buy(main(api.seg),'taipei',300,'lcl');try{api.g('undoCmd(0)');}catch(e){throw new Error('undo: '+e.message);}},
  passivo(api){const {S}=api;if(S.turn===api.t0)api.buy(main(api.seg),'guangzhou',300,'lcl');},
};
const q=(arr,p)=>{const s=[...arr].sort((x,y)=>x-y);return s[Math.floor((s.length-1)*p)];};
const rows={};const problems=[];
const ONLY=process.argv[3];for(const seg of (process.argv[4]?[process.argv[4]]:["eletronicos","pet","beleza"])){for(const [name,bot] of Object.entries(BOTS)){if(ONLY&&name!==ONLY)continue;const t0=Date.now();const pats=[],broke=[];let errs=0;
  for(let i=0;i<N;i++){const seed='2026-S'+String(10+i).padStart(2,'0');const api=mk(seed,seg);api.seg=seg;let S=api.S;const sync=()=>{S=api.g("S");api.S=S;};
    let it=0;try{while(!S.over){sync();bot(api);sync();api.close(true);sync();if(++it>20)throw new Error("loop: turn="+S.turn+" neg="+S.negMonths+" cash="+Math.round(S.cash));}
      const pat=api.g('patrimonio(S)');const val=api.g('valuation(S)');
      for(const p of prods(api)){if(S.stock[p].qty<0)problems.push(`${seg}/${name}/${seed}: estoque negativo ${p}`);if(!isFinite(S.stock[p].avg))problems.push(`${seg}/${name}/${seed}: avg NaN ${p}`);}
      if(!isFinite(pat)||!isFinite(S.cash)||!isFinite(val.valor))problems.push(`${seg}/${name}/${seed}: NaN em pat/cash/valor`);
      if(S.radar.used<0)problems.push(`${seg}/${name}/${seed}: radar.used negativo`);
      if(pat>3e6)problems.push(`${seg}/${name}/${seed}: patrimônio suspeito ${Math.round(pat)}`);
      if(S.hist.length!==12&&S.negMonths<2)problems.push(`${seg}/${name}/${seed}: hist ${S.hist.length} sem falência`);
      pats.push(pat);broke.push(S.negMonths>=2);}
    catch(e){errs++;if(errs<=2)problems.push(`${seg}/${name}/${seed}: EXCEÇÃO ${e.message.slice(0,120)}`);}}
  process.stderr.write(`${seg}/${name} ${Date.now()-t0}ms\n`);rows[`${seg} / ${name}`]={exc:errs,broke:Math.round(broke.filter(Boolean).length/Math.max(1,broke.length)*100)+'%',p10:Math.round(q(pats,.1)/1000)+'k',med:Math.round(q(pats,.5)/1000)+'k',max:Math.round(Math.max(...pats)/1000)+'k'};}}
console.table(rows);console.log('PROBLEMAS:',problems.length);for(const p of problems.slice(0,40))console.log(' -',p);
