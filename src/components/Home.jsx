import { useState } from 'react'
import { newTripId } from '../lib/ids'
import { loadRecent } from '../lib/recent'
import { okinawaSample } from '../lib/sampleTrip'
import { createTrip, isDemoMode } from '../lib/store'

export default function Home() {
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const recent = loadRecent()

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
      <p className="lead">
        建立一個行程，把連結傳給家人朋友，大家都能直接編輯、拖曳調整，不用註冊登入。
      </p>
      <button className="btn primary big" onClick={create} disabled={busy}>
        {busy ? '建立中…' : '建立沖繩行程'}
      </button>
      <p className="fine">會先放入 4/9 – 4/14 的行程草稿，之後都可以修改。</p>
      {failed && <p className="error">建立失敗，請檢查網路連線後再試一次。</p>}

      {recent.length > 0 && (
        <section className="recent">
          <h2>這台裝置開過的行程</h2>
          <ul>
            {recent.map((t) => (
              <li key={t.id}>
                <a href={`/t/${t.id}`}>{t.title || '未命名行程'}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="fine">提醒：知道連結的人都能編輯，請只分享給一起旅行的人。</p>
      <footer className="app-version">v{__APP_VERSION__}</footer>
    </div>
  )
}
