/* ---- mật khẩu (PBKDF2) + token mã hóa AES-GCM; "ghi nhớ" = khóa không xuất được trong IndexedDB ---- */
const E=new TextEncoder(),D=new TextDecoder(),ub=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0)),hex=u=>[...u].map(x=>x.toString(16).padStart(2,'0')).join('');
const b64=u=>{let s='';for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode(...u.subarray(i,i+32768));return btoa(s)};
const base=pw=>crypto.subtle.importKey('raw',E.encode(pw),'PBKDF2',false,['deriveBits','deriveKey']);
const hx=async pw=>hex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:E.encode('hd-pf-v1'),iterations:200000,hash:'SHA-256'},await base(pw),256)));
const ak=async pw=>crypto.subtle.deriveKey({name:'PBKDF2',salt:E.encode('hd-tk-v1'),iterations:200000,hash:'SHA-256'},await base(pw),{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
async function putTok(pw,t){const iv=crypto.getRandomValues(new Uint8Array(12)),ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},await ak(pw),E.encode(t));localStorage.tk=b64(iv)+'.'+b64(new Uint8Array(ct))}
async function getTok(pw){try{const[i,c]=localStorage.tk.split('.');return D.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:ub(i)},await ak(pw),ub(c)))}catch{return null}}
const idb=(m,v)=>new Promise((ok,no)=>{const r=indexedDB.open('kho',1);r.onupgradeneeded=()=>r.result.createObjectStore('k');r.onerror=()=>no(r.error);
r.onsuccess=()=>{const s=r.result.transaction('k',m==='get'?'readonly':'readwrite').objectStore('k'),q=m==='get'?s.get('a'):m==='del'?s.delete('a'):s.put(v,'a');q.onsuccess=()=>ok(q.result);q.onerror=()=>no(q.error)}});
async function remember(t){const k=await crypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']),iv=crypto.getRandomValues(new Uint8Array(12));
await idb('put',{k,iv,c:await crypto.subtle.encrypt({name:'AES-GCM',iv},k,E.encode(t))})}
async function recall(){try{const a=await idb('get');return a?D.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:a.iv},a.k,a.c)):null}catch{return null}}
async function check(t){const r=await fetch(`https://api.github.com/repos/${O}/${R}`,{headers:{Authorization:'Bearer '+t,Accept:'application/vnd.github+json'},cache:'no-store'});
if(r.status===401)throw Error('Token hết hạn hoặc sai');if(!r.ok)throw Error('GitHub '+r.status);const j=await r.json();if(j.permissions&&!j.permissions.push)throw Error('Token không có quyền ghi')}
const enter=t=>{TOK=t;adm=true;B.classList.add('adm')};
$('#sec').onclick=async()=>{if(adm)return;const t=await recall();if(t){try{await check(t);return enter(t)}catch{}}
dlg('Đăng nhập',`<input id="pw" type="password" placeholder="Mật khẩu" autocomplete="current-password"><input id="tk" type="password" placeholder="${localStorage.tk?'Token GitHub (đã lưu)':'Token GitHub'}" autocomplete="off"><label class="ck"><input id="rm" type="checkbox" checked> Ghi nhớ máy này</label>`,async d=>{
const pw=$('#pw',d).value;if(await hx(pw)!==HASH)throw Error('Sai mật khẩu');const nt=$('#tk',d).value.trim(),t=nt||await getTok(pw);if(!t)throw Error('Cần token GitHub');
await check(t);if(nt)await putTok(pw,t);if($('#rm',d).checked)await remember(t);enter(t);return true},'Vào')};
$('#out').onclick=()=>{adm=false;TOK=null;B.classList.remove('adm');closeP(true)};
$('#fg').onclick=async()=>{await idb('del').catch(()=>{});$('#out').onclick()};
/* ---- ghi vào repo: mọi thay đổi gom thành MỘT commit (Git Data API) ---- */
async function api(p,m='GET',b){const r=await fetch(`https://api.github.com/repos/${O}/${R}/${p}`,{method:m,cache:'no-store',headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github+json'},body:b?JSON.stringify(b):undefined});
if(!r.ok)throw Error('GitHub '+r.status+': '+((await r.json().catch(()=>({}))).message||''));return r.json()}
async function commit(msg,files,fn){const ent=Object.entries(files);
const blobs=await Promise.all(ent.filter(e=>e[1]).map(async([path,c])=>({path,mode:'100644',type:'blob',sha:(await api('git/blobs','POST',{content:c,encoding:'base64'})).sha})));
for(let n=0;;n++){const head=(await api('git/ref/heads/'+BR)).object.sha,base=(await api('git/commits/'+head)).tree.sha;
const f=await api('contents/data/projects.json?ref='+head),j=JSON.parse(D.decode(ub(f.content.replace(/\n/g,''))));fn(j);
const jb=(await api('git/blobs','POST',{content:b64(E.encode(JSON.stringify(j,null,1)+'\n')),encoding:'base64'})).sha;
const tree=(await api('git/trees','POST',{base_tree:base,tree:[...blobs,{path:'data/projects.json',mode:'100644',type:'blob',sha:jb},...ent.filter(e=>!e[1]).map(([path])=>({path,mode:'100644',type:'blob',sha:null}))]})).sha;
const c=(await api('git/commits','POST',{message:msg,tree,parents:[head]})).sha;
try{await api('git/refs/heads/'+BR,'PATCH',{sha:c});P=j.projects;render();return}catch(e){if(n>1)throw e}}}
/* ảnh: thu nhỏ, nền trắng cho PNG trong suốt, JPEG */
async function enc(file,max){const bm=await createImageBitmap(file),k=Math.min(1,max/Math.max(bm.width,bm.height)),c=mk('canvas');c.width=Math.round(bm.width*k);c.height=Math.round(bm.height*k);
const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.imageSmoothingQuality='high';x.drawImage(bm,0,0,c.width,c.height);
const u=c.toDataURL('image/jpeg',.88);return{u,b:u.split(',')[1],a:+(c.width/c.height).toFixed(4)}}
const rid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);
async function delP(p){const files={};[p.thumb,...(p.shots||[])].filter(Boolean).forEach(u=>files[u]=null);await commit('Xóa '+p.name,files,j=>{j.projects=j.projects.filter(x=>x.id!==p.id)})}
function form(p){const n=!p;p=p||{};let keep=[...(p.shots||[])],add=[],tf=null;
const d=dlg(n?'Thêm project':'Sửa project',`<input id="fn" placeholder="Tên" value="${esc(p.name||'')}" required><input id="fr" placeholder="Repo (ten/repo)" value="${esc(p.repo||'')}"><input id="fp" placeholder="Link github.io" value="${esc(p.pages||'')}"><textarea id="fd" rows="6" placeholder="Mô tả (Markdown)">${esc(p.desc||'')}</textarea>
<div class="up"><label class="tp"><img id="ti" alt=""${p.thumb?` src="${esc(src(p.thumb))}"`:''}><span>Thumbnail</span><input id="ft" type="file" accept="image/*"></label></div>
<div class="sg" id="sg"></div>`,async d=>{
const name=$('#fn',d).value.trim();if(!name)throw Error('Cần nhập tên');
const id=p.id||name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'-'+Date.now().toString(36);
const o={...p,id,name,repo:$('#fr',d).value.trim().replace(/^https?:\/\/github\.com\//,'').replace(/(\.git)?\/?$/,''),pages:$('#fp',d).value.trim(),desc:$('#fd',d).value},files={};
if(tf){const m=await enc(tf,1600),path=`images/${id}/thumb-${rid()}.jpg`;files[path]=m.b;LOCAL[path]=m.u;o.ta=m.a;if(p.thumb)files[p.thumb]=null;o.thumb=path}
(p.shots||[]).filter(u=>!keep.includes(u)).forEach(u=>files[u]=null);
const np=[];for(const f of add){const m=await enc(f,2000),path=`images/${id}/${rid()}.jpg`;files[path]=m.b;LOCAL[path]=m.u;np.push(path)}o.shots=[...keep,...np];
await commit((n?'Thêm ':'Sửa ')+name,files,j=>{const i=j.projects.findIndex(x=>x.id===id);if(i<0)j.projects.unshift(o);else j.projects[i]=o});closeP(true);return true});
$('#ft',d).onchange=e=>{tf=e.target.files[0];if(tf)$('#ti',d).src=URL.createObjectURL(tf)};
const sg=$('#sg',d),draw=()=>{sg.innerHTML=keep.map((u,i)=>`<span><img src="${esc(src(u))}" alt=""><button type="button" data-k="${i}" aria-label="Bỏ">✕</button></span>`).join('')+add.map((f,i)=>`<span class="nw"><img src="${f._u}" alt=""><button type="button" data-a="${i}" aria-label="Bỏ">✕</button></span>`).join('')+'<label class="ad">+<input type="file" accept="image/*" multiple></label>';
sg.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(b.dataset.k!=null)keep.splice(+b.dataset.k,1);else add.splice(+b.dataset.a,1);draw()});
$('input',sg).onchange=e=>{for(const f of e.target.files){f._u=URL.createObjectURL(f);add.push(f)}draw()}};draw()}
$('#add').onclick=()=>form();
