/* ---- mật khẩu + token mã hóa bằng chính mật khẩu ---- */
const E=new TextEncoder(),b64=u=>btoa(String.fromCharCode(...u)),ub=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0)),hex=u=>[...u].map(x=>x.toString(16).padStart(2,'0')).join('');
const base=pw=>crypto.subtle.importKey('raw',E.encode(pw),'PBKDF2',false,['deriveBits','deriveKey']);
const hx=async pw=>hex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:E.encode('hd-pf-v1'),iterations:200000,hash:'SHA-256'},await base(pw),256)));
const ak=async pw=>crypto.subtle.deriveKey({name:'PBKDF2',salt:E.encode('hd-tk-v1'),iterations:200000,hash:'SHA-256'},await base(pw),{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
async function putTok(pw,t){const iv=crypto.getRandomValues(new Uint8Array(12)),ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},await ak(pw),E.encode(t));localStorage.tk=b64(iv)+'.'+b64(new Uint8Array(ct))}
async function getTok(pw){try{const[i,c]=localStorage.tk.split('.');return new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:ub(i)},await ak(pw),ub(c)))}catch{return null}}
$('#sec').onclick=()=>{if(adm)return;dlg('Đăng nhập',`<input id="pw" type="password" placeholder="Mật khẩu" autocomplete="current-password"><input id="tk" placeholder="Token GitHub" autocomplete="off">`,async d=>{
const pw=$('#pw',d).value;if(await hx(pw)!==HASH)throw Error('Sai mật khẩu');let t=await getTok(pw);const nt=$('#tk',d).value.trim();
if(nt){t=nt;await putTok(pw,t)}if(!t)throw Error('Cần token GitHub');TOK=t;adm=true;document.body.classList.add('adm');return true},'Vào')};
$('#out').onclick=()=>{adm=false;TOK=null;document.body.classList.remove('adm');closeP(true)};
/* ---- ghi dữ liệu thẳng vào repo bằng GitHub API ---- */
async function gh(path,m='GET',b){const r=await fetch(`https://api.github.com/repos/${O}/${R}/contents/${path}${m==='GET'?'?ref='+BR:''}`,{method:m,headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github+json'},body:b?JSON.stringify({...b,branch:BR}):undefined});
if(!r.ok)throw Error('GitHub '+r.status+': '+((await r.json().catch(()=>({}))).message||''));return r.json()}
async function save(fn){const f=await gh('data/projects.json'),j=JSON.parse(new TextDecoder().decode(ub(f.content.replace(/\n/g,''))));fn(j);
await gh('data/projects.json','PUT',{message:'Cập nhật projects',content:b64(E.encode(JSON.stringify(j,null,1))),sha:f.sha});P=j.projects;render()}
async function up(id,file,max,tag){const bm=await createImageBitmap(file),k=Math.min(1,max/Math.max(bm.width,bm.height)),c=mk('canvas');c.width=Math.round(bm.width*k);c.height=Math.round(bm.height*k);
c.getContext('2d').drawImage(bm,0,0,c.width,c.height);const data=c.toDataURL('image/jpeg',.82).split(',')[1],path=`images/${id}/${tag}-${Date.now()}.jpg`;
await gh(path,'PUT',{message:'Thêm ảnh',content:data});return path}
function form(p){const n=!p;p=p||{};dlg(n?'Thêm project':'Sửa project',`<input id="fn" placeholder="Tên" value="${esc(p.name||'')}"><input id="fr" placeholder="Repo (ten/repo)" value="${esc(p.repo||'')}"><input id="fp" placeholder="Link github.io" value="${esc(p.pages||'')}"><textarea id="fd" rows="7" placeholder="Mô tả (Markdown)">${esc(p.desc||'')}</textarea><label>Thumbnail<input id="ft" type="file" accept="image/*"></label><label>Ảnh preview<input id="fs" type="file" accept="image/*" multiple></label>`,async d=>{
const name=$('#fn',d).value.trim();if(!name)throw Error('Cần nhập tên');const id=p.id||name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'-'+Date.now().toString(36);
const o={...p,id,name,repo:$('#fr',d).value.trim().replace(/^https?:\/\/github\.com\//,'').replace(/\/$/,''),pages:$('#fp',d).value.trim(),desc:$('#fd',d).value};
const tf=$('#ft',d).files[0],sf=[...$('#fs',d).files];if(tf)o.thumb=await up(id,tf,800,'thumb');
if(sf.length){o.shots=[...(o.shots||[])];for(const f of sf)o.shots.push(await up(id,f,1600,Math.random().toString(36).slice(2,7)))}
await save(j=>{const i=j.projects.findIndex(x=>x.id===id);if(i<0)j.projects.unshift(o);else j.projects[i]=o});closeP(true);return true})}
$('#add').onclick=()=>form();
