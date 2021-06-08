import React from 'react'
import PropTypes from 'prop-types'
import { useCssHandles } from 'vtex.css-handles'
import { IconClose } from 'vtex.store-icons'

const CSS_HANDLES = ['closeFiltersButton']

const MobileFiltersCloseButton = ({
  onClose
}) => {

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <button
      className={`${handles.closeFiltersButton} pa4 pointer bg-transparent transparent bn pointer ml-auto`}
      onClick={onClose}
    >
      <IconClose size='30' type='line' />
    </button>
  )
}

MobileFiltersCloseButton.propTypes = {
  onClose: PropTypes.func,
}

export default MobileFiltersCloseButton