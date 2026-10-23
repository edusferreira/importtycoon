// Partidas "humanas razoáveis" por segmento: plano fixo e sensato, 60 seeds, mais a tabela mensal de uma seed.
import fs from 'node:fs'; import vm from 'node:vm';
const src = fs.readFileSync(new URL('../index.html', import.meta.url),'utf8').split('<script>')[1].split('</script>')[0];
const noop=new Proxy({},{get:()=>()=>noop,set:()=>true});
const stub=()=>new Proxy({},{get:(t,k)=>k==='querySelectorAll'?()=>[]:k==='querySelector'?()=>stub():k==='remove'?()=>{}:k==='getContext'?()=>noop:k==='toDataURL'?()=>'':t[k],set:(t,k,v)=>{t[k]=v;return true;}});
function engine(){const ctx={console,Math,Date,JSON,Object,Array,Number,String,Infinity,NaN,Intl,Proxy,performance:{now:()=>0},requestAnimationFrame:()=>0,cancelAnimationFrame(){},document:{querySelector:()=>stub(),querySelectorAll:()=>[],createElement:()=>stub(),body:{appendChild(){},contains:()=>false},documentElement:{dataset:{}},addEventListener(){},removeEventListener(){},head:{appendChild(){}}},window:{},navigator:{},localStorage:{getItem:()=>null,setItem(){}},matchMedia:()=>({matches:false}),getComputedStyle:()=>({color:'#000'})};
 vm.createContext(ctx);vm.runInContext(src,ctx);vm.runInContext("renderGame=()=>{};openModal=(m)=>{queue.push(m)};showNext=()=>{};closeModal=()=>{};drawBase=()=>{};",ctx);return ctx;}
function buy(g,S,pid,sid,qty,modal,lock,insp){g('ui').buy={pid,sid,qty,modal,lock,seguro:true,insp};const pv=g('buyPreview')();if(pv.err)return pv.err;const st=S.stock[pid];if(st.ncm===null){const o=g('P')(pid).ncm.find(n=>n.ok);st.ncm=o.c;st.ncmOk=o.ok;}const sup=g('SUP')(sid);g('finishBuy')(pv,'good',sup.opts.find(x=>x.k==='good'),false);return null;}
function run(seg,seed,verbose){const c=engine();const g=x=>vm.runInContext(x,c);g(`newGame('sandbox','h',0,'${seg}');S.seedStr='play:${seed}';S.rng=hash(S.seedStr);queue=[];`);const S=g('S');const P=g('PRODUCTS');const notes=[];
 const close=()=>{g('closeMonth')();const q=g('queue');for(const m of q)for(const b of m.buttons||[])if(b.label==='Aceitar'&&b.onClick)b.onClick();q.length=0;};
 const main=P.slice().sort((a,b)=>b.market*b.base-a.market*a.base).slice(0,2).map(p=>p.id); // os 2 produtos mais relevantes
 while(!S.over){const t=S.turn;
  if(t===1){g('doSistema')(2);for(const pid of main)if(g('P')(pid).anu)g('doLicenca')(pid);}
  if(t===2&&S.wh===0)g('doWarehouse')(1);
  for(const p of P){const st=S.stock[p.id];st.price=g('marketPrice')(S,p.id);st.channel='ambos';}
  // compra: cobre ~2,5 meses de demanda base a partir da chegada, só se licença ok e caixa permite
  for(const pid of main){const p=g('P')(pid);const st=S.stock[pid];const ok=g('licOk')(S,pid);const pipe=st.qty+S.ships.filter(x=>x.pid===pid).reduce((a,x)=>a+x.qty,0);const need=Math.round(p.base*2.5)-pipe;
   if(ok&&need>200&&t<=10){const modal=p.m3*need>19?'fcl':(p.m3*need>0.5?'lcl':'lcl');let q=Math.min(need,Math.floor(19/p.m3));const err=buy(g,S,pid,'guangzhou',q,modal,true,true);if(err&&verbose)notes.push(`${t}: ${err.slice(0,70)}`);}}
  S.mkt=(t>=4&&P.reduce((a,p)=>a+S.stock[p.id].qty,0)>800)?6000:0;
  const nx=g('RADAR')[S.radar.level+1];if(nx&&S.imports>=nx.req&&S.cash>nx.cost+40000)g('doRadar')();
  if(S.cash<10000&&S.loans.giro<80000)g('doLoan')('giro',40000);
  close();}
 const rev=S.hist.reduce((a,h)=>a+h.m.rev,0);
 if(verbose){console.log(seg,'seed',seed);console.table(S.hist.map(h=>({m:h.month,rev:Math.round(h.m.rev),cmv:Math.round(h.m.cmv),fees:Math.round(h.m.fees),fixed:h.m.fixed,pl:h.m.pl,int:h.m.interest,other:Math.round(h.m.other),res:Math.round(h.m.result),cash:Math.round(h.m.cashEnd),landed:Math.round(h.m.landed),units:h.m.units,unmet:h.m.unmet,brand:Math.round((h.brandAfter||1)*100),ev:(S.log.filter(l=>l.turn===h.turn&&/Evento|Golpe|Sem inspeção|retida|cobrou/.test(l.t)).map(l=>l.t.slice(0,40)).join(' | '))})));console.log(notes.join('\n'));console.log('lic',JSON.stringify(S.lic),'brand',S.brand,'pat',Math.round(g('patrimonio')(S)));}
 return {pat:g('patrimonio')(S),broke:S.negMonths>=2,rev};}
const q=(a,p)=>a.slice().sort((x,y)=>x-y)[Math.floor(p*(a.length-1))];
const out={};for(const seg of ['pet','eletronicos','beleza']){const rs=[];for(let i=0;i<60;i++)rs.push(run(seg,i,false));const p=rs.map(r=>r.pat);out[seg]={broke:Math.round(rs.filter(r=>r.broke).length/60*100)+'%',lucro:Math.round(rs.filter(r=>r.pat>150000&&!r.broke).length/60*100)+'%',p10:Math.round(q(p,.1)/1000)+'k',med:Math.round(q(p,.5)/1000)+'k',p90:Math.round(q(p,.9)/1000)+'k',fat:Math.round(q(rs.map(r=>r.rev),.5)/1000)+'k'};}
console.table(out);
if(process.argv[2]==='broke'){for(let i=0;i<60;i++){const r=run(process.argv[3],i,false);if(r.broke){run(process.argv[3],i,true);break;}}}else if(process.argv[2])run(process.argv[2],+(process.argv[3]||3),true);
