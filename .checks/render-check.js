/* Paste into the browser console (or run via the preview) before every push.
   Renders every view in both tiers and every panel that only appears after a
   click, and reports anything that throws or comes back empty. Written after
   a day of shipping first and finding the fault afterwards. */
(function(){
  const out={threw:[],empty:[],missingStrings:[]};
  const warn=console.warn;
  console.warn=function(...a){ if(String(a[0]).indexOf('missing string')===0||String(a[0]).indexOf('missing plural')===0) out.missingStrings.push(a[1]); warn.apply(console,a); };
  const views={jesus:'vJesus',today:'vToday',map:'vMap',check:'vCheck',reports:'vReports',report:'vReport',time:'vTime',notes:'vNotes',translate:'vTranslate'};
  const PX='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  NOTES=[{id:1,rec:'r1',who:'Dave',text:'A note',area:'Today',state:'open',at:'2026-08-31T09:00:00Z',shots:[]},
         {id:2,rec:'r2',who:'Mel',text:'Done',area:'Your map',state:'done',at:'2026-08-30T09:00:00Z',shots:[]},
         {id:3,rec:'r3',who:'Dave',text:'With a shot',area:'Reports',state:'done',at:'2026-08-29T09:00:00Z',
          fix:'Fixed it.',shots:[{data:PX}]}];
  /* 'new' is a leader who signed up ten seconds ago: no roster, no
     programmes, no check-ups. Three screens used to throw in that state and
     nobody had looked, because the demo group always had a year of data. */
  ['new','open','activated'].forEach(function(tier){ setTier(tier);
    Object.keys(views).forEach(function(v){
      active=v; selPhase=null; toolInfo=null; selStudent=null; selProgram=null;
      addingProgram=false; addingTo=null; intake=null; quizIx=0; confirmDel=null;
      try{ render(); var n=document.getElementById('app').innerHTML.length;
           if(n<300) out.empty.push(tier+'/'+v+' ('+n+' chars)');
           if(document.querySelector('.cerr')) out.threw.push(tier+'/'+v+' rendered the error panel');
      }catch(e){ out.threw.push(tier+'/'+v+': '+e.message); }
    });
    /* the rest needs a report to hang off, which a new leader has not got */
    if(tier==='new'){
      active='today';
      try{ render(); if(!document.querySelector('.steps')) out.empty.push('new/start panel'); }
      catch(e){ out.threw.push('new/start panel: '+e.message); }
      active='check';
      try{ render(); if(!/who is in your group/i.test(document.getElementById('app').innerText))
             out.empty.push('new/check-up first run'); }
      catch(e){ out.threw.push('new/check-up first run: '+e.message); }
      return;
    }

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
  // the translate page, on a language, with every group open — 463 rows of
  // it, which is where a bad key or a missing plural category would show
  try{ TIER='open'; active='translate'; trLang='cs';
       TR_GROUPS.forEach(g=>trOpen[g.id]=true); trOpen['inst-ok']=true;
       render();
       var n=document.querySelectorAll('.tr-row').length;
       if(n<Object.keys(STRINGS.en).length) out.empty.push('translate/rows ('+n+')');
  }catch(e){ out.threw.push('translate/open: '+e.message); }
  trLang=null; trOpen={};

  // a note with a Decision is a question for Mel and Dave, not work: it goes
  // in its own section above the open list and keeps its reasoning visible
  const FIXTURE=NOTES.slice();          /* the next check needs it back */
  try{ TIER='open'; active='notes';
    NOTES=[{id:9,rec:'r9',who:'Dave',area:'The year',state:'open',at:'2026-09-19T12:00:00Z',
            text:'a request that touches personal data',decision:'WHY IT IS A DECISION  Article 9.',shots:[]},
           {id:8,rec:'r8',who:'Dave',area:'Your map',state:'open',at:'2026-09-19T11:00:00Z',
            text:'an ordinary open note',shots:[]}];
    const h=vNotes();
    if(!/nt-sec talk/.test(h))      out.empty.push('notes/discussion section');
    if(!/nt-fix talk/.test(h))      out.empty.push('notes/decision block');
    if(h.indexOf('To discuss') > h.indexOf('>Open<')) out.empty.push('notes/discussion is not first');
  }catch(e){ out.threw.push('notes/discussion: '+e.message); }
  NOTES=FIXTURE;

  // a fixed note shows the tester's shot beside the after-shot from /after/
  try{ TIER='open'; active='notes'; render();
       var ba=document.querySelector('.nt-ba');
       if(!ba) out.empty.push('notes/before-after grid');
       else if(ba.querySelectorAll('figure').length<2) out.empty.push('notes/after-shot figure');
  }catch(e){ out.threw.push('notes/before-after: '+e.message); }

  setTier('open');                      /* put the demo data back */
  if(STUDENTS.length===0) out.threw.push('setTier did not restore the demo data');

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
