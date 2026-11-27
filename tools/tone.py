"""角色圖色調統一：以生氣怪獸為基準，亮度往中間靠、偏硬的對比收柔，不改顏色。
用法：python3 tone.py <img資料夾> <輸出資料夾> [--dry]"""
import sys,os,glob,json
import numpy as np
from PIL import Image
src,dst=sys.argv[1],sys.argv[2];dry='--dry' in sys.argv
NAMES=['angry','sad','defiant','scared','stuck','reluctant','jealous','shy','hyper','embarrassed','guilty','lonely','stress','wronged','joy_happy','joy_proud','joy_safe','joy_curious','joy_grateful']
T_L=(0.55,0.66)   # 亮度範圍
T_C=0.115         # 對比上限（生氣怪獸約 0.09–0.10，留一點空間）
def stats(arr):
    m=arr[...,3]>230;rgb=arr[...,:3][m].astype(float)/255
    L=(rgb.max(1)+rgb.min(1))/2;return L.mean(),L.std()
def ref(n):
    for s in ['0','g2','1']:
        f=os.path.join(src,f'{n}{s}.webp')
        if os.path.exists(f):return f
plan={}
for n in NAMES:
    f=ref(n)
    if not f:continue
    L,C=stats(np.asarray(Image.open(f).convert('RGBA')))
    shift=0.0
    if L<T_L[0]:shift=min(T_L[0]-L,0.05)
    elif L>T_L[1]:shift=-min(L-T_L[1],0.05)
    k=1.0 if C<=T_C else max(T_C/C,0.85)
    plan[n]={'L':round(L,3),'C':round(C,3),'shift':round(shift,3),'contrast':round(k,3)}
print(json.dumps(plan,ensure_ascii=False,indent=0))
if dry:sys.exit()
os.makedirs(dst,exist_ok=True)
cnt=0
for n,p in plan.items():
    if p['shift']==0 and p['contrast']==1.0:continue
    for f in glob.glob(os.path.join(src,f'{n}*.webp')):
        base=os.path.basename(f)
        if not (base[len(n):].replace('g','').replace('.webp','').isdigit()):continue  # 只處理 n0–4、ng1–4
        im=Image.open(f).convert('RGBA');a=np.asarray(im).astype(float)
        rgb=a[...,:3]/255;alpha=a[...,3:]
        m=a[...,3]>230
        mean=rgb[m].mean(0) if m.any() else rgb.reshape(-1,3).mean(0)
        rgb=(rgb-mean)*p['contrast']+mean+p['shift']   # 繞平均色縮放對比，再整體平移亮度（不改色相）
        out=np.concatenate([np.clip(rgb,0,1)*255,alpha],2).astype(np.uint8)
        Image.fromarray(out,'RGBA').save(os.path.join(dst,base),'WEBP',quality=90,method=6)
        cnt+=1
print('處理',cnt,'張')
