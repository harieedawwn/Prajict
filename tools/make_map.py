# Tạo nền bản đồ đồng mức lặp liền mạch (img/map.webp). Chạy: python3 tools/make_map.py
import numpy as np
from PIL import Image
N=3072                     # pixel ảnh; hiển thị 1536 CSS px (2x)
rng=np.random.default_rng(7)
k=np.fft.fftfreq(N)*N; kx,ky=np.meshgrid(k,k); f=np.hypot(kx,ky); f[0,0]=1
amp=np.where((f>=1)&(f<=36),f**-2.5,0)          # fBm tuần hoàn (lặp liền mạch nhờ FFT)
h=np.real(np.fft.ifft2(amp*np.exp(2j*np.pi*rng.random((N,N)))))
lo,hi=np.percentile(h,[3,99.5]); h=np.clip((h-lo)/(hi-lo),0,.999)
pal=np.array([[.078,.188,.231],[.106,.29,.341],[.165,.416,.424],[.31,.549,.502],[.561,.702,.604],[.788,.824,.706],[.914,.89,.784],[.957,.937,.863]])
L=h*8; band=np.floor(L).astype(int); fr=L-band
g=np.hypot((np.roll(L,-1,1)-np.roll(L,1,1))/2,(np.roll(L,-1,0)-np.roll(L,1,0))/2)+1e-4
d=np.minimum(fr,1-fr)/g; ln=np.where(fr<.5,band,band+1); w=np.where(ln%4==0,1.7,.75)*2
a=(1-np.clip((d-(w-.6))/1.2,0,1)); a=a*a*(3-2*a)*.65
c=pal[band]*(1-a[...,None])+np.array([.05,.12,.15])*a[...,None]
Image.fromarray((c*255+.5).astype(np.uint8)).save('img/map.webp',quality=82,method=6)
