const FS=`#version 300 es
precision highp float;
uniform vec2 uRes,uOff,uM;uniform float uT,uS,uN,uP,uCols,uRows,uL;uniform sampler2D uA;out vec4 o;
vec2 CS(){return vec2(300.,390.)*uS;}
vec2 HS(){return vec2(120.,155.)*uS;}
float sdb(vec2 q,vec2 h,float r){vec2 d=abs(q)-h+r;return length(max(d,0.))+min(max(d.x,d.y),0.)-r;}
float cellAt(vec2 p,out vec2 q){vec2 C=CS();float cx=floor(p.x/C.x),yo=mod(cx,2.)*.5*C.y,cy=floor((p.y-yo)/C.y);q=p-vec2((cx+.5)*C.x,(cy+.5)*C.y+yo);return mod(cx+3.*cy,uP);}
float F(float d){return 1.-smoothstep(-1.,1.,d);}
mat2 rot(float a){return mat2(cos(a),sin(a),-sin(a),cos(a));}
float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1.,0.)),f.x),mix(hs(i+vec2(0.,1.)),hs(i+vec2(1.,1.)),f.x),f.y);}
float fb(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*vn(p);p=p*2.03+vec2(17.3,9.1);a*=.5;}return s;}
float ht(vec2 b){return clamp((fb(b*.0021+vec2(uT*.012,-uT*.008))-.22)*2.4,0.,.999);}
vec3 pal(float i){vec3 c=vec3(.078,.188,.231);
c=i>.5?vec3(.106,.29,.341):c;c=i>1.5?vec3(.165,.416,.424):c;c=i>2.5?vec3(.31,.549,.502):c;c=i>3.5?vec3(.561,.702,.604):c;
c=i>4.5?vec3(.788,.824,.706):c;c=i>5.5?vec3(.914,.89,.784):c;c=i>6.5?vec3(.957,.937,.863):c;return c;}
vec3 bg(vec2 p){vec2 b=(p-uOff*.65)/uS;float e=1.5,h0=ht(b);
float L=h0*8.,g=length(vec2(ht(b+vec2(e,0.))-h0,ht(b+vec2(0.,e))-h0))*8./e+1e-4;
float fr=fract(L),d=min(fr,1.-fr)/g,band=floor(L),ln=fr<.5?band:band+1.,w=mod(ln,4.)<.5?1.7:.75;
return mix(pal(band),vec3(.05,.12,.15),(1.-smoothstep(w-.6,w+.6,d))*.65);}
vec3 scene(vec2 p){vec3 c=bg(p);if(uN<1.)return c;vec2 q;float i=cellAt(p,q);if(i>=uN)return c;vec2 h=HS();float R=30.*uS,sd=sdb(q,h,R);
c*=1.-.22*(1.-smoothstep(0.,24.*uS,sdb(q-vec2(0.,16.*uS),h,R)))*step(0.,sd);
vec2 u=clamp(q/(2.*h)+.5,.01,.99);vec2 tl=vec2(mod(i,uCols),floor(i/uCols));
vec3 t=textureLod(uA,(tl+u)/vec2(uCols,uRows),0.).rgb;return mix(t,c,smoothstep(-1.,1.,sd));}
vec3 gs(vec2 p){vec2 q;float ci=cellAt(p,q);if(ci>=uN)return scene(p);vec2 h=HS();float R=30.*uS,bz=28.*uS,sd=sdb(q,h,R);
if(sd>0.||sd<-bz)return scene(p);
float m=pow(1.+sd/bz,2.);vec2 e=vec2(1.,0.);
vec2 n=normalize(vec2(sdb(q+e.xy,h,R)-sdb(q-e.xy,h,R),sdb(q+e.yx,h,R)-sdb(q-e.yx,h,R))+1e-5);
float s=bz*.95*m;vec3 c=vec3(scene(p-n*s*.92).r,scene(p-n*s).g,scene(p-n*s*1.08).b);
float lt=max(dot(n,normalize(vec2(-.7,-.8))),0.),dk=max(dot(n,normalize(vec2(.7,.8))),0.);
c+=pow(lt,3.)*m*.6;c*=1.-.16*dk*dk*m;c=mix(c,vec3(1.),.55*(1.-smoothstep(0.,1.5*uS,-sd)));return c;}
void main(){vec2 f=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);vec3 c;vec2 d=f-uM;float L=length(d),R=uL;
if(R>0.&&L<R+1.5){float t=L/R,k=.62+.38*t*t,e=smoothstep(.55,1.,t);
vec2 b=uOff+uM;c=vec3(gs(b+d*k*(1.-.10*e)).r,gs(b+d*k*(1.-.16*e)).g,gs(b+d*k*(1.-.22*e)).b);
vec2 n=d/max(L,1.);c+=pow(max(dot(n,normalize(vec2(-.7,-.8))),0.),3.)*smoothstep(.8,1.,t)*.5;
c=mix(c,vec3(1.),.5*(1.-smoothstep(0.,1.6*uS,abs(L-R+1.))));
c=mix(gs(uOff+f),c,1.-smoothstep(R-1.,R+1.,L));}
else c=gs(uOff+f);o=vec4(c,1.);}`;
