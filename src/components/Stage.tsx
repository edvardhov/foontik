import { forwardRef, useEffect, useRef } from 'react'

interface StageProps {
  text: string
  fontSize: number
  coachPulse?: boolean
  onTextChange: (text: string) => void
  onFocus?: () => void
}

export const Stage = forwardRef<HTMLHeadingElement, StageProps>(function Stage(
  { text, fontSize, coachPulse = false, onTextChange, onFocus },
  ref,
) {
  const editableRef = useRef<HTMLHeadingElement>(null)
  const isEmpty = !text.trim()

  useEffect(() => {
    const node = editableRef.current
    if (!node) return
    if (isEmpty) {
      node.textContent = ''
      return
    }
    if (node.textContent !== text) node.textContent = text
  }, [text, isEmpty])

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="foontik-stage-text px-6 text-center leading-[0.85] tracking-tight select-none"
        style={{ fontSize: `${fontSize}vw` }}
      >
        <h1
          ref={(node) => {
            editableRef.current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
          }}
          data-export-target
          data-placeholder="TYPE HERE"
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          className={`pointer-events-auto outline-none ${isEmpty ? 'is-empty' : ''} ${coachPulse ? 'coach-pulse' : ''}`}
          onFocus={onFocus}
          onInput={(event) => {
            const value = event.currentTarget.textContent?.trim() ?? ''
            onTextChange(value)
          }}
          onBlur={(event) => {
            const value = event.currentTarget.textContent?.trim() ?? ''
            if (!value) {
              event.currentTarget.textContent = ''
            }
          }}
        />
      </div>
    </div>
  )
})
