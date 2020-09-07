import { useOnView } from './useOnView'
import React, { useState, useRef } from 'react'

const useRenderOnView = ({ lazyRender = false, height = 400 }) => {
  const dummy = useRef<HTMLDivElement | null>(null)
  const [hasBeenViewed, setHasBeenViewed] = useState(false)

  useOnView({
    ref: dummy,
    onView: () => setHasBeenViewed(true),
    once: true,
    initializeOnInteraction: true,
    bailOut: !lazyRender,
  })

  const dummyElement = (
    <div
      ref={dummy}
      style={{
        width: '100%',
        height,
        position: 'relative',
        /** Pulls the object 200px up so it renders a bit earlier,
         * before the user would actually see the content */
        top: -200,
      }}
    />
  )

  return { hasBeenViewed: hasBeenViewed || !lazyRender, dummyElement }
}

export { useRenderOnView }
