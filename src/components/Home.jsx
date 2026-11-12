import { useEffect, useState } from 'react'
import { rangeLabel } from '../lib/dates'
import { newTripId } from '../lib/ids'
import { okinawaSample } from '../lib/sampleTrip'
import { createTrip, isDemoMode, subscribeTrips } from '../lib/store'
import { ChevronIcon } from './Icons'

export default function Home() {
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const [trips, setTrips] = useState(undefined) // undefined = loading
  const [listFailed, setListFailed] = useState(false)

  useEffect(() => {
    document.title = '旅行計畫'
    return subscribeTrips(
      (list) => {
        setTrips(list)
        setListFailed(false)
      },
      () => setListFailed(true),
    )
  }, [])

  async function create() {
    setBusy(true)
    setFailed(false)
    const id = newTripId()
    try {
      await createTrip(id, okinawaSample())
      window.location.assign(`/t/${id}`)
    } catch {
      setFailed(true)
      setBusy(false)
    }
  }

  return (
    <div className="page home">
      {isDemoMode && (
        <div className="demo-banner">本機示範模式：尚未設定 Firebase，資料只存在這台電腦。</div>
      )}
      <h1>旅行計畫</h1>
      <p className="lead">大家的行程都在這裡，點進去就能直接編輯、拖曳調整，不用註冊登入。</p>

      <section className="trip-list">
        <h2>所有行程</h2>
        {listFailed ? (
          <p className="error">無法載入行程列表，請檢查網路連線。</p>
        ) : trips === undefined ? (
          <p className="fine">載入中…</p>
        ) : trips.length === 0 ? (
          <p className="fine">還沒有行程，按下面的按鈕建立第一個。</p>
        ) : (
          <ul>
            {trips.map((t) => {
              const days = t.days?.length || 0
              return (
                <li key={t.id}>
                  <a href={`/t/${t.id}`}>
                    <span className="trip-list-body">
                      <span className="trip-list-title">{t.title || '未命名行程'}</span>
                      <span className="trip-list-meta">
                        {t.startDate && days ? `${rangeLabel(t.startDate, days)} · ${days} 天` : '還沒有日期'}
                      </span>
                    </span>
                    <ChevronIcon />
                  </a>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <button className="btn primary big" onClick={create} disabled={busy}>
        {busy ? '建立中…' : '建立沖繩行程'}
      </button>
      <p className="fine">會先放入 4/9 – 4/14 的行程草稿，之後都可以修改。</p>
      {failed && <p className="error">建立失敗，請檢查網路連線後再試一次。</p>}

      <p className="fine">提醒：打開這個網站的人都能看到並編輯所有行程，網址請只分享給家人朋友。</p>
      <footer className="app-version">v{__APP_VERSION__}</footer>
    </div>
  )
}
