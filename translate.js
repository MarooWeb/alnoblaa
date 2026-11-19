/* ترجمة الموقع إلى الإنجليزية من قاموس الموقع نفسه (assets/i18n/en.js) بدون خدمات خارجية */
(function(){
 var KEY='nobles_lang';
 function getLang(){
  try{return localStorage.getItem(KEY)==='en'?'en':'ar'}catch(e){return 'ar'}
 }
 function setLang(l){
  try{localStorage.setItem(KEY,l)}catch(e){}
 }
 var D=window.NOBLES_EN||{};
 var AR=/[؀-ۿ]/;
 function norm(s){return s.replace(/\s+/g,' ').trim()}
 function tr(s){
  var k=norm(s);
  return Object.prototype.hasOwnProperty.call(D,k)?D[k]:null;
 }
 function translateText(n){
  var v=n.nodeValue;
  if(!v||!AR.test(v))return;
  var t=tr(v);
  if(t==null&&/^[\u0660-\u0669+%.,\s]+$/.test(norm(v))){t=norm(v).replace(/[\u0660-\u0669]/g,function(d){return String(d.charCodeAt(0)-0x660)})}
  if(t==null)return;
  var lead=v.match(/^\s*/)[0],trail=v.match(/\s*$/)[0];
  n.nodeValue=lead+t+trail;
 }
 function translateAttrs(root){
  if(!root.querySelectorAll)return;
  var list=root.querySelectorAll('[alt],[title],[placeholder],[aria-label],input[type=submit],input[type=button]');
  Array.prototype.forEach.call(list,function(e){
   ['alt','title','placeholder','aria-label'].forEach(function(a){
    var v=e.getAttribute(a);
    if(v&&AR.test(v)){var t=tr(v);if(t!=null)e.setAttribute(a,t)}
   });
   if((e.type==='submit'||e.type==='button')&&e.value&&AR.test(e.value)){var tv=tr(e.value);if(tv!=null)e.value=tv}
  });
 }
 function walk(root){
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null);
  var nodes=[],n;
  while(n=w.nextNode()){
   var p=n.parentNode;
   if(p&&/^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName))continue;
   nodes.push(n);
  }
  nodes.forEach(translateText);
 }
 function applyAll(root){
  walk(root||document.body);
  translateAttrs(root||document.body);
 }
 function applyPage(){
  document.documentElement.lang='en';
  document.documentElement.dir='ltr';
  document.documentElement.classList.add('nobles-en');
  var t=tr(document.title);if(t!=null)document.title=t;
  var md=document.querySelector('meta[name=description]');
  if(md){var mt=tr(md.getAttribute('content')||'');if(mt!=null)md.setAttribute('content',mt)}
  applyAll(document.body);
  var mo=new MutationObserver(function(muts){
   muts.forEach(function(m){
    if(m.type==='characterData'){translateText(m.target);return}
    m.addedNodes.forEach(function(nd){
     if(nd.nodeType===3)translateText(nd);
     else if(nd.nodeType===1){walk(nd);translateAttrs(nd)}
    });
   });
  });
  mo.observe(document.body,{childList:true,subtree:true,characterData:true});
 }
 var st=document.createElement('style');
 st.textContent='html.nobles-en body{text-align:left}';
 document.head.appendChild(st);
 var lang=getLang();
 var btn=document.querySelector('.tr');
 if(btn){
  btn.textContent=lang==='en'?'AR':'EN';
  btn.setAttribute('title',lang==='en'?'Switch to Arabic':'Translate to English');
  btn.addEventListener('click',function(){
   setLang(getLang()==='en'?'ar':'en');
   location.reload();
  });
 }
 if(lang==='en'){
  if(document.readyState==='loading'){
   document.addEventListener('DOMContentLoaded',applyPage);
  }else{
   applyPage();
  }
  window.addEventListener('load',function(){applyAll(document.body)});
 }
})();
