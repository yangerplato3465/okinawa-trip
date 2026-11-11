import { useState } from 'react'

export default function ItemForm({ initial, onSave, onCancel, onDelete }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [time, setTime] = useState(initial?.time || '')
  const [note, setNote] = useState(initial?.note || '')
  const [tentative, setTentative] = useState(initial?.tentative || false)

  function submit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim(), time, note: note.trim(), tentative })
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
      </div>
      <textarea
        className="field"
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="備註：餐廳、交通、營業時間…"
        aria-label="備註"
      />
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
