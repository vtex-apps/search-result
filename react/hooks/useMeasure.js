import { useState, useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

export default function useMeasure(ref) {
  const [bounds, setBounds] = useState({ left: 0, top: 0, width: 0, height: 0 })

  useEffect(() => {
    let isCurrent = true
    const resizeObserver = new ResizeObserver(([entry]) => {
      if (isCurrent) {
        setBounds(entry.contentRect)
      }
    })

    if (ref.current !== null) {
      resizeObserver.observe(ref.current)
    }

    return () => {
      resizeObserver.disconnect()
      isCurrent = false
    }
  }, [ref])

  return bounds
}
