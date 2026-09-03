/* Pseudo-language leak check.

   Builds a fake locale where every key becomes an accented echo of itself,
   switches to it, renders every screen, and reports any run of plain English
   left on the page. What survives should only ever be data — student names,
   the group name, numbers, dates — never a label.

   This is the check that catches a string the extraction missed, which the
   text diff cannot: the diff only proves English still renders the same. */
(function(){
  const MARK='«', END='»';
  const fake={};
  const walk=(o)=>{const r={};for(const k in o){const v=o[k];
    r[k]= (v&&typeof v==='object')
      ? Object.fromEntries(Object.keys(v).map(c=>[c,MARK+k+END]))
      : MARK+k+END;}
    return r;};
  STRINGS.xx=walk(STRINGS.en);
  const was=LANG; LANG='xx';

  /* Legitimately not translated, each for a stated reason:
       - demo data: the group, the leaders, the roster, the programmes. A
         real leader's own records replace all of it.
       - COACH_DEMO: example questions naming demo students, shown only
         until the leader presses "Read my report".
       - STORY: placeholder prose behind a red asterisk, kept out of STRINGS
         on purpose so nobody translates wording that is due to be replaced.
       - month names: those come from toLocaleDateString, not from STRINGS.
         The pseudo tag is not a real locale, so they fall back to English
         here; a real locale formats its own.
     Everything is compared lowercased, whole words only. Anything NOT on
     this list that survives is a string the extraction missed — which is
     the entire point of this check. */
  const words=x=>String(x).replace(/&[a-z]+;|&#\d+;/g,' ').toLowerCase().match(/[a-z][a-z'-]*/g)||[];
  const OK=new Set([
    ...words("CB Frydlant Frýdlant youth Katka Boza Boža Czech Republic"),
    ...words("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec"),
    ...words("CCE SIX TAR CPR REST mo am pm"),
    ...STUDENTS.flatMap(x=>words(x.name)),
    ...LEADERS.flatMap(words),
    ...PROGRAMS.flatMap(x=>words(x.name)),
    ...COACH_DEMO.flatMap(x=>[...words(x.q),...words(x.from)]),
    ...Object.values(STORY).flatMap(v=>Object.values(v).filter(Boolean).flatMap(words))
  ]);

  const leaks={};
  const views=['jesus','today','map','check','reports','report','time','notes'];
  const scan=(where)=>{
    const txt=document.getElementById('app').innerText;
    const rest=txt.replace(new RegExp(MARK+'[^'+END+']*'+END,'g'),' ');
    const left=[...new Set(words(rest))].filter(w=>w.length>2&&!OK.has(w));
    if(left.length) leaks[where]=left.slice(0,12);
  };
  const reset=()=>{selPhase=null;toolInfo=null;selStudent=null;selProgram=null;
    addingProgram=false;addingTo=null;intake=null;quizIx=0;confirmDel=null;learnMore=null;};
  NOTES=[];
  ['open','activated'].forEach(tier=>{ TIER=tier;
    views.forEach(v=>{ reset(); active=v; try{render();scan(tier+'/'+v)}catch(e){leaks[tier+'/'+v]=['THREW: '+e.message]} });
    active='report';
    for(let n=1;n<=5;n++){ reset(); selPhase=n; try{render();scan(tier+'/phase-'+n)}catch(e){} }
    Object.keys(TOOLS).forEach(k=>{ reset(); toolInfo=k; try{render();scan(tier+'/tool-'+k)}catch(e){} });
    reset(); active='check';
    for(let i=1;i<=Q.length;i++){ quizIx=i; try{render();scan(tier+'/quiz-'+i)}catch(e){} }
    reset(); active='map'; intake=1; try{render();scan(tier+'/intake')}catch(e){} intake=null;
  });
  LANG=was; delete STRINGS.xx; reset(); active='jesus'; TIER='open';
  return {ok:!Object.keys(leaks).length, leaks};
})()
