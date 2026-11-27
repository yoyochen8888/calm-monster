"""綠幕角色圖：去背、去綠邊、切成一隻一隻、丟掉殘影頭、頂滿高度裁切、存 webp（高 320）。
用法：python3 cutout.py 輸入.jpg 輸出前綴 [張數]
  張數＝一排有幾隻（1 或 4）。輸出：前綴0.webp…（由左到右）"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

src,prefix=sys.argv[1],sys.argv[2];want=int(sys.argv[3]) if len(sys.argv)>3 else 1
im=np.asarray(Image.open(src).convert('RGB')).astype(float)
H,W,_=im.shape
r,g,b=im[...,0],im[...,1],im[...,2]
# 綠的程度：綠色比紅藍高多少
greenness=g-np.maximum(r,b)
# 背景：很綠；邊緣漸層
alpha=np.clip((150-greenness)/(150-70),0,1)   # greenness ≥150 全透明；≤70 全不透明
# 去綠邊：把綠色壓到不超過紅藍的較大者
spill=np.clip(g-np.maximum(r,b),0,None)
g2=g-spill*(1-alpha*0.0)                       # 全部去綠（角色本身沒有超過紅藍的綠，除了小勾勾）
keep_green=(greenness>20)&(greenness<70)&(g<215) # 角色上的深綠小東西（打勾）保留原色
g2=np.where(keep_green,g,g2)
rgb=np.stack([r,np.minimum(g,np.maximum(g2,0)),b],2)

solid=alpha>0.5
lab,n=ndimage.label(solid)
sizes=ndimage.sum(solid,lab,range(1,n+1))
objs=ndimage.find_objects(lab)
comps=[(i+1,sizes[i],objs[i]) for i in range(n) if sizes[i]>H*W*0.0004]
# 腳底基準：最大幾塊的最低點
bottoms=sorted([o[0].stop for _,s,o in comps],reverse=True)
base=bottoms[0]
# 只留「腳踩在基準線附近」的大塊（丟掉上方殘影頭），以及附在牠身上的小東西
main=[c for c in comps if c[2][0].stop>base-H*0.12 and c[1]>H*W*0.01]
main.sort(key=lambda c:c[2][1].start)
if len(main)!=want:
    print('警告：找到',len(main),'隻，預期',want)
mask_all=np.zeros((H,W),bool)
for lab_id,_,_ in main: mask_all|=(lab==lab_id)
# 小配件（旗子、紙、筆）：不在主塊但跟主塊很近、而且不在殘影區（底部低於殘影）
for lab_id,s,o in comps:
    if any(lab_id==m[0] for m in main):continue
    ys,xs=o
    near=any(abs(ys.stop-m[2][0].stop)<H*0.6 and xs.start<m[2][1].stop+40 and xs.stop>m[2][1].start-40 and ys.start>m[2][0].start-H*0.08 for m in main)
    if near: mask_all|=(lab==lab_id)
# 擴一點點，把邊緣半透明的像素也包進來
grow=ndimage.binary_dilation(mask_all,iterations=4)
a=np.where(grow,alpha,0)
for k,(lab_id,_,o) in enumerate(main):
    ys,xs=o
    # 這一隻的範圍：左右用相鄰兩隻的中間當界線
    left=0 if k==0 else (main[k-1][2][1].stop+xs.start)//2
    right=W if k==len(main)-1 else (xs.stop+main[k+1][2][1].start)//2
    sub=a[:,left:right]
    rows=np.nonzero(sub.max(1)>0.05)[0];cols=np.nonzero(sub.max(0)>0.05)[0]
    y0,y1=rows[0],rows[-1]+1;x0,x1=cols[0]+left,cols[-1]+1+left
    crop_rgb=rgb[y0:y1,x0:x1];crop_a=a[y0:y1,x0:x1]
    out=np.dstack([crop_rgb,crop_a*255]).clip(0,255).astype(np.uint8)
    img=Image.fromarray(out,'RGBA')
    h=320;w=round(img.width*h/img.height)
    img=img.resize((w,h),Image.LANCZOS)
    name=f'{prefix}{k}.webp'
    img.save(name,'WEBP',quality=90,method=4)
    print(name,img.size,'寬高比',round(w/h,2))
