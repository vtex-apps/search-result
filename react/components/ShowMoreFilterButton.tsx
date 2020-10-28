import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'

interface ShowMoreFilterButton {
  toggleTruncate: () => void
  truncated: boolean
  quantity: number
}

const CSS_HANDLES = ['seeMoreButton'] as const

const ShowMoreFilterButton: React.FC<ShowMoreFilterButton> = ({
  truncated,
  toggleTruncate,
  quantity,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <button
      onClick={toggleTruncate}
      className={`${handles.seeMoreButton} mt2 pv2 bn pointer c-link`}
      key={truncated ? 'store/filter.more-items' : 'store/filter.less-items'}
    >
      <FormattedMessage
        id={truncated ? 'store/filter.more-items' : 'store/filter.less-items'}
        values={{
          quantity,
        }}
      />
    </button>
  )
}

export default ShowMoreFilterButton
