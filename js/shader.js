/* ---- nền: bản đồ đồng mức trôi chậm + thấu kính theo chuột ----
   noise = texture 256² (không dùng hash sin: GPU điện thoại thiếu chính xác -> vỡ thành ô vuông)
   đường đồng mức dùng fwidth (1 lần tính độ cao / pixel thay vì 3) */
const FS=`#version 300 es
precision highp float;
uniform vec2 uRes,uOff,uM;uniform float uT,uS,uL;uniform sampler2D uN;out vec4 o;
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return texture(uN,(i+f+.5)/256.).r;}
float fb(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*vn(p);p=p*2.03+vec2(17.3,9.1);a*=.5;}return s;}
vec3 pal(float i){vec3 c=vec3(.078,.188,.231);
c=i>.5?vec3(.106,.29,.341):c;c=i>1.5?vec3(.165,.416,.424):c;c=i>2.5?vec3(.31,.549,.502):c;c=i>3.5?vec3(.561,.702,.604):c;
c=i>4.5?vec3(.788,.824,.706):c;c=i>5.5?vec3(.914,.89,.784):c;c=i>6.5?vec3(.957,.937,.863):c;return c;}
void main(){vec2 f=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y),d=f-uM;float r=length(d),R=max(uL,1.),t=r/R,in_=uL>1.?1.-smoothstep(R-1.,R+1.,r):0.;
vec2 q=mix(f,uM+d*(.62+.38*t*t),in_);
vec2 b=(q+uOff)/uS;float h=clamp((fb(b*.0021+vec2(uT*.012,-uT*.008))-.22)*2.4,0.,.999),L=h*8.,fw=fwidth(L)+1e-4;
float fr=fract(L),dd=min(fr,1.-fr)/fw,band=floor(L),ln=fr<.5?band:band+1.,w=(mod(ln,4.)<.5?1.7:.75)*uS;
vec3 c=mix(pal(band),vec3(.05,.12,.15),(1.-smoothstep(w-.6,w+.6,dd))*.65);
if(in_>0.){vec2 n=d/max(r,1.);c+=pow(max(dot(n,normalize(vec2(-.7,-.8))),0.),3.)*smoothstep(.8,1.,t)*.5*in_;
c=mix(c,vec3(1.),.5*(1.-smoothstep(0.,1.6*uS,abs(r-R+1.)))*step(1.,uL));}
o=vec4(c,1.);}`;
