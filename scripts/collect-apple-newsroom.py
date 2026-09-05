"""Build a dated discovery index from Apple's public newsroom. Does not grade forecasts."""
import json,re,time,urllib.request,concurrent.futures
from pathlib import Path
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[1]
def year(y):
 out=[];seen=set()
 for page in range(1,45):
  url=f'https://www.apple.com/newsroom/archive/{y}/?page={page}'
  try:
   html=urllib.request.urlopen(url,timeout=25).read(); s=BeautifulSoup(html,'html.parser')
   rows=[]
   for a in s.select('a'):
    h=a.get('href','')
    if h.startswith(f'/newsroom/{y}/'):
     rows.append({'url':'https://www.apple.com'+h,'text':a.get_text(' ',strip=True),'year':y})
   fresh=[r for r in rows if r['url'] not in seen]
   if not fresh:break
   seen.update(r['url'] for r in fresh)
   out.extend(fresh)
   if len(rows)<10: break
  except Exception as e:
   print('Failed',url,str(e),flush=True);break
 print(y,len(out),flush=True)
 return out
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
  rows=[r for group in ex.map(year,range(2015,2027)) for r in group]
 rows=list({r['url']:r for r in rows}.values())
 p=ROOT/'docs/apple-newsroom-index.json';p.write_text(json.dumps(rows,indent=2,ensure_ascii=False)+'\n')
 cand=[r for r in rows if re.search(r'\b(introduces|unveils|announces|available|arrives|pre-order|preorder|orders|launches)\b',r['text'],re.I) and re.search(r'\b(iPhone|iPad|Mac|MacBook|iMac|AirPods|HomePod|Watch|AirTag|Vision|Apple TV|Apple Music|Apple One|Fitness|Siri|Intelligence|Display|Pencil|Magic|iPod)\b',r['text'],re.I)]
 (ROOT/'docs/apple-launch-candidates.json').write_text(json.dumps(cand,indent=2,ensure_ascii=False)+'\n')
 print('Total',len(rows),'candidates',len(cand),flush=True)
