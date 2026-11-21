/* ---- xem project ---- */
const sh=$('#sheet');gl(sh,26,60);gl($('#x'),14,26);
function openP(p,t){curT=t;const zip=p.repo?`https://github.com/${esc(p.repo)}/archive/refs/heads/${esc(p.branch||'main')}.zip`:'';
const L=(u,txt)=>`<a class="bt glass" target="_blank" rel="noopener" href="${esc(u)}">${txt}</a>`;
$('.sb',sh).innerHTML=`<h1>${esc(p.name)}</h1><div class="acts">${p.pages?L(p.pages,'Mở trang'):''}${p.repo?L('https://github.com/'+p.repo,'GitHub')+L(zip,'Tải ZIP'):''}${adm?'<button class="bt glass" id="ed">Sửa</button><button class="bt glass" id="dl">Xóa</button>':''}</div>${(p.shots||[]).length?'<div class="gal">'+p.shots.map(u=>`<img src="${esc(u)}" alt="" loading="lazy">`).join('')+'</div>':''}<div class="md">${md(p.desc||'')}</div>`;
sh.querySelectorAll('.sb .bt').forEach(b=>gl(b,12,24));
if(adm){$('#ed').onclick=()=>form(p);$('#dl').onclick=()=>dlg('Xóa "'+esc(p.name)+'"?','',async()=>{await save(j=>{j.projects=j.projects.filter(x=>x.id!==p.id)});closeP(true);return true},'Xóa')}
const a=t.getBoundingClientRect();sh.style.display='flex';const b=sh.getBoundingClientRect();
sh.style.transformOrigin='0 0';sh.style.transition='none';sh.style.opacity='0';sh.style.transform=`translate(${a.left-b.left}px,${a.top-b.top}px) scale(${a.width/b.width},${a.height/b.height})`;
sh.offsetWidth;sh.style.transition='transform .6s cubic-bezier(.2,.9,.2,1),opacity .3s';sh.style.opacity='1';sh.style.transform='none'}
function closeP(fast){if(sh.style.display!=='flex')return;const a=curT&&(curT.r||document.contains(curT))?curT.getBoundingClientRect():null,b=sh.getBoundingClientRect();
if(a&&!fast)sh.style.transform=`translate(${a.left-b.left}px,${a.top-b.top}px) scale(${a.width/b.width},${a.height/b.height})`;sh.style.opacity='0';setTimeout(()=>sh.style.display='none',fast?0:500)}
$('#x').onclick=()=>closeP();addEventListener('keydown',e=>{if(e.key==='Escape')closeP()});
/* ---- hộp thoại ---- */
function dlg(t,body,go,ok='Lưu'){const o=mk('div','ov'),d=mk('form','dg glass',`<h2>${t}</h2>${body}<div class="acts"><button type="button" class="bt glass x">Hủy</button><button class="bt glass">${ok}</button></div><p class="er"></p>`);
o.append(d);document.body.append(o);d.querySelectorAll('.bt').forEach(b=>gl(b,12,24));gl(d,24,50);const er=$('.er',d);$('.x',d).onclick=()=>o.remove();
d.onsubmit=async e=>{e.preventDefault();er.textContent='Đang xử lý…';try{if(await go(d))o.remove();else er.textContent=''}catch(x){er.textContent=x.message}};const f=$('input,textarea',d);if(f)f.focus()}
