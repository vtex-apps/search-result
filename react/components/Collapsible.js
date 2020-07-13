import classNames from 'classnames'
import React, { useState, useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import { NoSSR } from 'vtex.render-runtime'

import AnimatedDiv from './AnimatedDiv'

const Collapsible = ({
  render,
  maxItems,
  threshold,
  items,
  openLabel = 'store/filter.more-items',
  closedLabel = 'store/filter.less-items',
  linkClassName,
}) => {
  const [open, setOpen] = useState(false)
  const shouldCollapse = items.length >= maxItems + threshold

  const containerRef = useRef(null)

  const overflowQuantity = items.length - maxItems

  return (
    <>
      {items.slice(0, shouldCollapse ? maxItems : items.length).map(render)}
      {shouldCollapse && items.length > maxItems && (
        <>
          <NoSSR>
            <AnimatedDiv open={open} containerRef={containerRef}>
              <div className="dib w-100" aria-hidden={!open} ref={containerRef}>
                {items.slice(maxItems).map(render)}
              </div>
            </AnimatedDiv>
          </NoSSR>
          <button
            className={classNames(
              linkClassName,
              'flex items-center mt2 pv2 ph0 bg-base bn self-start tl c-muted-3 pointer'
            )}
            onClick={() => setOpen(o => !o)}
          >
            <span className="c-link">
              <FormattedMessage id={!open ? openLabel : closedLabel} values={{ quantity: overflowQuantity }} />
            </span>
          </button>
        </>
      )}
    </>
  )
}

export default Collapsible
