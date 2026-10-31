let admin=null,apps=[];
function dashInit(){const d=$("#dash");if(!auth)return needDb(d);
 if(!dashInit.on){dashInit.on=1;auth.onAuthStateChanged(async u=>{admin=null;if(u){try{const s=await db.collection("admins").doc(u.uid).get();if(s.exists)admin={uid:u.uid,email:u.email}}catch(e){}}renderDash()})}else renderDash()}
async function renderDash(){const d=$("#dash");
 if(!admin){d.innerHTML=`<div class="card"><label>Email admin</label><input id="le" type="email"><label>Password</label><input id="lp" type="password"><button id="lb">LOGIN</button><p class="mut" style="font-size:12px">Hanya akun terdaftar di koleksi admins yang bisa mengakses.</p></div>`;
  $("#lb").onclick=()=>auth.signInWithEmailAndPassword($("#le").value,$("#lp").value).catch(e=>alert("Login gagal: "+e.message));
  if(auth.currentUser)d.insertAdjacentHTML("afterbegin",'<div class="warn">Akun ini bukan admin terdaftar.</div>');return}
 d.innerHTML='<p><span class="sp"></span></p>';try{apps=(await db.collection("applicants").orderBy("created_at","desc").limit(300).get()).docs.map(x=>x.data())}catch(e){d.innerHTML='<div class="warn">Gagal memuat: '+esc(e.message)+"</div>";return}
 const n=s=>apps.filter(a=>a.status===s).length,bp=p=>apps.filter(a=>a.position===p).length;
 d.innerHTML=`<div class="row" style="justify-content:space-between"><span class="mut">${esc(admin.email)}</span><button class="ghost" id="lo">LOGOUT</button></div>
 <div class="stats"><div><b>${apps.length}</b>Total</div><div><b>${n("PENDING")}</b>Pending</div><div><b>${n("APPROVED")}</b>Diterima</div><div><b>${n("REJECTED")}</b>Ditolak</div></div>
 <p class="mut">Admin ${bp("Admin")} · Moderator ${bp("Moderator")} · Art Designer ${bp("Art Designer")}</p>
 <div style="overflow-x:auto"><table><tr><th>ID</th><th>Nama</th><th>User WA</th><th>Posisi</th><th>Tgl</th><th>Status</th></tr>${apps.map((a,i)=>`<tr class="r" data-i="${i}"><td>${esc(a.application_id)}</td><td>${esc(a.full_name)}</td><td>${esc(a.username)}</td><td>${esc(a.position)}</td><td>${a.created_at?a.created_at.toDate().toLocaleDateString("id-ID"):"-"}</td><td>${esc(a.status)}</td></tr>`).join("")}</table></div>`;
 $("#lo").onclick=()=>auth.signOut();$$("tr.r").forEach(r=>r.onclick=()=>detail(apps[+r.dataset.i]))}
function detail(a){const skip=["created_at","reviewed_at"];modal(`<h3>${esc(a.application_id)} · ${esc(a.status)}</h3>${Object.entries(a).filter(([k])=>!skip.includes(k)).map(([k,v])=>`<div><b>${esc(k)}</b>: <span class="mut">${esc(v)}</span></div>`).join("")}<div class="row"><button id="ap">APPROVE</button><button id="rj" style="background:var(--no)">REJECT</button><button id="pd" class="ghost">PENDING</button><button class="ghost" id="cl">TUTUP</button></div>`);
 $("#cl").onclick=mclose;[["ap","APPROVED"],["rj","REJECTED"],["pd","PENDING"]].forEach(([b,s])=>$("#"+b).onclick=()=>{if(confirm("Ubah status "+a.application_id+" menjadi "+s+"?"))setStatus(a,s)})}
async function setStatus(a,s){const ts=firebase.firestore.FieldValue.serverTimestamp(),batch=db.batch(),ref=db.collection("applicants").doc(a.application_id);
 batch.update(ref,{status:s,reviewed_at:ts,reviewed_by:admin.email});batch.set(db.collection("application_logs").doc(),{application_id:a.application_id,previous_status:a.status,new_status:s,admin_id:admin.uid,timestamp:ts});
 try{await batch.commit();sfx("open");mclose();renderDash()}catch(e){alert("Gagal: "+e.message)}}
