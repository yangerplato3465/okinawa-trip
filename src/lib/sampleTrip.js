import { randomId } from './ids'

const item = (title, { time = '', note = '', tentative = false, showMap = true, mapUrl = '' } = {}) => ({
  id: randomId(),
  title,
  time,
  note,
  mapUrl,
  showMap,
  tentative,
})

// Steps that aren't a place (flights, naps, driving) hide the map pin.
const step = (title, opts = {}) => item(title, { ...opts, showMap: false })

const day = (items, title = '', hotel = null, food = []) => ({ id: randomId(), title, items, hotel, food })
const food = (name, note = '') => ({ id: randomId(), name, note })

const nahana = { name: 'Okinawa NaHaNa Hotel & Spa', note: '14:00 可以 check in；備品齊全', mapUrl: '' }
const yamakawa = { name: 'Ocean front Yamakawa', note: '民宿', mapUrl: '' }

// From the family's schedule spreadsheet (4/9 – 4/14).
export function okinawaSample() {
  return {
    title: '沖繩家族旅行',
    startDate: '2027-04-09',
    days: [
      day(
        [
          step('出發機場', {
            time: '11:30',
            note: '開車30分鐘，嘟嘟房停車場－文昌加盟－台中機場2站台新一天90元\n待補充：換錢、保險、ESIM、入境資料',
          }),
          step('Check in', { time: '12:00', note: '清泉崗機場（網友說提早1HR就可以）用網路' }),
          step('搭飛機', {
            time: '13:10',
            note: '星宇 JX302，航廈 T2，座位：（待選，2天前選位），有親子櫃台嗎？\n13:10–15:45',
          }),
          step('拿行李', { time: '15:45', note: '59751 台幣' }),
          step('搭車到飯店', { time: '16:30', note: '預計19分鐘' }),
          item('牧志公設市場', { note: '晚餐' }),
          step('回飯店休息'),
        ],
        '前往沖繩 · 天氣 19–25°C',
        nahana,
      ),
      day(
        [
          item('波上宮', { time: '09:00', note: '走進鳥居、在手水舍洗手漱口、到本殿參拜，買御守或抽籤' }),
          item('泊港魚市場', { note: '中餐，大國海鮮' }),
          step('回飯店午睡'),
          step('取車', {
            note: 'ORIX Rent-a-car Naha Nishi-machi／歐力士租車 美榮橋站前店\n推薦 Nissan Serena（確認最晚借車時間）',
          }),
          item('國際通', {
            note: '逛街＋晚餐\n唐吉訶德（~1:00）、安利美特（~20:00）、Calbee+（~21:00）',
          }),
        ],
        '那霸（波上宮＋泊港漁市場＋國際通）',
        nahana,
      ),
      day(
        [
          step('飯店吃早餐', { time: '08:00' }),
          item('沖繩兒童王國', { time: '09:40', note: '09:00 出發開車過去；下午3點離開（玩5個小時）' }),
          step('換房間：開車到民宿', { time: '15:00', note: '4點半抵達 Ocean front Yamakawa' }),
          item('Aqua Town 公園', { time: '16:30', note: '開車5分鐘，帶挖沙工具!!' }),
          item('タウンプラザかねひで もとぶ美ら海市場', {
            note: '晚餐超市買，開車7分鐘（開到11:00，熟食很強）\n飯店附近可逛：BIG EXPRESS 本部店（旁邊有大創）、San-A（一般超市）',
          }),
        ],
        '換房間＋兒童王國（09:30–17:30）',
        yamakawa,
      ),
      day(
        [
          item('古宇利島', {
            time: '09:00',
            note: '開車36分鐘\n古宇利海洋塔、古宇利大橋、心型石、古宇利沙灘、Seal Blue 冰淇淋',
          }),
          step('吃午餐', {
            note: '古宇利島吃飯：蝦蝦飯、食事処鏡屋吃海膽飯、FIFI PARLOR、Gajumaru Rock 吃漢堡排飯',
          }),
          step('開車回飯店睡午覺', { time: '12:20', note: '開車36分鐘，13:00–14:30 睡午覺' }),
          item('名護鳳梨園', { time: '14:30', note: '開車24分鐘，15:00–18:00 鳳梨園玩耍；門票、小火車' }),
          step('吃燒肉', {
            note: '在名護市區吃，吃完逛一下\n名護的雨備：AEON＋MEGA 唐吉訶德＋birthday',
          }),
        ],
        '古宇利島＋鳳梨園＋燒肉',
        yamakawa,
        [
          food('蝦蝦飯', '古宇利島午餐'),
          food('食事処 鏡屋', '海膽飯'),
          food('FIFI PARLOR'),
          food('Gajumaru Rock', '漢堡排飯'),
        ],
      ),
      day(
        [
          item('美麗海水族館', {
            time: '08:20',
            note: '開車10分鐘；水族館 08:30 營業＋海洋博公園，到下午3、4點再離開',
          }),
          step('睡午覺', { time: '15:00' }),
          item('Emerald Beach 翡翠海灘', {
            time: '16:30',
            tentative: true,
            note: '下午至晚上行程：開車5分鐘到 Kokuei Okinawakinenkoen Emerald Beach 玩沙看夕陽\nor 瀨底島 or 備瀨のフクギ並木道',
          }),
          step('晚餐', {
            tentative: true,
            note: '飯店附近的吃飯：Steakhouse 88、海人料理 海邦丸、燒肉本部牧場 本部總店、美ら海キッチンぱぱいや、Reunion、抜萃咖茶 花人逢\n飯店附近可逛：BIG EXPRESS 本部店（旁邊有大創）、San-A（一般超市）',
          }),
        ],
        '美麗海水族館',
        yamakawa,
        [
          food('Steakhouse 88'),
          food('海人料理 海邦丸'),
          food('燒肉本部牧場 本部總店'),
          food('美ら海キッチンぱぱいや'),
          food('Reunion'),
          food('抜萃咖茶 花人逢'),
        ],
      ),
      day(
        [
          item('永旺夢樂城', { time: '08:30', note: '早上8:30離開飯店；10:00–13:30 逛永旺夢樂城' }),
          item('瀨長島', { time: '13:30', note: '13點30離開，14點30抵達瀨長島（小團車上午睡）\n瀨長島鬆餅' }),
          step('還車', { time: '16:10', note: '還車前要加油' }),
          step('搭接駁車去那霸機場', { time: '16:45' }),
          step('出境', { time: '17:00' }),
          step('搭飛機 沖繩－台中', { time: '20:10', note: '星宇 JX313，航廈 T2，座位：，有親子櫃台嗎？\n20:50–21:30 等行李' }),
          step('開車回家', { time: '21:30', note: '約 22:00 到家' }),
        ],
        '永旺夢樂城＋瀨長島',
      ),
    ],
    trash: [],
  }
}
