/* Sound: file lokal di assets/sounds (boleh diganti dengan file milik sendiri) */
const SFX={};["click","open","close","error","success","fail"].forEach(n=>{const a=new Audio("assets/sounds/"+n+".wav");a.preload="auto";a.volume=.8;SFX[n]=a});
let mute=false,lastT=0;
function sfx(n){if(mute||!SFX[n])return;const t=Date.now();if(n==="click"&&t-lastT<120)return;lastT=t;
 try{const a=SFX[n];a.currentTime=0;const p=a.play();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
const beep=()=>sfx("click");
document.addEventListener("pointerdown",e=>{if(e.target.closest("button,.btn,nav a,tr.r")&&!e.target.closest("#snd,#mb,#mx"))sfx("click")},{passive:true});
document.addEventListener("pointerdown",function u(){Object.values(SFX).forEach(a=>{a.muted=true;a.play().then(()=>{a.pause();a.currentTime=0;a.muted=false}).catch(()=>{a.muted=false})});document.removeEventListener("pointerdown",u)},{once:true});
$("#snd").onclick=()=>{mute=!mute;$("#snd").textContent=mute?"🔇":"🔊";if(!mute)sfx("click")};
