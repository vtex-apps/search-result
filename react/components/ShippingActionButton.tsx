import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['shippingActionButton']

interface Props {
  label: string
  openDrawer: () => void
}

const ShippingActionButton = ({ label, openDrawer }: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <button
      onClick={() => openDrawer()}
      className={handles.shippingActionButton}
    >
      {label}
    </button>
  )
}

export default ShippingActionButton
