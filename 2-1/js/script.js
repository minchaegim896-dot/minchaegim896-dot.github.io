"use strict";
// SVG 2-3의 원본 로고 위치(viewBox 1920 × 1080)에서 직접 추출한 좌표.
const logoRects = [{"index":0,"x":1422.28,"y":124.0,"w":112.0,"h":100.0},{"index":1,"x":1093.28,"y":155.0,"w":99.0,"h":100.0},{"index":2,"x":990.281,"y":155.0,"w":108.0,"h":101.0},{"index":3,"x":1023.28,"y":348.0,"w":61.0,"h":101.0},{"index":4,"x":1090.28,"y":350.0,"w":102.0,"h":102.0},{"index":5,"x":1032.28,"y":524.0,"w":120.0,"h":109.0},{"index":6,"x":1143.28,"y":524.0,"w":98.0,"h":111.0},{"index":7,"x":913.281,"y":777.0,"w":98.0,"h":116.0},{"index":8,"x":1198.28,"y":899.0,"w":106.0,"h":100.0},{"index":9,"x":1305.28,"y":893.0,"w":97.0,"h":119.0},{"index":10,"x":1657.28,"y":353.0,"w":72.0,"h":120.0},{"index":11,"x":1556.28,"y":362.0,"w":105.0,"h":102.0},{"index":12,"x":1683.28,"y":480.0,"w":91.0,"h":96.0},{"index":13,"x":1661.28,"y":613.0,"w":96.0,"h":108.0},{"index":14,"x":1771.63,"y":624.895,"w":38.8579,"h":79.9826},{"index":15,"x":1754.28,"y":733.0,"w":91.0,"h":97.0},{"index":16,"x":1657.28,"y":728.0,"w":101.0,"h":102.0},{"index":17,"x":1736.28,"y":851.0,"w":109.0,"h":122.0},{"index":18,"x":1636.28,"y":847.0,"w":103.0,"h":112.0},{"index":19,"x":1531.28,"y":851.0,"w":114.0,"h":102.0}];
// 2-3.svg 지도에서의 로고 좌표 순서에 맞춘 20개 구단 상세 SVG 연결.
const clubSlugs = ["newcastle", "man-united", "city", "liverpool", "everton", "wolves", "aston-villa", "bournemouth", "brighton", "southampton", "nottingham-forest", "leicester", "ipswich", "arsenal", "tottenham", "fulham", "chelsea", "west-ham", "crystal-palace", "brentford"];
const clubs = clubSlugs.map(slug => ({
  id: slug === "city" ? "manchester-city" : slug,
  builtInDetail: `2-1/assets/detail-${slug}-foreground.svg`
}));
const scene=document.querySelector('#scene');
const description=document.querySelector('#description');
const logos=document.querySelector('#clubs');
const hitboxes=document.querySelector('#hitboxes');
const detail=document.querySelector('#detail');
const detailArt=document.querySelector('#detail-art');
const custom=document.querySelector('#custom-detail');
const backArt=document.querySelector('#detail-back-art');
const returnButton=document.querySelector('#return');
let progress=0,opened=null;
const clamp=n=>Math.min(1,Math.max(0,n));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
function update(){
 if(opened)return;
 const travel=Math.max(1,scene.offsetHeight-window.innerHeight);
 progress=clamp((window.scrollY-scene.offsetTop)/travel);
 const text=smooth((progress-.08)/.30);
 const badges=smooth((progress-.49)/.35);
 description.style.opacity=text;
 description.style.transform=`translateY(${(1-text)*1.4}%)`;
 logos.style.opacity=badges;
 for(const b of hitboxes.children){const active=badges>.98;b.classList.toggle('enabled',active);b.tabIndex=active?0:-1;b.disabled=!active;}
}
const detailCache=new Map();
function loadDetail(src){
 if(!detailCache.has(src)){
  const img=new Image(); img.src=src;
  const ready=img.decode().then(()=>img).catch(err=>{detailCache.delete(src);throw err;});
  detailCache.set(src,ready);
 }
 return detailCache.get(src);
}
let requestId=0;
async function openClub(index){
 if(progress<.82)return;
 const club=clubs[index];
 if(!club)return;
 const token=++requestId;
 if(club.builtInDetail){
  try{await loadDetail(club.builtInDetail);}catch(e){console.error(e);return;}
  if(token!==requestId||opened||progress<.82)return;
  detailArt.src=club.builtInDetail;
  try{await detailArt.decode();}catch(e){console.error(e);return;}
  if(token!==requestId||opened||progress<.82)return;
 }
 const ready=club.builtInDetail||(club.logo&&club.name&&club.description);
 // 상세 이미지가 없는 구단도 클릭/복귀는 작동합니다.
 // 해당 구단 PNG 3개가 제공되기 전까지는 잘못된 구단 정보를 표시하지 않습니다.
 opened=club.id;
 if(club.builtInDetail){detailArt.src=club.builtInDetail;detailArt.alt=`${club.id} 상세 정보`;detailArt.hidden=false;backArt.hidden=club.id==='manchester-city';custom.hidden=true;}
 else if(ready){detailArt.hidden=true;backArt.hidden=false;custom.hidden=false;document.querySelector('#detail-logo').src=club.logo;document.querySelector('#detail-name').src=club.name;document.querySelector('#detail-description').src=club.description;}
 else{detailArt.hidden=true;backArt.hidden=false;custom.hidden=true;}
 hitboxes.style.pointerEvents='none';detail.classList.add('open');detail.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';returnButton.focus({preventScroll:true});
}
function closeClub(){
 if(!opened)return;
 ++requestId;opened=null;hitboxes.style.pointerEvents='';detail.classList.remove('open');detail.setAttribute('aria-hidden','true');document.body.style.overflow='';
 // 이전 스크롤 상태를 보존하되 항상 완성된 3번 지도 화면으로 복귀.
 const target=scene.offsetTop+Math.max(1,scene.offsetHeight-window.innerHeight)*.99;
 window.scrollTo({top:target,behavior:'instant'});update();
}
logoRects.forEach((r,i)=>{
 const b=document.createElement('button');b.type='button';b.className='club-button';b.dataset.clubId=clubs[i].id;b.setAttribute('aria-label',`${clubs[i].id} 상세 보기`);
 b.style.left=`${r.x/1920*100}%`;b.style.top=`${r.y/1080*100}%`;b.style.width=`${r.w/1920*100}%`;b.style.height=`${r.h/1080*100}%`;
 b.addEventListener('click',()=>openClub(i));hitboxes.append(b);
});
returnButton.addEventListener('click',closeClub);
window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened)closeClub()});
update();

// Preload after initial page load, two at a time.
async function preloadClubs(){let next=0;async function worker(){while(next<clubs.length){const club=clubs[next++];try{await loadDetail(club.builtInDetail);}catch(e){console.warn(e);}}}await Promise.all([worker(),worker()]);}
if(document.readyState==="complete")preloadClubs();else window.addEventListener("load",preloadClubs,{once:true});
