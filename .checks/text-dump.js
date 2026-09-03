/* Walks every screen, tier and panel and returns the visible text of each.
   Run it before an extraction and after, and diff the two files: extraction
   is only allowed to move words, never to change them, so the diff must be
   empty. Written because a big mechanical diff is exactly where a quiet
   wording change hides. */
(function(){
  const dump={};
  const views=['jesus','today','map','check','reports','report','time','notes'];
  const grab=k=>{ try{ render(); dump[k]=document.getElementById('app').innerText
                        .replace(/\s+/g,' ').trim(); }
                  catch(e){ dump[k]='THREW: '+e.message; } };
  const reset=()=>{ selPhase=null; toolInfo=null; selStudent=null; selProgram=null;
                    addingProgram=false; addingTo=null; intake=null; quizIx=0;
                    confirmDel=null; learnOpen=null; };
  NOTES=[];
  ['open','activated'].forEach(function(tier){ TIER=tier;
    views.forEach(function(v){ reset(); active=v; grab(tier+'/'+v); });
    active='report';
    for(var n=1;n<=5;n++){ reset(); selPhase=n; grab(tier+'/phase-'+n);
      try{ dump[tier+'/phase-'+n+'-panel']=document.querySelector('.why-panel').innerText.replace(/\s+/g,' ').trim(); }catch(e){}
    }
    Object.keys(TOOLS).forEach(function(k){ reset(); toolInfo=k; grab(tier+'/tool-'+k);
      try{ dump[tier+'/tool-'+k+'-tip']=document.querySelector('.tip').innerText.replace(/\s+/g,' ').trim(); }catch(e){}
    });
    reset(); active='check';
    for(var i=0;i<=40;i++){ quizIx=i; grab(tier+'/quiz-'+i); }
    reset(); active='map';
    selStudent=0; grab(tier+'/student'); selStudent=null;
    selProgram=0; grab(tier+'/programme'); selProgram=null;
  });
  return dump;
})()
