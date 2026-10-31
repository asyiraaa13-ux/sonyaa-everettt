const nav=$("#nav");
$("#mb").onclick=()=>{nav.classList.add("open");sfx("open")};
const closeNav=()=>{nav.classList.remove("open");sfx("close")};
$("#mx").onclick=closeNav;
function route(){const p=(location.hash||"#home").slice(1);const id=$("#"+p)&&$("#"+p).classList.contains("p")?p:"home";
 $$("section.p").forEach(s=>s.classList.toggle("on",s.id===id));document.body.className="";nav.classList.remove("open");scrollTo(0,0);
 if(id==="contact")contact();if(id==="dashboard")dashInit();if(id==="chat")chatInit();if(id==="recruit")recruitReset()}
addEventListener("hashchange",route);
