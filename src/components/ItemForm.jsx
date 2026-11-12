import { useState } from 'react'
import { cleanMapUrl } from '../lib/maps'

export default function ItemForm({ initial, onSave, onCancel, onDelete }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [time, setTime] = useState(initial?.time || '')
  const [note, setNote] = useState(initial?.note || '')
  const [mapUrl, setMapUrl] = useState(initial?.mapUrl || '')
  const [tentative, setTentative] = useState(initial?.tentative || false)
  // Older items have no showMap field; they keep showing the pin.
  const [showMap, setShowMap] = useState(initial?.showMap !== false)
  const [badLink, setBadLink] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (!title.trim()) return
    let link = cleanMapUrl(mapUrl)
    if (link === null) {
      // The link box is hidden while the pin is off, so don't block saving on it.
      if (showMap) return setBadLink(true)
      link = initial?.mapUrl || ''
    }
    onSave({ title: title.trim(), time, note: note.trim(), mapUrl: link, showMap, tentative })
  }

  return (
    <form className="item-form" onSubmit={submit} onKeyDown={(e) => e.key === 'Escape' && onCancel()}>
      <input
        autoFocus
        className="field"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="地點或活動，例如：美麗海水族館"
        aria-label="行程名稱"
      />
      <div className="form-row">
        <label className="time-field">
          <span>時間</span>
          <input type="time" className="field" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
        {time && (
          <button type="button" className="link-btn" onClick={() => setTime('')}>
            清除時間
          </button>
        )}
        <label className="check">
          <input type="checkbox" checked={tentative} onChange={(e) => setTentative(e.target.checked)} />
          未確定
        </label>
        <label className="check">
          <input type="checkbox" checked={showMap} onChange={(e) => setShowMap(e.target.checked)} />
          顯示地圖
        </label>
      </div>
      <textarea
        className="field"
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="備註：餐廳、交通、營業時間…"
        aria-label="備註"
      />
      {showMap && (
        <MapUrlField value={mapUrl} bad={badLink} onChange={(v) => { setMapUrl(v); setBadLink(false) }} />
      )}
      <div className="form-actions">
        {onDelete && (
          <button type="button" className="btn danger" onClick={onDelete}>
            刪除
          </button>
        )}
        <span className="spacer" />
        <button type="button" className="btn ghost" onClick={onCancel}>
          取消
        </button>
        <button type="submit" className="btn primary" disabled={!title.trim()}>
          儲存
        </button>
      </div>
    </form>
  )
}

// Shared with the hotel form.
export function MapUrlField({ value, bad, onChange }) {
  return (
    <>
      <input
        className="field"
        inputMode="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="地圖連結（選填）：貼上 Google 地圖分享連結"
        aria-label="Google 地圖連結"
        aria-invalid={bad || undefined}
      />
      {bad && <p className="error field-error">這看起來不像連結，請貼上 Google 地圖的分享連結。</p>}
    </>
  )
}
