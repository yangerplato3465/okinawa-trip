import { useEffect, useRef, useState } from 'react'
import { mapHref } from '../lib/maps'
import { CloseIcon, MapPinIcon } from './Icons'
import InlineText from './InlineText'

// Popup with one day's "美食備選名單": restaurants we might eat at that day.
export default function FoodDialog({ open, onClose, dayLabel, items, actions }) {
  const dialog = useRef()
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [lastDeleted, setLastDeleted] = useState(null)

  useEffect(() => {
    const d = dialog.current
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
    if (!open) {
      setLastDeleted(null)
      setName('')
      setNote('')
    }
  }, [open])

  function add(e) {
    e.preventDefault()
    const n = name.trim()
    if (!n) return
    actions.add({ name: n, note: note.trim() })
    setName('')
    setNote('')
  }

  function remove(item, index) {
    actions.remove(item.id)
    setLastDeleted({ item, index })
  }

  return (
    <dialog
      ref={dialog}
      className="sheet"
      aria-labelledby="food-title"
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
    >
      <div className="sheet-inner">
        <header className="sheet-head">
          <h2 id="food-title">
            美食備選名單
            {dayLabel && <span className="sheet-sub">{dayLabel}</span>}
          </h2>
          <button className="icon-btn" onClick={onClose} aria-label="關閉">
            <CloseIcon />
          </button>
        </header>

        <form className="food-add" onSubmit={add}>
          <input
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="餐廳名稱，例如：海人料理 海邦丸"
            aria-label="餐廳名稱"
          />
          <div className="packing-add">
            <input
              className="field"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="備註（選填）：招牌菜、營業時間…"
              aria-label="餐廳備註"
            />
            <button className="btn primary" disabled={!name.trim()}>
              新增
            </button>
          </div>
        </form>

        {items.length === 0 ? (
          <p className="packing-empty">還沒有備選餐廳。把想吃的店先記在這裡，當天再決定。</p>
        ) : (
          <ul className="packing-list food-list">
            {items.map((item, i) => (
              <li key={item.id}>
                <span className="bullet" aria-hidden="true" />
                <div className="food-text">
                  <InlineText
                    className="food-name"
                    value={item.name}
                    ariaLabel="餐廳名稱"
                    onCommit={(t) => (t ? actions.update(item.id, { name: t }) : remove(item, i))}
                  />
                  <InlineText
                    className="food-note"
                    value={item.note || ''}
                    placeholder="加上備註"
                    ariaLabel={`${item.name} 的備註`}
                    onCommit={(t) => actions.update(item.id, { note: t })}
                  />
                </div>
                <a
                  className="item-map"
                  href={mapHref(item.name)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`在 Google 地圖搜尋 ${item.name}`}
                  title="在 Google 地圖搜尋"
                >
                  <MapPinIcon />
                </a>
                <button className="icon-btn" onClick={() => remove(item, i)} aria-label={`刪除 ${item.name}`}>
                  <CloseIcon />
                </button>
              </li>
            ))}
          </ul>
        )}

        {lastDeleted && (
          <div className="packing-undo" role="status">
            <span>已刪除「{lastDeleted.item.name}」</span>
            <button
              onClick={() => {
                actions.restore(lastDeleted.item, lastDeleted.index)
                setLastDeleted(null)
              }}
            >
              復原
            </button>
          </div>
        )}
      </div>
    </dialog>
  )
}
