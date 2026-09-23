
(function(){
"use strict";

function sh(a){return Array.from(a).sort(function(){return Math.random()-.5})}
function eh(s){return String(s).replace(/[&<>"']/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]})}
function vp(raw){var m=String(raw).match(/^(.*?)(?=[\u4e00-\u9fff])/);return m?{de:m[1].trim(),zh:String(raw).slice(m[1].length).trim()}:{de:String(raw).trim(),zh:""}}
function vk(v){return v.unit+"|"+v.raw}
function vs(){try{return JSON.parse(localStorage.getItem("DeutschTrainingLab_VocabMemory_v1")||"{}")}catch(e){return {}}}
function sv(x){localStorage.setItem("DeutschTrainingLab_VocabMemory_v1",JSON.stringify(x))}
function phrase(v){return /\s/.test(vp(v.raw).de)}
function mastery(x){if(!x)return 0;var a=(x.right||0)+(x.wrong||0);if(!a)return 0;return Math.max(0,Math.min(100,Math.round((x.right||0)/a*65+Math.min(x.streak||0,5)*7)))}
function pool(u){return FULL_VOCAB.filter(function(v){return (u==="ALL"||v.unit===u)&&vp(v.raw).zh})}
function hideGrammar(){var b=document.querySelector('[data-page="grammar"]');if(b)b.remove();var g=document.getElementById("grammar");if(g)g.remove()}
function visual(){var st=document.createElement("style");st.textContent="header{background:linear-gradient(135deg,#64766d,#8a8d9f,#a5a0ae)!important;padding:34px 18px 30px!important}nav{background:rgba(248,249,246,.94)!important;box-shadow:0 4px 18px rgba(45,55,50,.06)}.tab{color:#59645e!important}.tab.active{background:#dce3de!important;color:#43564c!important}.card{border-radius:20px!important;box-shadow:0 10px 30px rgba(49,61,54,.06)!important}.hero-card{background:linear-gradient(145deg,#fafbf7,#f1f4ef)}.eyebrow{font-size:11px;letter-spacing:.14em;color:#78857e;font-weight:700}.practice-config{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:18px 0}.practice-config label{display:block;font-size:13px;color:#6d7871;margin-bottom:5px}.grammar-summary{padding:14px 16px;border-radius:15px;background:#e9eee9;border:1px solid #d0d9d2;margin:15px 0}.grammar-chip{display:inline-block;margin:4px 5px 4px 0;padding:5px 9px;border-radius:99px;background:#f8faf7;border:1px solid #d0d8d1;font-size:13px}.logic-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.logic-grid>div{padding:14px;border-radius:15px;background:#f2f5f1;border:1px solid #dbe0db}.logic-grid b,.logic-grid span{display:block}.logic-grid span{color:#748078;font-size:14px;margin-top:4px}.translation-result{min-height:80px;margin-top:12px;padding:14px;border-radius:14px;background:#f2f5f1;border:1px solid #d5ddd6;white-space:pre-wrap}.translator-actions{display:flex;gap:9px;align-items:center;margin-top:10px;flex-wrap:wrap}@media(max-width:700px){.practice-config,.logic-grid{grid-template-columns:1fr}}";document.head.appendChild(st)}
function normalizeUnits(){FULL_VOCAB.forEach(function(v){if(v.unit==="E1–E5")v.unit="E5"})}

var UG={
E1:["人称代词第一格","规则动词现在时变位","sein 现在时变位","定/不定冠词第一格","句子类型与基本语序"],
E2:["kein- 第一格","不规则动词现在时变位","物主冠词第一格"],
E3:["es gibt + Akkusativ","第三格人称代词与 helfen / schmecken","常见强变化动词现在时"],
E4:["第四格基础使用","购物数量与量词表达","kein / nichts 否定"],
E5:["可分动词现在时","时间与地点表达","in / an / auf / nach / zu / von / aus","可分动词句中位置"],
E6:["第三格动词","固定介词与格","nicht ..., sondern ...","nicht nur ..., sondern auch ...","zwar ..., aber ..."],
E7:["Perfekt 基本结构","haben / sein 的选择","规则/不规则 Partizip II","-ieren 不加 ge-","可分/不可分前缀","sein / haben 的 Präteritum"],
E8:["Wo / Wohin 与 Wechselpräpositionen","静态位置与方向的 Dativ / Akkusativ","nach Hause / zu Hause","sorgen für / führen zu / überzeugen von / überreden zu","问路与地点表达"]
};

var GB={
E1:[["Ich ___ Deutsch.","lerne",["lernt","lernen","lernst"]],["Wir ___ Studenten.","sind",["seid","ist","bin"]],["___ bin Studentin.","Ich",["Mich","Mir","Mein"]]],
E2:[["Das ist ___ Problem.","kein",["keine","keinen","nicht"]],["Er ___ gern Bücher.（lesen）","liest",["lese","lesen","liest"]],["Das ist ___ Buch.（ich）","mein",["meine","meinen","meiner"]]],
E3:[["In der Stadt gibt es ___ Bibliothek.","eine",["ein","einer","einen"]],["Ich helfe ___.（du）","dir",["dich","du","dein"]],["Er ___ zu Mittag.（essen）","isst",["esse","esst","essen"]]],
E4:[["Ich probiere ___ Apfel.","den",["der","dem","des"]],["eine ___ Milch","Packung",["Stück","Flasche","Tüte"]],["Ich brauche ___.","nichts",["kein","keine","nicht"]]],
E5:[["Ich ___ früh ___.（aufstehen）","stehe / auf",["aufstehe / stehe","stehe / an","auf / stehe"]],["Wir treffen uns ___ 8 Uhr.","um",["am","in","nach"]],["Ich komme ___ China.","aus",["von","nach","zu"]]],
E6:[["Das Buch gehört ___.（ich）","mir",["mich","mein","ich"]],["Ich habe Angst ___ etwas.","vor",["für","auf","mit"]],["Er trinkt nicht Kaffee, ___ Tee.","sondern",["aber","oder","und"]],["Sie ist zwar müde, ___ sie arbeitet weiter.","aber",["sondern","und","oder"]]],
E7:[["Ich ___ Deutsch ___.（lernen）","habe / gelernt",["bin / gelernt","habe / lernen","bin / lernen"]],["Wir ___ nach Berlin gefahren.","sind",["haben","waren","hatten"]],["studieren →","studiert",["gestudiert","studieren","studierte"]],["besuchen →","besucht",["gebesucht","besuchen","besuchte"]],["einladen →","eingeladen",["geeinladen","einladet","eingeladet"]],["sein 的 ich-Präteritum：","war",["bin","hatte","wurde"]]],
E8:[["Ich stelle das Buch ___ Tisch.","auf den",["auf dem","an der","in der"]],["Das Buch liegt ___ Tisch.","auf dem",["auf den","in den","an die"]],["Ich gehe ___ Hause.","nach",["zu","in","an"]],["Ich bin ___ Hause.","zu",["nach","in","an"]],["Das führt ___ Problemen.","zu",["für","von","auf"]],["Er überzeugt mich ___ seiner Idee.","von",["zu","für","mit"]]]
};

function gq(u,g){var A=GB[u]||[];if(!A.length)return null;var x=A[Math.floor(Math.random()*A.length)];return{unit:u,category:"语法",type:"choice",skill:u+"-"+g,q:x[0],opts:sh([x[1]].concat(x[2])),correctText:x[1],e:"围绕该单元固定知识点生成的变式题。",generated:true}}
function vq(u){var P=pool(u);if(!P.length)return null;var q=P[Math.floor(Math.random()*P.length)],z=vp(q.raw),de=Math.random()<.5,ans=de?z.zh:z.de,vals=[],seen={};seen[ans]=1;for(var i=0;i<P.length&&vals.length<3;i++){var v=P[Math.floor(Math.random()*P.length)],x=vp(v.raw),a=de?x.zh:x.de;if(a&&!seen[a]){seen[a]=1;vals.push(a)}}return{unit:q.unit,category:"词汇",type:"choice",skill:q.unit+"-词汇记忆",q:de?"“"+z.de+"”的意思是：":"“"+z.zh+"”对应的德语是：",opts:sh([ans].concat(vals)),correctText:ans,e:"词条来自你提供的词库："+z.de+" = "+z.zh+"。",generated:true}}
function makeSet(n,u,mode){var U=u==="ALL"?Object.keys(UG):[u],S=[],O=[],weak=Object.keys(state.skills||{}).filter(function(k){return(state.skills[k].wrong||0)>0});U.forEach(function(x){(UG[x]||[]).forEach(function(g){S.push([x,g])})});for(var i=0;i<n*5&&O.length<n;i++){if(mode==="vocab"||(mode==="mixed"&&Math.random()<.35)){var v=vq(u);if(v)O.push(v);continue}var p;if(mode==="weak"&&weak.length){var w=weak[Math.floor(Math.random()*weak.length)];p=[w.slice(0,2),w.slice(3)]}else p=S[Math.floor(Math.random()*S.length)];var q=p?gq(p[0],p[1]):null;if(q)O.push(q)}return sh(O).slice(0,n)}

window.startDynamicPractice=function(){var u=document.getElementById("dynamicUnit").value,n=+document.getElementById("dynamicCount").value,m=document.getElementById("dynamicMode").value,q=makeSet(n,u,m);if(!q.length){alert("当前资料范围暂时没有足够可生成的题目；E9–E10 请先补充原始材料。");return}session={queue:q,pos:0,correct:0,mode:"dynamic",current:null,answered:false};go("quiz");showDyn()}
window.startSmartQuiz=function(){var q=makeSet(10,"ALL","weak");session={queue:q,pos:0,correct:0,mode:"dynamic",current:null,answered:false};go("quiz");showDyn()}
function showDyn(){if(session.pos>=session.queue.length){document.getElementById("qtext").textContent="本轮完成 🎉";document.getElementById("options").innerHTML="";document.getElementById("feedback").innerHTML='<div class="answer ok"><b>'+session.correct+" / "+session.queue.length+'</b><br>下一轮会重新组合题目。</div>';document.getElementById("progress").textContent="完成";return}var q=session.queue[session.pos];session.current=q;session.answered=false;document.getElementById("qtype").textContent=q.category+" · 自动生成";document.getElementById("progress").textContent=(session.pos+1)+" / "+session.queue.length;document.getElementById("qtext").textContent=q.q;document.getElementById("feedback").innerHTML="";document.getElementById("options").innerHTML=q.opts.map(function(o,i){return'<button class="option" onclick="answerDyn('+i+')">'+eh(o)+'</button>'}).join("");document.getElementById("nextBtn").disabled=true}
window.answerDyn=function(i){if(session.answered)return;var q=session.current,ok=i===q.opts.indexOf(q.correctText);session.answered=true;state.total++;state.correct+=ok?1:0;state.wrong+=ok?0:1;state.skills[q.skill]=state.skills[q.skill]||{right:0,wrong:0,streak:0};var st=state.skills[q.skill];if(ok){st.right++;st.streak++}else{st.wrong++;st.streak=0}updateSchedule(q.skill,ok);if(!ok){state.mistakes.unshift({time:new Date().toISOString(),unit:q.unit,skill:q.skill,q:q.q,correct:q.correctText,user:q.opts[i],explanation:q.e,generated:true});state.mistakes=state.mistakes.slice(0,200)}saveState();document.querySelectorAll("#options .option").forEach(function(b,j){if(j===q.opts.indexOf(q.correctText))b.classList.add("correct");if(j===i&&!ok)b.classList.add("wrong");b.disabled=true});document.getElementById("feedback").innerHTML='<div class="answer '+(ok?"ok":"bad")+'"><b>'+(ok?"✓ 正确":"✗ 错误")+'</b><br>'+(ok?"":"<b>正确答案：</b>"+eh(q.correctText)+"<br>")+eh(q.e)+'</div>';session.correct+=ok?1:0;document.getElementById("nextBtn").disabled=false}
window.nextQuestion=function(){if(session.mode==="dynamic"){if(session.current&&session.answered){session.pos++;showDyn()}return}if(!session.current||!session.answered)return;session.pos++;showQuestion()}

function initDynamic(){normalizeUnits();hideGrammar();visual();
var learn=document.getElementById("learn");if(learn){learn.innerHTML='<div class="card hero-card"><div class="eyebrow">ADAPTIVE PRACTICE · 自动出题</div><h2>学习中心</h2><p class="muted">不再使用固定题库。选择范围、题量和模式后，系统按固定知识点＋词库实时生成本轮题目。</p><div class="practice-config"><div><label>练习范围</label><select id="dynamicUnit"></select></div><div><label>题量</label><select id="dynamicCount"><option>5</option><option selected>10</option><option>15</option><option>20</option><option>30</option></select></div><div><label>模式</label><select id="dynamicMode"><option value="mixed">混合：语法＋词汇</option><option value="grammar">以语法为主</option><option value="vocab">以词汇为主</option><option value="weak">优先薄弱点</option></select></div></div><div id="dynamicGrammarInfo" class="grammar-summary"></div><button class="primary" onclick="startDynamicPractice()">开始生成本轮练习</button></div><div class="card"><h3>本轮固定知识范围</h3><p class="muted">E1–E2：人称代词、现在时、冠词、kein、物主冠词；E3–E5：词库支持的 Akkusativ、Dativ、强变化、可分动词和时间/地点表达；E6：Dativ、固定介词和连接结构；E7：Perfekt/Partizip II/Präteritum；E8：Wo/Wohin、Wechselpräpositionen、固定搭配。</p></div>';var e=document.getElementById("dynamicUnit");e.innerHTML='<option value="ALL">E1–E8 综合</option>'+UNIT_INFO.slice(0,8).map(function(x){return'<option value="'+x[0]+'">'+x[0]+' · '+x[1]+'</option>'}).join("");e.onchange=renderGInfo;renderGInfo()}
var homeUnits=document.getElementById("unitGrid");if(homeUnits){homeUnits.innerHTML=UNIT_INFO.slice(0,8).map(function(x){return "<button class=\"unitbtn\" onclick=\"go('learn')\"><b>"+x[0]+" · "+x[1]+"</b><span class=\"muted small\">"+(UG[x[0]]||[]).length+" 个核心语法点 · "+FULL_VOCAB.filter(function(v){return v.unit===x[0]}).length+" 条词汇</span></button>"}).join("")}var words=document.getElementById("words");if(words){words.innerHTML='<div class="card hero-card"><div class="eyebrow">VOCABULARY MEMORY · 词汇记忆</div><h2>单词记背</h2><p class="muted">默认随机抽取 E1–E8，并尽量平衡单个词与短语。系统自动判断答案并记录每个词条的掌握度。</p><div class="vocab-tools"><select id="memoryUnit"></select><select id="memoryMode"><option value="de2zh">看德选中</option><option value="zh2de">看中选德</option></select><select id="memoryCount"><option>10</option><option selected>20</option><option>30</option><option>50</option></select></div><div class="memory-card"><button class="primary" onclick="startMemoryTest()">▶ 点击开始</button><div class="memory-mode" id="memoryModeLabel">看德选中</div><div class="memory-word" id="memoryWord">点击“点击开始”生成随机词汇题</div><div class="memory-answer hidden" id="memoryAnswer"></div><div id="memoryOptions" class="memory-buttons"></div><div class="memory-stat" id="memoryStat"></div></div></div><div class="card"><h3>词汇掌握度</h3><div id="vocabProgress"></div></div><div class="card"><div class="eyebrow">QUICK TRANSLATOR · 快速翻译</div><h3>德语 ↔ 中文</h3><textarea id="translatorInput" placeholder="输入德语单词、短语或句子"></textarea><div class="translator-actions"><select id="translatorPair"><option value="auto">自动判断</option><option value="de|zh-CN">德语 → 中文</option><option value="zh-CN|de">中文 → 德语</option></select><button class="primary" onclick="translateText()">翻译</button><button class="secondary" onclick="clearTranslator()">清空</button></div><div id="translatorResult" class="translation-result muted">翻译结果会显示在这里。</div><a class="translate-link" href="https://translate.google.com/?sl=de&tl=zh-CN&op=translate" target="_blank" rel="noopener">打开 Google 翻译 ↗</a></div>';var e2=document.getElementById("memoryUnit");e2.innerHTML='<option value="ALL">全部 E1–E8</option>'+UNIT_INFO.slice(0,8).map(function(x){return'<option value="'+x[0]+'">'+x[0]+' '+x[1]+'</option>'}).join("");e2.value="ALL";resetMemory()}}
function renderGInfo(){var u=document.getElementById("dynamicUnit")?.value||"ALL",box=document.getElementById("dynamicGrammarInfo");if(!box)return;var us=u==="ALL"?Object.keys(UG):[u];box.innerHTML="<b>知识点：</b> "+us.flatMap(function(x){return UG[x]}).map(function(g){return'<span class="grammar-chip">'+eh(g)+'</span>'}).join("")}
function resetMemory(){window._mem={items:[],pos:0,score:0,answered:false,mode:document.getElementById("memoryMode")?.value||"de2zh",unit:document.getElementById("memoryUnit")?.value||"ALL",count:+(document.getElementById("memoryCount")?.value||20)};document.getElementById("memoryWord").textContent="点击“点击开始”生成随机词汇题";document.getElementById("memoryOptions").innerHTML="";document.getElementById("memoryAnswer").classList.add("hidden");document.getElementById("memoryStat").textContent="系统会自动判断。"}
function startMemoryTest(){var m=window._mem;m.mode=document.getElementById("memoryMode").value;m.unit=document.getElementById("memoryUnit").value;m.count=+(document.getElementById("memoryCount").value||20);var p=pool(m.unit);m.items=sh(p).slice(0,Math.min(m.count,p.length));m.pos=0;m.score=0;showMem()}
function showMem(){var m=window._mem,q=m.items[m.pos],w=document.getElementById("memoryWord"),a=document.getElementById("memoryAnswer"),o=document.getElementById("memoryOptions");if(!q){w.textContent="本轮完成 🎉";a.textContent="正确 "+m.score+" / "+m.items.length+" · 熟练度已记录";a.classList.remove("hidden");o.innerHTML="";return}m.answered=false;var z=vp(q.raw),correct=m.mode==="de2zh"?z.zh:z.de;w.textContent=m.mode==="de2zh"?z.de:z.zh;a.classList.add("hidden");var c=[],seen={};seen[correct]=1;for(var i=0;i<30&&c.length<3;i++){var v=p[Math.floor(Math.random()*p.length)],x=vp(v.raw),t=m.mode==="de2zh"?x.zh:x.de;if(t&&!seen[t]){seen[t]=1;c.push(t)}}o.innerHTML=sh([correct].concat(c)).map(function(x){return'<button class="option" onclick=\'memAnswer(this,'+JSON.stringify(x)+')\'>'+eh(x)+'</button>'}).join("");document.getElementById("memoryModeLabel").textContent=m.mode==="de2zh"?"看德选中":"看中选德";document.getElementById("memoryStat").textContent="第 "+(m.pos+1)+" / "+m.items.length+" 题 · 选择后立即判断"}
function memAnswer(btn,val){var m=window._mem;if(m.answered)return;m.answered=true;var q=m.items[m.pos],z=vp(q.raw),correct=m.mode==="de2zh"?z.zh:z.de,ok=val===correct,st=vs(),k=vk(q),x=st[k]||{right:0,wrong:0,streak:0,mastery:0};if(ok){x.right++;x.streak++;x.mastery=Math.min(100,(x.mastery||0)+12+Math.min(x.streak,5)*2);m.score++}else{x.wrong++;x.streak=0;x.mastery=Math.max(0,(x.mastery||0)-25)}x.last=Date.now();x.due=Date.now()+(ok?86400000*Math.min(Math.max(x.streak,1),14):600000);st[k]=x;sv(st);document.querySelectorAll("#memoryOptions .option").forEach(function(b){if(b.textContent===correct)b.classList.add("correct");if(b===btn&&!ok)b.classList.add("wrong");b.disabled=true});var a=document.getElementById("memoryAnswer");a.innerHTML=(ok?"✓ 正确":"✗ 错误")+"<br><b>正确答案：</b>"+eh(correct)+"<br><span class=\'small muted\'>掌握度："+x.mastery+"%</span>";a.classList.remove("hidden");setTimeout(function(){m.pos++;showMem();renderVP()},900)}
function renderVP(){var box=document.getElementById("vocabProgress");if(!box)return;var st=vs();box.innerHTML=UNIT_INFO.slice(0,8).map(function(u){var a=FULL_VOCAB.filter(function(v){return v.unit===u[0]}),avg=a.length?Math.round(a.reduce(function(t,v){return t+mastery(st[vk(v)])},0)/a.length):0;return'<div class="skillrow"><b>'+u[0]+' · '+u[1]+'</b><br><span class="muted">平均掌握度 '+avg+'%</span><div class="scorebar" style="margin-top:7px"><i style="width:'+avg+'%"></i></div></div>'}).join("")}
function translateText(){var input=document.getElementById("translatorInput").value.trim(),out=document.getElementById("translatorResult");if(!input)return;var pair=document.getElementById("translatorPair").value;if(pair==="auto")pair=/[\u4e00-\u9fff]/.test(input)?"zh-CN|de":"de|zh-CN";out.textContent="翻译中…";fetch("https://api.mymemory.translated.net/get?q="+encodeURIComponent(input)+"&langpair="+encodeURIComponent(pair)).then(function(r){return r.json()}).then(function(d){out.textContent=(d.responseData&&d.responseData.translatedText)||"未获得翻译结果"}).catch(function(){out.textContent="在线翻译暂时不可用，请打开下方 Google 翻译。"})}
function clearTranslator(){document.getElementById("translatorInput").value="";document.getElementById("translatorResult").textContent="翻译结果会显示在这里。"}
function renderVP(){var b=document.getElementById("vocabProgress");if(!b)return;var st=vs();b.innerHTML=UNIT_INFO.slice(0,8).map(function(u){var a=FULL_VOCAB.filter(function(v){return v.unit===u[0]}),avg=a.length?Math.round(a.reduce(function(t,v){return t+mastery(st[vk(v)])},0)/a.length):0;return'<div class="skillrow"><b>'+u[0]+' · '+u[1]+'</b><br><span class="muted">平均掌握度 '+avg+'%</span><div class="scorebar" style="margin-top:7px"><i style="width:'+avg+'%"></i></div></div>'}).join("")}
initDynamic();renderVP();
})();


/* ================= V5 PATCH ================= */
(function(){
"use strict";
function V5esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]})}
function V5shuffle(a){return a.slice().sort(function(){return Math.random()-.5})}
function V5vp(raw){var s=String(raw||""),m=s.match(/^(.*?)(?=[\u4e00-\u9fff])/);return m?{de:m[1].trim(),zh:s.slice(m[1].length).trim()}:{de:s.trim(),zh:""}}
function V5allV(){
 var a=[];
 try{if(typeof FULL_VOCAB!=="undefined"&&Array.isArray(FULL_VOCAB))a=FULL_VOCAB}catch(e){}
 try{if((!a||!a.length)&&typeof VOCAB!=="undefined"&&Array.isArray(VOCAB))a=VOCAB}catch(e){}
 try{if((!a||!a.length)&&Array.isArray(window.FULL_VOCAB))a=window.FULL_VOCAB}catch(e){}
 try{if((!a||!a.length)&&Array.isArray(window.VOCAB))a=window.VOCAB}catch(e){}
 return Array.isArray(a)?a:[];
}
function V5pool(u){
 return V5allV().filter(function(v){
  var z=V5vp(v&&v.raw);
  return v&&(u==="ALL"||v.unit===u)&&z.de&&z.zh;
 });
}
function V5isPhrase(v){return /\s/.test(V5vp(v.raw).de.trim())}
function V5balancedItems(p,n){
 p=Array.isArray(p)?p:[];
 n=Math.min(Math.max(1,n||1),p.length);
 var singles=V5shuffle(p.filter(function(v){return !V5isPhrase(v)}));
 var phrases=V5shuffle(p.filter(function(v){return V5isPhrase(v)}));
 var targetP=Math.min(phrases.length,Math.floor(n/2));
 var targetS=Math.min(singles.length,n-targetP);
 var out=V5shuffle(singles.slice(0,targetS).concat(phrases.slice(0,targetP)));
 var used={};out.forEach(function(v){used[V5key(v)]=1});
 if(out.length<n){
  V5shuffle(p).forEach(function(v){
   if(out.length<n&&!used[V5key(v)]){used[V5key(v)]=1;out.push(v)}
  });
 }
 return V5shuffle(out);
}
function V5key(v){return (v.unit||"")+"\u0001"+(v.raw||"")}
function V5store(){try{return JSON.parse(localStorage.getItem("DeutschTrainingLab_VocabMemory_v1")||"{}")}catch(e){return {}}}
function V5save(x){localStorage.setItem("DeutschTrainingLab_VocabMemory_v1",JSON.stringify(x))}
function V5master(x){if(!x)return 0;var n=(x.right||0)+(x.wrong||0);if(!n)return 0;return Math.max(0,Math.min(100,Math.round((x.right||0)/n*70+Math.min(x.streak||0,5)*6)))}

var V5UG={
 E1:["人称代词第一格","规则动词现在时变位","sein 现在时变位","（不）定冠词第一格","句子类型与基本语序"],
 E2:["kein- 第一格","不规则动词现在时变位","物主冠词第一格"],
 E3:["es gibt + Akkusativ","第三格人称代词","helfen / schmecken 等第三格动词","强变化动词现在时"],
 E4:["第四格基础使用","数量与量词表达","kein / nichts 否定"],
 E5:["可分动词现在时","时间表达","地点与方向表达","in / an / auf / nach / zu / von / aus"],
 E6:["第三格动词","固定介词与格","nicht ..., sondern ...","nicht nur ..., sondern auch ...","zwar ..., aber ..."],
 E7:["Perfekt 基本结构","haben / sein 的选择","规则与不规则 Partizip II","-ieren 不加 ge-","可分/不可分前缀","sein / haben 的 Präteritum"],
 E8:["Wo / Wohin","Wechselpräpositionen 的 Dativ / Akkusativ","nach Hause / zu Hause","sorgen für / führen zu / überzeugen von / überreden zu","地点与问路表达"]
};
var V5GB={
 E1:[
  ["Ich ___ Deutsch.","lerne",["lernt","lernen","lernst"],"规则动词现在时"],
  ["Wir ___ Studenten.","sind",["seid","ist","bin"],"sein 现在时"],
  ["___ bin Studentin.","Ich",["Mich","Mir","Mein"],"人称代词第一格"],
  ["Das ist ___ Student.","ein",["eine","einen","einer"],"不定冠词第一格"]
 ],
 E2:[
  ["Das ist ___ Problem.","kein",["keine","keinen","nicht"],"kein- 第一格"],
  ["Er ___ gern Bücher.","liest",["lese","lesen","liest"],"不规则动词现在时"],
  ["Das ist ___ Buch. (ich)","mein",["meine","meinen","meiner"],"物主冠词第一格"],
  ["Du ___ gern Musik.","hörst",["hört","höre","hören"],"现在时变位"]
 ],
 E3:[
  ["In der Stadt gibt es ___ Bibliothek.","eine",["ein","einer","einen"],"es gibt + Akkusativ"],
  ["Ich helfe ___. (du)","dir",["dich","du","dein"],"第三格人称代词"],
  ["Das Essen schmeckt ___. (ich)","mir",["mich","mein","ich"],"schmecken + Dativ"],
  ["Er ___ zu Mittag. (essen)","isst",["esse","esst","essen"],"强变化动词"]
 ],
 E4:[
  ["Ich probiere ___ Apfel.","den",["der","dem","des"],"第四格基础使用"],
  ["eine ___ Milch","Packung",["Stück","Flasche","Tüte"],"数量与量词"],
  ["Ich brauche ___.","nichts",["kein","keine","nicht"],"nichts 否定"],
  ["Ich kaufe ___ Schokolade.","eine Tafel",["ein Bund","ein Netz","ein Beutel"],"数量表达"]
 ],
 E5:[
  ["Ich ___ früh ___. (aufstehen)","stehe / auf",["aufstehe / stehe","stehe / an","auf / stehe"],"可分动词"],
  ["Wir treffen uns ___ 8 Uhr.","um",["am","in","nach"],"时间表达"],
  ["Ich komme ___ China.","aus",["von","nach","zu"],"地点/来源"],
  ["Ich gehe ___ Bibliothek.","in die",["in der","auf dem","von der"],"方向表达"]
 ],
 E6:[
  ["Das Buch gehört ___. (ich)","mir",["mich","mein","ich"],"第三格动词"],
  ["Ich habe Angst ___ etwas.","vor",["für","auf","mit"],"固定介词"],
  ["Er trinkt nicht Kaffee, ___ Tee.","sondern",["aber","oder","und"],"nicht ..., sondern ..."],
  ["Sie ist zwar müde, ___ sie arbeitet weiter.","aber",["sondern","und","oder"],"zwar ..., aber ..."],
  ["Ich danke ___. (du)","dir",["dich","du","dein"],"danken + Dativ"]
 ],
 E7:[
  ["Ich ___ Deutsch ___. (lernen)","habe / gelernt",["bin / gelernt","habe / lernen","bin / lernen"],"Perfekt"],
  ["Wir ___ nach Berlin gefahren.","sind",["haben","waren","hatten"],"Perfekt 助动词"],
  ["studieren →","studiert",["gestudiert","studieren","studierte"],"-ieren"],
  ["besuchen →","besucht",["gebesucht","besuchen","besuchte"],"不可分前缀"],
  ["einladen →","eingeladen",["geeinladen","einladet","eingeladet"],"可分动词"],
  ["lesen →","gelesen",["gelest","gelesert","lesen"],"强变化"],
  ["sein 的 ich-Präteritum：","war",["bin","hatte","wurde"],"Präteritum"],
  ["haben 的 ich-Präteritum：","hatte",["habe","war","wurde"],"Präteritum"]
 ],
 E8:[
  ["Ich stelle das Buch ___ Tisch.","auf den",["auf dem","an der","in der"],"Wohin + Akkusativ"],
  ["Das Buch liegt ___ Tisch.","auf dem",["auf den","in den","an die"],"Wo + Dativ"],
  ["Ich gehe ___ Hause.","nach",["zu","in","an"],"nach Hause"],
  ["Ich bin ___ Hause.","zu",["nach","in","an"],"zu Hause"],
  ["Das führt ___ Problemen.","zu",["für","von","auf"],"führen zu + Dativ"],
  ["Er überzeugt mich ___ seiner Idee.","von",["zu","für","mit"],"überzeugen von"],
  ["Pflanzen sorgen ___ gute Luft.","für",["vor","von","zu"],"sorgen für"]
 ]
};

function V5style(){
 if(document.getElementById("v5-style"))return;
 var s=document.createElement("style");s.id="v5-style";s.textContent=
 ":root{--vbg:#dfdde5;--vcard:#f4f2f6;--vink:#37343f;--vmuted:#6b6874;--vline:#b9b5c1;--vacc:#718177;--vsoft:#d7ddd8;--vbad:#92747d;--vshadow:0 14px 38px rgba(48,45,60,.11)}"+
 "body{background:radial-gradient(circle at 8% 0%,rgba(125,117,148,.24),transparent 34%),radial-gradient(circle at 95% 15%,rgba(137,160,146,.19),transparent 32%),var(--vbg)!important;color:var(--vink)!important;font-family:Inter,'Noto Sans SC','PingFang SC','Microsoft YaHei',system-ui,sans-serif!important;letter-spacing:.01em;font-weight:520}"+
 "header{background:linear-gradient(135deg,#56535f,#6e7371 55%,#78727f)!important;padding:34px 18px 30px!important;box-shadow:0 12px 32px rgba(54,63,58,.12)}"+
 "nav{background:rgba(239,238,242,.94)!important;border-bottom:1px solid rgba(150,160,153,.34)!important;box-shadow:0 8px 24px rgba(55,65,59,.05)}"+
 ".tab{padding:10px 15px;border-radius:13px;color:#5d6862!important;transition:.18s ease}.tab:hover{background:#dddde1;transform:translateY(-1px)}.tab.active{background:#d1d9d3!important;color:#3f544a!important;box-shadow:inset 0 0 0 1px rgba(88,109,98,.08)}"+
 ".card{background:rgba(246,244,248,.97)!important;border:1.7px solid rgba(157,151,169,.78)!important;border-radius:18px!important;box-shadow:var(--vshadow)!important}"+
 ".primary,.secondary,.dangerbtn{border-radius:12px!important;min-height:44px;padding:10px 17px!important;transition:transform .16s ease,box-shadow .16s ease;font-weight:650}.primary{background:#788b80!important;box-shadow:0 7px 18px rgba(70,88,79,.16)}.primary:hover,.secondary:hover{transform:translateY(-1px)}.primary:active,.secondary:active,.option:active,.v5memopt:active{transform:scale(.98)}"+
 ".secondary{background:#e4e9e4!important;color:#405047!important;border:1px solid #d0d8d1!important}.dangerbtn{background:#eee1df!important;color:#76514e!important}"+
 "select,input,textarea{border-radius:13px!important;border-color:#cbd3cc!important;background:#fbfcfa!important}"+
 ".option{border-radius:13px!important;background:#faf9fb!important;border:1.6px solid #c8c4ce!important;padding:14px 16px!important;transition:.16s ease;font-weight:560}.option:hover{background:#eef2ef!important;border-color:#84958b!important;transform:translateY(-1px)}"+
 ".option.correct{background:#dce9df!important;border-color:#678473!important}.option.wrong{background:#eee0de!important;border-color:#a47772!important}"+
 ".answer{border-radius:15px!important;background:#f0f4f0!important;border-left:4px solid #667c71!important}.answer.bad{background:#f3e9e7!important;border-left-color:#9a706c!important}.answer.ok{background:#e8f0ea!important;border-left-color:#5d7c69!important}"+
 ".practice-config{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:18px 0}.practice-config label{display:block;color:#6e7972;font-size:13px;margin-bottom:5px}.grammar-summary{padding:15px 16px;border-radius:17px;background:#e9eee9;border:1px solid #d0d9d2;margin:15px 0}.grammar-chip{display:inline-block;margin:4px 5px 4px 0;padding:6px 10px;border-radius:99px;background:#f7faf6;border:1px solid #d2dbd3;font-size:13px}"+
 ".v5stage{margin-top:18px}.v5stageq{font-size:26px;font-weight:730;line-height:1.45;margin:16px 0 22px}.v5progress{height:7px;background:#e1e6e1;border-radius:99px;overflow:hidden;margin:12px 0 20px}.v5progress i{display:block;height:100%;background:#748b80;width:0;transition:width .25s ease}.v5actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:16px}"+
 ".v5memcard{max-width:760px;margin:18px auto;padding:28px;border:1.8px solid #c0bbc9;border-radius:18px;background:linear-gradient(145deg,#fbfafd,#efedf3);text-align:center;box-shadow:0 16px 36px rgba(54,68,80,.09)}.v5memword{font-size:30px;font-weight:780;min-height:55px}.v5memopts{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:20px}.v5memopt{border:1.6px solid #c2ccd4;background:#f8fafb;border-radius:13px;padding:14px 17px;cursor:pointer;transition:.16s ease;min-width:180px;font-weight:560}.v5memopt:hover{background:#e9eff3;border-color:#788e9f;transform:translateY(-1px)}.v5memopt.correct{background:#dce8ee;border-color:#657f92}.v5memopt.wrong{background:#eee1e2;border-color:#9a767b}.v5next{display:none;margin-top:16px}.v5next.show{display:inline-flex}"+
 ".v5homegrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.v5homeitem{padding:20px;border-radius:18px;background:#f1f4f0;border:1px solid #d6ddd7;text-align:center}.v5homeitem span{font-size:13px;color:#707a74}.v5homeitem b{display:block;font-size:30px;margin-top:3px}.v5trans{min-height:90px;margin-top:12px;padding:15px;border-radius:15px;background:#f0f4f0;border:1px solid #d0d8d1;white-space:pre-wrap}@media(max-width:720px){.practice-config,.v5homegrid{grid-template-columns:1fr 1fr}.v5stageq{font-size:23px}}@media(max-width:500px){.practice-config,.v5homegrid{grid-template-columns:1fr}.v5memopt{width:100%}}";
 document.head.appendChild(s);
}

function V5home(){
 var h=document.getElementById("home");if(!h)return;
 h.innerHTML='<div class="card"><div style="font-size:12px;letter-spacing:.14em;color:#7a867f;font-weight:700">YOUR GERMAN TRAINING ROOM</div><h2>学习记录</h2><p class="muted">这里仅保留你的长期学习数据。具体练习分别放在「学习中心」和「智能练习」中。</p><div class="v5homegrid"><div class="v5homeitem"><span>累计答题</span><b id="v5-total">0</b></div><div class="v5homeitem"><span>正确率</span><b id="v5-rate">—</b></div><div class="v5homeitem"><span>错题</span><b id="v5-wrong">0</b></div><div class="v5homeitem"><span>待复习</span><b id="v5-due">0</b></div></div></div>';
}
function V5stats(){
 var t=state.total||0,r=t?Math.round((state.correct||0)/t*100)+"%":"—",w=state.wrong||0,d=Object.values(state.schedule||{}).filter(function(x){return x.next&&x.next<=Date.now()}).length;
 [["v5-total",t],["v5-rate",r],["v5-wrong",w],["v5-due",d]].forEach(function(x){var e=document.getElementById(x[0]);if(e)e.textContent=x[1]});
}

function V5topics(){
 var u=document.getElementById("v5lu")?document.getElementById("v5lu").value:"ALL",box=document.getElementById("v5topics");if(!box)return;
 var us=u==="ALL"?Object.keys(V5UG):[u],a=[];us.forEach(function(x){a=a.concat(V5UG[x]||[])});
 box.innerHTML="<b>固定知识点：</b> "+a.map(function(x){return "<span class='grammar-chip'>"+V5esc(x)+"</span>"}).join("");
}
function V5grammarQ(u){
 var a=V5GB[u]||[];if(!a.length)return null;
 var x=a[Math.floor(Math.random()*a.length)];
 return {unit:u,skill:u+"-"+x[3],category:"语法",q:x[0],opts:V5shuffle([x[1]].concat(x[2])),correct:x[1],explanation:"本题围绕 "+u+" 的固定知识点「"+x[3]+"」生成。"};
}
function V5vocabQ(u){
 var p=V5pool(u);if(!p.length)return null;
 var q=p[Math.floor(Math.random()*p.length)],z=V5vp(q.raw),de=Math.random()<.5,correct=de?z.zh:z.de,vals=[correct],seen={};seen[correct]=1;
 for(var i=0,arr=V5shuffle(p);i<arr.length&&vals.length<4;i++){var x=V5vp(arr[i].raw),v=de?x.zh:x.de;if(v&&!seen[v]){seen[v]=1;vals.push(v)}}
 if(vals.length<4)return null;
 return {unit:q.unit,skill:q.unit+"-词汇-"+(de?"德中":"中德"),category:"词汇",q:de?"“"+z.de+"”的意思是：":"“"+z.zh+"”对应的德语是：",opts:V5shuffle(vals),correct:correct,explanation:"词条来自你提供的 "+q.unit+" 词库："+z.de+" = "+z.zh+"。"};
}
function V5make(unit,n,mode){
 var us=unit==="ALL"?Object.keys(V5UG):[unit],out=[],seen={},weak=Object.entries(state.skills||{}).sort(function(a,b){return (b[1].wrong||0)-(a[1].wrong||0)}).map(function(x){return x[0]});
 for(var guard=0;out.length<n&&guard<n*50;guard++){
  var u=us[Math.floor(Math.random()*us.length)],q=null;
  if(mode==="vocab")q=V5vocabQ(u);
  else if(mode==="grammar")q=V5grammarQ(u);
  else if(mode==="weak"){
   var wk=weak.find(function(k){return k.indexOf(u+"-")===0});
   q=wk&&wk.indexOf("词汇")>=0?V5vocabQ(u):V5grammarQ(u);
   if(!wk&&Math.random()<.4)q=V5vocabQ(u);
  }else q=Math.random()<.55?V5grammarQ(u):V5vocabQ(u);
  if(q){var k=q.skill+"|"+q.q;if(!seen[k]){seen[k]=1;out.push(q)}}
 }
 return out;
}
function V5record(q,ok,user){
 state.total=(state.total||0)+1;state.correct=(state.correct||0)+(ok?1:0);state.wrong=(state.wrong||0)+(ok?0:1);state.skills=state.skills||{};
 var s=state.skills[q.skill]||{right:0,wrong:0,streak:0};if(ok){s.right++;s.streak=(s.streak||0)+1}else{s.wrong++;s.streak=0};state.skills[q.skill]=s;
 state.schedule=state.schedule||{};var o=state.schedule[q.skill]||{box:0,next:0};o.box=ok?Math.min((o.box||0)+1,5):0;
 var ints=[0,6e5,864e5,2592e5,6048e5,12096e5];o.next=Date.now()+(ok?ints[o.box]:6e5);state.schedule[q.skill]=o;
 if(!ok){state.mistakes=state.mistakes||[];state.mistakes.unshift({time:new Date().toISOString(),unit:q.unit,skill:q.skill,q:q.q,correct:q.correct,user:user||"",explanation:q.explanation,generated:true});state.mistakes=state.mistakes.slice(0,200)}
 localStorage.setItem(KEY,JSON.stringify(state));V5stats();
}

var V5learn={items:[],pos:0,correct:0,answered:false,current:null};
function V5learnBuild(){
 var el=document.getElementById("learn");if(!el)return;
 el.innerHTML='<div class="card"><div style="font-size:12px;letter-spacing:.14em;color:#7a867f;font-weight:700">LEARNING CENTER · 动态出题</div><h2>按单元生成练习</h2><p class="muted">不使用每单元固定题库。系统依据本单元固定语法知识点＋你提供的词库，实时组合本轮题目。</p><div class="practice-config"><div><label>练习单元</label><select id="v5lu"></select></div><div><label>题量</label><select id="v5lc"><option>5</option><option selected>10</option><option>15</option><option>20</option><option>30</option></select></div><div><label>题型重点</label><select id="v5lm"><option value="mixed">混合：语法＋词汇</option><option value="grammar">语法为主</option><option value="vocab">词汇为主</option><option value="weak">优先薄弱点</option></select></div></div><div id="v5topics" class="grammar-summary"></div><button class="primary" onclick="V5startLearn()">开始本轮练习</button></div><div id="v5learnstage" class="card v5stage"><div class="muted">请先设置单元、题量和题型，然后点击「开始本轮练习」。</div></div>';
 var s=document.getElementById("v5lu");s.innerHTML='<option value="ALL">E1–E8 综合</option>'+Object.keys(V5UG).map(function(u){return '<option value="'+u+'">'+u+'</option>'}).join("");s.onchange=V5topics;V5topics();
}
function V5renderLearn(){
 var root=document.getElementById("v5learnstage");if(!root)return;
 if(V5learn.pos>=V5learn.items.length){root.innerHTML='<div class="answer ok"><b>本轮完成 🎉</b><br>正确 '+V5learn.correct+' / '+V5learn.items.length+'<br><span class="muted">已自动记录知识点表现与复习计划。</span></div><button class="primary" onclick="V5startLearn()" style="margin-top:14px">再来一轮</button>';return}
 var q=V5learn.items[V5learn.pos];V5learn.current=q;V5learn.answered=false;
 root.innerHTML='<div class="qhead"><div><span class="tag">'+V5esc(q.category)+' · 自动生成</span><div class="v5stageq">'+V5esc(q.q)+'</div></div><div class="muted">'+(V5learn.pos+1)+' / '+V5learn.items.length+'</div></div><div class="v5progress"><i style="width:'+(V5learn.pos/V5learn.items.length*100)+'%"></i></div><div id="v5learnopts">'+q.opts.map(function(o,i){return '<button class="option" onclick="V5answerLearn('+i+')">'+V5esc(o)+'</button>'}).join("")+'</div><div id="v5learnfb"></div><div class="v5actions"><button id="v5learnnext" class="primary" disabled onclick="V5nextLearn()">下一题 →</button></div>';
}
window.V5startLearn=function(){var u=document.getElementById("v5lu").value,n=+document.getElementById("v5lc").value,m=document.getElementById("v5lm").value,it=V5make(u,n,m);if(!it.length){alert("当前范围暂时没有足够可生成的材料。请先补充该单元词库。");return}V5learn={items:it,pos:0,correct:0,answered:false,current:null};V5renderLearn()};
window.V5answerLearn=function(i){if(V5learn.answered)return;var q=V5learn.current,ok=q.opts[i]===q.correct;V5learn.answered=true;if(ok)V5learn.correct++;V5record(q,ok,q.opts[i]);document.querySelectorAll("#v5learnopts .option").forEach(function(b,j){b.disabled=true;if(q.opts[j]===q.correct)b.classList.add("correct");if(j===i&&!ok)b.classList.add("wrong")});document.getElementById("v5learnfb").innerHTML='<div class="answer '+(ok?"ok":"bad")+'"><b>'+(ok?"✓ 正确":"✗ 错误")+'</b>'+(ok?"":"<br><b>正确答案：</b>"+V5esc(q.correct))+'<br><span class="small">'+V5esc(q.explanation)+'</span></div>';document.getElementById("v5learnnext").disabled=false};
window.V5nextLearn=function(){if(!V5learn.answered)return;V5learn.pos++;V5renderLearn()};

var V5smart={items:[],pos:0,correct:0,answered:false,current:null};
function V5smartBuild(){
 var el=document.getElementById("quiz");if(!el)return;
 el.innerHTML='<div class="card"><div style="font-size:12px;letter-spacing:.14em;color:#7a867f;font-weight:700">ADAPTIVE PRACTICE · 智能练习</div><h2>智能练习</h2><p class="muted">每日智能十题与薄弱点强化都集中在这里。系统会依据你的答题记录动态调整知识点权重。</p><div class="practice-config"><div><label>模式</label><select id="v5smode"><option value="daily">每日智能 10 题</option><option value="weak">根据薄弱点生成</option><option value="mixed">全范围自适应</option></select></div><div><label>题量</label><select id="v5scount"><option selected>10</option><option>15</option><option>20</option><option>30</option></select></div><div><label>范围</label><select id="v5sunit"><option value="ALL">E1–E8 全部</option>'+Object.keys(V5UG).map(function(u){return '<option value="'+u+'">'+u+'</option>'}).join("")+'</select></div></div><button class="primary" onclick="V5startSmart()">开始智能练习</button><button class="secondary" onclick="V5startSmart(\'weak\')" style="margin-left:7px">直接强化薄弱点</button></div><div id="v5smartstage" class="card v5stage"><div class="muted">选择模式后开始。这里不会跳到其他板块。</div></div>';
}
function V5renderSmart(){
 var root=document.getElementById("v5smartstage");if(!root)return;
 if(V5smart.pos>=V5smart.items.length){root.innerHTML='<div class="answer ok"><b>本轮完成 🎉</b><br>正确 '+V5smart.correct+' / '+V5smart.items.length+'<br><span class="muted">系统已根据本轮结果更新薄弱点和间隔复习。</span></div><button class="primary" onclick="V5startSmart()" style="margin-top:14px">再来一轮</button>';return}
 var q=V5smart.items[V5smart.pos];V5smart.current=q;V5smart.answered=false;
 root.innerHTML='<div class="qhead"><div><span class="tag">'+V5esc(q.category)+' · 智能生成</span><div class="v5stageq">'+V5esc(q.q)+'</div></div><div class="muted">'+(V5smart.pos+1)+' / '+V5smart.items.length+'</div></div><div class="v5progress"><i style="width:'+(V5smart.pos/V5smart.items.length*100)+'%"></i></div><div id="v5smartopts">'+q.opts.map(function(o,i){return '<button class="option" onclick="V5answerSmart('+i+')">'+V5esc(o)+'</button>'}).join("")+'</div><div id="v5smartfb"></div><div class="v5actions"><button id="v5smartnext" class="primary" disabled onclick="V5nextSmart()">下一题 →</button></div>';
}
window.V5startSmart=function(force){var mode=force||document.getElementById("v5smode")?.value||"daily",n=+(document.getElementById("v5scount")?.value||10),u=document.getElementById("v5sunit")?.value||"ALL";var m=mode==="weak"?"weak":mode==="daily"?"mixed":mode;var it=V5make(u,n,m);if(!it.length){alert("目前没有足够的可生成材料。请先补充词库或完成一些练习。");return}V5smart={items:it,pos:0,correct:0,answered:false,current:null};V5renderSmart()};
window.V5answerSmart=function(i){if(V5smart.answered)return;var q=V5smart.current,ok=q.opts[i]===q.correct;V5smart.answered=true;if(ok)V5smart.correct++;V5record(q,ok,q.opts[i]);document.querySelectorAll("#v5smartopts .option").forEach(function(b,j){b.disabled=true;if(q.opts[j]===q.correct)b.classList.add("correct");if(j===i&&!ok)b.classList.add("wrong")});document.getElementById("v5smartfb").innerHTML='<div class="answer '+(ok?"ok":"bad")+'"><b>'+(ok?"✓ 正确":"✗ 错误")+'</b>'+(ok?"":"<br><b>正确答案：</b>"+V5esc(q.correct))+'<br><span class="small">'+V5esc(q.explanation)+'</span></div>';document.getElementById("v5smartnext").disabled=false};
window.V5nextSmart=function(){if(!V5smart.answered)return;V5smart.pos++;V5renderSmart()};

var V5mem={items:[],pos:0,score:0,answered:false,mode:"de2zh",unit:"ALL"};
function V5wordsBuild(){
 var w=document.getElementById("words");if(!w)return;
 w.innerHTML='<div class="card"><div style="font-size:12px;letter-spacing:.14em;color:#7a867f;font-weight:700">VOCABULARY MEMORY · 词汇记背</div><h2>单词记背</h2><p class="muted">从已有 E1–E8 词库随机抽取，自动判断答案并记录每个词条的熟练程度。答完后必须点击“下一题”才会进入下一题。</p><div class="vocab-tools"><select id="v5mu"></select><select id="v5mm"><option value="de2zh">看德选中</option><option value="zh2de">看中选德</option></select><select id="v5mc"><option>10</option><option selected>20</option><option>30</option><option>50</option></select></div><div class="v5memcard"><button id="v5mstart" type="button" class="primary">▶ 点击开始</button><div class="memory-mode" id="v5mlabel">尚未开始</div><div class="v5memword" id="v5mword">选择范围和题量后开始</div><div id="v5mopts" class="v5memopts"></div><div id="v5mfb"></div><button id="v5mnext" class="primary v5next" onclick="V5nextMem()">下一题 →</button><div class="memory-stat" id="v5mstat"></div></div></div><div class="card"><h3>词汇熟练度</h3><p class="muted">答题历史会自动形成词条熟练度。答错会降低熟练度并缩短复习间隔，连续答对会提高熟练度。</p><div id="v5vp"></div></div><div class="card"><div style="font-size:12px;letter-spacing:.14em;color:#7a867f;font-weight:700">QUICK TRANSLATOR · 快速翻译</div><h3>德语 ↔ 中文</h3><textarea id="v5ti" placeholder="输入德语单词、短语或句子"></textarea><div class="translator-actions"><select id="v5tp"><option value="auto">自动判断</option><option value="de|zh-CN">德语 → 中文</option><option value="zh-CN|de">中文 → 德语</option></select><button class="primary" onclick="V5translate()">翻译</button><button class="secondary" onclick="document.getElementById(\'v5ti\').value=\'\';document.getElementById(\'v5tr\').textContent=\'翻译结果会显示在这里。\'">清空</button></div><div id="v5tr" class="v5trans muted">翻译结果会显示在这里。</div><p><a href="https://translate.google.com/?sl=de&tl=zh-CN&op=translate" target="_blank" rel="noopener" style="color:#61776b">打开 Google 翻译 ↗</a></p></div>';
 var startBtn=document.getElementById("v5mstart");
 if(startBtn)startBtn.addEventListener("click",function(e){e.preventDefault();V5startMem()});
 var nextBtn=document.getElementById("v5mnext");
 if(nextBtn){
  nextBtn.removeAttribute("onclick");
  nextBtn.addEventListener("click",function(e){e.preventDefault();window.V5nextMem()});
 }var s=document.getElementById("v5mu");s.innerHTML='<option value="ALL">全部 E1–E8</option>'+Object.keys(V5UG).map(function(u){return '<option value="'+u+'">'+u+'</option>'}).join("");V5renderVP();
}
function V5startMem(){
 try{
  var modeEl=document.getElementById("v5mm"),unitEl=document.getElementById("v5mu"),countEl=document.getElementById("v5mc");
  var mode=modeEl?modeEl.value:"de2zh",unit=unitEl?unitEl.value:"ALL",n=countEl?parseInt(countEl.value,10):20;
  var p=V5pool(unit);
  if(!p.length){
   var all=V5allV();
   alert("词库暂时没有被读取到。当前词库记录数："+all.length+"。如果你刚打开网页，请刷新一次后再试。");
   return;
  }
  var st=V5store(),weighted=[];
  p.forEach(function(v){
   var x=st[V5key(v)]||{},w=Math.min(12,1+(x.wrong||0)*3+((x.streak||0)<2?2:0));
   for(var i=0;i<w;i++)weighted.push(v);
  });
  var unique=[],seen={};
  V5shuffle(weighted).forEach(function(v){
   var k=V5key(v);
   if(!seen[k]){seen[k]=1;unique.push(v);}
  });
  var out=V5balancedItems(unique,Math.min(n,p.length));
  if(!out.length)out=V5shuffle(p).slice(0,Math.min(n,p.length));
  V5mem={items:out,pos:0,score:0,answered:false,mode:mode,unit:unit};
  V5showMem();
 }catch(e){
  console.error("V5 vocabulary start error",e);
  var fb=document.getElementById("v5mfb");
  if(fb)fb.innerHTML='<div class="answer bad"><b>启动失败</b><br><span class="small">'+V5esc(String(e&&e.message||e))+'</span><br>请刷新页面后重试。</div>';
 }
}
function V5showMem(){
 var w=document.getElementById("v5mword"),o=document.getElementById("v5mopts"),fb=document.getElementById("v5mfb"),nx=document.getElementById("v5mnext");
 if(V5mem.pos>=V5mem.items.length){w.textContent="本轮完成 🎉";o.innerHTML="";fb.innerHTML='<div class="answer ok"><b>正确 '+V5mem.score+' / '+V5mem.items.length+'</b><br>本轮词条熟练度已全部记录。</div>';nx.classList.remove("show");document.getElementById("v5mstat").textContent="可以重新开始一轮随机练习。";V5renderVP();return}
 var q=V5mem.items[V5mem.pos],z=V5vp(q.raw),correct=V5mem.mode==="de2zh"?z.zh:z.de;V5mem.answered=false;
 document.getElementById("v5mlabel").textContent=V5mem.mode==="de2zh"?"看德选中":"看中选德";w.textContent=V5mem.mode==="de2zh"?z.de:z.zh;fb.innerHTML="";nx.classList.remove("show");
 var vals=[correct],seen={};seen[correct]=1;for(var a=V5shuffle(V5pool(V5mem.unit).filter(function(v){return V5key(v)!==V5key(q)})),i=0;i<a.length&&vals.length<4;i++){var x=V5vp(a[i].raw),v=V5mem.mode==="de2zh"?x.zh:x.de;if(v&&!seen[v]){seen[v]=1;vals.push(v)}}o.innerHTML="";
 V5shuffle(vals).forEach(function(x){
  var b=document.createElement("button");
  b.type="button";b.className="v5memopt";b.textContent=x;
  b.addEventListener("click",function(){window.V5answerMem(b,x)});
  o.appendChild(b);
 });
 document.getElementById("v5mstat").textContent="第 "+(V5mem.pos+1)+" / "+V5mem.items.length+" 题 · 选择后立即判断";
}
window.V5answerMem=function(btn,val){
 try{
  if(V5mem.answered)return;
  var q=V5mem.items[V5mem.pos],z=V5vp(q.raw),correct=V5mem.mode==="de2zh"?z.zh:z.de,ok=val===correct;
  V5mem.answered=true;
  var st=V5store(),k=V5key(q),x=st[k]||{right:0,wrong:0,streak:0,mastery:0};
  if(ok){x.right++;x.streak=(x.streak||0)+1;x.mastery=Math.min(100,(x.mastery||0)+12+Math.min(x.streak,5)*2);V5mem.score++}
  else{x.wrong++;x.streak=0;x.mastery=Math.max(0,(x.mastery||0)-25)}
  x.last=Date.now();x.due=Date.now()+(ok?86400000*Math.min(Math.max(x.streak,1),14):600000);st[k]=x;V5save(st);
  document.querySelectorAll("#v5mopts .v5memopt").forEach(function(b){b.disabled=true;if(b.textContent===correct)b.classList.add("correct");if(b===btn&&!ok)b.classList.add("wrong")});
  var fb=document.getElementById("v5mfb");
  if(fb){
    fb.innerHTML='<div class="answer '+(ok?"ok":"bad")+'"><b>'+(ok?"✓ 正确":"✗ 错误")+'</b><br><b>正确答案：</b>'+V5esc(correct)+'<br><span class="small">本词条熟练度：'+x.mastery+'%</span><br><button type="button" id="v5mnext2" class="primary" style="margin-top:12px">下一题 →</button></div>';
    var nb=document.getElementById("v5mnext2");
    if(nb)nb.addEventListener("click",function(e){e.preventDefault();window.V5nextMem()});
  }
  var nx=document.getElementById("v5mnext");if(nx){nx.classList.add("show");nx.disabled=false;nx.style.display="inline-flex"}
  V5renderVP();
 }catch(e){
  var fb2=document.getElementById("v5mfb");
  if(fb2)fb2.innerHTML='<div class="answer bad"><b>答题处理出现问题</b><br><span class="small">'+V5esc(String(e&&e.message||e))+'</span></div>';
  console.error("V5 answer error",e);
 }
};
window.V5nextMem=function(){if(!V5mem.answered)return;V5mem.pos++;V5showMem()};
function V5renderVP(){
 var b=document.getElementById("v5vp");if(!b)return;var st=V5store(),all=V5allV();
 b.innerHTML=Object.keys(V5UG).map(function(u){var a=all.filter(function(v){return v.unit===u}),avg=a.length?Math.round(a.reduce(function(t,v){return t+V5master(st[V5key(v)])},0)/a.length):0;return '<div class="skillrow"><b>'+u+'</b><br><span class="muted small">平均熟练度 '+avg+'% · '+a.length+' 条词条</span><div class="scorebar" style="margin-top:7px"><i style="width:'+avg+'%"></i></div></div>'}).join("");
}
window.V5translate=function(){
 var inp=document.getElementById("v5ti"),out=document.getElementById("v5tr");if(!inp||!out||!inp.value.trim())return;var p=document.getElementById("v5tp").value;if(p==="auto")p=/[\u4e00-\u9fff]/.test(inp.value)?"zh-CN|de":"de|zh-CN";out.textContent="翻译中…";fetch("https://api.mymemory.translated.net/get?q="+encodeURIComponent(inp.value.trim())+"&langpair="+encodeURIComponent(p)).then(function(r){return r.json()}).then(function(d){out.textContent=d&&d.responseData&&d.responseData.translatedText?d.responseData.translatedText:"未获得翻译结果"}).catch(function(){out.textContent="在线翻译暂时不可用，请使用下方 Google 翻译备用入口。"});
};

function V5reviewBuild(){
 var r=document.getElementById("review");if(!r)return;
 r.innerHTML='<div class="card"><div style="font-size:12px;letter-spacing:.14em;color:#7a867f;font-weight:700">REVIEW · 间隔复习</div><h2>今日复习</h2><p class="muted">这里仅展示到期知识点；具体答题统一在「智能练习」中完成。</p><div id="v5reviewlist"></div><button class="primary" onclick="V5go(\'quiz\');setTimeout(function(){V5startSmart(\'weak\')},0)">开始到期复习</button></div>';
 var d=Object.entries(state.schedule||{}).filter(function(x){return x[1].next&&x[1].next<=Date.now()});document.getElementById("v5reviewlist").innerHTML=d.length?d.map(function(x){var s=state.skills[x[0]]||{};return '<div class="skillrow"><b>'+V5esc(x[0])+'</b><br><span class="muted small">正确 '+(s.right||0)+' · 错误 '+(s.wrong||0)+' · 已到期</span></div>'}).join(""):"<div class='notice'>今天暂时没有到期知识点。</div>";
}
function V5quizBuild(){
 var q=document.getElementById("quiz");if(!q)return;
 q.innerHTML='<div class="card"><div style="font-size:12px;letter-spacing:.14em;color:#7a867f;font-weight:700">ADAPTIVE PRACTICE · 智能练习</div><h2>智能练习</h2><p class="muted">每日智能十题与薄弱点强化集中在这里，不再跳到学习中心或其他板块。</p><div class="practice-config"><div><label>模式</label><select id="v5smode"><option value="daily">每日智能 10 题</option><option value="weak">根据薄弱点生成</option><option value="mixed">全范围自适应</option></select></div><div><label>题量</label><select id="v5scount"><option selected>10</option><option>15</option><option>20</option><option>30</option></select></div><div><label>范围</label><select id="v5sunit"><option value="ALL">E1–E8 全部</option>'+Object.keys(V5UG).map(function(u){return '<option value="'+u+'">'+u+'</option>'}).join("")+'</select></div></div><button class="primary" onclick="V5startSmart()">开始智能练习</button><button class="secondary" onclick="V5startSmart(\'weak\')" style="margin-left:7px">直接强化薄弱点</button></div><div id="v5smartstage" class="card v5stage"><div class="muted">设置完成后，练习会直接在这里开始。</div></div>';
}
function V5go(id){
 document.querySelectorAll(".page").forEach(function(x){x.classList.remove("active")});var p=document.getElementById(id);if(p)p.classList.add("active");document.querySelectorAll(".tab").forEach(function(x){x.classList.toggle("active",x.dataset.page===id)});
 if(id==="home"){V5home();V5stats()}
 if(id==="learn")V5learnBuild();
 if(id==="quiz")V5quizBuild();
 if(id==="words")V5wordsBuild();
 if(id==="review")V5reviewBuild();
 if(id==="mistakes"){try{renderMistakes()}catch(e){}}
 if(id==="library"){try{renderSourceCatalog();renderCustomMaterials()}catch(e){}}
 if(id==="data"){try{renderDataOverview()}catch(e){}}
}
window.V5go=V5go;window.go=V5go;
window.startSmartQuiz=function(){V5go("quiz");setTimeout(function(){V5startSmart()},0)};
window.startReview=function(){V5go("review");};
window.startSkill=function(){V5go("quiz");setTimeout(function(){V5startSmart("weak")},0)};
window.startUnit=function(unit){V5go("learn");setTimeout(function(){var s=document.getElementById("v5lu");if(s){s.value=unit;V5topics()}},0)};

function V5init(){
 V5style();
 var gt=document.querySelector('[data-page="grammar"]');if(gt)gt.remove();var gp=document.getElementById("grammar");if(gp)gp.remove();
 document.querySelectorAll(".tab").forEach(function(b){b.onclick=function(){V5go(b.dataset.page)}});
 V5home();V5learnBuild();V5quizBuild();V5wordsBuild();V5reviewBuild();V5stats();
}
V5init();
})();
