#!/bin/zsh
# usage: capture-text.sh <out.json>   — dumps the visible text of every screen
set -e
OUT="$1"; D=$(mktemp -d); R="${0:a:h}/.."
python3 - "$R" "$D" <<'PY'
import io,sys,re
root,d=sys.argv[1],sys.argv[2]
s=io.open(root+'/index.html',encoding='utf8').read()
chk=io.open(root+'/.checks/text-dump.js',encoding='utf8').read().strip().rstrip(';')
run=("<script>window.addEventListener('load',function(){"
     "var p=document.createElement('pre');p.id='dump';"
     "p.textContent=JSON.stringify(%s,null,1);document.body.appendChild(p);});</script>") % chk
io.open(d+'/x.html','w',encoding='utf8').write(s.replace('</body>',run+'\n</body>'))
PY
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --no-sandbox --virtual-time-budget=9000 --dump-dom "file://$D/x.html" 2>/dev/null > "$D/dom.html"
python3 - "$D" "$OUT" <<'PY'
import io,sys,re,html,json
d,out=sys.argv[1],sys.argv[2]
s=io.open(d+'/dom.html',encoding='utf8').read()
m=re.search(r'<pre id="dump">(.*?)</pre>', s, re.S)
if not m: sys.exit('no dump found — the page threw before it finished')
io.open(out,'w',encoding='utf8').write(html.unescape(m.group(1)))
print('captured %d states -> %s' % (len(json.loads(html.unescape(m.group(1)))), out))
PY
