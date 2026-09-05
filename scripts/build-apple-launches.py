"""Curated Apple launch dates, backed by first-party newsroom references.
Dates are ISO calendar dates in the first launch market, normally the US.
Empty dates are deliberately unknown, never inferred from the announcement.
"""
import json,hashlib,re,urllib.request,concurrent.futures
from datetime import datetime
from pathlib import Path
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[1]
INDEX=json.loads((ROOT/'docs/apple-newsroom-index.json').read_text())
CACHE=Path('/tmp/gurman-apple-evidence');CACHE.mkdir(exist_ok=True)
# ID | family | product | announcement | orders | first availability | newsroom locator
RAW='''
pencil-1|Accessories|Apple Pencil (1st generation)|2015-09-09|2015-11-11||2015/09/09Apple-Introduces-iPad-Pro
macos-sierra|Software|macOS Sierra (10.12)|2016-06-13||2016-09-20|2016/06/apple-previews-major-update-with-macos-sierra
watch-original|Apple Watch|Apple Watch (original, 2015 launch)|2014-09-09|2015-04-10|2015-04-24|https://www.apple.com/newsroom/2014/09/09Apple-Unveils-Apple-Watch-Apples-Most-Personal-Device-Ever/
macbook-2015|Mac|MacBook (12-inch, 2015)|2015-03-09|2015-04-10|2015-04-10|2015/03/09Apple-Unveils-All-New-MacBook
macbook-pro-13-2015|Mac|MacBook Pro 13-inch (Force Touch)|2015-03-09|2015-03-09|2015-03-09|2015/03/09Apple-Updates-13-inch
macbook-pro-15-2015|Mac|MacBook Pro 15-inch (Force Touch)|2015-05-19|2015-05-19|2015-05-19|2015/05/19Apple-Introduces-15-inch
apple-music|Services|Apple Music|2015-06-08||2015-06-30|2015/06/08Introducing-Apple-Music
ipod-2015|iPod|iPod touch (6th generation)|2015-07-15|2015-07-15|2015-07-15|2015/07/15Apple-Introduces-The-Best-iPod
iphone-6s|iPhone|iPhone 6s / 6s Plus|2015-09-09|2015-09-12|2015-09-25|2015/09/09Apple-Introduces-iPhone-6s
ipad-pro-2015|iPad|iPad Pro 12.9-inch (1st generation)|2015-09-09|2015-11-11||2015/09/09Apple-Introduces-iPad-Pro
apple-tv-2015|Apple TV|Apple TV HD (4th generation)|2015-09-09|||2015/09/09Apple-Brings-Innovation-Back-to-Television
imac-2015|Mac|Retina iMac 21.5-inch / 27-inch (2015)|2015-10-13|2015-10-13|2015-10-13|2015/10/13Apple-Updates-iMac
iphone-se-2016|iPhone|iPhone SE (1st generation)|2016-03-21|2016-03-24|2016-03-31|2016/03/21Apple-Introduces-iPhone-SE
ipad-pro-2016|iPad|iPad Pro 9.7-inch|2016-03-21|2016-03-24|2016-03-31|2016/03/21Apple-Introduces-9-7-inch
iphone-7|iPhone|iPhone 7 / 7 Plus|2016-09-07|2016-09-09|2016-09-16|2016/09/apple-introduces-iphone-7
watch-2|Apple Watch|Apple Watch Series 2|2016-09-07|2016-09-09|2016-09-16|2016/09/apple-introduces-apple-watch-series-2
watch-1|Apple Watch|Apple Watch Series 1|2016-09-07|2016-09-09|2016-09-16|2016/09/apple-introduces-apple-watch-series-2
airpods-1|AirPods|AirPods (1st generation)|2016-09-07|2016-12-13||2016/09/apple-reinvents-the-wireless-headphones-with-airpods
macbook-pro-2016|Mac|MacBook Pro 13/15-inch with Touch Bar|2016-10-27|2016-10-27||2016/10/apple-unveils-groundbreaking-new-macbook-pro
ipad-2017|iPad|iPad (5th generation)|2017-03-21|2017-03-24||2017/03/new-9-7-inch-ipad-features
ipad-pro-2017|iPad|iPad Pro 10.5-inch / 12.9-inch (2017)|2017-06-05|2017-06-05||2017/06/ipad-pro-10-5
imac-2017|Mac|iMac / MacBook / MacBook Pro (2017 refreshes)|2017-06-05|2017-06-05|2017-06-07|2017/06/imac-receives-major-update
imac-pro-2017|Mac|iMac Pro|2017-06-05|2017-12-14||2017/06/imac-pro-most-powerful-mac
iphone-8|iPhone|iPhone 8 / 8 Plus|2017-09-12|2017-09-15|2017-09-22|2017/09/iphone-8-and-iphone-8-plus-a-new
iphone-x|iPhone|iPhone X|2017-09-12|2017-10-27|2017-11-03|2017/09/the-future-is-here-iphone-x
watch-3|Apple Watch|Apple Watch Series 3|2017-09-12|2017-09-15|2017-09-22|2017/09/apple-watch-series-3-features
apple-tv-2017|Apple TV|Apple TV 4K (1st generation)|2017-09-12|2017-09-15|2017-09-22|2017/09/apple-tv-4k-brings
homepod-2018|HomePod|HomePod (1st generation)|2017-06-05|2018-01-26|2018-02-09|2018/01/homepod-arrives
ipad-2018|iPad|iPad (6th generation)|2018-03-27|2018-03-27||2018/03/apple-introduces-new-9-7
macbook-pro-2018|Mac|MacBook Pro 13/15-inch (2018)|2018-07-12|2018-07-12||2018/07/apple-updates-macbook-pro
iphone-xs|iPhone|iPhone XS / XS Max|2018-09-12|2018-09-14|2018-09-21|2018/09/iphone-xs-and-iphone-xs-max-bring
iphone-xr|iPhone|iPhone XR|2018-09-12|2018-10-19|2018-10-26|2018/09/apple-introduces-iphone-xr
watch-4|Apple Watch|Apple Watch Series 4|2018-09-12|2018-09-14|2018-09-21|2018/09/redesigned-apple-watch-series-4
macbook-air-2018|Mac|MacBook Air (Retina, 2018)|2018-10-30|2018-10-30|2018-11-07|2018/10/all-new-macbook-air
mac-mini-2018|Mac|Mac mini (Intel, 2018)|2018-10-30|2018-10-30|2018-11-07|2018/10/new-mac-mini
ipad-pro-2018|iPad|iPad Pro 11-inch / 12.9-inch (2018)|2018-10-30|2018-10-30|2018-11-07|2018/10/new-ipad-pro-with-all
pencil-2|Accessories|Apple Pencil (2nd generation)|2018-10-30|2018-10-30|2018-11-07|2018/10/new-ipad-pro-with-all
ipad-air-2019|iPad|iPad Air (3rd generation)|2019-03-18|2019-03-18||2019/03/all-new-ipad-air-and-ipad-mini
ipad-mini-2019|iPad|iPad mini (5th generation)|2019-03-18|2019-03-18||2019/03/all-new-ipad-air-and-ipad-mini
imac-2019|Mac|iMac (2019)|2019-03-19|2019-03-19||2019/03/imac-gets-a-2x
airpods-2|AirPods|AirPods (2nd generation)|2019-03-20|2019-03-20||2019/03/airpods-the-worlds-most
ipod-2019|iPod|iPod touch (7th generation)|2019-05-28|2019-05-28||2019/05/new-ipod-touch
mac-pro-2019|Mac|Mac Pro (Intel, 2019)|2019-06-03|||2019/06/apple-unveils-powerful-all-new-mac-pro
pro-display-xdr|Displays|Pro Display XDR|2019-06-03|||2019/06/apple-unveils-powerful-all-new-mac-pro
iphone-11|iPhone|iPhone 11|2019-09-10|2019-09-13|2019-09-20|2019/09/apple-introduces-dual-camera
iphone-11-pro|iPhone|iPhone 11 Pro / Pro Max|2019-09-10|2019-09-13|2019-09-20|2019/09/iphone-11-pro-and-iphone-11-pro-max-the
watch-5|Apple Watch|Apple Watch Series 5|2019-09-10|2019-09-10|2019-09-20|2019/09/apple-unveils-apple-watch-series-5
ipad-2019|iPad|iPad (7th generation, 10.2-inch)|2019-09-10|2019-09-10|2019-09-25|2019/09/apple-introduces-new-version
apple-tv-plus|Services|Apple TV+|2019-03-25||2019-11-01|2019/03/apple-unveils-apple-tv-plus
airpods-pro-1|AirPods|AirPods Pro (1st generation)|2019-10-28|2019-10-28|2019-10-30|2019/10/apple-reveals-new-airpods-pro
macbook-pro-2019|Mac|MacBook Pro 16-inch (Intel)|2019-11-13|2019-11-13||2019/11/apple-introduces-16-inch
macbook-air-2020|Mac|MacBook Air (Intel, Magic Keyboard)|2020-03-18|2020-03-18||2020/03/new-macbook-air-has
ipad-pro-2020|iPad|iPad Pro 11-inch / 12.9-inch (A12Z)|2020-03-18|2020-03-18||2020/03/apple-unveils-new-ipad-pro
magic-keyboard-ipad|Accessories|Magic Keyboard for iPad Pro|2020-03-18|2020-04-15||2020/03/apple-unveils-new-ipad-pro
iphone-se-2020|iPhone|iPhone SE (2nd generation)|2020-04-15|2020-04-17|2020-04-24|2020/04/iphone-se-a-powerful
macbook-pro-13-2020|Mac|MacBook Pro 13-inch (Intel, Magic Keyboard)|2020-05-04|2020-05-04||2020/05/apple-updates-13-inch
imac-2020|Mac|iMac 27-inch (Intel, 2020)|2020-08-04|2020-08-04||2020/08/27-inch-imac
watch-6|Apple Watch|Apple Watch Series 6|2020-09-15|2020-09-15|2020-09-18|2020/09/apple-watch-series-6-delivers
watch-se-1|Apple Watch|Apple Watch SE (1st generation)|2020-09-15|2020-09-15|2020-09-18|2020/09/apple-watch-se-the
ipad-2020|iPad|iPad (8th generation)|2020-09-15|2020-09-15|2020-09-18|2020/09/apple-introduces-eighth
ipad-air-2020|iPad|iPad Air (4th generation, A14)|2020-09-15|2020-10-16|2020-10-23|2020/09/apple-unveils-all-new-ipad-air
apple-one|Services|Apple One|2020-09-15||2020-10-30|2020/09/apple-one-makes
fitness-plus|Services|Apple Fitness+|2020-09-15||2020-12-14|2020/12/apple-fitness-plus-the-future-of-fitness
iphone-12|iPhone|iPhone 12|2020-10-13|2020-10-16|2020-10-23|2020/10/apple-announces-iphone-12
iphone-12-mini|iPhone|iPhone 12 mini|2020-10-13|2020-11-06|2020-11-13|2020/10/apple-announces-iphone-12
iphone-12-pro|iPhone|iPhone 12 Pro|2020-10-13|2020-10-16|2020-10-23|2020/10/apple-introduces-iphone-12-pro
iphone-12-pro-max|iPhone|iPhone 12 Pro Max|2020-10-13|2020-11-06|2020-11-13|2020/10/apple-introduces-iphone-12-pro
homepod-mini|HomePod|HomePod mini|2020-10-13|2020-11-06|2020-11-16|2020/10/apple-introduces-homepod-mini
m1-macs|Mac|MacBook Air / Pro 13-inch / mini (M1)|2020-11-10|2020-11-10|2020-11-17|2020/11/introducing-the-next-generation-of-mac
airpods-max|AirPods|AirPods Max (Lightning)|2020-12-08|2020-12-08|2020-12-15|2020/12/apple-introduces-airpods-max
imac-2021|Mac|iMac 24-inch (M1)|2021-04-20|2021-04-30|2021-05-21|2021/04/imac-features-all-new-design
ipad-pro-2021|iPad|iPad Pro (M1)|2021-04-20|2021-04-30|2021-05-21|2021/04/apple-unveils-new-ipad-pro
apple-tv-2021|Apple TV|Apple TV 4K (2nd generation)|2021-04-20|2021-04-30|2021-05-21|2021/04/apple-unveils-the-next-generation-of-apple-tv
airtag-1|Accessories|AirTag (1st generation)|2021-04-20|2021-04-23|2021-04-30|2021/04/apple-introduces-airtag
iphone-13|iPhone|iPhone 13 / 13 mini|2021-09-14|2021-09-17|2021-09-24|2021/09/apple-introduces-iphone-13
iphone-13-pro|iPhone|iPhone 13 Pro / Pro Max|2021-09-14|2021-09-17|2021-09-24|2021/09/apple-unveils-iphone-13-pro
ipad-mini-2021|iPad|iPad mini (6th generation)|2021-09-14|2021-09-14|2021-09-24|2021/09/apple-unveils-new-ipad-mini
ipad-2021|iPad|iPad (9th generation)|2021-09-14|2021-09-14|2021-09-24|2021/09/apples-most-popular-ipad
watch-7|Apple Watch|Apple Watch Series 7|2021-09-14|2021-10-08|2021-10-15|2021/09/apple-reveals-apple-watch-series-7
macbook-pro-2021|Mac|MacBook Pro 14/16-inch (M1 Pro / Max)|2021-10-18|2021-10-18|2021-10-26|2021/10/apple-unveils-game-changing
airpods-3|AirPods|AirPods (3rd generation)|2021-10-18|2021-10-18|2021-10-26|2021/10/introducing-the-next-generation-of-airpods
iphone-se-2022|iPhone|iPhone SE (3rd generation)|2022-03-08|2022-03-11|2022-03-18|2022/03/apple-announces-the-new-iphone-se
ipad-air-2022|iPad|iPad Air (5th generation, M1)|2022-03-08|2022-03-11|2022-03-18|2022/03/apple-introduces-the-most-powerful-and-versatile-ipad
mac-studio-2022|Mac|Mac Studio (M1 Max / Ultra)|2022-03-08|2022-03-08|2022-03-18|2022/03/apple-unveils-all-new-mac-studio
studio-display|Displays|Studio Display|2022-03-08|2022-03-08|2022-03-18|2022/03/apple-unveils-all-new-mac-studio
macbook-air-2022|Mac|MacBook Air 13-inch (M2)|2022-06-06|2022-07-08|2022-07-15|2022/06/apple-unveils-all-new-macbook-air
macbook-pro-m2|Mac|MacBook Pro 13-inch (M2)|2022-06-06|2022-06-17|2022-06-24|2022/06/apple-unveils-all-new-macbook-air
iphone-14|iPhone|iPhone 14|2022-09-07|2022-09-09|2022-09-16|2022/09/apple-introduces-iphone-14
iphone-14-plus|iPhone|iPhone 14 Plus|2022-09-07|2022-09-09|2022-10-07|2022/09/apple-introduces-iphone-14
iphone-14-pro|iPhone|iPhone 14 Pro / Pro Max|2022-09-07|2022-09-09|2022-09-16|2022/09/apple-debuts-iphone-14-pro
watch-8|Apple Watch|Apple Watch Series 8|2022-09-07|2022-09-07|2022-09-16|2022/09/apple-reveals-apple-watch-series-8
watch-se-2|Apple Watch|Apple Watch SE (2nd generation)|2022-09-07|2022-09-07|2022-09-16|2022/09/apple-reveals-apple-watch-series-8
watch-ultra|Apple Watch|Apple Watch Ultra|2022-09-07|2022-09-07|2022-09-23|2022/09/introducing-apple-watch-ultra
airpods-pro-2|AirPods|AirPods Pro (2nd generation, Lightning)|2022-09-07|2022-09-09|2022-09-23|2022/09/apple-announces-the-next-generation-of-airpods-pro
ipad-pro-2022|iPad|iPad Pro (M2)|2022-10-18|2022-10-18|2022-10-26|2022/10/apple-introduces-next-generation-ipad-pro
ipad-2022|iPad|iPad (10th generation)|2022-10-18|2022-10-18|2022-10-26|2022/10/apple-unveils-completely-redesigned-ipad
apple-tv-2022|Apple TV|Apple TV 4K (3rd generation)|2022-10-18|2022-10-18|2022-11-04|2022/10/apple-introduces-the-powerful-next-generation-apple-tv
macbook-pro-m2-pro|Mac|MacBook Pro 14/16-inch (M2 Pro / Max)|2023-01-17|2023-01-17|2023-01-24|2023/01/apple-unveils-macbook-pro
mac-mini-2023|Mac|Mac mini (M2 / M2 Pro)|2023-01-17|2023-01-17|2023-01-24|2023/01/apple-introduces-new-mac-mini
homepod-2|HomePod|HomePod (2nd generation)|2023-01-18|2023-01-18|2023-02-03|2023/01/apple-introduces-the-new-homepod
macbook-air-15|Mac|MacBook Air 15-inch (M2)|2023-06-05|2023-06-05|2023-06-13|2023/06/apple-introduces-the-15
mac-studio-2023|Mac|Mac Studio (M2 Max / Ultra)|2023-06-05|2023-06-05|2023-06-13|2023/06/apple-unveils-new-mac-studio
mac-pro-2023|Mac|Mac Pro (M2 Ultra)|2023-06-05|2023-06-05|2023-06-13|2023/06/apple-unveils-new-mac-studio
vision-pro-1|Vision|Apple Vision Pro (M2, US launch)|2023-06-05|2024-01-19|2024-02-02|2023/06/introducing-apple-vision-pro
watchos-10|Software|watchOS 10|2023-06-05||2023-09-18|2023/06/introducing-watchos-10
iphone-15|iPhone|iPhone 15 / 15 Plus|2023-09-12|2023-09-15|2023-09-22|2023/09/apple-debuts-iphone-15
iphone-15-pro|iPhone|iPhone 15 Pro / Pro Max|2023-09-12|2023-09-15|2023-09-22|2023/09/apple-unveils-iphone-15-pro
watch-9|Apple Watch|Apple Watch Series 9|2023-09-12|2023-09-12|2023-09-22|2023/09/apple-introduces-the-advanced-new-apple-watch-series-9
watch-ultra-2|Apple Watch|Apple Watch Ultra 2|2023-09-12|2023-09-12|2023-09-22|2023/09/apple-unveils-apple-watch-ultra-2
airpods-pro-usbc|AirPods|AirPods Pro 2 (USB-C revision)|2023-09-12|2023-09-12|2023-09-22|2023/09/apple-upgrades-airpods-pro
tvos-17|Software|tvOS 17|2023-06-05||2023-09-18|2023/06/tvos-17-brings
pencil-usbc|Accessories|Apple Pencil (USB-C)|2023-10-17|2023-11-01||2023/10/apple-introduces-new-apple-pencil
macbook-pro-m3|Mac|MacBook Pro 14/16-inch (M3 / Pro / Max)|2023-10-30|2023-10-30|2023-11-07|2023/10/apple-unveils-new-macbook-pro
imac-m3|Mac|iMac 24-inch (M3)|2023-10-30|2023-10-30|2023-11-07|2023/10/apple-supercharges-24
macbook-air-m3|Mac|MacBook Air 13/15-inch (M3)|2024-03-04|2024-03-04|2024-03-08|2024/03/apple-unveils-the-new-13
ipad-pro-m4|iPad|iPad Pro 11/13-inch (M4)|2024-05-07|2024-05-07|2024-05-15|2024/05/apple-unveils-stunning
ipad-air-m2|iPad|iPad Air 11/13-inch (M2)|2024-05-07|2024-05-07|2024-05-15|2024/05/apple-unveils-the-redesigned
pencil-pro|Accessories|Apple Pencil Pro|2024-05-07|2024-05-07|2024-05-15|2024/05/apple-unveils-stunning
apple-intelligence|Software|Apple Intelligence (initial US English beta)|2024-06-10||2024-10-28|2024/06/introducing-apple-intelligence
iphone-16|iPhone|iPhone 16 / 16 Plus|2024-09-09|2024-09-13|2024-09-20|2024/09/apple-introduces-iphone-16
iphone-16-pro|iPhone|iPhone 16 Pro / Pro Max|2024-09-09|2024-09-13|2024-09-20|2024/09/apple-debuts-iphone-16-pro
watch-10|Apple Watch|Apple Watch Series 10|2024-09-09|2024-09-09|2024-09-20|2024/09/introducing-apple-watch-series-10
watch-ultra-2-black|Apple Watch|Apple Watch Ultra 2 (black titanium revision)|2024-09-09|2024-09-09|2024-09-20|2024/09/apple-watch-ultra-2-now
airpods-4|AirPods|AirPods 4 / AirPods 4 with ANC|2024-09-09|2024-09-09|2024-09-20|2024/09/apple-introduces-airpods-4
airpods-max-usbc|AirPods|AirPods Max (USB-C revision)|2024-09-09|2024-09-09|2024-09-20|2024/09/apple-introduces-airpods-4
ipad-mini-a17|iPad|iPad mini (A17 Pro)|2024-10-15|2024-10-15|2024-10-23|2024/10/apple-introduces-powerful-new-ipad-mini
imac-m4|Mac|iMac 24-inch (M4)|2024-10-28|2024-10-28|2024-11-08|2024/10/apple-introduces-new-imac
magic-usbc|Accessories|Magic Keyboard / Mouse / Trackpad (USB-C)|2024-10-28|||2024/10/apple-introduces-new-imac
mac-mini-m4|Mac|Mac mini (M4 / M4 Pro)|2024-10-29|2024-10-29|2024-11-08|2024/10/apples-new-mac-mini
macbook-pro-m4|Mac|MacBook Pro 14/16-inch (M4 / Pro / Max)|2024-10-30|2024-10-30|2024-11-08|2024/10/new-macbook-pro
iphone-16e|iPhone|iPhone 16e|2025-02-19|2025-02-21|2025-02-28|2025/02/apple-debuts-iphone-16e
ipad-air-m3|iPad|iPad Air 11/13-inch (M3)|2025-03-04|2025-03-04|2025-03-12|2025/03/apple-introduces-ipad-air
ipad-a16|iPad|iPad (A16)|2025-03-04|2025-03-04|2025-03-12|2025/03/apple-introduces-ipad-air
macbook-air-m4|Mac|MacBook Air 13/15-inch (M4)|2025-03-05|2025-03-05|2025-03-12|2025/03/apple-introduces-the-new-macbook-air
mac-studio-2025|Mac|Mac Studio (M4 Max / M3 Ultra)|2025-03-05|2025-03-05|2025-03-12|2025/03/apple-unveils-new-mac-studio
iphone-17|iPhone|iPhone 17|2025-09-09|2025-09-12|2025-09-19|2025/09/apple-debuts-iphone-17
iphone-17-pro|iPhone|iPhone 17 Pro / Pro Max|2025-09-09|2025-09-12|2025-09-19|2025/09/apple-unveils-iphone-17-pro
iphone-air|iPhone|iPhone Air|2025-09-09|2025-09-12|2025-09-19|2025/09/introducing-iphone-air
watch-11|Apple Watch|Apple Watch Series 11|2025-09-09|2025-09-09|2025-09-19|2025/09/apple-debuts-apple-watch-series-11
watch-ultra-3|Apple Watch|Apple Watch Ultra 3|2025-09-09|2025-09-09|2025-09-19|2025/09/introducing-apple-watch-ultra-3
watch-se-3|Apple Watch|Apple Watch SE (3rd generation)|2025-09-09|2025-09-09|2025-09-19|2025/09/apple-introduces-apple-watch-se-3
airpods-pro-3|AirPods|AirPods Pro (3rd generation)|2025-09-09|2025-09-09|2025-09-19|2025/09/introducing-airpods-pro-3
ipad-pro-m5|iPad|iPad Pro 11/13-inch (M5)|2025-10-15|2025-10-15|2025-10-22|2025/10/apple-introduces-the-powerful-new-ipad-pro
macbook-pro-m5|Mac|MacBook Pro 14-inch (M5)|2025-10-15|2025-10-15|2025-10-22|2025/10/apple-unveils-new-14-inch
vision-pro-m5|Vision|Apple Vision Pro (M5)|2025-10-15|2025-10-15|2025-10-22|2025/10/apple-vision-pro-upgraded
airtag-2|Accessories|AirTag (2nd generation)|2026-01-26|2026-01-26||https://www.apple.com/newsroom/2026/01/apple-introduces-new-airtag-with-expanded-range-and-improved-findability/
iphone-17e|iPhone|iPhone 17e|2026-03-02|2026-03-04|2026-03-11|2026/03/apple-introduces-iphone-17e
ipad-air-m4|iPad|iPad Air (M4)|2026-03-02|2026-03-04|2026-03-11|2026/03/apple-introduces-the-new-ipad-air
macbook-pro-m5-pro|Mac|MacBook Pro 14/16-inch (M5 Pro / Max)|2026-03-03|2026-03-04|2026-03-11|2026/03/apple-introduces-macbook-pro
macbook-air-m5|Mac|MacBook Air (M5)|2026-03-03|2026-03-04|2026-03-11|2026/03/apple-introduces-the-new-macbook-air
studio-display-2026|Displays|Studio Display / Studio Display XDR (2026)|2026-03-03|2026-03-04|2026-03-11|2026/03/apple-unveils-new-studio-display
macbook-neo|Mac|MacBook Neo|2026-03-04|2026-03-04|2026-03-11|2026/03/say-hello-to-macbook-neo
airpods-max-2|AirPods|AirPods Max (2nd generation)|2026-03-16|2026-03-25||2026/03/apple-introduces-airpods-max-2
siri-ai|Software|Siri AI (preview)|2026-06-08|||2026/06/apple-introduces-siri-ai
mac-studio-2026|Mac|Mac Studio (M5 Max / Ultra)|2026-08-25|2026-08-25|2026-09-22|2026/08/apple-introduces-new-mac-studio
mac-mini-2026|Mac|Mac mini (M6 / M5 Pro)|2026-08-25|2026-08-25|2026-09-22|2026/08/apple-unveils-a-more-powerful-mac-mini
'''
def lookup(q):
 if q.startswith('https://'): return q
 matches=[x['url'] for x in INDEX if q in x['url']]
 if len(matches)!=1: raise ValueError((q,matches))
 return matches[0]
SUPPLEMENTS={
 'pencil-1':['2015/11/09Epic-12-9-inch'],
 'macos-sierra':['2016/09/macos-sierra-now'],
 'watch-original':['2015/03/09Apple-Watch-Available'],
 'apple-tv-plus':['2019/09/apple-tv-launches-november'],
 'ipad-pro-2015':['2015/11/09Epic-12-9-inch'],
 'airpods-1':['2016/12/apple-airpods-are'],
 'imac-pro-2017':['2017/12/imac-pro-the'],
 'homepod-2018':['2017/06/homepod-reinvents'],
 'ipad-air-2020':['2020/10/all-new-ipad-air-with'],
 'fitness-plus':['2020/09/apple-fitness-plus-a-personalized'],
 'magic-keyboard-ipad':['2020/04/new-magic-keyboard'],
 'imac-2021':['2021/05/imac-ipad-pro-and-apple-tv'],
 'ipad-pro-2021':['2021/05/imac-ipad-pro-and-apple-tv'],
 'apple-tv-2021':['2021/05/imac-ipad-pro-and-apple-tv'],
 'watch-7':['2021/10/apple-watch-series-7-orders'],
 'macbook-air-2022':['2022/07/all-new-macbook-air'],
 'macbook-pro-m2':['2022/06/13-inch-macbook-pro-with'],
 'vision-pro-1':['2024/01/apple-vision-pro-available'],
 'watchos-10':['2023/09/watchos-10-is-available'],
 'tvos-17':['2023/09/tvos-17-available'],
 'pencil-usbc':['2023/11/the-new-more-affordable'],
 'apple-intelligence':['2024/10/apple-intelligence-is-available','2024/12/apple-intelligence-now-features'],
 'm1-macs':['2020/11/apple-unleashes-m1'],
 'ipad-2019':['2019/09/new-version-of-the-most-popular-ipad-starts'],
}
NOTES={
 'watch-original':'First preview September 9, 2014; launch details March 9, 2015. Orders April 10; initial customer deliveries April 24.',
 'macbook-pro-2018':'July 12 is online ordering. Stores later that week; an exact delivery day is not inferred.',
 'airtag-2':'January 26 is announcement and online ordering; Apple states stores later that week. An exact delivery day is not inferred.',
 'homepod-mini':'Source gives the week of November 16. Date represents the start of that stated week, not a verified exact first-delivery date.',
 'ipad-pro-2015':'November 11 is online ordering. Apple’s follow-up states stores later that week; no exact customer-availability date is inferred.',
 'apple-tv-2015':'Initial release states late October without an exact day. Exact ordering and availability dates remain to be sourced.',
 'airpods-1':'Initial October plan slipped. December 13 is online ordering; follow-up says deliveries the following week.',
 'macbook-pro-2016':'Touch Bar models ordered October 27 with shipment quoted in 2–3 weeks. The non-Touch-Bar model shipped immediately; these are separate milestones.',
 'imac-2017':'Groups simultaneous 2017 Mac refreshes described in the same release.',
 'imac-pro-2017':'December 14 marks order availability; delivery depended on configuration.',
 'airpods-2':'Orders March 20; Apple specifies stores the following week. Exact first delivery day not inferred.',
 'mac-pro-2019':'The preview gives fall, not an exact availability date. A later launch-day source is still needed.',
 'pro-display-xdr':'The preview gives fall, not an exact availability date. A later launch-day source is still needed.',
 'ipad-2019':'Apple revised the initial September 30 plan: shipping started September 25, stores later that week. Availability here means start of shipping.',
 'macbook-pro-2019':'Online orders November 13; stores later that week. Exact first delivery date not inferred.',
 'm1-macs':'Groups the simultaneous MacBook Air, 13-inch MacBook Pro and Mac mini M1 launches.',
 'vision-pro-1':'June 2023 is the preview; February 2024 is the initial US retail launch. International rollouts are distinct.',
 'apple-intelligence':'October 28 is initial US English public beta availability, not every announced feature. ChatGPT followed December 11; personalized Siri was later.',
 'magic-usbc':'USB-C accessories announced with M4 iMac. Standalone ordering and delivery dates are not established by the linked release.',
 'airpods-max-2':'Apple specifies customer availability in early April without an exact day.',
 'siri-ai':'Developer preview announced; general availability not yet entered.',
 'mac-studio-2026':'September 22 is scheduled future availability as of September 5, not an observed launch.',
 'mac-mini-2026':'September 22 is scheduled future availability as of September 5, not an observed launch.',
}
rows=[]
for line in RAW.strip().splitlines():
 id,cat,product,ann,orders,avail,q=line.split('|')
 try: urls=[lookup(q)]+[lookup(x) for x in SUPPLEMENTS.get(id,[])]
 except ValueError as e: raise SystemExit(f'Unresolved source: {e}')
 rows.append(dict(id=id,category=cat,product=product,announcementDate=ann,orderDate=orders or None,availabilityDate=avail or None,region='US / first launch markets',availabilityPrecision='week' if id=='homepod-mini' else 'day' if avail else None,availabilityMilestone='Shipping began' if id=='ipad-2019' else 'Customer / store availability',availabilityStatus='Scheduled' if avail>'2026-09-05' else 'Apple-stated' if avail else 'Exact date not entered',notes=NOTES.get(id,'') or ('Exact customer-availability date has not been established from the linked source; ordering is recorded separately.' if not avail else ''),sourceUrls=urls,verifiedAt='2026-09-05'))
def fetch(url):
 key=hashlib.sha256(url.encode()).hexdigest();p=CACHE/(key+'.json')
 if p.exists():
  saved=json.loads(p.read_text())
  if saved.get('publishedText'):return saved
 try:
  raw=urllib.request.urlopen(url,timeout=30).read();s=BeautifulSoup(raw,'html.parser')
  title=s.select_one('h1');parts=s.select('.pagebody-copy')
  if not parts:
   article=s.select_one('article') or s.select_one('main')
   parts=article.find_all(['p','li']) if article else []
  txt='\n'.join(dict.fromkeys(x.get_text(' ',strip=True) for x in parts))
  dat=s.select_one('.category-eyebrow__date') or s.select_one('.dateline')
  r=dict(url=url,title=title.get_text(' ',strip=True) if title else '',publishedText=dat.get_text(' ',strip=True) if dat else '',text=txt,sha256=hashlib.sha256(raw).hexdigest(),accessed='2026-09-05')
  p.write_text(json.dumps(r,ensure_ascii=False));return r
 except Exception as e:return dict(url=url,error=str(e))
if __name__=='__main__':
 urls=list(dict.fromkeys(u for r in rows for u in r['sourceUrls']))
 with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex: fetched=list(ex.map(fetch,urls))
 errors=[r for r in fetched if 'error' in r]
 if errors:raise SystemExit(errors)
 registry={r['url']:{k:v for k,v in r.items() if k!='text'} for r in fetched}
 milestone_indices={
  'pencil-1':(0,1,0),
  'macos-sierra':(0,0,1),'m1-macs':(0,0,2),
  'watch-original':(0,1,1),'ipad-pro-2015':(0,1,0),'airpods-1':(0,1,0),
  'imac-pro-2017':(0,1,0),'homepod-2018':(1,0,0),'ipad-air-2020':(0,1,1),
  'fitness-plus':(1,0,0),'magic-keyboard-ipad':(0,1,0),'imac-2021':(0,0,1),
  'ipad-pro-2021':(0,0,1),'apple-tv-2021':(0,0,1),'watch-7':(0,1,1),
  'macbook-air-2022':(0,1,1),'macbook-pro-m2':(0,1,1),'vision-pro-1':(0,1,1),
  'watchos-10':(0,0,1),'tvos-17':(0,0,1),'pencil-usbc':(0,1,0),
  'apple-intelligence':(0,0,1),'ipad-2019':(0,0,1),'apple-one':(0,0,1),
  'apple-tv-plus':(0,0,1),
 }
 for row in rows:
  row['sources']=[registry[u] for u in row.pop('sourceUrls')]
  if row['id']=='apple-one':
   row['sources'].append(dict(url='https://arstechnica.com/gadgets/2020/10/apple-one-launches-today-bundling-music-icloud-more-for-14-95-and-up/',title='Ars Technica · Apple One launches October 30 (Apple executive confirmation)',publishedText='October 30, 2020',accessed='2026-09-05',sha256=None))
   row['availabilityStatus']='Reported Apple confirmation'
   row['notes']='October 30 availability is backed by contemporaneous reporting of Apple executive confirmation; the original September release only said fall.'
  if row['id']=='m1-macs':
   row['sources'].extend([
    dict(url='https://9to5mac.com/2020/11/12/apple-silicon-mac-orders-shipping/',title='9to5Mac · Apple’s November 17 M1 Mac delivery date',publishedText='November 12, 2020',accessed='2026-09-05',sha256=None),
    dict(url='https://www.macrumors.com/2020/11/16/first-m1-silicon-macs-arriving-to-customers/',title='MacRumors · isolated early M1 Mac deliveries',publishedText='November 16, 2020',accessed='2026-09-05',sha256=None),
   ])
   row['availabilityStatus']='Reported Apple confirmation'
   row['availabilityMilestone']='General launch date'
   row['notes']='Groups M1 Air, Pro 13-inch and mini. November 17 is the general launch date reported from Apple’s delivery promise; isolated early deliveries on November 16 are recorded by the final reference.'
  indices=milestone_indices.get(row['id'],(0,0,0))
  row['milestoneSources']={field:row['sources'][i]['url'] if row[field] else None for field,i in zip(['announcementDate','orderDate','availabilityDate'],indices)}
  for source in row['sources']:
   source['publishedDate']=datetime.strptime(source['publishedText'],'%B %d, %Y').strftime('%Y-%m-%d')
 (ROOT/'public/data/apple-launches.json').write_text(json.dumps({'asOf':'2026-09-05','scope':'Major product generations and selected services, 2015–2026; exact dates only when sourced. Not a complete SKU inventory.','launches':rows},indent=2,ensure_ascii=False)+'\n')
 (CACHE/'all.json').write_text(json.dumps(fetched,indent=2,ensure_ascii=False))
 print('LAUNCHES',len(rows),'SOURCES',len(set(s['url'] for row in rows for s in row['sources'])))
