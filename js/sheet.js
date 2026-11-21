/* ---- xem project: tấm nở ra từ card, trình xem nhiều ảnh, phóng toàn màn hình ---- */
const sh=$('#sheet'),scrim=$('#scrim'),B=document.body;let vw=null;
function openP(p,t){curT=t;const imgs=(p.shots||[]).length?p.shots:p.thumb?[p.thumb]:[];
const L=(u,txt,c='')=>`<a class="bt ${c}" target="_blank" rel="noopener" href="${esc(u)}">${txt}</a>`;
$('.sb',sh).innerHTML=`<header class="hd"><h1>${esc(p.name)}</h1><div class="acts">${p.pages?L(p.pages,'Mở trang','pri'):''}${p.repo?L('https://github.com/'+p.repo,'GitHub')+L(`https://github.com/${p.repo}/archive/HEAD.zip`,'Tải ZIP'):''}${adm?'<button class="bt" id="ed">Sửa</button><button class="bt" id="dl">Xóa</button>':''}</div></header>
${imgs.length?`<div class="vw"><div class="st"><div class="rail">${imgs.map(u=>`<div class="sl"><img src="${esc(src(u))}" alt="" draggable="false"></div>`).join('')}</div>
${imgs.length>1?'<button class="bt ic nv pv" aria-label="Trước">←</button><button class="bt ic nv nx" aria-label="Sau">→</button><span class="ct"></span>':''}<button class="bt ic fs" aria-label="Toàn màn hình">⤢</button></div>
${imgs.length>1?`<div class="th">${imgs.map((u,i)=>`<button aria-label="${i+1}"><img src="${esc(src(u))}" alt="" loading="lazy"></button>`).join('')}</div>`:''}</div>`:''}
${p.desc?`<div class="md">${md(p.desc)}</div>`:''}`;
if(adm){$('#ed').onclick=()=>form(p);$('#dl').onclick=()=>dlg('Xóa "'+esc(p.name)+'"?','',async()=>{await delP(p);closeP(true);return true},'Xóa')}
vw=imgs.length?viewer($('.vw',sh),imgs.length):null;
B.classList.add('open');sh.scrollTop=0;$('.sb',sh).scrollTop=0;
const a=t.getBoundingClientRect();sh.style.transition='none';sh.style.transform='none';sh.style.opacity='1';const b=sh.getBoundingClientRect();
sh.style.transform=`translate(${a.left-b.left}px,${a.top-b.top}px) scale(${a.width/b.width},${a.height/b.height})`;sh.style.borderRadius='60px';
sh.offsetWidth;sh.style.transition='';sh.style.transform='none';sh.style.borderRadius='';setTimeout(()=>$('#x').focus({preventScroll:true}),300)}
function closeP(fast){if(!B.classList.contains('open'))return;vw&&vw.full(false);const t=curT,a=!fast&&t&&document.contains(t)?t.getBoundingClientRect():null,b=sh.getBoundingClientRect();
if(a&&a.width)sh.style.transform=`translate(${a.left-b.left}px,${a.top-b.top}px) scale(${a.width/b.width},${a.height/b.height})`;sh.style.opacity='0';
B.classList.remove('open');setTimeout(()=>{if(!B.classList.contains('open'))sh.style.transform=''},fast?0:520)}
function viewer(v,n){const rail=$('.rail',v),st=$('.st',v),ct=$('.ct',v),th=[...v.querySelectorAll('.th button')];let i=0,d=null;
const set=(k,an=true)=>{i=(k+n)%n;rail.style.transition=an?'':'none';rail.style.transform=`translateX(${-i*100}%)`;if(ct)ct.textContent=`${i+1} / ${n}`;
th.forEach((b,j)=>b.classList.toggle('on',j===i));th[i]&&th[i].scrollIntoView({block:'nearest',inline:'center',behavior:an?'smooth':'auto'})};
const full=f=>{v.classList.toggle('full',f);B.classList.toggle('lb',f)};
$('.pv',v)&&($('.pv',v).onclick=()=>set(i-1));$('.nx',v)&&($('.nx',v).onclick=()=>set(i+1));$('.fs',v).onclick=()=>full(!v.classList.contains('full'));
th.forEach((b,j)=>b.onclick=()=>set(j));
const im=$('img',rail);im.onload=()=>st.style.setProperty('--ar',im.naturalWidth/im.naturalHeight);if(im.complete&&im.naturalWidth)im.onload();
st.onpointerdown=e=>{if(e.target.closest('button'))return;d={x:e.clientX,m:false};st.setPointerCapture(e.pointerId)};
st.onpointermove=e=>{if(!d)return;const dx=e.clientX-d.x;if(Math.abs(dx)>6)d.m=true;if(d.m&&n>1){rail.style.transition='none';rail.style.transform=`translateX(calc(${-i*100}% + ${dx}px))`}};
st.onpointerup=e=>{if(!d)return;const dx=e.clientX-d.x,m=d.m;d=null;if(!m){full(!v.classList.contains('full'));return}set(n>1&&Math.abs(dx)>50?i-Math.sign(dx):i)};
st.onpointercancel=()=>{d=null;set(i)};set(0,false);
return{step:k=>n>1&&set(i+k),full,isFull:()=>v.classList.contains('full')}}
$('#x').onclick=()=>closeP();scrim.onclick=()=>closeP();
addEventListener('keydown',e=>{if($('.ov')){if(e.key==='Escape')$('.ov').remove();return}if(!B.classList.contains('open'))return;
if(e.key==='Escape'){vw&&vw.isFull()?vw.full(false):closeP()}else if(vw&&e.key==='ArrowRight')vw.step(1);else if(vw&&e.key==='ArrowLeft')vw.step(-1)});
/* ---- hộp thoại ---- */
function dlg(t,body,go,ok='Lưu'){const o=mk('div','ov'),d=mk('form','dg',`<h2>${t}</h2>${body}<div class="acts end"><button type="button" class="bt x">Hủy</button><button class="bt pri">${ok}</button></div><p class="er" role="alert"></p>`);
o.append(d);B.append(o);const er=$('.er',d),sb=$('.pri',d);$('.x',d).onclick=()=>o.remove();o.onpointerdown=e=>{if(e.target===o)o.remove()};
d.onsubmit=async e=>{e.preventDefault();if(sb.disabled)return;sb.disabled=true;er.textContent='Đang xử lý…';try{if(await go(d))o.remove();else er.textContent=''}catch(x){er.textContent=x.message}sb.disabled=false};
const f=$('input:not([type=file]):not([type=checkbox]),textarea',d);if(f)f.focus();return d}
