(()=>{
const stage=document.getElementById('stage'),slides=[...document.querySelectorAll('.slide')],prog=document.getElementById('prog'),notesEl=document.getElementById('notes');
const P=new URLSearchParams(location.search);let cur=0,bc=null;
try{bc=new BroadcastChannel('hnv-deck')}catch(e){}
if(P.has('static'))document.body.classList.add('static');
if(P.has('presenter'))document.body.classList.add('presenter');
function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080);stage.style.transform=`translate(-50%,-50%) scale(${s})`}
addEventListener('resize',fit);fit();
const notesOf=s=>(s.querySelector('.notes')||{}).textContent||'';
function count(root){root.querySelectorAll('[data-count]').forEach(el=>{
 const to=+el.dataset.count,dec=+(el.dataset.dec||0),t0=performance.now(),d=1600;
 const fmt=v=>v.toLocaleString('pt-BR',{minimumFractionDigits:dec,maximumFractionDigits:dec});
 if(document.body.classList.contains('static')){el.textContent=fmt(to);return}
 (function f(t){const p=Math.min(1,(t-t0)/d),e=1-Math.pow(1-p,3);el.textContent=fmt(to*e);if(p<1)requestAnimationFrame(f)})(t0)})}
function closePanel(){document.querySelectorAll('.panel.open').forEach(p=>p.classList.remove('open'))}
function openPanel(id){closePanel();const p=document.getElementById(id);if(p){p.classList.add('open');count(p)}}
function go(n){n=Math.max(0,Math.min(slides.length-1,n));closePanel();
 slides[cur].classList.remove('active');
 slides[cur].querySelectorAll('iframe[data-src]').forEach(f=>f.removeAttribute('src'));
 cur=n;const s=slides[cur];s.classList.add('active');
 s.querySelectorAll('iframe[data-src]').forEach(f=>f.src=f.dataset.src);
 count(s);history.replaceState(null,'','?'+P.toString()+'#'+(cur+1));
 prog.style.width=(100*(cur+1)/slides.length)+'%';notesEl.textContent=notesOf(s);
 if(bc)bc.postMessage({t:'slide',n:cur});renderPres()}
function renderPres(){const el=document.getElementById('pres');if(!el)return;const s=slides[cur],nx=slides[cur+1];
 el.innerHTML=`<div class="m">Slide ${cur+1}/${slides.length} · previsto ${s.dataset.t||'-'} s</div><h1>${s.dataset.title||''}</h1><p>${notesOf(s)}</p><div class="m">Próximo: ${nx?nx.dataset.title:'fim'}</div><div class="tm" id="tm">00:00</div><div class="m">Setas = navegar · Espaço = próximo</div>`}
const t0=Date.now();setInterval(()=>{const e=document.getElementById('tm');if(e){const s=Math.floor((Date.now()-t0)/1000);e.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}},500);
if(bc)bc.onmessage=m=>{const d=m.data,pres=document.body.classList.contains('presenter');
 if(d.t==='slide'&&pres&&d.n!==cur){cur=d.n;renderPres()}
 if(d.t==='cmd'&&!pres){d.k==='next'?go(cur+1):go(cur-1)}};
document.addEventListener('click',e=>{const h=e.target.closest('.hot');if(h){openPanel(h.dataset.open);return}
 if(e.target.closest('.panel')){closePanel()}});
document.addEventListener('keydown',e=>{
 const pres=document.body.classList.contains('presenter');
 if(['ArrowRight','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();pres?(bc&&bc.postMessage({t:'cmd',k:'next'})):go(cur+1)}
 else if(['ArrowLeft','PageUp','Backspace'].includes(e.key)){e.preventDefault();pres?(bc&&bc.postMessage({t:'cmd',k:'prev'})):go(cur-1)}
 else if(e.key==='Escape'){closePanel()}
 else if(e.key==='Home')go(0);else if(e.key==='End')go(slides.length-1);
 else if(e.key==='n'||e.key==='N')notesEl.classList.toggle('on');
 else if(e.key==='f'||e.key==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}
 else if(e.key==='p'||e.key==='P'){window.open(location.pathname+'?presenter=1','hnvpres','width=900,height=760')}
 else if(e.key==='r'||e.key==='R'){const i=slides.findIndex(s=>s.classList.contains('reserve'));if(i>=0)go(i)}
 else if(/^[1-6]$/.test(e.key)){const h=slides[cur].querySelectorAll('.hot')[+e.key-1];if(h)openPanel(h.dataset.open)}});
const h=parseInt(location.hash.slice(1));go(isNaN(h)?0:h-1);
if(P.has('open')){const h2=slides[cur].querySelectorAll('.hot')[+P.get('open')-1];if(h2)openPanel(h2.dataset.open)}
})();
