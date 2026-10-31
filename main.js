/* === Konfigurasi === */
const FIREBASE_CONFIG = null; // {apiKey:"...",authDomain:"...",projectId:"...",appId:"..."}
const ADMINS=[["+60115955614","60115955614"],["+6285878089195","6285878089195"],["+628133201764","628133201764"]];
const WA_GROUP="https://chat.whatsapp.com/DnHWIdq0CM6HYIR9FbgmV8?s=cl&p=a&iam=2";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
document.querySelectorAll('[href="WA_GROUP"]').forEach(a=>a.href=WA_GROUP);
let db=null,auth=null;
try{if(FIREBASE_CONFIG&&window.firebase){firebase.initializeApp(FIREBASE_CONFIG);db=firebase.firestore();auth=firebase.auth()}}catch(e){console.error(e)}
$("#cfgwarn").hidden=!!db;
function modal(h){$("#mc").innerHTML=h;$("#md").classList.add("on")}
const mclose=()=>$("#md").classList.remove("on");
$("#md").onclick=e=>{if(e.target.id==="md")mclose()};
const needDb=el=>{el.innerHTML='<div class="warn">Backend belum dikonfigurasi, fitur ini belum aktif.</div>'};
function contact(){$("#clist").innerHTML=ADMINS.map((a,i)=>`<div class="card"><b>Admin ${i+1}</b><div class="mut">${a[0]}</div><a class="btn" target="_blank" rel="noopener" href="https://wa.me/${a[1]}">CONTACT</a></div>`).join("")}
let chatOn=false;
function chatInit(){const w=$("#chatwarn");if(!db){w.textContent="Prototype: UI saja, pesan tidak tersimpan dan belum realtime. Hubungkan Firebase untuk mengaktifkan.";return}
 w.textContent="Terhubung ke Firestore (koleksi global_chat).";if(chatOn)return;chatOn=true;
 db.collection("global_chat").orderBy("t","desc").limit(50).onSnapshot(s=>{const m=s.docs.map(d=>d.data()).reverse();$("#msgs").innerHTML=m.map(x=>`<p><b>${esc(x.n)}</b>: ${esc(x.m)}</p>`).join("");$("#msgs").scrollTop=1e9})}
$("#cs").onclick=()=>{const n=$("#cn").value.trim().slice(0,30),m=$("#cm").value.trim().slice(0,300);if(!n||!m)return;$("#cm").value="";
 if(db)db.collection("global_chat").add({n,m,t:firebase.firestore.FieldValue.serverTimestamp()}).catch(()=>alert("Gagal mengirim (cek Security Rules)"));
 else{$("#msgs").insertAdjacentHTML("beforeend",`<p><b>${esc(n)}</b>: ${esc(m)} <i class="mut">(lokal)</i></p>`)}};
