/* ---- project nằm trên một cung cong trôi qua bản đồ; kéo / cuộn / phím mũi tên ---- */
const cv=$('#cv'),stage=$('#stage'),track=$('#track'),fine=matchMedia('(pointer:fine)').matches;
let cards=[],X=[],S=0,tgt=0,lastS=0,dn=null,snapT,act=-1,W=innerWidth,H=innerHeight,ARC=1800;
const M={x:-999,y:-999,sx:-999,sy:-999,on:false},isOpen=()=>document.body.classList.contains('open');

function size(a){const h0=H<500?H*.42:W<600?clamp(H*.3,150,260):clamp(H*.44,200,500),A=h0*h0*1.45;let w=Math.sqrt(A*a),h=Math.sqrt(A/a);
const k=Math.min(1,W*(W<700?.74:.62)/w,H*(H<500?.6:.56)/h);return[w*k,h*k]}
function layout(){W=innerWidth;H=innerHeight;ARC=Math.max(W,900)*1.5;const gap=W<600?22:Math.max(36,W*.05);let x=0;
X=cards.map((c,i)=>{const[w,h]=size(c._p.ta||1.6);c._w=w;c._h=h;c.style.width=w+'px';c.style.height=h+'px';if(i)x+=cards[i-1]._w/2+gap+w/2;return x});
S=tgt=clamp(tgt,X[0]||0,X[X.length-1]||0);dirty=true}
function card(p,i){const c=mk('button','card');c._p=p;c.style.setProperty('--d',i*70+'ms');c.setAttribute('aria-label',p.name);
c.innerHTML=`<span class="ph"><img alt="" draggable="false" decoding="async"></span><span class="nm">${esc(p.name)}</span>`;
const im=$('img',c);if(p.thumb){im.onload=()=>{c.classList.add('ok');if(!p.ta){p.ta=im.naturalWidth/im.naturalHeight;layout()}};im.onerror=()=>c.classList.add('ok','no');im.src=src(p.thumb)}
else c.classList.add('ok','no'),0;$('.ph',c).dataset.l=(p.name||'?')[0].toUpperCase();return c}
function render(){track.textContent='';cards=P.map(card);track.append(...cards);act=-1;layout();if(cards.length)tgt=S=clamp(S,X[0],X[X.length-1])}
const near=v=>{let b=0;X.forEach((x,i)=>{if(Math.abs(x-v)<Math.abs(X[b]-v))b=i});return b};
const go=i=>{if(!X.length)return;tgt=X[clamp(i,0,X.length-1)]};
const settle=()=>{clearTimeout(snapT);snapT=setTimeout(()=>{if(!dn)go(near(tgt))},140)};
const lim=v=>{if(!X.length)return 0;const a=X[0],b=X[X.length-1];return v<a?a-(a-v)*.3:v>b?b+(v-b)*.3:v};

stage.onpointerdown=e=>{if(e.button)return;dn={x:e.clientX,s:tgt,c:e.target.closest('.card'),m:false,v:0,lx:e.clientX,lt:e.timeStamp};stage.setPointerCapture(e.pointerId);clearTimeout(snapT)};
stage.onpointermove=e=>{if(!dn)return;const dx=e.clientX-dn.x;if(Math.abs(dx)>6)dn.m=true;
if(dn.m){stage.classList.add('drag');tgt=S=lim(dn.s-dx);const dt=Math.max(1,e.timeStamp-dn.lt);dn.v=.8*dn.v+.2*(dn.lx-e.clientX)/dt;dn.lx=e.clientX;dn.lt=e.timeStamp}};
stage.onpointerup=e=>{if(!dn)return;const d=dn;dn=null;stage.classList.remove('drag');
if(d.m){const i=near(tgt+d.v*260);go(i===near(tgt)&&Math.abs(d.v)>.35?i+Math.sign(d.v):i)}
else if(d.c){const i=cards.indexOf(d.c);if(i===act||Math.abs(X[i]-S)<40)openP(d.c._p,$('.ph',d.c));else go(i)}};
stage.onpointercancel=()=>{dn=null;stage.classList.remove('drag');go(near(tgt))};
stage.onwheel=e=>{e.preventDefault();if(isOpen())return;const d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;tgt=lim(tgt+d*(e.deltaMode?40:1));settle()};
stage.onkeydown=e=>{const c=e.target.closest('.card');if(c&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openP(c._p,$('.ph',c))}};
stage.addEventListener('focusin',e=>{const c=e.target.closest('.card');if(c)go(cards.indexOf(c))});
addEventListener('keydown',e=>{if(isOpen()||$('.ov'))return;if(e.key==='ArrowRight')go(act+1);if(e.key==='ArrowLeft')go(act-1);if(e.key==='Enter'&&e.target===document.body&&cards[act])openP(P[act],$('.ph',cards[act]))});
addEventListener('pointermove',e=>{M.x=e.clientX;M.y=e.clientY;M.on=e.pointerType==='mouse'&&!e.target.closest('.card,button,a,#top')});
document.documentElement.addEventListener('pointerleave',()=>M.on=false);
let rzT;addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>{layout();fit();dirty=true},120)});

/* chỉ đặt lại transform khi có chuyển động (không tốn CPU lúc đứng yên) */
let dirty=true;
function place(){const v=S-lastS;if(!dirty&&Math.abs(v)<.02)return false;dirty=false;lastS=S;const sk=clamp(v*.12,-6,6);
cards.forEach((c,i)=>{const dx=X[i]-S;if(Math.abs(dx)>W*1.3+c._w){if(c._v!==0){c.style.visibility='hidden';c._v=0}return}
if(c._v!==1){c.style.visibility='';c._v=1}const a=dx/ARC,x=W/2+ARC*Math.sin(a),y=H*.52+ARC*(1-Math.cos(a)),s=1-Math.min(Math.abs(dx)/W,1)*.1;
c.style.transform=`translate3d(${(x-c._w/2).toFixed(1)}px,${(y-c._h/2).toFixed(1)}px,0) rotate(${a.toFixed(4)}rad) skewX(${sk.toFixed(2)}deg) scale(${s.toFixed(4)})`});
const n=X.length?near(S):-1;if(n!==act){cards[act]?.classList.remove('on');act=n;cards[act]?.classList.add('on')}return true}

/* ---- WebGL2 nền: độ phân giải thấp trên điện thoại, đứng yên thì chỉ vẽ ~12-24 hình/giây ---- */
const coarse=!fine,G=cv.getContext('webgl2',{antialias:false,alpha:false,depth:false,stencil:false,powerPreference:'low-power'});let fit=()=>{},Q=1,Ls=0,last=0,live=!!G;
if(G){const cs=(t,s)=>{const x=G.createShader(t);G.shaderSource(x,s);G.compileShader(x);if(!G.getShaderParameter(x,G.COMPILE_STATUS))throw Error(G.getShaderInfoLog(x));return x};
const pg=G.createProgram();G.attachShader(pg,cs(G.VERTEX_SHADER,'#version 300 es\nvoid main(){vec2 v=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(v*2.-1.,0.,1.);}'));G.attachShader(pg,cs(G.FRAGMENT_SHADER,FS));G.linkProgram(pg);G.useProgram(pg);
const U={};['uRes','uOff','uM','uT','uS','uL','uN'].forEach(n=>U[n]=G.getUniformLocation(pg,n));
const nz=new Uint8Array(65536);crypto.getRandomValues(nz);G.bindTexture(G.TEXTURE_2D,G.createTexture());G.pixelStorei(G.UNPACK_ALIGNMENT,1);
G.texImage2D(G.TEXTURE_2D,0,G.R8,256,256,0,G.RED,G.UNSIGNED_BYTE,nz);for(const k of[G.TEXTURE_MIN_FILTER,G.TEXTURE_MAG_FILTER])G.texParameteri(G.TEXTURE_2D,k,G.LINEAR);
for(const k of[G.TEXTURE_WRAP_S,G.TEXTURE_WRAP_T])G.texParameteri(G.TEXTURE_2D,k,G.REPEAT);G.uniform1i(U.uN,0);
fit=()=>{Q=coarse?Math.min(devicePixelRatio||1,1):Math.min(devicePixelRatio||1,1.25);cv.width=Math.round(innerWidth*Q);cv.height=Math.round(innerHeight*Q);G.viewport(0,0,cv.width,cv.height)};fit();
cv.addEventListener('webglcontextlost',e=>{e.preventDefault();live=false;cv.style.background='#2a6a6c'});
var draw=t=>{M.sx+=(M.x-M.sx)*.3;M.sy+=(M.y-M.sy)*.3;Ls+=((fine&&M.on&&!dn?78:0)-Ls)*.18;if(Ls<.5)Ls=0;const s=(innerWidth<600?.78:1)*Q;
G.uniform2f(U.uRes,cv.width,cv.height);G.uniform2f(U.uOff,S*.45*Q,0);G.uniform2f(U.uM,M.sx*Q,M.sy*Q);G.uniform1f(U.uT,t/1000);G.uniform1f(U.uS,s);G.uniform1f(U.uL,Ls*s);G.drawArrays(G.TRIANGLES,0,3)}}
else cv.style.background='#2a6a6c';
const frame=t=>{requestAnimationFrame(frame);if(document.hidden||isOpen())return;if(!dn)S+=(tgt-S)*.14;const mv=place()||dn;
const busy=mv||Ls>0||Math.abs(M.x-M.sx)>.5||Math.abs(M.y-M.sy)>.5;
if(live&&(busy||t-last>(coarse?80:40))){last=t;draw(t)}};
requestAnimationFrame(frame);
