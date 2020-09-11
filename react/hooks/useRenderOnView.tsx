import { useOnView } from './useOnView'
import React, { useState, useRef } from 'react'

const useRenderOnView = ({
  lazyRender = false,
  height = 400,
  offset = 200,
  waitForUserInteraction = true,
}) => {
  const dummy = useRef<HTMLDivElement | null>(null)
  const [hasBeenViewed, setHasBeenViewed] = useState(false)

  useOnView({
    ref: dummy,
    onView: () => setHasBeenViewed(true),
    once: true,
    initializeOnInteraction: waitForUserInteraction,
    bailOut: !lazyRender,
  })

  const dummyElement = (
    <div
      style={{
        width: '100%',
        height,
        position: 'relative',
      }}
    >
      <div
        ref={dummy}
        style={{
          /** Allows detecting the view a bit earlier, allowing rendering before the user
           * sees the whitespace where the component should be */
          top: -offset,
          bottom: 0,
          left: 0,
          right: 0,
          position: 'absolute',
        }}
      />
    </div>
  )

  return { hasBeenViewed: hasBeenViewed || !lazyRender, dummyElement }
}

export { useRenderOnView }
