import { useEffect, useRef, useState } from 'react'
import { CloseIcon } from './Icons'
import InlineText from './InlineText'

// Popup with the shared "what to bring" checklist. Anyone can tick items off.
export default function PackingDialog({ open, onClose, items, actions }) {
  const dialog = useRef()
  const [text, setText] = useState('')
  const [lastDeleted, setLastDeleted] = useState(null)

  useEffect(() => {
    const d = dialog.current
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
    if (!open) setLastDeleted(null)
  }, [open])

  function add(e) {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    actions.add(t)
    setText('')
  }

  function remove(item, index) {
    actions.remove(item.id)
    setLastDeleted({ item, index })
  }

  return (
    <dialog
      ref={dialog}
      className="sheet"
      aria-labelledby="packing-title"
      onClose={onClose}
      // clicking the dim background closes it
      onClick={(e) => e.target === dialog.current && onClose()}
    >
      <div className="sheet-inner">
        <header className="sheet-head">
          <h2 id="packing-title">要帶的東西</h2>
          <button className="icon-btn" onClick={onClose} aria-label="關閉">
            <CloseIcon />
          </button>
        </header>

        <form className="packing-add" onSubmit={add}>
          <input
            className="field"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="新增要帶的東西，例如：護照"
            aria-label="新增要帶的東西"
          />
          <button className="btn primary" disabled={!text.trim()}>
            新增
          </button>
        </form>

        {items.length === 0 ? (
          <p className="packing-empty">清單還是空的。可以加上：護照、日幣、轉接頭、防曬乳、泳衣…</p>
        ) : (
          <ul className="packing-list">
            {items.map((item, i) => (
              <li key={item.id} className={item.done ? 'is-done' : ''}>
                <input
                  type="checkbox"
                  className="packing-check"
                  checked={Boolean(item.done)}
                  onChange={(e) => actions.update(item.id, { done: e.target.checked })}
                  aria-label={`${item.text} 已準備好`}
                />
                <InlineText
                  className="packing-text"
                  value={item.text}
                  ariaLabel="要帶的東西"
                  onCommit={(t) => (t ? actions.update(item.id, { text: t }) : remove(item, i))}
                />
                <button className="icon-btn" onClick={() => remove(item, i)} aria-label={`刪除 ${item.text}`}>
                  <CloseIcon />
                </button>
              </li>
            ))}
          </ul>
        )}

        {lastDeleted && (
          <div className="packing-undo" role="status">
            <span>已刪除「{lastDeleted.item.text}」</span>
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
