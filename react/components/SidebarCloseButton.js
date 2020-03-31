import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { IconClose } from 'vtex.store-icons'

const CSS_HANDLES = ['closeIconButton']

const SidebarCloseButton = ({ size = 30, type = 'line', onClose }) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <button
      className={`${handles.closeIconButton} pa5 bg-transparent c-on-base bn absolute top-0 right-0 pointer`}
      onClick={onClose}
    >
      <IconClose size={size} type={type} />
    </button>
  )
}

export default SidebarCloseButton
