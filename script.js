const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const MAP='https://maps.app.goo.gl/qBp9QndxZMn4SLqj7';
const PAGES=[['index.html','الرئيسية'],['programs.html','البرامج التعليمية'],['partners.html','شركاء النجاح'],['portal.html','بوابة الطلاب']];
/* البرامج: عدّل هنا النصوص، والصور من assets/images/image3.jpg إلى image8.jpg */
const P=[
{id:'python',cat:'prog',ic:'🐍',t:'أساسيات البرمجة بلغة Python',d:'من الصفر حتى بناء مشاريع حقيقية بأسلوب عملي.',lv:'مبتدئ',du:'8 أسابيع'},
{id:'ai',cat:'ai',ic:'🤖',t:'الذكاء الاصطناعي وتعلم الآلة',d:'نماذج التعلم الآلي والشبكات العصبية مع تطبيقات عملية.',lv:'متوسط',du:'12 أسبوعًا'},
{id:'web',cat:'design',ic:'💻',t:'تصميم وتطوير المواقع',d:'HTML وCSS وJavaScript لبناء مواقع حديثة متجاوبة.',lv:'مبتدئ',du:'10 أسابيع'},
{id:'mobile',cat:'prog',ic:'📱',t:'تطبيقات الموبايل',d:'تطوير تطبيقات أندرويد وiOS بتقنيات حديثة.',lv:'متوسط',du:'10 أسابيع'},
{id:'robot',cat:'robot',ic:'🦾',t:'الروبوتات والأنظمة الذكية',d:'بناء وبرمجة روبوتات وربطها بالحساسات والذكاء الاصطناعي.',lv:'مبتدئ',du:'8 أسابيع'},
{id:'prompt',cat:'ai',ic:'✨',t:'هندسة الأوامر وأدوات الذكاء الاصطناعي',d:'استخدام أدوات الذكاء الاصطناعي لزيادة الإنتاجية والإبداع.',lv:'مبتدئ',du:'4 أسابيع'}];
const card=(p,i)=>`<article class="card rv" data-cat="${p.cat}"><div class="ph"><span>${p.ic}</span><img src="assets/images/image${i+3}.jpg" alt="${p.t}" loading="lazy" onerror="this.remove()"></div><h3>${p.t}</h3><p>${p.d}</p><div class="meta"><span>${p.lv}</span><span>${p.du}</span></div><a class="btn pri" href="index.html?course=${p.id}#register">سجّل الآن</a></article>`;

/* هيدر وفوتر موحّدان */
const cur=location.pathname.split('/').pop()||'index.html';
$('#nav').outerHTML=`<header class="nav" id="nav"><div class="wrap"><a class="brand" href="index.html"><img src="assets/images/image1.jpg" alt="شعار مدرسة النبلاء">مدرسة النبلاء</a><button class="burger" aria-label="القائمة">☰</button><nav class="links">${PAGES.map(([h,n])=>`<a href="${h}" class="${h===cur?'on':''}">${n}</a>`).join('')}</nav></div></header>`;
$('#footer').outerHTML=`<footer class="foot"><div class="wrap grid"><div><h3>مدرسة النبلاء للتدريب والإبداع</h3><p>بيت التدريب الاحترافي المتكامل في البرمجة والذكاء الاصطناعي.</p></div><div><h3>روابط سريعة</h3>${PAGES.map(([h,n])=>`<a href="${h}">${n}</a>`).join('')}</div><div><h3>تواصل معنا</h3><p>الهاتف: 01XXXXXXXXX</p><p>البريد: info@example.com</p><a class="btn out" style="margin-top:10px;text-align:center" href="${MAP}" target="_blank" rel="noopener">موقعنا على الخريطة</a></div></div><p class="copy">© ${new Date().getFullYear()} مدرسة النبلاء للتدريب والإبداع. جميع الحقوق محفوظة.</p></footer><div class="toast" id="toast"></div>`;
const nav=$('#nav');
$('.burger').onclick=()=>$('.links').classList.toggle('open');
addEventListener('scroll',()=>nav.classList.toggle('sc',scrollY>40),{passive:true});

/* شاشة التحميل */
const pre=document.createElement('div');pre.className='pre';pre.innerHTML='<img src="assets/images/image1.jpg" alt=""><i></i>';document.body.prepend(pre);
addEventListener('load',()=>setTimeout(()=>pre.classList.add('off'),900));

/* عرض البرامج */
$$('[data-programs]').forEach(el=>{el.innerHTML=P.slice(0,+el.dataset.programs||P.length).map(card).join('')});
$$('[data-course-select]').forEach(s=>{s.innerHTML='<option value="">اختر البرنامج</option>'+P.map(p=>`<option value="${p.id}">${p.t}</option>`).join('');const c=new URLSearchParams(location.search).get('course');if(c)s.value=c});
$$('.tabs button').forEach(b=>b.onclick=()=>{$$('.tabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');$$('[data-cat]').forEach(c=>c.classList.toggle('hide',b.dataset.f!=='all'&&c.dataset.cat!==b.dataset.f))});

/* ظهور العناصر + العدادات + ميل الكروت */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);
 if(e.target.dataset.count){const n=+e.target.dataset.count;let t0;const f=t=>{t0??=t;const k=Math.min((t-t0)/1600,1);e.target.textContent=Math.floor(n*k).toLocaleString('ar-EG')+'+';k<1&&requestAnimationFrame(f)};requestAnimationFrame(f)}}),{threshold:.15});
$$('.rv,[data-count]').forEach(e=>io.observe(e));
new MutationObserver(()=>$$('.rv:not(.in)').forEach(e=>io.observe(e))).observe(document.body,{childList:true,subtree:true});
document.addEventListener('pointermove',e=>{const c=e.target.closest?.('.card');if(!c||matchMedia('(pointer:coarse)').matches)return;const r=c.getBoundingClientRect();c.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*7+'deg');c.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*7+'deg')});
document.addEventListener('pointerout',e=>{const c=e.target.closest?.('.card');c&&(c.style.setProperty('--rx','0'),c.style.setProperty('--ry','0'))});

/* جزيئات ذهبية في الهيرو */
const cv=$('#fx');
if(cv&&!matchMedia('(prefers-reduced-motion:reduce)').matches){const x=cv.getContext('2d');let W,H;const rs=()=>{W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight};rs();addEventListener('resize',rs);
 const d=Array.from({length:55},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2+.4,v:Math.random()*.5+.15,a:Math.random()}));
 (function f(){x.clearRect(0,0,W,H);d.forEach(p=>{p.y-=p.v;p.a+=.01;if(p.y<-5){p.y=H+5;p.x=Math.random()*W}x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fillStyle=`rgba(246,223,142,${.25+Math.abs(Math.sin(p.a))*.55})`;x.fill()});requestAnimationFrame(f)})()}

/* النماذج (تجريبي: تُحفظ في المتصفح فقط — اربطها بسيرفر لاحقًا) */
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),3200)};
$$('form[data-form]').forEach(f=>f.onsubmit=e=>{e.preventDefault();const k='nobles_'+f.dataset.form,a=JSON.parse(localStorage.getItem(k)||'[]');a.push({...Object.fromEntries(new FormData(f)),date:new Date().toISOString()});localStorage.setItem(k,JSON.stringify(a));f.reset();toast('تم استلام بياناتك، وسنتواصل معك قريبًا ✔')});

/* بوابة الطلاب */
const lf=$('#login');
if(lf){const dash=$('#dash'),S=window.STUDENTS||{};
 const show=u=>{const s=S[u];lf.style.display='none';dash.classList.add('on');
  $('#hi').textContent='أهلًا، '+s.name;$('#trk').textContent='المسار: '+s.track;
  $('#sch').innerHTML=s.schedule.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('');
  $('#prg').innerHTML=s.progress.map(([n,v])=>`<div>${n} <b>${v}%</b></div><div class="bar"><i data-w="${v}"></i></div>`).join('');
  setTimeout(()=>$$('#prg i').forEach(i=>i.style.width=i.dataset.w+'%'),100);
  const dk='nobles_done_'+u,dn=JSON.parse(localStorage.getItem(dk)||'[]');
  $('#tsk').innerHTML=s.tasks.map(([n,d],i)=>`<li class="${dn.includes(i)?'done':''}"><input type="checkbox" data-i="${i}" ${dn.includes(i)?'checked':''}><span>${n} — التسليم ${d}</span></li>`).join('');
  $$('#tsk input').forEach(c=>c.onchange=()=>{const a=$$('#tsk input').filter(x=>x.checked).map(x=>+x.dataset.i);localStorage.setItem(dk,JSON.stringify(a));c.parentNode.classList.toggle('done',c.checked)});
  $('#nts').innerHTML=s.notes.map(n=>`<li>🔔 <span>${n}</span></li>`).join('')};
 lf.onsubmit=e=>{e.preventDefault();const u=lf.user.value.trim(),s=S[u];if(s&&s.pass===lf.pass.value){sessionStorage.setItem('nobles_user',u);show(u)}else $('#err').textContent='اسم المستخدم أو كلمة المرور غير صحيحة.'};
 $('#out').onclick=()=>{sessionStorage.removeItem('nobles_user');location.reload()};
 const u=sessionStorage.getItem('nobles_user');if(u&&S[u])show(u)}
