import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { useEffect, useRef, useState } from 'react'
import { rangeLabel } from '../lib/dates'
import { randomId } from '../lib/ids'
import * as ops from '../lib/ops'
import { rememberTrip } from '../lib/recent'
import { isDemoMode } from '../lib/store'
import { useTrip } from '../lib/useTrip'
import DayCard from './DayCard'
import { BagIcon, PlusIcon, ShareIcon, UndoIcon } from './Icons'
import InlineText from './InlineText'
import PackingDialog from './PackingDialog'

export default function TripPage({ tripId }) {
  const { trip, error, mutate, saving } = useTrip(tripId)
  const [editing, setEditing] = useState(null) // item id, or `new:<dayId>`
  const [toast, setToast] = useState(null)
  const [packingOpen, setPackingOpen] = useState(false)
  const toastTimer = useRef()

  function showToast(message, action) {
    clearTimeout(toastTimer.current)
    setToast({ message, action })
    toastTimer.current = setTimeout(() => setToast(null), 6000)
  }

  const run = (change) =>
    mutate(change).catch(() => showToast('儲存失敗，請檢查網路連線後再試一次'))

  useEffect(() => {
    if (!trip) return
    document.title = trip.title || '旅行計畫'
    rememberTrip(tripId, trip.title)
  }, [tripId, trip?.title])

  if (error) return <Message title="無法載入行程">請檢查網路連線，或確認連結是否完整。</Message>
  if (trip === undefined) return <Message title="載入中…" />
  if (trip === null)
    return (
      <Message title="找不到這個行程">
        連結可能少複製了幾個字，請再跟分享的人要一次。<br />
        <a href="/">回到首頁</a>
      </Message>
    )

  const actions = {
    updateDay: (dayId, patch) => run(ops.updateDay(dayId, patch)),
    deleteDay: (day, label) => {
      run(ops.deleteDay(day.id, label))
      const extra = day.items.length ? `（含 ${day.items.length} 個行程）` : ''
      showToast(`已刪除 ${label}${extra}`, { label: '復原', fn: () => run(ops.restore(day.id)) })
    },
    addItem: (dayId, fields) => run(ops.addItem(dayId, { id: randomId(), ...fields })),
    updateItem: (itemId, patch) => run(ops.updateItem(itemId, patch)),
    setHotel: (dayId, hotel) => run(ops.setHotel(dayId, hotel)),
    deleteItem: (item) => {
      run(ops.deleteItem(item.id, item.title))
      showToast(`已刪除「${item.title}」`, { label: '復原', fn: () => run(ops.restore(item.id)) })
    },
  }

  function onDragEnd({ source, destination, draggableId, type }) {
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return
    if (type === 'DAY') run(ops.moveDay(draggableId, destination.index))
    else run(ops.moveItem(draggableId, destination.droppableId, destination.index))
  }

  async function share() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: trip.title, text: '一起來編輯行程！', url })
        return
      } catch (e) {
        if (e.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      showToast('已複製連結，貼到群組就能一起編輯')
    } catch {
      showToast(url)
    }
  }

  const trash = trip.trash || []
  const packing = trip.packing || []
  const packingActions = {
    add: (text) => run(ops.addPacking({ id: randomId(), text })),
    update: (id, patch) => run(ops.updatePacking(id, patch)),
    remove: (id) => run(ops.deletePacking(id)),
    restore: (item, index) => run(ops.restorePacking(item, index)),
  }

  return (
    <div className="page">
      {isDemoMode && (
        <div className="demo-banner">
          本機示範模式：資料只存在這台電腦的瀏覽器。設定 Firebase 後才能和大家共用。
        </div>
      )}

      <header className="trip-head">
        <div className="eyebrow">
          {rangeLabel(trip.startDate, trip.days.length)} · {trip.days.length} 天
          <span className={`sync ${saving ? 'is-saving' : ''}`}>{saving ? '儲存中…' : '已同步'}</span>
        </div>
        <h1>
          <InlineText
            className="trip-title"
            value={trip.title}
            placeholder="行程名稱"
            onCommit={(title) => run(ops.setTitle(title || '我們的旅行'))}
          />
        </h1>
        <div className="toolbar">
          <label className="start-date">
            出發日
            <input
              type="date"
              className="field"
              value={trip.startDate}
              onChange={(e) => e.target.value && run(ops.setStartDate(e.target.value))}
            />
          </label>
          <div className="toolbar-actions">
            <button className="btn" onClick={() => setPackingOpen(true)}>
              <BagIcon /> 要帶的東西
              {packing.length > 0 && <span className="count">{packing.length}</span>}
            </button>
            <button className="btn primary" onClick={share}>
              <ShareIcon /> 分享連結
            </button>
          </div>
        </div>
        <p className="hint">
          點行程可以編輯；按住行程拖曳就能換到別天。按住日期左邊的 <span className="hint-grip">⠿</span>{' '}
          可以整天調換順序，日期會自動對上。
        </p>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="days" type="DAY">
          {(drop) => (
            <div ref={drop.innerRef} {...drop.droppableProps} className="days">
              {trip.days.map((day, i) => (
                <DayCard
                  key={day.id}
                  day={day}
                  index={i}
                  startDate={trip.startDate}
                  previousHotel={trip.days[i - 1]?.hotel}
                  editing={editing}
                  setEditing={setEditing}
                  actions={actions}
                />
              ))}
              {drop.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button className="add-day" onClick={() => run(ops.addDay(randomId()))}>
        <PlusIcon /> 新增一天
      </button>

      {trash.length > 0 && (
        <details className="trash">
          <summary>最近刪除（{trash.length}）</summary>
          <ul>
            {trash.map((entry) => (
              <li key={entry.id + entry.deletedAt}>
                <span>
                  {entry.kind === 'day'
                    ? `整天 ${entry.label}${entry.day.items.length ? `・${entry.day.items.length} 個行程` : ''}`
                    : entry.label}
                </span>
                <button className="btn ghost small" onClick={() => run(ops.restore(entry.id))}>
                  <UndoIcon /> 復原
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}

      <footer className="app-version">v{__APP_VERSION__}</footer>

      <PackingDialog
        open={packingOpen}
        onClose={() => setPackingOpen(false)}
        items={packing}
        actions={packingActions}
      />

      {toast && (
        <div className="toast" role="status">
          <span>{toast.message}</span>
          {toast.action && (
            <button
              onClick={() => {
                toast.action.fn()
                setToast(null)
              }}
            >
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function Message({ title, children }) {
  return (
    <div className="page message">
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  )
}
