const WEEKDAYS = '日一二三四五六'

export function dayInfo(startDate, offset) {
  const [y, m, d] = startDate.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + offset))
  return {
    month: dt.getUTCMonth() + 1,
    date: dt.getUTCDate(),
    dow: dt.getUTCDay(),
    weekday: WEEKDAYS[dt.getUTCDay()],
  }
}

export function dayLabel(startDate, offset) {
  const { month, date, weekday } = dayInfo(startDate, offset)
  return `${month}/${date}（${weekday}）`
}

export function rangeLabel(startDate, count) {
  if (!count) return ''
  const year = startDate.slice(0, 4)
  return count === 1
    ? `${year} · ${dayLabel(startDate, 0)}`
    : `${year} · ${dayLabel(startDate, 0)} – ${dayLabel(startDate, count - 1)}`
}
