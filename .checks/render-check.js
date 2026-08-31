/* Paste into the browser console (or run via the preview) before every push.
   Renders every view in both tiers and every panel that only appears after a
   click, and reports anything that throws or comes back empty. Written after
   a day of shipping first and finding the fault afterwards. */
(function(){
  const out={threw:[],empty:[],missingStrings:[]};
  const warn=console.warn;
  console.warn=function(...a){ if(String(a[0]).indexOf('missing string')===0||String(a[0]).indexOf('missing plural')===0) out.missingStrings.push(a[1]); warn.apply(console,a); };
  const views={jesus:'vJesus',today:'vToday',map:'vMap',check:'vCheck',reports:'vReports',report:'vReport',time:'vTime',notes:'vNotes'};
  NOTES=[{id:1,rec:'r1',who:'Dave',text:'A note',area:'Today',state:'open',at:'2026-08-31T09:00:00Z',shots:[]},
         {id:2,rec:'r2',who:'Mel',text:'Done',area:'Your map',state:'done',at:'2026-08-30T09:00:00Z',shots:[]}];
  ['open','activated'].forEach(function(tier){ TIER=tier;
    Object.keys(views).forEach(function(v){
      active=v; selPhase=null; toolInfo=null; selStudent=null; selProgram=null;
      addingProgram=false; addingTo=null; intake=null; quizIx=0; confirmDel=null;
      try{ render(); var n=document.getElementById('app').innerHTML.length;
           if(n<300) out.empty.push(tier+'/'+v+' ('+n+' chars)');
           if(document.querySelector('.cerr')) out.threw.push(tier+'/'+v+' rendered the error panel');
      }catch(e){ out.threw.push(tier+'/'+v+': '+e.message); }
    });
    // panels that only exist after a click
    active='report';
    for(var n=1;n<=5;n++){ try{ selPhase=n; render(); if(!document.querySelector('.why-panel')) out.empty.push(tier+'/phase-card-'+n); }catch(e){ out.threw.push(tier+'/phase-card-'+n+': '+e.message); } }
    selPhase=null;
    [].concat(Object.keys(TOOLS)).forEach(function(k){ try{ toolInfo=k; render(); if(!document.querySelector('.tip')) out.empty.push(tier+'/tool-'+k); }catch(e){ out.threw.push(tier+'/tool-'+k+': '+e.message); } });
    toolInfo=null;
    active='check';
    for(var i=0;i<=Q.length+1;i++){ try{ quizIx=i; render(); }catch(e){ out.threw.push(tier+'/quiz-step-'+i+': '+e.message); break; } }
    quizIx=0;
    active='map';
    try{ selStudent=0; render(); if(!document.querySelector('.mdet')) out.empty.push(tier+'/student-panel'); }catch(e){ out.threw.push(tier+'/student-panel: '+e.message); }
    selStudent=null;
    try{ selProgram=0; render(); if(!document.querySelector('.mdet')) out.empty.push(tier+'/programme-panel'); }catch(e){ out.threw.push(tier+'/programme-panel: '+e.message); }
    selProgram=null;
  });
  // the bot, in each of its states
  [['closed',function(){botOpen=false}],
   ['name gate',function(){botOpen=true;WHO=null;askingWho=false}],
   ['open',function(){botOpen=true;WHO='Mel';askingWho=false}]].forEach(function(p){
    try{ p[1](); render(); if(document.getElementById('bot').innerHTML.length<20) out.empty.push('bot/'+p[0]); }
    catch(e){ out.threw.push('bot/'+p[0]+': '+e.message); }});
  console.warn=warn;
  out.missingStrings=[...new Set(out.missingStrings)];
  out.ok = !out.threw.length && !out.empty.length && !out.missingStrings.length;
  return out;
})()
