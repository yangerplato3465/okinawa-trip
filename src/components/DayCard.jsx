import { Draggable, Droppable } from '@hello-pangea/dnd'
import { dayInfo } from '../lib/dates'
import HotelSection from './HotelSection'
import { mapHref } from '../lib/maps'
import { GripIcon, MapPinIcon, PlusIcon, TrashIcon } from './Icons'
import InlineText from './InlineText'
import ItemForm from './ItemForm'

export default function DayCard({ day, index, startDate, previousHotel, editing, setEditing, actions }) {
  const { month, date, weekday, dow } = dayInfo(startDate, index)
  const adding = editing === `new:${day.id}`

  return (
    <Draggable draggableId={day.id} index={index}>
      {(drag, dragSnap) => (
        <section
          ref={drag.innerRef}
          {...drag.draggableProps}
          className={`day ${dragSnap.isDragging ? 'is-dragging' : ''}`}
        >
          <header className="day-head">
            <div className="day-handle" {...drag.dragHandleProps} aria-label={`拖曳調整 ${month}/${date} 整天的順序`}>
              <GripIcon />
            </div>
            <div className={`day-date dow-${dow}`}>
              <span className="day-md">{month}/{date}</span>
              <span className="day-wd">（{weekday}）</span>
            </div>
            <InlineText
              className="day-title"
              value={day.title}
              placeholder="加上標題"
              ariaLabel={`${month}/${date} 的標題`}
              onCommit={(title) => actions.updateDay(day.id, { title })}
            />
            <button
              className="icon-btn"
              onClick={() => actions.deleteDay(day, `${month}/${date}（${weekday}）`)}
              aria-label={`刪除 ${month}/${date}`}
              title="刪除這一天"
            >
              <TrashIcon />
            </button>
          </header>

          <Droppable droppableId={day.id} type="ITEM">
            {(drop, dropSnap) => (
              <ol
                ref={drop.innerRef}
                {...drop.droppableProps}
                className={`items ${dropSnap.isDraggingOver ? 'is-over' : ''}`}
              >
                {day.items.map((item, i) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    index={i}
                    isEditing={editing === item.id}
                    onEdit={() => setEditing(item.id)}
                    onCancel={() => setEditing(null)}
                    onSave={(patch) => {
                      actions.updateItem(item.id, patch)
                      setEditing(null)
                    }}
                    onDelete={() => {
                      actions.deleteItem(item)
                      setEditing(null)
                    }}
                  />
                ))}
                {drop.placeholder}
                {day.items.length === 0 && !dropSnap.isDraggingOver && (
                  <li className="items-empty">還沒有行程 — 可以把其他天的行程拖過來</li>
                )}
              </ol>
            )}
          </Droppable>

          {adding ? (
            <div className="add-form">
              <ItemForm
                onCancel={() => setEditing(null)}
                onSave={(fields) => {
                  actions.addItem(day.id, fields)
                  setEditing(null)
                }}
              />
            </div>
          ) : (
            <button className="add-item" onClick={() => setEditing(`new:${day.id}`)}>
              <PlusIcon /> 新增行程
            </button>
          )}

          <HotelSection
            hotel={day.hotel}
            previousHotel={previousHotel}
            isEditing={editing === `hotel:${day.id}`}
            onEdit={() => setEditing(`hotel:${day.id}`)}
            onCancel={() => setEditing(null)}
            onSave={(hotel) => {
              actions.setHotel(day.id, hotel)
              setEditing(null)
            }}
          />
        </section>
      )}
    </Draggable>
  )
}

function ItemRow({ item, index, isEditing, onEdit, onCancel, onSave, onDelete }) {
  return (
    <Draggable draggableId={item.id} index={index} isDragDisabled={isEditing}>
      {(drag, snap) => (
        <li
          ref={drag.innerRef}
          {...drag.draggableProps}
          {...(isEditing ? {} : drag.dragHandleProps)}
          className={`item ${snap.isDragging ? 'is-dragging' : ''} ${isEditing ? 'is-editing' : ''}`}
          onClick={isEditing ? undefined : onEdit}
          onKeyDown={(e) => {
            if (!isEditing && e.key === 'Enter') onEdit()
          }}
          aria-label={isEditing ? undefined : `${item.time ? item.time + ' ' : ''}${item.title}，點一下編輯，按住拖曳`}
        >
          {isEditing ? (
            <ItemForm initial={item} onSave={onSave} onCancel={onCancel} onDelete={onDelete} />
          ) : (
            <>
              <span className={`item-time ${item.time ? '' : 'none'}`}>{item.time || '•'}</span>
              <span className="item-body">
                <span className="item-title">
                  {item.title}
                  {item.tentative && <span className="badge">未確定</span>}
                </span>
                {item.note && <span className="item-note">{item.note}</span>}
              </span>
              {item.showMap !== false && (
                <a
                  className={`item-map ${item.mapUrl ? 'has-link' : ''}`}
                  href={mapHref(item.title, item.mapUrl)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  aria-label={`在 Google 地圖開啟 ${item.title}`}
                  title={item.mapUrl ? '開啟地圖連結' : '在 Google 地圖搜尋'}
                >
                  <MapPinIcon />
                </a>
              )}
              <span className="item-grip" aria-hidden="true">
                <GripIcon />
              </span>
            </>
          )}
        </li>
      )}
    </Draggable>
  )
}
