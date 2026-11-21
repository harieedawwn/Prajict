/* ---- lưới kính lỏng vô tận: WebGL2, khúc xạ thật + tán sắc (chạy cả Safari/Firefox) ---- */
let render=()=>{};const cv=$('#cv'),G=cv.getContext('webgl2',{antialias:false});
if(G){
const cs=(t,s)=>{const x=G.createShader(t);G.shaderSource(x,s);G.compileShader(x);if(!G.getShaderParameter(x,G.COMPILE_STATUS))throw Error(G.getShaderInfoLog(x));return x};
const pg=G.createProgram();G.attachShader(pg,cs(G.VERTEX_SHADER,'#version 300 es\nvoid main(){vec2 v=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(v*2.-1.,0.,1.);}'));G.attachShader(pg,cs(G.FRAGMENT_SHADER,FS));G.linkProgram(pg);G.useProgram(pg);
const U=n=>G.getUniformLocation(pg,n),tex=G.createTexture(),TW=192,TH=240,at=mk('canvas'),ac=at.getContext('2d'),fine=matchMedia('(pointer:fine)').matches;
let cols=1,rows=1,N=0,PR=8,ut,dpr=1,S=1,dn=null,inside=false;const off={x:0,y:0},vel={x:0,y:0},M={x:-999,y:-999,sx:-999,sy:-999};
const fit=()=>{dpr=Math.min(devicePixelRatio||1,1.5);S=(innerWidth<600?.78:1)*dpr;cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;G.viewport(0,0,cv.width,cv.height)};
const upload=()=>{G.bindTexture(G.TEXTURE_2D,tex);G.texImage2D(G.TEXTURE_2D,0,G.RGBA,G.RGBA,G.UNSIGNED_BYTE,at);for(const[k,v]of[[G.TEXTURE_MIN_FILTER,G.LINEAR],[G.TEXTURE_MAG_FILTER,G.LINEAR],[G.TEXTURE_WRAP_S,G.CLAMP_TO_EDGE],[G.TEXTURE_WRAP_T,G.CLAMP_TO_EDGE]])G.texParameteri(G.TEXTURE_2D,k,v)};
function tile(p,i,im){const x=(i%cols)*TW,y=Math.floor(i/cols)*TH;ac.save();ac.beginPath();ac.rect(x,y,TW,TH);ac.clip();ac.fillStyle=COLS[i%COLS.length];ac.fillRect(x,y,TW,TH);
if(im){const k=Math.max(TW/im.width,TH/im.height),w=im.width*k,h=im.height*k;ac.drawImage(im,x+(TW-w)/2,y+(TH-h)/2,w,h)}
else{ac.fillStyle='rgba(255,255,255,.92)';ac.font='800 110px "Bricolage Grotesque","Segoe UI",sans-serif';ac.textAlign='center';ac.fillText((p.name||'?')[0].toUpperCase(),x+TW/2,y+TH/2+30)}
ac.font='700 17px "Bricolage Grotesque","Segoe UI",sans-serif';let s=p.name||'';while(ac.measureText(s).width>TW-84&&s.length>1)s=s.slice(0,-1);if(s!==p.name)s+='…';
const w=ac.measureText(s).width+28,px=x+(TW-w)/2,py=y+TH-74;ac.fillStyle='rgba(19,24,29,.58)';ac.beginPath();ac.roundRect?ac.roundRect(px,py,w,40,20):ac.rect(px,py,w,40);ac.fill();
ac.fillStyle='#fff';ac.textAlign='center';ac.fillText(s,x+TW/2,py+26);ac.restore()}
function atlas(){N=Math.min(P.length,64);PR=Math.max(N,8);cols=Math.max(1,Math.ceil(Math.sqrt(N)));rows=Math.max(1,Math.ceil(N/cols));at.width=cols*TW;at.height=rows*TH;
P.slice(0,N).forEach((p,i)=>tile(p,i,null));upload();P.slice(0,N).forEach((p,i)=>{if(!p.thumb)return;const im=new Image();im.onload=()=>{tile(p,i,im);clearTimeout(ut);ut=setTimeout(upload,60)};im.src=p.thumb})}
render=()=>{fit();atlas();};
document.fonts&&document.fonts.load('700 19px "Bricolage Grotesque"').then(()=>P.length&&atlas());
const pt=e=>({x:e.clientX*dpr,y:e.clientY*dpr});
function hit(p){if(!N)return;const wx=p.x+off.x,wy=p.y+off.y,Cx=300*S,Cy=390*S,cx=Math.floor(wx/Cx),yo=(((cx%2)+2)%2)*.5*Cy,cy=Math.floor((wy-yo)/Cy),ox=(cx+.5)*Cx,oy=(cy+.5)*Cy+yo,hx=120*S,hy=155*S;
if(Math.abs(wx-ox)>hx||Math.abs(wy-oy)>hy)return;const r=new DOMRect((ox-off.x-hx)/dpr,(oy-off.y-hy)/dpr,2*hx/dpr,2*hy/dpr);const k=(((cx+3*cy)%PR)+PR)%PR;if(k<N)openP(P[k],{r:1,getBoundingClientRect:()=>r})}
cv.onpointerdown=e=>{const p=pt(e);dn={x:p.x,y:p.y,ox:off.x,oy:off.y,m:false,lx:p.x,ly:p.y};vel.x=vel.y=0;cv.setPointerCapture(e.pointerId);inside=true;M.x=p.x;M.y=p.y};
cv.onpointermove=e=>{const p=pt(e);M.x=p.x;M.y=p.y;inside=true;if(!dn)return;if(Math.hypot(p.x-dn.x,p.y-dn.y)>6*dpr)dn.m=true;
if(dn.m){off.x=dn.ox-(p.x-dn.x);off.y=dn.oy-(p.y-dn.y);vel.x=dn.lx-p.x;vel.y=dn.ly-p.y;dn.lx=p.x;dn.ly=p.y}};
cv.onpointerup=e=>{if(dn&&!dn.m)hit(pt(e));dn=null;if(e.pointerType==='touch')inside=false};
cv.onpointercancel=()=>{dn=null};cv.onpointerleave=()=>{if(!dn)inside=false};
cv.onwheel=e=>{off.x+=e.deltaX*dpr;off.y+=e.deltaY*dpr;vel.x=vel.y=0};onresize=fit;
const frame=t=>{requestAnimationFrame(frame);if(document.hidden)return;if(!dn||!dn.m){off.x+=vel.x;off.y+=vel.y;vel.x*=.94;vel.y*=.94}
M.sx+=(M.x-M.sx)*.35;M.sy+=(M.y-M.sy)*.35;const open=$('#sheet').style.display==='flex'||$('.ov'),L=!open&&inside&&(fine||dn)?(fine?84:64)*S:0;
G.uniform2f(U('uRes'),cv.width,cv.height);G.uniform2f(U('uOff'),off.x,off.y);G.uniform2f(U('uM'),M.sx,M.sy);G.uniform1f(U('uT'),t/1000);G.uniform1f(U('uS'),S);
G.uniform1f(U('uN'),N);G.uniform1f(U('uP'),PR);G.uniform1f(U('uCols'),cols);G.uniform1f(U('uRows'),rows);G.uniform1f(U('uL'),L);G.uniform1i(U('uA'),0);G.drawArrays(G.TRIANGLES,0,3)};
requestAnimationFrame(frame)}else document.body.insertAdjacentHTML('beforeend','<p style="position:fixed;inset:45% 0 auto;text-align:center">Trình duyệt chưa hỗ trợ WebGL2.</p>');
