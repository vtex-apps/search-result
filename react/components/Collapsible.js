import classNames from 'classnames'
import React, { useState, useRef } from 'react'
import { injectIntl } from 'react-intl'
import { useSpring, animated } from 'react-spring'

import useMeasure from '../hooks/useMeasure'

const Collapsible = ({
  render,
  maxItems,
  threshold,
  items,
  openLabel = 'store/filter.more-items',
  closedLabel = 'store/filter.less-items',
  linkClassName,
  intl,
}) => {
  const [open, setOpen] = useState(false)
  const shouldCollapse = items.length >= maxItems + threshold

  const containerRef = useRef(null)

  const overflowQuantity = items.length - maxItems

  const { height } = useMeasure(containerRef)
  const styles = useSpring({ height: open ? height : 0 })

  return (
    <>
      {items.slice(0, shouldCollapse ? maxItems : items.length).map(render)}
      {shouldCollapse && items.length > maxItems && (
        <>
          <animated.div style={{ overflow: 'hidden', ...styles }}>
            <div className="dib w-100" ref={containerRef}>
              {items.slice(maxItems).map(render)}
            </div>
          </animated.div>
          <button
            className={classNames(
              linkClassName,
              'flex items-center mt2 pv2 ph0 bg-base bn self-start tl c-muted-3 pointer'
            )}
            onClick={() => setOpen(o => !o)}
          >
            <span className="c-link">
              {intl.formatMessage(
                {
                  id: !open ? openLabel : closedLabel,
                },
                { quantity: overflowQuantity }
              )}
            </span>
          </button>
        </>
      )}
    </>
  )
}

export default injectIntl(Collapsible)
