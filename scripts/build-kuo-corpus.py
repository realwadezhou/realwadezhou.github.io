"""Curated Kuo extraction ledger. Paraphrases; preserve each dated revision.
Run from any directory to regenerate public/data/kuo-forecasts.json.
"""
import json
from apple_review import apply_review
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sources = {}; claims = []
def source(key, date, path, label, note='', evidence='Attributed'):
 url = path if path.startswith('https:') else 'https://www.macrumors.com/' + path
 sources[key] = dict(id=key, date=date, url=url, label=label, evidence=evidence, note=note or 'Dated public report explicitly attributing these statements to Kuo. The underlying client note was not independently retrieved.', accessed='2026-09-07', access='Read')
def add(s, family, category, title, target, verdict, outcome, launches='', qualifier='Reported expectation', kind='expectation', deadline=None, timing='Not specified', note='', start=None):
 claims.append(dict(id=f'K-{len(claims)+1:03}', sourceId=s, familyId=family, category=category, title=title, target=target, status=verdict, outcome=outcome, launchIds=launches.split(), qualifier=qualifier, kind=kind, deadline=deadline, start=start, timing=timing, note=note, probability={'kind':'lower-bound','value':float(qualifier.split()[2].rstrip('%'))/100,'strict':True} if qualifier.startswith('Greater than ') and '% chance' in qualifier else None, reviewState='Provisional', assessedAt='2026-09-07'))
def batch(s, family, cat, launch, rows):
 for title, outcome in rows: add(s, family, cat, title, 'Named product generation', 'Supported', outcome, launch)
def window(s, family, cat, title, end, verdict, outcome, launch, start=None, qualifier='Reported expectation'):
 add(s, family, cat, title, (start+' to ' if start else 'By ')+end, verdict, outcome, launch, qualifier=qualifier, deadline=end, start=start, timing='On time' if verdict=='Supported' else 'Late')
source('k15pencil','2015-01-18','2015/01/18/kuo-ipad-pro-stylus/','Kuo attribution · iPad stylus')
batch('k15pencil','pencil-1','Accessories','ipad-pro-2015 pencil-1',[
 ('Apple stylus for the 12.9-inch iPad','Apple Pencil accompanied the original iPad Pro.'),
 ('Stylus sold separately','Apple Pencil was a $99 optional accessory.'),
 ('Stylus charges through Lightning','The first Pencil used a Lightning connector.')])
add('k15pencil','pencil-1','Accessories','Stylus launches in Q2 or Q3 2015','Launch in Q2–Q3 2015','Unresolvable','Apple announced Pencil in September but customer availability began in November.','pencil-1',timing='Ambiguous',note='The recovered report does not pin launch to announcement or customer availability; the distinction changes the result.')
add('k15pencil','pencil-1','Accessories','First stylus omits a gyroscope accelerometer','First Pencil sensor hardware','Not assessed','The combined sensor wording needs a component-level teardown comparison.','pencil-1',note='Do not treat an unlisted sensor in a press release as proof of absence.')
source('k15phone','2015-05-12','2015/05/12/kgi-iphone-6s-2015-predicitions/','Kuo attribution · eleven iPhone 6s predictions')
batch('k15phone','iphone-6s','iPhone','iphone-6s',[
 ('Pressure-sensitive display in iPhone 6s','Apple introduced 3D Touch.'),('4.7- and 5.5-inch screen sizes retained','Both sizes remained in the 6s generation.'),('Rose gold iPhone option','Rose gold joined the lineup.'),('12 MP rear camera','The rear camera increased to 12 MP.'),('A9 processor','Apple introduced A9 in the 6s.'),('Different enclosure material to improve rigidity','Apple adopted 7000 series aluminum; material change is supported, not a quantified bending claim.')])
add('k15phone','iphone-6s','iPhone','2 GB LPDDR4 memory','iPhone 6s RAM','Not assessed','Apple launch material does not disclose RAM; component verification is still needed.','iphone-6s')
add('k15phone','iphone-6s','iPhone','Conditional sapphire cover for larger iPhone','Only if drop-test problems resolved','Unresolvable','The condition is not publicly established, so a glass screen does not falsify this conditional.','iphone-6s',qualifier='If drop-test issues resolved',kind='possibility')
add('k15phone','iphone-6s','iPhone','Gesture controls added','2015 iPhone capabilities','Unresolvable','Gesture control is insufficiently defined to separate it from existing gestures or 3D Touch.','iphone-6s')
add('k15phone','iphone-6s','iPhone','80–90 million new iPhones shipped in 2015','Model-level shipments in 2015','Not assessed','No independently verified model-level shipment total is in this corpus.','iphone-6s')
source('k16mac','2016-05-23','2016/05/23/macbook-pro-2016-oled-display-touch-bar/','Kuo attribution · MacBook Pro redesign')
batch('k16mac','macbook-pro-2016','Mac','macbook-pro-2016',[
 ('OLED function strip on MacBook Pro','Apple introduced Touch Bar.'),('Touch ID on MacBook Pro','Touch ID shipped on Touch Bar configurations.'),('Thinner and lighter Pro notebooks','Apple reduced the enclosure size and weight.'),('USB-C and Thunderbolt 3 ports','Both interfaces shipped.'),('13- and 15-inch Pro sizes','Apple introduced both sizes.'),('Butterfly keyboard on MacBook Pro','The redesign used a second-generation butterfly mechanism.')])
window('k16mac','macbook-pro-2016','Mac','Redesigned MacBook Pro arrives in Q4 2016','2016-12-31','Supported','Apple introduced it October 27 and specified initial shipments within Q4.','macbook-pro-2016',start='2016-10-01')
add('k16mac','macbook-13-roadmap','Mac','13-inch MacBook joins the 12-inch line','2016 notebook identity','Unresolvable','A 13-inch Pro without Touch Bar shipped; the recovered wording does not establish whether MacBook is a precise retail name.','macbook-pro-2016',note='Naming ambiguity is retained rather than silently matching a different product name.')
source('k16watch','2016-08-07','2016/08/07/apple-watch-2-upgraded-first-gen-models-kuo/','Kuo attribution · Watch 2 and lower-cost Watch')
batch('k16watch','watch-2','Apple Watch','watch-2',[
 ('GPS added to Watch 2','Series 2 added built-in GPS.'),('Faster processor in Watch 2','S2 introduced a faster dual-core processor.'),('Stronger water resistance for Watch 2','Series 2 was rated to 50 metres.'),('No LTE in Watch 2','Cellular arrived with Series 3 in 2017.')])
window('k16watch','watch-2','Apple Watch','Watch 2 ships in H2 2016','2016-12-31','Supported','Series 2 became available September 16.','watch-2',start='2016-07-01',qualifier='Likely')
batch('k16watch','watch-1','Apple Watch','watch-1',[
 ('Upgraded cheaper first-generation Watch','Apple introduced Series 1 with a dual-core processor.'),('Cheaper Watch omits GPS','Series 1 omitted built-in GPS.')])
add('k16watch','watch-2','Apple Watch','Watch 2 includes a barometer','Series 2 hardware','Contradicted','The barometric altimeter arrived in Series 3.','watch-2 watch-3')
add('k16watch','watch-2','Apple Watch','Watch 2 retains the same thickness','Series 2 enclosure','Not assessed','Exact thickness needs a generation-specific specifications comparison.','watch-2')
source('k16phone','2016-09-03','2016/09/03/iphone-7-5-colors-ipx7-12mp-cameras/','Kuo attribution · iPhone 7 detailed preview')
batch('k16phone','iphone-7','iPhone','iphone-7',[
 ('A10 processor in iPhone 7','Apple introduced A10 Fusion.'),('32, 128 and 256 GB storage tiers','All three capacities were offered.'),('Two black finishes plus silver, gold and rose gold','Apple introduced black and glossy jet black.'),('IPX7-level water resistance','Apple certified IP67, including water-protection level 7.'),('Headphone jack removed','Wired audio moved to Lightning.'),('Lightning EarPods and audio adapter included','Both were supplied at launch.'),('Earpiece doubles as a stereo speaker','Apple introduced a stereo speaker system.'),('Haptic Home button','A solid-state Home button replaced the mechanical click.'),('Wide-color display','Apple added a wide-color display.'),('Dual 12 MP wide and telephoto cameras on Plus','Both focal lengths shipped on iPhone 7 Plus.'),('Four-LED rear flash','The generation used a quad-LED True Tone flash.'),('FeliCa support for Japan','Apple announced FeliCa for Japanese models.')])
add('k16phone','iphone-7','iPhone','60–65 million iPhone 7 shipments in 2016','Model-level shipments','Not assessed','Model-level shipment totals are not independently established here.','iphone-7')
source('k17wwdc','2017-05-13','2017/05/13/kuo-wwdc-10-5-ipad-siri-speaker/','Kuo attribution · probabilistic WWDC calls')
window('k17wwdc','ipad-pro-2017','iPad','10.5-inch iPad Pro unveiled at WWDC','2017-06-05','Supported','Apple announced the 10.5-inch Pro at WWDC.','ipad-pro-2017',start='2017-06-05',qualifier='Greater than 70% chance')
batch('k17wwdc','ipad-pro-2017','iPad','ipad-pro-2017',[('Larger iPad screen through narrower bezels','Apple reduced the borders for the 10.5-inch display.')])
window('k17wwdc','homepod-2018','HomePod','Siri speaker announced at WWDC','2017-06-05','Supported','Apple unveiled HomePod at WWDC; shipment followed in 2018.','homepod-2018',start='2017-06-05',qualifier='Greater than 50% chance')
add('k17wwdc','homepod-2018','HomePod','Siri speaker has a touch panel','HomePod input surface','Supported','HomePod included a touch surface for playback and Siri.','homepod-2018',note='The quoted note says touch panel, not a full graphical touchscreen; the headline is stronger than the recovered wording.')
source('k17phone','2017-07-03','2017/07/03/ming-chi-kuo-iphone-omit-touch-id/','Kuo attribution · 2017 iPhone lineup')
batch('k17phone','iphone-x','iPhone','iphone-x iphone-8',[
 ('Three new iPhones: one OLED and two LCD','Apple introduced iPhone X and both iPhone 8 sizes.'),('OLED iPhone omits fingerprint recognition','iPhone X used Face ID without Touch ID.'),('3D facial sensing on OLED iPhone','The TrueDepth camera enabled Face ID.'),('64 and 256 GB storage choices','Both capacities were offered on the new lineup.'),('Lightning retained with fast charging','The new phones kept Lightning and added fast charging.'),('OLED iPhone offered in fewer colors','X launched in two finishes; iPhone 8 in three.')])
add('k17phone','iphone-x','iPhone','Virtual Home button on OLED iPhone','iPhone X navigation','Unresolvable','Apple used a Home indicator and swipe gestures; virtual button is not defined precisely enough for a binary comparison.','iphone-x')
add('k17phone','iphone-x','iPhone','OLED model reaches market after LCD models','2017 relative availability','Supported','iPhone 8 shipped September 22; X shipped November 3.','iphone-x iphone-8',timing='On time')
add('k17phone','iphone-x','iPhone','All new iPhones may be announced together in September','September 2017','Supported','All three were announced September 12.','iphone-x iphone-8',qualifier='May',kind='possibility',timing='On time',note='Matched possibility; excluded from expectation-only totals.')
source('k17charge','2017-07-03','2017/07/03/2017-iphone-models-qi-wireless-charger-separate/','Kuo attribution · full note on charging')
batch('k17charge','iphone-x','iPhone','iphone-x iphone-8',[
 ('Glass backs for Qi charging across 2017 iPhones','All new models used glass backs and Qi charging.'),('Wireless charger purchased separately','A charging pad was not included.'),('Standard 5 W USB-A power adapter in box','The phones retained the 5 W USB adapter.')])
source('k18line','2018-07-11','2018/07/11/apple-product-updates-fall-kuo/','Kuo attribution · second-half 2018 roadmap')
batch('k18line','iphone-xs','iPhone','iphone-xs iphone-xr',[
 ('Two OLED iPhones and a cheaper 6.1-inch LCD model','XS and XS Max used OLED; XR used a 6.1-inch LCD.'),('Face ID and A12 across new iPhones','All three used Face ID and A12 Bionic.'),('Single rear camera on lower-cost model','XR had one rear camera; XS models had two.')])
batch('k18line','ipad-pro-2018','iPad','ipad-pro-2018',[
 ('11- and 12.9-inch iPad Pro','Both sizes shipped in the 2018 redesign.'),('Face ID replaces iPad Pro Home button','Apple removed the Home button and introduced Face ID.')])
for fam,cat,title,end,result,outcome,launch in [
 ('mac-mini-2018','Mac','Mac mini processor refresh in H2 2018','2018-12-31','Supported','Apple introduced new quad- and six-core processors in October.','mac-mini-2018'),
 ('macbook-pro-2018','Mac','MacBook Pro processor refresh in H2 2018','2018-12-31','Supported','Apple introduced the refresh July 12, one day after this report.','macbook-pro-2018'),
 ('imac-2019','Mac','iMac processor refresh in H2 2018','2018-12-31','Contradicted','Apple introduced the next iMac refresh in March 2019.','imac-2019')]:
 window('k18line',fam,cat,title,end,result,outcome,launch,start='2018-07-01')
add('k18line','macbook-air-2018','Mac','New lower-cost notebook falls outside MacBook Air family','2018 notebook identity','Contradicted','The new Retina notebook was branded MacBook Air.','macbook-air-2018',note='This report explicitly says Kuo revised his earlier Air-family identification; the exclusion is assessed as written.')
batch('k18line','watch-4','Apple Watch','watch-4',[('Larger Apple Watch displays','Series 4 enlarged the displays.'),('Enhanced heart-rate detection','Series 4 added electrical heart sensing and ECG capability.')])
add('k18line','airpower','Accessories','AirPower mass production in Q3 2018','Internal production milestone','Not assessed','Apple later cancelled AirPower; that alone does not establish the claimed manufacturing stage.','',note='Retail availability is not a substitute for a production date.')
source('k18oct','2018-10-23','2018/10/23/kuo-october-event-ipad-mini-refresh/','Kuo attribution · October event and early 2019')
batch('k18oct','ipad-pro-2018','iPad','ipad-pro-2018 pencil-2',[
 ('USB-C on new iPad Pro','The redesigned Pro adopted USB-C.'),('Redesigned Apple Pencil alongside iPad Pro','The second Pencil charged and attached magnetically.')])
window('k18oct','mac-mini-2018','Mac','Mac mini refresh at October 30 event','2018-10-30','Supported','Apple announced the mini at the event.','mac-mini-2018',start='2018-10-30')
window('k18oct','imac-2019','Mac','iMac refresh at October 30 event','2018-10-30','Contradicted','The next iMac refresh was March 19, 2019.','imac-2019',start='2018-10-30')
add('k18oct','ipad-mini-2019','iPad','New iPad mini with faster processor','Next mini generation','Supported','The next mini used A12 Bionic.','ipad-mini-2019')
add('k18oct','ipad-mini-2019','iPad','Lower-cost display panel on next iPad mini','Component cost','Not assessed','Public specifications do not establish Apple’s panel procurement cost.','ipad-mini-2019')
batch('k18oct','airpods-2','AirPods','airpods-2',[('AirPods wireless charging case','A wireless charging case was offered.'),('New chip enables hands-free Hey Siri','H1 enabled hands-free Siri.')])
add('k18oct','airpower','Accessories','AirPower could launch late 2018 or early 2019','Uncertain launch possibility','Unresolvable','AirPower was cancelled, but the source explicitly presents an uncertain possibility.','',qualifier='Could; specific plans unknown',kind='possibility',timing='Ambiguous')
source('k19mac','2019-02-17','2019/02/17/16-inch-macbook-pro-2019-kuo/','Kuo attribution · 16-inch MacBook Pro')
window('k19mac','macbook-pro-2019','Mac','16–16.5-inch MacBook Pro released in 2019','2019-12-31','Supported','Apple introduced the 16-inch Pro in November.','macbook-pro-2019')
add('k19mac','macbook-pro-13-2020','Mac','13-inch MacBook Pro may offer 32 GB RAM','Possible configuration','Supported','The 2020 13-inch Pro offered up to 32 GB.','macbook-pro-13-2020',qualifier='May; no explicit deadline',kind='possibility',note='The sentence gives no explicit date; not counted as an on-time 2019 hit.')
source('k19display','2019-02-17','2019/02/17/apple-31-inch-6k-display-mini-led-kuo/','Kuo attribution · pro display')
window('k19display','pro-display-xdr','Mac','Apple 6K display released in 2019','2019-12-31','Supported','Pro Display XDR launched in December with 6016 × 3384 resolution.','pro-display-xdr')
add('k19display','pro-display-xdr','Mac','31.6-inch display with mini-LED-like backlight','Size and backlight description','Unresolvable','Apple marketed a 32-inch panel with 576 local-dimming LEDs. Neither rounding tolerance nor mini-LED-like is defined.','pro-display-xdr')
source('k19pads','2019-02-17','2019/02/17/kuo-2019-ipad-pro-models-10-2-inch-ipad/','Kuo attribution · 2019 iPads')
window('k19pads','ipad-pro-2020','iPad','Two refreshed iPad Pros in 2019','2019-12-31','Contradicted','The next Pro update came in March 2020.','ipad-pro-2020')
window('k19pads','ipad-2019','iPad','10.2-inch iPad in 2019','2019-12-31','Supported','Apple introduced the 10.2-inch iPad in September.','ipad-2019')
add('k19pads','ipad-2019','iPad','New 10.2-inch iPad has upgraded processor','Versus preceding 9.7-inch iPad','Contradicted','The 2019 model retained A10 Fusion from the 2018 iPad.','ipad-2019 ipad-2018')
window('k19pads','ipad-mini-2019','iPad','Refreshed iPad mini in 2019','2019-12-31','Supported','The A12-powered mini arrived in March.','ipad-mini-2019')
source('k19audio','2019-02-17','2019/02/17/airpower-new-airpods-ship-first-half-2019-kuo/','Kuo attribution · AirPower, AirPods and iPod')
window('k19audio','airpower','Accessories','AirPower ships in H1 2019','2019-06-30','Contradicted','Apple cancelled AirPower on March 29, 2019.','')
window('k19audio','airpods-2','AirPods','New AirPods ship in H1 2019','2019-06-30','Supported','Second-generation AirPods became available in March.','airpods-2')
window('k19audio','ipod-2019','iPod','Faster iPod touch in 2019','2019-12-31','Supported','Apple introduced the A10-powered iPod touch in May.','ipod-2019')
source('k19phones','2019-02-17','2019/02/17/2019-iphones-bilateral-charging-frosted-glass-kuo/','Kuo attribution · 2019 iPhone roadmap',note='The reproduced note says all or part of the models for several upgrades; the article summary overstates this as all models. Use the narrower quoted scope.')
batch('k19phones','iphone-11','iPhone','iphone-11 iphone-11-pro',[
 ('2019 lineup keeps 5.8/6.5 OLED and 6.1 LCD sizes','11 Pro and Pro Max retained those OLED sizes; 11 used LCD.'),('Lightning retained in all three iPhones','All three kept Lightning.'),('UWB arrives in 2019 iPhones','Apple introduced the U1 chip.'),('Frosted glass on at least some 2019 models','The Pro models used textured matte glass.'),('Triple wide, telephoto and ultra-wide camera','The Pro models included all three cameras.')])
add('k19phones','iphone-11','iPhone','2019 iPhones can wirelessly charge other devices','Usable reverse wireless charging','Contradicted','iPhone 11 did not offer reverse wireless charging; a component capable of it would not fulfill a user-facing feature claim.','iphone-11 iphone-11-pro')
source('k19keys','2019-07-25','2019/07/25/kuo-16-inch-macbook-pro-scissor-keyboard/','Kuo attribution · scissor keyboard revision')
batch('k19keys','macbook-pro-2019','Mac','macbook-pro-2019',[('Scissor keyboard on next 16-inch MacBook Pro','Apple introduced the scissor-switch Magic Keyboard.')])
window('k19keys','macbook-pro-2019','Mac','16-inch Pro with new keyboard in Q4 2019','2019-12-31','Supported','The model arrived in November.','macbook-pro-2019',start='2019-10-01')
source('k19led','2019-09-29','2019/09/29/kuo-mini-led-ipad-macbook-2020-21/','Kuo attribution · first mini-LED windows')
window('k19led','ipad-pro-2021','iPad','Mini-LED iPad released by Q1 2021','2021-03-31','Contradicted','Apple announced the mini-LED 12.9-inch Pro in April; availability followed in May.','ipad-pro-2021',start='2020-10-01')
window('k19led','macbook-pro-2021','Mac','Mini-LED MacBook released in H1 2021','2021-06-30','Contradicted','The mini-LED MacBook Pros arrived in October.','macbook-pro-2021',start='2021-01-01')
add('k19led','ipad-pro-2021','iPad','Approximately 10,000 mini-LEDs in high-end iPad','First mini-LED iPad','Supported','Apple specified over 10,000 mini-LEDs in the 12.9-inch Pro.','ipad-pro-2021',note='Approximate count, not an exact 10,000 requirement.')
source('k20h1','2020-01-29','2020/01/29/kuo-on-apple-first-half-of-2020/','Kuo attribution · first-half 2020 hardware',note='Only the directly attributed list is extracted; the article’s separate editorial product speculation is not assigned to Kuo.')
for fam,cat,title,result,outcome,launch in [
 ('iphone-se-2020','iPhone','4.7-inch LCD iPhone released in H1 2020','Supported','The second SE launched April 24.','iphone-se-2020'),
 ('ipad-pro-2020','iPad','iPad Pro refresh in H1 2020','Supported','The refreshed Pro arrived in March.','ipad-pro-2020'),
 ('macbook-air-2020','Mac','MacBook Pro and/or Air refresh in H1 2020','Supported','Air refreshed in March and 13-inch Pro in May.','macbook-air-2020 macbook-pro-13-2020'),
 ('airtag-1','Accessories','UWB tracking tags released in H1 2020','Contradicted','AirTag shipped April 30, 2021.','airtag-1')]:
 window('k20h1',fam,cat,title,'2020-06-30',result,outcome,launch,start='2020-01-01')
add('k20h1','airpods-max','AirPods','High-end Bluetooth headphones in H1 2020','First-half 2020 product identity','Unresolvable','AirPods Max arrived in December, but the recovered note does not establish whether it means Apple-branded over-ear headphones or another product.','airpods-max',timing='Ambiguous',note='Do not borrow the over-ear detail from the article’s separate discussion of Gurman.')
add('k20h1','charging-mat-roadmap','Accessories','Small wireless charging mat in H1 2020','Unspecified charging product','Unresolvable','No precise product identity is recovered; cannot silently substitute MagSafe or a third-party mat.','',timing='Ambiguous')
source('k20led','2020-03-03','2020/03/03/apple-14-1-inch-macbook-pro-mini-led/','Kuo attribution · six mini-LED projects')
window('k20led','imac-pro-roadmap','Mac','27-inch mini-LED iMac Pro in Q4 2020','2020-12-31','Contradicted','The 2020 iMac refresh used a conventional Retina 5K display; no new iMac Pro shipped in the window.','imac-2020 imac-pro-2017',start='2020-10-01')
window('k20led','ipad-mini-2021','iPad','7.9-inch mini-LED iPad mini in 2020','2020-12-31','Contradicted','The next mini shipped in September 2021 with an 8.3-inch conventional LCD.','ipad-mini-2021')
add('k20led','mini-led-research','iPad','Six mini-LED products under development','Internal research portfolio','Unresolvable','A launch catalog cannot establish which prototypes Apple developed.','ipad-pro-2021 macbook-pro-2021',kind='development',qualifier='Currently developing')
source('k20arm','2020-06-21','2020/06/21/apple-arm-13-inch-macbook-pro-imac/','Kuo attribution · Apple silicon rollout')
window('k20arm','apple-silicon-transition','Mac','Apple announces custom Mac chips at WWDC 2020','2020-06-22','Supported','Apple announced the transition at WWDC.','m1-macs',start='2020-06-22')
add('k20arm','apple-silicon-transition','Mac','First ARM Macs are 13-inch Pro and redesigned iMac','Initial shipping cohort','Contradicted','The first cohort was Air, 13-inch Pro and mini in November 2020; iMac followed in May 2021.','m1-macs imac-2021')
batch('k20arm','imac-2021','Mac','imac-2021',[('ARM iMac redesigned around a 24-inch screen','Apple introduced a redesigned 24-inch M1 iMac.')])
window('k20arm','imac-2020','Mac','Intel iMac refresh in Q3 2020','2020-09-30','Supported','Apple refreshed the Intel iMac August 4.','imac-2020',start='2020-07-01')
add('k20arm','apple-silicon-transition','Mac','Entire Mac lineup transitions in 12–18 months','From 2020 transition start','Contradicted','Apple described the June 2023 Mac Pro as completing the transition, well beyond 18 months.','mac-pro-2023 m1-macs',timing='Late',note='The interval misses whether counted from the June announcement or November first shipment.')
source('k21mac','2021-01-14','2021/01/15/new-macbook-pro-models-magsafe-ports/','Kuo attribution · 2021 MacBook Pro',note='Publication is January 14 in the displayed Pacific timestamp; URL uses January 15. Specific ports were not named in this note.')
batch('k21mac','macbook-pro-2021','Mac','macbook-pro-2021',[
 ('14- and 16-inch MacBook Pro redesign','Apple introduced both sizes.'),('MagSafe returns to Pro notebooks','MagSafe 3 shipped.'),('Physical function keys replace Touch Bar','The redesign removed Touch Bar.'),('More kinds of ports','HDMI and SDXC returned alongside Thunderbolt.'),('New Pro models use Apple silicon without Intel option','M1 Pro and M1 Max powered the new models.')])
window('k21mac','macbook-pro-2021','Mac','Redesigned MacBook Pros release in Q3 2021','2021-09-30','Contradicted','Apple announced them October 18; availability began October 26.','macbook-pro-2021',start='2021-07-01')
add('k21mac','macbook-pro-2021','Mac','Completely flat top and bottom like iPhone 12','Enclosure description','Unresolvable','The shipping enclosure combines flatter surfaces with curved edges; no measurable curvature criterion was stated.','macbook-pro-2021')
source('k21air','2021-03-18','2021/03/18/kuo-macbook-air-mini-led-2020-launch/','Kuo attribution · display roadmap')
add('k21air','macbook-air-2022','Mac','MacBook Air adopts mini-LED in 2022','2022 Air display','Contradicted','The 2022 Air used a conventional LED-backlit Liquid Retina display.','macbook-air-2022')
add('k21air','ipad-air-2022','iPad','iPad Air adopts OLED in 2022','2022 Air display','Contradicted','The M1 iPad Air retained its Liquid Retina LCD.','ipad-air-2022')
batch('k21air','macbook-pro-2021','Mac','macbook-pro-2021',[('HDMI port returns to MacBook Pro','An HDMI port shipped.'),('SD card reader returns to MacBook Pro','An SDXC slot shipped.')])
window('k21air','macbook-pro-2021','Mac','Two mini-LED MacBook Pros in H2 2021','2021-12-31','Supported','Both sizes shipped in October with mini-LED displays.','macbook-pro-2021',start='2021-07-01')
source('k21iphone','2021-04-13','2021/04/14/kuo-2022-iphones-no-mini-upgraded-camera/','Kuo attribution · 2022 iPhone cameras and sizes',note='Displayed Pacific publication is April 13; URL uses April 14. Preserve may for pixel-binning output.')
batch('k21iphone','iphone-14','iPhone','iphone-14 iphone-14-plus iphone-14-pro',[
 ('2022 flagship lineup has two 6.1- and two 6.7-inch phones','Apple released 14, 14 Plus, Pro and Pro Max at those sizes.'),('No new 5.4-inch mini in 2022 lineup','No mini was introduced in the iPhone 14 generation.'),('48 MP main camera on high-end 2022 iPhones','Both iPhone 14 Pro sizes gained a 48 MP camera.')])
add('k21iphone','iphone-14-pro','iPhone','High-end 2022 iPhones record 8K video','iPhone 14 Pro capture modes','Contradicted','Apple specified video recording up to 4K, not 8K.','iphone-14-pro')
add('k21iphone','iphone-14-pro','iPhone','48 MP and binned 12 MP output may both be available','2022 Pro camera','Supported','The quad-pixel sensor offered 12 MP output and 48 MP ProRAW.','iphone-14-pro',qualifier='May',kind='possibility')
source('k21foldconditional','2021-03-01','2021/03/01/kuo-foldable-iphone-2023/','Kuo attribution · conditional foldable schedule')
add('k21foldconditional','foldable-iphone','iPhone','Foldable iPhone possible in 2023 if technical issues solved','Conditional 2023 window','Unresolvable','The technology and production conditions are not independently established.','iphone-15 iphone-15-pro',kind='possibility',qualifier='Could, dependent on solving key issues',timing='Ambiguous')
source('k21fold','2021-05-02','2021/05/02/kuo-8-inch-foldable-iphone-2023/','Kuo attribution · revised foldable expectation')
window('k21fold','foldable-iphone','iPhone','8-inch foldable iPhone likely launches in 2023','2023-12-31','Contradicted','Apple’s 2023 iPhones were conventional iPhone 15 models; a foldable remained prospective after the deadline.','iphone-15 iphone-15-pro',qualifier='Likely, based on latest survey')
source('k21headset','2021-11-25','2021/11/25/kuo-apple-ar-headset-mac-level-computing/','Kuo attribution · first headset architecture')
window('k21headset','vision-pro-1','Vision','First Apple AR headset launches in Q4 2022','2022-12-31','Contradicted','Apple unveiled Vision Pro in June 2023 and shipped it in February 2024.','vision-pro-1',start='2022-10-01')
batch('k21headset','vision-pro-1','Vision','vision-pro-1',[
 ('Headset has main processor and separate sensor processor','Vision Pro used M2 for computing and R1 for sensor input.'),('Headset operates without tethering to iPhone or Mac','Vision Pro ran visionOS independently.'),('Headset supports both AR and VR experiences','Vision Pro blended surroundings and immersive virtual content.'),('Two micro-OLED headset displays','Apple specified a micro-OLED system with 23 million pixels.')])
add('k21headset','vision-pro-1','Vision','Headset main processor has M1-like computing power','Performance comparison','Unresolvable','Vision Pro used M2; similar computing power has no workload or tolerance specified.','vision-pro-1')
source('k21periscope','2021-12-20','2021/12/20/iphone-48mp-camera-2022-periscope-2023-kuo/','Kuo attribution · periscope roadmap')
window('k21periscope','iphone-15-pro','iPhone','At least one iPhone gains folded telephoto optics in 2023','2023-12-31','Supported','iPhone 15 Pro Max introduced the 5x tetraprism camera.','iphone-15-pro')
source('k22se','2022-03-04','2022/03/04/last-minute-iphone-se-details-leaked/','Kuo attribution · third-generation iPhone SE')
batch('k22se','iphone-se-2022','iPhone','iphone-se-2022',[
 ('A15 Bionic in next iPhone SE','The third SE used A15 Bionic.'),('64, 128 and 256 GB SE options','All three capacities were offered.'),('SE retains its preceding form factor','The SE kept its 4.7-inch screen and Home button.'),('White, black and red SE finishes','Apple offered starlight, midnight and PRODUCT(RED); assessed as broad color descriptions.')])
add('k22se','iphone-se-2022','iPhone','iPhone SE supports both mmWave and sub-6 5G','2022 SE cellular radios','Mixed','Sub-6 5G shipped, but mmWave support did not.','iphone-se-2022',note='One conjunction in the source; the two radio conditions are retained together.')
add('k22se','iphone-se-2022','iPhone','25–30 million SE shipments in 2022','Model-level shipments','Not assessed','No independently verified model-level shipment total is in this corpus.','iphone-se-2022')
source('k22air','2022-03-08','2022/03/08/kuo-macbook-air-2022-m1/','Kuo attribution · revised 2022 MacBook Air',note='Report includes the embedded March 9 UTC post, displayed March 8 Pacific, and direct confirmation to MacRumors of the M1 expectation. Unattributed white-bezel and rainbow-color speculation is excluded.')
add('k22air','macbook-air-2022','Mac','2022 MacBook Air uses M1, possibly modified','Next redesigned Air processor','Contradicted','Apple shipped the redesigned Air with M2.','macbook-air-2022',qualifier='M1; could be modified')
batch('k22air','macbook-air-2022','Mac','macbook-air-2022',[
 ('Revised call: no mini-LED in 2022 Air','Apple retained conventional LED backlighting.'),('New MacBook Air form factor','The M2 Air replaced the wedge-shaped design.'),('More MacBook Air color options','Four finishes replaced the preceding three.')])
add('k22air','macbook-air-2022','Mac','Air mass production late Q2 or Q3 2022','Manufacturing window','Not assessed','A July retail launch does not independently date mass production.','macbook-air-2022',timing='Not specified')
source('k22proaudio','2022-01-02','2022/01/02/airpods-pro-2-Lossless-and-sound-emitting-case/','Kuo attribution · AirPods Pro 2')
add('k22proaudio','airpods-pro-2','AirPods','AirPods Pro 2 support ALAC lossless','2022 generation at launch','Contradicted','The 2022 Lightning model did not support lossless playback. The later USB-C revision’s Vision Pro support is a different hardware configuration.','airpods-pro-2 airpods-pro-usbc')
add('k22proaudio','airpods-pro-2','AirPods','Charging case emits a locating sound','AirPods Pro 2 case','Supported','Apple added a speaker for Find My sounds.','airpods-pro-2')
add('k22proaudio','airpods-pro-2','AirPods','AirPods Pro 2 launch in Q4 2022','During Q4 2022','Contradicted','Customer availability began September 23, in Q3.','airpods-pro-2',deadline='2022-12-31',start='2022-10-01',timing='Early',note='During Q4 is not a by-year-end deadline. An early launch misses the stated interval.')
source('k22mini','2022-03-10','2022/03/11/kuo-no-mac-mini-until-next-year/','Kuo attribution · revised Mac release years',note='Displayed Pacific publication is March 10. The embedded update lists Mac Pro, iMac Pro and Mac mini for 2023; it does not postpone the already announced Studio Display.')
window('k22mini','mac-mini-2023','Mac','Revised Mac mini release year: 2023','2023-12-31','Supported','The M2 and M2 Pro mini shipped January 24, 2023.','mac-mini-2023',start='2023-01-01')
window('k22mini','mac-pro-2023','Mac','Apple silicon Mac Pro in 2023','2023-12-31','Supported','Apple introduced the M2 Ultra Mac Pro in June 2023.','mac-pro-2023',start='2023-01-01')
window('k22mini','imac-pro-roadmap','Mac','iMac Pro in 2023','2023-12-31','Contradicted','Apple launched a 24-inch M3 iMac and confirmed no 27-inch Apple-silicon replacement was planned.','imac-m3',start='2023-01-01')
source('k22usb','2022-05-11','2022/05/11/iphone-15-ditch-lightning-for-usb-c/','Kuo attribution · USB-C iPhone')
window('k22usb','iphone-15','iPhone','At least some 2023 iPhones switch to USB-C','2023-12-31','Supported','All four iPhone 15 models adopted USB-C.','iphone-15 iphone-15-pro',start='2023-07-01')
source('k22access','2022-05-15','2022/05/15/kuo-usb-c-apple-accessories/','Kuo attribution · USB-C accessories')
batch('k22access','airpods-pro-usbc','AirPods','airpods-pro-usbc',[('AirPods migrate to USB-C','USB-C AirPods Pro arrived in 2023.')])
batch('k22access','magic-usbc','Accessories','magic-usbc',[('Magic Keyboard, Mouse and Trackpad migrate to USB-C','All three accessories adopted USB-C in 2024.')])
add('k22access','usb-c-accessories','Accessories','USB-C accessories arrive in foreseeable future','Unbounded timing phrase','Unresolvable','Some transitions occurred in 2023–2024, but the source defines no deadline.','airpods-pro-usbc magic-usbc',timing='Ambiguous')
source('k22home','2022-05-20','2022/05/20/homepod-refresh-late-2022-early-2023/','Kuo attribution · HomePod refresh')
window('k22home','homepod-2','HomePod','New HomePod in Q4 2022–Q1 2023','2023-03-31','Supported','The second-generation HomePod shipped February 3, 2023.','homepod-2',start='2022-10-01',qualifier='Would release')
add('k22home','homepod-2','HomePod','HomePod may have little hardware-design innovation','Design-change magnitude','Unresolvable','Little innovation has no threshold; size and internal changes cannot resolve this wording.','homepod-2',qualifier='May',kind='possibility')
source('k22tv','2022-05-13','2022/05/13/kuo-new-apple-tv-to-launch-second-half-2022/','Kuo attribution · Apple TV refresh')
window('k22tv','apple-tv-2022','Apple TV','New Apple TV in H2 2022','2022-12-31','Supported','The refreshed Apple TV 4K shipped November 4.','apple-tv-2022',start='2022-07-01')
add('k22tv','apple-tv-2022','Apple TV','Improved Apple TV cost structure','Manufacturing economics','Not assessed','The new $129 retail price is observable, but Apple’s cost structure is not established.','apple-tv-2022',note='Lower retail pricing was the article’s inference, not the exact claim in Kuo’s quoted post.')
source('k22buttons','2022-10-27','2022/10/28/kuo-iphone-15-pro-models-solid-state-buttons/','Kuo attribution · initial solid-state buttons',note='Displayed October 27 Pacific; URL October 28. The report mixes may with a stronger buttonless-update statement; the initial possibility stays separate from January’s reiterated expectation.')
add('k22buttons','iphone-15-pro-buttons','iPhone','iPhone 15 Pro may use solid-state power and volume buttons','Initial design possibility','Unresolvable','The shipping models used physical buttons; may alone is not a firm launch commitment.','iphone-15-pro',qualifier='May',kind='possibility')
source('k23buttons','2023-01-11','2023/01/11/iphone-15-pro-solid-state-buttons/','Kuo attribution · reiterated solid-state buttons')
add('k23buttons','iphone-15-pro-buttons','iPhone','Reiterated expectation: solid-state Pro power and volume buttons','iPhone 15 Pro generation','Contradicted','The shipped iPhone 15 Pro models retained mechanical side and volume buttons.','iphone-15-pro',note='Retained separately from the October possibility and April reversal.')
source('k23buttonrev','2023-04-12','https://medium.com/@mingchikuo/two-iphone-15-pro-models-removal-of-solid-state-button-design-negatively-affects-cirrus-logic-and-a456d5e7386c','Kuo · physical-button reversal','Original Medium post read. Medium displays April 12; the contemporaneous US report displays April 11 Pacific.','Direct')
add('k23buttonrev','iphone-15-pro-buttons','iPhone','Revised call: iPhone 15 Pro returns to physical buttons','iPhone 15 Pro generation','Supported','Apple shipped mechanical side and volume buttons.','iphone-15-pro',note='This correction does not erase the January forecast.')
add('k23buttonrev','iphone-15-pro-buttons','iPhone','Button change has limited impact on production and shipments','Internal schedule effect','Not assessed','A September launch does not quantify the counterfactual impact of the design change.','iphone-15-pro')
source('k22usbspeed','2022-11-16','2022/11/16/iphone-15-high-speed-data-transfer/','Kuo attribution · USB-C transfer tiers')
batch('k22usbspeed','iphone-15','iPhone','iphone-15 iphone-15-pro',[
 ('Standard iPhone 15 retains USB 2 data rates','The standard models used USB 2 up to 480 Mb/s.'),('Only Pro iPhones get faster USB-C data transfer','The Pro models supported USB 3 up to 10 Gb/s.')])
source('k23foldpad','2023-01-30','2023/01/30/foldable-ipad-kickstand-2024/','Kuo attribution · foldable iPad',note='Kuo’s embedded statement is positive about a 2024 foldable iPad. Later Young and Gurman responses on the page are not Kuo forecasts.')
window('k23foldpad','foldable-ipad','iPad','Foldable iPad with carbon-fiber kickstand in 2024','2024-12-31','Contradicted','Apple’s 2024 iPad refreshes were conventional Pro, Air and mini models; a foldable remained unreleased after the deadline.','ipad-pro-m4 ipad-air-m2 ipad-mini-a17')
source('k23m3','2023-09-08','2023/09/08/kuo-first-m3-macbooks-unlikely-2023/','Kuo attribution · no M3 MacBooks in 2023')
add('k23m3','macbook-pro-m3','Mac','No M3-series MacBooks expected before end of 2023','Through 2023-12-31','Contradicted','M3, M3 Pro and M3 Max MacBook Pros shipped November 7.','macbook-pro-m3',qualifier='Seems; unlikely',deadline='2023-12-31',timing='Not specified')
source('k23m3rev','2023-10-24','2023/10/24/kuo-m3-macbook-pro-october-30/','Kuo attribution · M3 event reversal',note='Only the event focus is attributed. The article’s extrapolation to a 13-inch model is not Kuo’s stated prediction.')
window('k23m3rev','macbook-pro-m3','Mac','Revised call: M3-series MacBook Pros at October event','2023-10-30','Supported','Apple introduced the M3 MacBook Pro lineup October 30.','macbook-pro-m3',start='2023-10-30')
source('k23pads','2023-11-12','https://medium.com/@mingchikuo/2024年新款ipad機型與量產時程預測-predictions-for-new-ipad-models-and-production-timeline-in-2024-650a5fc9bbee','Kuo · original 2024 iPad production roadmap','Original bilingual Medium post read. Dates explicitly describe mass production; do not convert them to retail-release deadlines.','Direct')
batch('k23pads','ipad-air-m2','iPad','ipad-air-m2',[
 ('Larger roughly 13-inch iPad Air joins smaller model','Apple introduced an Air marketed as 13 inches; its measured diagonal is 12.9 inches.'),('Larger Air display lacks mini-LED','The larger Air used conventional LCD backlighting.')])
batch('k23pads','ipad-pro-m4','iPad','ipad-pro-m4',[('Both iPad Pros move to OLED','Both 2024 Pro sizes adopted OLED.'),('Tandem OLED architecture','Apple introduced the tandem OLED Ultra Retina XDR display.')])
add('k23pads','ipad-pro-m4','iPad','OLED iPad Pro uses M3','2024 Pro processor','Contradicted','Apple introduced M4 directly in the OLED Pro.','ipad-pro-m4')
for fam,title,launch in [('ipad-air-m2','Both iPad Air models enter production in Q1 2024','ipad-air-m2'),('ipad-pro-m4','OLED iPad Pros enter production late Q1–Q2 2024','ipad-pro-m4'),('ipad-mini-a17','New mini enters production in H2 2024','ipad-mini-a17'),('ipad-a16','Eleventh-generation iPad enters production in H2 2024','ipad-a16')]:
 add('k23pads',fam,'iPad',title,'Mass-production milestone','Not assessed','The catalog records announcement and retail dates; neither establishes this manufacturing date.',launch)
add('k23pads','ipad-pro-m4','iPad','OLED Pro may cost more if Air pricing and segmentation persist','Conditional price increase','Supported','The 11-inch Air stayed $599, larger Air cost $799, and Pro starting prices increased to $999/$1,299.','ipad-air-m2 ipad-pro-m4',qualifier='Conditional; may',kind='possibility',note='Observed prices match the conditional direction; Apple’s internal segmentation intention is not independently established.')
source('k23tag','2023-10-18','2023/10/18/airtag-2-postponed-until-2025/','Kuo attribution · AirTag production revision')
add('k23tag','airtag-2','Accessories','AirTag 2 production postponed to 2025','Manufacturing rather than retail launch','Not assessed','The second AirTag was announced in January 2026, which does not independently establish its production start.','airtag-2')
add('k23tag','airtag-2','Accessories','AirTag 2 integrates with Vision Pro ecosystem','Unspecified integration capability','Unresolvable','No concrete interaction, API or measurable criterion is identified in the recovered statement.','airtag-2 vision-pro-1')
source('k24watch','2024-06-17','2024/06/17/kuo-apple-watch-series-10-larger-screen-thinner/','Kuo attribution · Series 10 and Ultra',note='Public attribution read; original Medium page returned no article body. Specific 45/49 mm sizes are separated from the broad larger-display forecast.')
batch('k24watch','watch-10','Apple Watch','watch-10',[('Thinner Series 10 enclosure','Apple reduced thickness to 9.7 mm.'),('Larger Series 10 displays','Series 10 increased display area.')])
add('k24watch','watch-10','Apple Watch','Series 10 size options increase to 45 and 49 mm','Case-size labels in reported comparison','Contradicted','Apple released 42 mm and 46 mm cases.','watch-10',note='The source compares existing 41/45 mm labels with 45/49 mm; these are case labels, even though its prose calls them screen sizes.')
add('k24watch','watch-ultra-2-black','Apple Watch','Dark Ultra finish possible if yields permit','Conditional 2024 finish','Supported','Apple introduced a black titanium Ultra 2.','watch-ultra-2-black',qualifier='If production yields meet expectations',kind='possibility',note='The finish appeared; the internal yield condition is not independently measured.')
add('k24watch','watch-ultra-2-black','Apple Watch','Ultra hardware remains roughly the same in 2024','2024 Ultra update','Supported','Apple retained Ultra 2 and added a new finish.','watch-ultra-2-black',qualifier='Roughly the same',note='Interpreted as no new hardware generation; cosmetic finish is separately recorded.')
source('k24airphone','2024-07-24','2024/07/24/kuo-ultra-thin-iphone-17-specs/','Kuo attribution · ultra-thin iPhone')
batch('k24airphone','iphone-air','iPhone','iphone-air',[
 ('New ultra-thin iPhone in the 2025 lineup','Apple introduced the 5.6 mm iPhone Air.'),('One rear camera on thin iPhone','Air shipped with one 48 MP rear camera.'),('Apple-designed 5G modem in thin iPhone','Air used the Apple C1X modem.')])
add('k24airphone','iphone-air','iPhone','Thin iPhone uses A19 rather than A19 Pro','2025 thin-model chip','Contradicted','iPhone Air used A19 Pro.','iphone-air')
add('k24airphone','iphone-air','iPhone','Thin iPhone display measures 6.6 inches','Screen diagonal','Unresolvable','Apple specified 6.5 inches, measured as 6.55 inches in a rectangle.','iphone-air',note='The reported 6.6 inches and Apple’s 6.55-inch measurement can agree after rounding; no precision convention was stated. Do not force a size miss.')
add('k24airphone','iphone-air','iPhone','Titanium-aluminum frame with less titanium than Pro','Frame composition proportions','Not assessed','Apple identifies a titanium enclosure, but comparable material percentages are not established.','iphone-air')
add('k24airphone','iphone-17','iPhone','No iPhone 17 Plus','2025 lineup','Supported','Apple introduced 17, Air, Pro and Pro Max, without a Plus model.','iphone-17 iphone-air iphone-17-pro')
source('k24front','2024-01-04','https://9to5mac.com/2024/01/04/kuo-24-megapixel-upgraded-front-camera-iphone-17/','Kuo attribution · iPhone 17 selfie camera')
add('k24front','iphone-17','iPhone','iPhone 17 front camera rises to 24 MP','2025 front-camera resolution','Contradicted','Apple introduced an 18 MP Center Stage front camera across the new lineup.','iphone-17 iphone-17-pro iphone-air')
source('k24vision','2024-09-27','https://medium.com/@mingchikuo/ai-spatial-computing-to-be-the-main-selling-point-for-new-m5-powered-vision-pro-new-apple-15f409ea6c15','Kuo · M5 Vision Pro','Original Medium post read. Production dates, chip prediction and conditional AI speculation are kept separate.','Direct')
batch('k24vision','vision-pro-m5','Vision','vision-pro-m5',[('Next Vision Pro moves from M2 to M5','The 2025 revision introduced M5.'),('Apple Intelligence integrated with upgraded Vision Pro','The M5 model ran visionOS with Apple Intelligence support.')])
add('k24vision','vision-pro-m5','Vision','M5 Vision Pro enters production in H2 2025','Manufacturing window','Not assessed','October 2025 customer availability does not establish its mass-production start.','vision-pro-m5')
add('k24vision','vision-pro-m5','Vision','Price may stay near previous Vision Pro','US launch price','Supported','The M5 model retained the $3,499 starting price.','vision-pro-m5',qualifier='May not change much',kind='possibility')
add('k24vision','vision-ai-roadmap','Vision','Sora-like integration could transform headset experience','Hypothetical AI integration','Unresolvable','The post discusses a conditional use case, not an announced feature or deadline.','vision-pro-m5',qualifier='If it can integrate something like Sora',kind='possibility')
source('k25neo','2025-06-30','2025/06/30/apple-to-launch-low-cost-macbook/','Kuo attribution · iPhone-chip MacBook',note='Production timing is not a promised customer-launch date. Price figures and 2026 launch in later summaries are not retroactively added.')
batch('k25neo','macbook-neo','Mac','macbook-neo',[
 ('Lower-cost MacBook powered by A18 Pro','MacBook Neo launched at $599 with A18 Pro.'),('13-inch screen on lower-cost MacBook','Neo used a 13-inch Liquid Retina display.')])
add('k25neo','macbook-neo','Mac','Silver, blue, pink and yellow are possible MacBook finishes','Possible color palette','Supported','Neo launched in silver, indigo, blush and citrus.','macbook-neo',qualifier='Could',kind='possibility',note='Broad color descriptions, not predicted retail color names.')
add('k25neo','macbook-neo','Mac','Budget MacBook production begins late Q4 2025 or early Q1 2026','Manufacturing window','Not assessed','The March 2026 launch does not establish its production start.','macbook-neo')
source('k25fold','2025-03-05','2025/03/06/kuo-apple-foldable-iphone-book-style-2000/','Kuo attribution · first foldable iPhone specifications',note='Displayed March 5 Pacific, URL March 6. Future product specifications remain pending as of September 7, 2026; no announcement assumed.')
for title,target in [('Book-style first foldable iPhone','First folding iPhone form'),('Foldable iPhone priced above $2,000','First model US price'),('Foldable iPhone uses Touch ID side button without Face ID','First model authentication'),('Approximately 7.8-inch inner and 5.5-inch outer displays','First model displays')]:
 add('k25fold','foldable-iphone','iPhone',title,target,'Pending','The first foldable iPhone has not been announced as of this review. Future specifications remain unresolved.','',timing='Pending',note='Other reporters’ leaks and expected events are not launch evidence.')

# APPEND NEW SOURCES ABOVE THE WRITE BLOCK.
def write():
 for row in claims:
  if row['status']=='Not assessed' and any(term in (row['target']+' '+row['title']).lower() for term in ['production','manufactur']): row['timing']='Not assessed'
  if row['familyId'] in ['airpower','imac-pro-roadmap','foldable-ipad','foldable-iphone'] and row['status']=='Contradicted': row['timing']='Overdue'
 result = dict(asOf='2026-09-07', scope='Selective historical Kuo corpus, 2015 onward; distinct dated claims and revisions, not a complete census or career accuracy estimate.', sources=sources, claims=claims)
 result = apply_review(result, 'kuo')
 (ROOT/'public/data/kuo-forecasts.json').write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n')
 print(len(result['claims']), 'claims;',len(result['sources']),'sources')
if __name__=='__main__': write()
