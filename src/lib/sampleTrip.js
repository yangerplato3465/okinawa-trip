import { randomId } from './ids'

const item = (title, { time = '', note = '', tentative = false } = {}) => ({
  id: randomId(),
  title,
  time,
  note,
  tentative,
})

const day = (items, title = '') => ({ id: randomId(), title, items })

// From the family's draft schedule (4/9 – 4/14).
export function okinawaSample() {
  return {
    title: '沖繩家族旅行',
    startDate: '2027-04-09',
    days: [
      day([]),
      day([
        item('泊港魚市場', { note: '大國海鮮' }),
        item('瀨長島'),
        item('國際通', { note: '或 看煙火' }),
      ]),
      day([item('換房間'), item('兒童王國', { time: '09:30' })]),
      day([
        item('鳳梨園', { time: '10:00' }),
        item('古宇利島', { note: '蝦蝦飯' }),
        item('吃燒肉'),
      ]),
      day([
        item('水族館', { time: '08:30', note: '有可能沒營業？' }),
        item('晚上在房間玩耍'),
      ]),
      day([item('永旺夢樂城'), item('瀨長島', { note: '鬆餅', tentative: true })]),
    ],
    trash: [],
  }
}
