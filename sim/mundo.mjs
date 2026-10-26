// Prova: dois jogadores com decisões diferentes, mesma semente semanal → mesmo dólar e mesmos eventos.
import fs from 'node:fs'; import vm from 'node:vm';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');const src=html.split('<script>')[1].split('</script>')[0];
const simSrc=fs.readFileSync(new URL('./sim.mjs',import.meta.url),'utf8');const a=simSrc.indexOf('function makeEngine');const b=simSrc.indexOf('function run(');
const makeEngine=new Function('fs','vm','src',simSrc.slice(a,b)+'; return makeEngine;')(fs,vm,src);
function play(seed,buyer,maino){const c=makeEngine();const g=x=>vm.runInContext(x,c);
  g(`newGame('semanal','p',0,'pet');S.seedStr='semanal:${seed}:pet';S.rng=hash(S.seedStr);S.rngW=hash(S.seedStr+':mundo');queue=[];`);
  const S=g('S');if(maino)g('S.sys=2');const events=[];
  for(let m=1;m<=12;m++){
    if(buyer&&m<=8&&S.cash>30000){g(`ui.buy={pid:'coleira',sid:SUPPLIERS[${m%2}].id,qty:${200+m*40},modal:'${m%3?'lcl':'aereo'}',lock:${m%2===0},seguro:false,insp:${m%4===0}};`);
      const err=g(`(()=>{const pv=buyPreview();if(pv.err)return pv.err;const st=S.stock.coleira;if(st.ncm===null){const o=P('coleira').ncm.find(n=>n.ok);st.ncm=o.c;st.ncmOk=true;}const o=SUPPLIERS[ui.buy.sid==='shenzhen'?0:1].opts[${m%3}];finishBuy(pv,o.k,o,false);return null;})()`);}
    const before=S.log.length;g('queue=[];modalOpen=false;closeMonth();');
    events.push(S.log.slice(0,S.log.length-before).map(l=>l.t).filter(t=>/^Evento:|alíquota|Alíquota/i.test(t)).join('|'));
    if(S.over)break;}
  return {d:S.dHist.map(v=>v.toFixed(4)),events,pat:g('patrimonio(S)'),imports:S.imports};}
for(const seed of ['2026-S44','2026-S45']){const A=play(seed,false),B=play(seed,true),C=play(seed,true,true);
  const sameD=JSON.stringify(A.d)===JSON.stringify(B.d)&&JSON.stringify(A.d)===JSON.stringify(C.d);const sameE=JSON.stringify(A.events)===JSON.stringify(B.events);
  console.log(seed,'| imports A/B/C(Mainô):',A.imports,B.imports,C.imports,'| dólar igual nos 3:',sameD,'| patrimônio A/B:',Math.round(A.pat),Math.round(B.pat),'| mesmo dólar:',sameD,'| mesmos eventos:',sameE);
  if(!sameD)console.log(' A',A.d.join(' '),'\n B',B.d.join(' '));if(!sameE)console.log(' A',A.events,'\n B',B.events);}
