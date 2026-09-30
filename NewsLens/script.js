var SAMPLE="The Riverton city council voted 5-4 on Tuesday to close the Eastside and Milltown libraries by June, saying the move will save $2.1 million a year. Mayor Dana Whitfield said the closures were unavoidable because of falling tax revenue. Critics say the decision will hurt children in low-income areas.\n\nSources familiar with the talks said the council may also cut bus service next year. The city's finance report shows property tax income fell 8 percent since 2022. Whitfield claimed the cuts will never affect emergency services. \"This is the most responsible budget we have ever passed,\" she said.\n\nResidents reacted with outrage. Many people believe the closures are a disaster for the neighborhood. The library system is expected to lose about 40 staff positions, and officials say the changes could reduce visitor numbers.";
var $=function(i){return document.getElementById(i)};
var txt=$("txt"),wc=$("wc"),art=$("art"),D=null,TAB="claims",TM=[];
function words(t){t=t.trim();return t?t.split(/\s+/).length:0}
function el(tag,cls,t){var n=document.createElement(tag);if(cls)n.className=cls;if(t!=null)n.textContent=t;return n}
txt.addEventListener("input",function(){wc.textContent=words(txt.value)+" words";$("editor").classList.toggle("filled",!!txt.value.trim())});
$("sample").onclick=function(){txt.value=SAMPLE;txt.dispatchEvent(new Event("input"));run()};
$("clear").onclick=function(){txt.value="";txt.dispatchEvent(new Event("input"));txt.focus()};
$("go").onclick=run;
$("edit").onclick=function(){$("dash").hidden=true;$("editor").hidden=false;txt.focus()};
var RX={
 attrib:/\b(said|says|say|told|according to|reported|announced|claimed|claims|stated|argued|argues|wrote|added|noted|warned|explained|insisted)\b/i,
 evi:/\b(study|studies|survey|poll|polls|report|data|analysis|research|researchers|experiment|trial|court|filing|filings|document|documents|records|statistics|census|audit|peer-reviewed|published|figures|review|investigation|footage|transcript|testimony)\b/i,
 anon:/\b(?:sources?|people|officials?)\s+(?:familiar|close to|with knowledge)|on condition of anonymity|requested anonymity|anonymous|unnamed|\b(?:experts|scientists|critics|many(?: people)?|some(?: people)?|officials|analysts|observers|insiders|sources|residents)\s+(?:say|said|believe|argue|warn|claim|suggest|told|think|fear)\b/i,
 hedge:/\b(may|might|could|possibly|perhaps|reportedly|allegedly|apparently|appears?|seems?|suggests?|likely|unlikely|probably|estimated|roughly|about|approximately|expected|potential(?:ly)?|preliminary|uncertain|unclear|unconfirmed|believed|thought to|so far|yet to)\b/i,
 abs:/\b(always|never|proves?|proven|undeniabl\w*|clearly|obviously|certainly|definitely|everyone|nobody|no one|guarantee[sd]?|totally|completely|the only|without a doubt)\b|100 ?%/i,
 causal:/\b(because|caused?|causes|due to|leads? to|led to|results? in|resulted in|linked to|blamed|driven by|thanks to|responsible for)\b/i,
 loaded:/\b(slam(?:med)?|blast(?:ed)?|shocking|outrage\w*|disastrous|disaster|catastrophic|devastating|radical|extremist|explosive|bombshell|scandal|chaos|regime|so-called|massive|tragic|stunning|crisis)\b/i,
 counter:/\b(however|critics|opponents|disputed?|disagree\w*|denied|denies|on the other hand|although|whereas|in contrast|supporters|defenders|rejected|pushed back)\b/i,
 time:/\b(?:19|20)\d\d\b|\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|yesterday|today|january|february|march|april|may|june|july|august|september|october|november|december|last (?:week|month|year)|this (?:week|month|year))\b/i,
 base:/\b(compared (?:with|to)|versus|than last|up from|down from|previous(?:ly)?|average|baseline|per capita|year-on-year|since \d{4})\b/i,
 pred:/\b(will|would)\b/i,
 sup:/\b(most|largest|highest|lowest|first|record|worst|best|biggest)\b/i,
 op:/\b(?:I|we) (?:think|believe|feel)\b|in my view|\bshould\b|\bmust\b|\bneed to\b/i
};
function sents(p){
  var q=p.replace(/\b(Mr|Mrs|Ms|Dr|St|Jr|Sr|vs|Inc|Ltd|Gov|Sen|Rep|Rev|Prof|No)\./g,"$1§");
  return q.split(/(?<=[.!?]["”']?)\s+(?=["“'‘]?[A-Z0-9$])/).map(function(x){return x.replace(/§/g,".").trim()}).filter(Boolean);
}
function feat(s){
  var f={},t=s.replace(/\b(19|20)\d\d\b/g,"");
  f.num=/\d/.test(t);f.quote=/["“][^"”]{12,}["”]/.test(s);f.url=/https?:\/\//.test(s);
  for(var k in RX)f[k]=RX[k].test(s);
  f.evid=f.evi||f.url||(f.quote&&f.attrib)||(f.num&&/according to/i.test(s));
  f.q=/\?\s*$/.test(s);
  f.sc=(f.num?2:0)+(f.causal?2:0)+(f.abs?2:0)+(f.attrib?1:0)+(f.pred?1:0)+(f.sup?1:0);
  f.claim=!f.q&&s.length>25&&f.sc>=2;
  return f;
}
var STOP=/^(The|He|She|They|It|We|I|Critics|Officials|Sources|Experts|Residents|Many|Some|Analysts|Supporters|Opponents|Researchers|Scientists|People|Others|Police|This|That|These|Those|But|And|However|Reuters|Both)$/;
function names(text){
  var set={},m,n="[A-Z][\\w.'’-]*",nm="("+n+"(?:\\s+"+n+"){0,3})";
  var r1=new RegExp(nm+",?\\s+(?:said|says|told|added|noted|argued|wrote|claimed|stated|announced|warned|explained|insisted)\\b","g");
  var r2=new RegExp("according to\\s+(?:the\\s+)?"+nm,"g");
  [r1,r2].forEach(function(r){while((m=r.exec(text))){var x=m[1].trim();if(!(x.indexOf(" ")<0&&STOP.test(x)))set[x]=1}});
  var ks=Object.keys(set);
  return ks.filter(function(x){return !ks.some(function(y){return y!==x&&y.slice(-x.length-1)===" "+x})});
}
function analyze(text){
  var paras=text.replace(/\r/g,"").split(/\n+/).map(function(p){return p.trim()}).filter(Boolean),all=[];
  paras.forEach(function(p,i){sents(p).forEach(function(s){all.push({s:s,p:i,f:feat(s)})})});
  all.forEach(function(o,i){
    o.near=[i-1,i,i+1].some(function(j){return all[j]&&all[j].f.evid});
  });
  return all;
}
function tagsFor(f){var t=[];if(f.num)t.push("number");if(f.causal)t.push("cause & effect");if(f.pred)t.push("prediction");if(f.abs)t.push("absolute");if(f.sup)t.push("superlative");if(f.attrib&&!t.length)t.push("attributed");return t.join(" · ")}

function compute(text){
  var all=analyze(text),N=all.length,nw=words(text);
  all.forEach(function(o,i){o.i=i});
  var P=function(k){return all.filter(function(o){return o.f[k]})};
  var claims=P("claim"),evid=P("evid"),hedged=P("hedge"),abso=P("abs"),anon=P("anon");
  var named=names(text),counter=P("counter").length,loaded=P("loaded").length,nums=P("num").length;
  var timeAny=P("time").length>0,baseAny=P("base").length>0;
  var causalUn=all.filter(function(o){return o.f.causal&&!o.near}).length,op=P("op").length;
  var supported=claims.filter(function(o){return o.near}).length;
  var flags=[],F=function(t,d){flags.push([t,d])};
  if(!named.length)F("No named sources","Nobody is quoted or cited by name, so you can't check who is speaking or what stake they have.");
  else if(named.length===1)F("Only one named source","The story rests on a single voice. A second, independent source would show whether it holds up.");
  if(anon.length>=2)F("Leans on anonymous or vague sources","Phrases like “experts say” or “sources familiar” can't be checked. Ask who they are and why they aren't named.");
  if(!counter&&claims.length>=3)F("No opposing view","Nobody with a different position is quoted or answered, so you may be seeing one side.");
  if(!timeAny)F("No dates or timeframes","Without knowing when things happened, you can't tell if this is new, old or part of a trend.");
  if(nums>=2&&!baseAny)F("Figures without a baseline","Numbers appear with no comparison (last year, an average, other places), so their size is hard to judge.");
  if(causalUn)F("Cause and effect without evidence","Wording like “because” or “led to” implies a cause, but nothing nearby backs it up. Correlation isn't cause.");
  if(loaded>=2)F("Loaded wording","Emotive words can shape how you feel before you have weighed the facts.");
  if(abso.length)F("Absolute language","Words like “never”, “always” or “proves” claim a certainty few real situations support.");
  if(op>=3)F("Reads partly like opinion","First-person or “should/must” language suggests commentary mixed in with reporting.");
  if(!evid.length)F("No primary source pointed to","No study, document, dataset or record is named that you could go and read yourself.");
  if(nw<120)F("Very short text","There isn't much to go on, so treat these results loosely.");
  var qs=[];
  if(named.length<2)qs.push("Who else could confirm this?");if(anon.length>=2)qs.push("Why aren't these sources named?");
  if(!counter)qs.push("What would the other side say?");if(nums>=2&&!baseAny)qs.push("Compared with what?");
  if(causalUn)qs.push("What else could explain this?");if(!timeAny)qs.push("When did this happen, and what came before?");
  qs.push("Who gains if I believe this?");qs.push("Where can I read the original data or document?");
  var pts=(named.length>=2?1:0)+(claims.length&&supported/claims.length>=.5?1:0)+(counter?1:0)+(anon.length<=1?1:0)+(loaded<2?1:0);
  return{all:all,N:N,nw:nw,claims:claims,evid:evid,hedged:hedged,abso:abso,named:named,flags:flags,qs:qs.slice(0,5),pts:pts,supported:supported,anon:anon.length};
}
function jump(i){
  var s=$("s"+i);if(!s)return;
  s.scrollIntoView({behavior:"smooth",block:"center"});
  s.classList.remove("flash");void s.offsetWidth;s.classList.add("flash");
}
function renderArticle(){
  TM.forEach(clearTimeout);TM=[];art.textContent="";art.className="";
  var byP={};D.all.forEach(function(o){(byP[o.p]=byP[o.p]||[]).push(o)});
  Object.keys(byP).forEach(function(k){
    var p=el("p","");
    byP[k].forEach(function(o){
      var sp=el("span","",o.s),c=[];sp.id="s"+o.i;
      if(o.f.claim)c.push("claim");if(o.f.evid)c.push("evi");if(o.f.hedge)c.push("hedge");if(o.f.anon)c.push("anon");
      sp.className=c.join(" ")+" pend";
      p.appendChild(sp);p.appendChild(document.createTextNode(" "));
    });
    art.appendChild(p);
  });
  var lg=$("legend");lg.textContent="";
  [["claim","Claim","var(--mag)"],["evi","Evidence","var(--mint)"],["hedge","Hedged","var(--grn)"],["anon","Vague source","transparent;border:1.5px dashed var(--mag)"]].forEach(function(x){
    var b=el("button","lg");b.type="button";var i=el("i");i.style.cssText="background:"+x[2];b.appendChild(i);b.appendChild(el("span","",x[1]));
    b.onclick=function(){b.classList.toggle("off",art.classList.toggle("off-"+x[0]))};lg.appendChild(b)});
}
function add(box,arr,fn,empty){if(!arr.length){box.appendChild(el("p","fine",empty));return}arr.forEach(fn)}
function jumpItem(box,o,meta,color){
  var b=el("button","item");b.type="button";
  var st=el("strong","");if(color){var d=el("i","dot");d.style.background=color;st.appendChild(d)}
  st.appendChild(document.createTextNode(o.s));b.appendChild(st);if(meta)b.appendChild(el("small","",meta));
  b.onclick=function(){jump(o.i)};box.appendChild(b);
}
function fill(id,n,build){
  var p=$(id),b=p.querySelector(".pb"),c=p.querySelector(".cnt");
  b.textContent="";build(b);c.textContent=String(n);countUp(c,n);
  var rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
  Array.prototype.forEach.call(b.children,function(ch,i){ch.style.animationDelay=rm?"0ms":Math.min(i,12)*40+"ms"});
  b.scrollTop=0;
}
function renderPanels(){
  var k=D.pts>=4?"solid":D.pts>=2?"mixed":"thin",v=$("p-verdict");
  v.className="verdict v-"+k;v.textContent="";
  var t=el("div","");
  t.appendChild(el("div","kick",k==="solid"?"This one shows its work.":k==="mixed"?"Some of it holds up.":"Hold it up to the light."));
  t.appendChild(el("h2","","Sourcing looks "+k));
  t.appendChild(el("p","",D.claims.length+" claim"+(D.claims.length===1?"":"s")+", "+D.supported+" with a source nearby. "+D.named.length+" named source"+(D.named.length===1?"":"s")+", "+D.anon+" vague. "+D.nw+" words read."));
  t.appendChild(el("p","vnote","Reads wording patterns. It cannot check whether claims are true."));
  var m=el("div","meter");
  for(var i=0;i<5;i++){var sg=el("i",i<D.pts?"on":"");sg.style.animationDelay=(i*110)+"ms";m.appendChild(sg)}
  v.appendChild(t);v.appendChild(m);
  fill("p-claims",D.claims.length,function(b){add(b,D.claims.slice(0,12),function(o){jumpItem(b,o,(o.near?"Source nearby":"No source nearby")+(tagsFor(o.f)?" · "+tagsFor(o.f):""),o.near?"var(--grn)":"var(--mag)")},"No checkable claims found.")});
  fill("p-evidence",D.evid.length,function(b){
    b.appendChild(el("h3","","Named sources"));b.appendChild(el("p","fine",D.named.length?D.named.join(", "):"None found."));
    b.appendChild(el("h3","","Evidence in the text"));
    add(b,D.evid.slice(0,10),function(o){jumpItem(b,o,"","var(--mint)")},"No studies, documents, data or quotes are pointed to.");
  });
  fill("p-doubt",D.hedged.length,function(b){
    var sh=D.hedged.length/D.N;
    b.appendChild(el("p","fine",Math.round(sh*100)+"% of sentences hedge. "+(sh>=.15?"The article flags a fair amount of doubt.":"Little doubt is flagged, which can make things sound more settled than they are.")));
    b.appendChild(el("h3","","Hedged"));
    add(b,D.hedged.slice(0,8),function(o){jumpItem(b,o,"","var(--grn)")},"No hedging found.");
    b.appendChild(el("h3","","Stated with certainty"));
    add(b,D.abso.slice(0,5),function(o){jumpItem(b,o,"","var(--mag)")},"No absolute language found.");
  });
  fill("p-context",D.flags.length,function(b){
    add(b,D.flags,function(x){var d=el("div","item");d.appendChild(el("strong","",x[0]));d.appendChild(el("small","",x[1]));b.appendChild(d)},"No obvious gaps found. That does not mean none exist.");
    b.appendChild(el("h3","","Questions to ask"));
    D.qs.forEach(function(q){b.appendChild(el("div","item",q))});
  });
}
function countUp(n,to){
  if(matchMedia("(prefers-reduced-motion:reduce)").matches||!to)return;
  var t0=performance.now();n.textContent="0";
  (function f(t){var k=Math.min(1,(t-t0)/600);n.textContent=String(Math.round(to*k));if(k<1)requestAnimationFrame(f)})(t0);
}
function reveal(){
  var spans=[].slice.call(art.querySelectorAll("span")),n=spans.length,prog=$("prog"),prev=null;
  var rm=matchMedia("(prefers-reduced-motion:reduce)").matches,step=Math.max(25,Math.min(90,1800/n));
  spans.forEach(function(s,i){
    TM.push(setTimeout(function(){
      if(prev)prev.classList.remove("now");
      s.classList.remove("pend");if(/claim|evi|hedge|anon/.test(s.className))s.classList.add("pop");
      if(i<n-1){s.classList.add("now");prev=s}
      prog.textContent=i<n-1?"Reading… "+(i+1)+" of "+n:"Done · "+n+" sentences";
    },rm?0:i*step));
  });
}
function run(){
  var text=txt.value;
  if(words(text)<40){wc.textContent="Need at least 40 words. Paste more text.";wc.style.color="var(--mag)";setTimeout(function(){wc.style.color="";wc.textContent=words(txt.value)+" words"},2600);return}
  D=compute(text);renderArticle();renderPanels();
  $("editor").hidden=true;$("dash").hidden=false;window.scrollTo(0,0);reveal();
}
