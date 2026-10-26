// Mede a consultoria: aplica o plano todo mês, por nível e com/sem Mainô, em N seeds. Uso: node consult.mjs [N]
import fs from 'node:fs'; import vm from 'node:vm';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');const src=html.split('<script>')[1].split('</script>')[0];
const simSrc=fs.readFileSync(new URL('./sim.mjs',import.meta.url),'utf8');const a=simSrc.indexOf('function makeEngine');const b=simSrc.indexOf('function run(');
const makeEngine=new Function('fs','vm','src',simSrc.slice(a,b)+'; return makeEngine;')(fs,vm,src);
const N=+(process.argv[2]||40);
function play(seed,lv,sys,seg='eletronicos'){const c=makeEngine();const g=x=>vm.runInContext(x,c);
  g(`newGame('semanal','p',0,'${seg}');S.seedStr='semanal:${seed}:${seg}';S.rng=hash(S.seedStr);S.rngW=hash(S.seedStr+':mundo');queue=[];S.consult={lv:${lv},errTurn:null,err:null,errDesc:null,applied:null};${sys?`doSistema(${sys});`:''}queue=[];modalOpen=false;`);
  const S=g('S');let errs=0;
  for(let m=1;m<=12;m++){if(S.over)break;
    const pl=g('buildPlan(S)');if(pl&&pl.err)errs++;
    g('queue=[];modalOpen=false;aplicarPlano();');const q=g('queue');const md=q[q.length-1];if(md){const bt=(md.buttons||[]).find(x=>x.label==='Aplicar');if(bt&&bt.onClick)bt.onClick();}
    g('queue=[];modalOpen=false;closeMonth();');}
  return {pat:g('patrimonio(S)'),broke:S.negMonths>=2,errs,imports:S.imports};}
const q=(arr,p)=>{const s=[...arr].sort((x,y)=>x-y);return s[Math.floor((s.length-1)*p)];};
const rows={};
for(const seg of ['eletronicos','pet']){for(const [lv,sys] of [[0,1],[1,1],[1,3],[2,1],[2,3],[3,1],[3,3]]){const out=[];
  for(let i=0;i<N;i++){const seed='2026-S'+String(10+i).padStart(2,'0');if(lv===0){ /* sem consultoria: compra nada = passivo; usa bot? pula */ }
    out.push(play(seed,lv,sys,seg));}
  const pats=out.map(o=>o.pat);rows[`${seg} / consult ${lv||'-'} / sys ${sys}`]={broke:Math.round(out.filter(o=>o.broke).length/N*100)+'%',p10:Math.round(q(pats,.1)/1000)+'k',med:Math.round(q(pats,.5)/1000)+'k',p90:Math.round(q(pats,.9)/1000)+'k',errs:(out.reduce((a,o)=>a+o.errs,0)/N).toFixed(1),imp:(out.reduce((a,o)=>a+o.imports,0)/N).toFixed(1)};}}
console.table(rows);
