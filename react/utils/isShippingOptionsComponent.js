const SHIPPING_OPTION_COMPONENT_DRAWER_CLASS =
  'vtex-shipping-option-components-0-x-drawer'

const SHIPPING_OPTION_COMPONENT_OVERLAY_CLASS =
  'vtex-shipping-option-components-0-x-overlay'

const isShippingOptionsComponent = e => {
  if (!e.target) {
    return false
  }

  const shippingOptionsDawerElement = e.target.closest(
    `.${SHIPPING_OPTION_COMPONENT_DRAWER_CLASS}`
  )

  const isShippingOptionsOverlayElement = e.target.classList.contains(
    SHIPPING_OPTION_COMPONENT_OVERLAY_CLASS
  )

  return shippingOptionsDawerElement || isShippingOptionsOverlayElement
}

export default isShippingOptionsComponent
