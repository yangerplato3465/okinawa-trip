import { useEffect, useRef, useState } from 'react'

// Text that looks like a heading but can be tapped and edited.
// Saves on Enter or when you tap elsewhere; Esc cancels.
export default function InlineText({ value, onCommit, placeholder, className = '', ariaLabel }) {
  const [draft, setDraft] = useState(value)
  const focused = useRef(false)
  const cancelled = useRef(false)

  useEffect(() => {
    if (!focused.current) setDraft(value)
  }, [value])

  return (
    <input
      className={`inline-text ${className}`}
      value={draft}
      placeholder={placeholder}
      aria-label={ariaLabel || placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onFocus={() => {
        focused.current = true
        cancelled.current = false
      }}
      onBlur={() => {
        focused.current = false
        const next = draft.trim()
        if (cancelled.current) setDraft(value)
        else if (next !== value) onCommit(next)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
        if (e.key === 'Escape') {
          cancelled.current = true
          e.currentTarget.blur()
        }
      }}
    />
  )
}
