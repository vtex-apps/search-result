import React, { useState, useEffect } from 'react'
import { Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'

const CSS_HANDLES = ['buttonShowMore']

const useShowButton = (from, products, loading) => {
  const [showButton, setShowButton] = useState(
    !!products && from > 0 && products.length > 0
  )

  useEffect(() => {
    if (!loading) {
      setShowButton(!!products && from > 0 && products.length > 0)
    }
  }, [from, products, loading])

  return showButton
}

const FetchPreviousButton = (props) => {
  const {
    products,
    from,
    onFetchPrevious,
    loading,
    htmlElementForButton,
    previousPage,
  } = props

  const isAnchor = htmlElementForButton === 'a'
  const showButton = useShowButton(from, products, loading)
  const handles = useCssHandles(CSS_HANDLES)

  const handleFetchMoreClick = (ev) => {
    isAnchor && ev.preventDefault()
    onFetchPrevious()
  }

  return (
    <div className={`${handles.buttonShowMore} w-100 flex justify-center`}>
      {showButton && (
        <Button
          onClick={(ev) => handleFetchMoreClick(ev)}
          href={isAnchor && `?page=${previousPage}`}
          rel={isAnchor && 'prev'}
          isLoading={loading}
          size="small"
          key={from} // Necessary to prevent focus after click
        >
          <FormattedMessage id="store/search-result.show-previous-button" />
        </Button>
      )}
    </div>
  )
}

export default FetchPreviousButton
