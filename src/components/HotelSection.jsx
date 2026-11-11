import { useState } from 'react'
import { BedIcon } from './Icons'

// The "住宿" strip at the bottom of each day.
export default function HotelSection({ hotel, previousHotel, isEditing, onEdit, onCancel, onSave }) {
  if (isEditing) {
    return (
      <div className="hotel is-editing">
        <HotelForm initial={hotel} onCancel={onCancel} onSave={onSave} />
      </div>
    )
  }

  if (!hotel?.name) {
    return (
      <div className="hotel empty">
        <BedIcon />
        <button className="hotel-add" onClick={onEdit}>
          加上住宿
        </button>
        {previousHotel?.name && (
          <button className="hotel-same" onClick={() => onSave({ ...previousHotel })}>
            同前一晚：{previousHotel.name}
          </button>
        )}
      </div>
    )
  }

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name)}`
  return (
    <div className="hotel">
      <BedIcon />
      <button className="hotel-body" onClick={onEdit} aria-label={`住宿：${hotel.name}，點一下編輯`}>
        <span className="hotel-label">住宿</span>
        <span className="hotel-name">{hotel.name}</span>
        {hotel.note && <span className="hotel-note">{hotel.note}</span>}
      </button>
      <a className="hotel-map" href={mapUrl} target="_blank" rel="noreferrer">
        地圖
      </a>
    </div>
  )
}

function HotelForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [note, setNote] = useState(initial?.note || '')

  function submit(e) {
    e.preventDefault()
    onSave(name.trim() ? { name: name.trim(), note: note.trim() } : null)
  }

  return (
    <form className="item-form" onSubmit={submit} onKeyDown={(e) => e.key === 'Escape' && onCancel()}>
      <input
        autoFocus
        className="field"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="飯店名稱，例如：那霸 Hilton"
        aria-label="飯店名稱"
      />
      <input
        className="field"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="備註：地址、入住時間、訂房代號…"
        aria-label="住宿備註"
      />
      <div className="form-actions">
        {initial?.name && (
          <button type="button" className="btn danger" onClick={() => onSave(null)}>
            清除住宿
          </button>
        )}
        <span className="spacer" />
        <button type="button" className="btn ghost" onClick={onCancel}>
          取消
        </button>
        <button type="submit" className="btn primary">
          儲存
        </button>
      </div>
    </form>
  )
}
