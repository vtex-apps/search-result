/**
 * Whether at least one delivery-promise shopper block
 * (`shopper-location-setter`, `shipping-method-selector`, or
 * `pickup-point-selector` from `vtex.delivery-promise-components`) has
 * registered itself in the shared DeliveryPromiseContext `uiRegistry`.
 */
export const hasDeliveryPromiseBlock = uiRegistry =>
  Boolean(
    uiRegistry &&
      (uiRegistry.shopperLocation ||
        uiRegistry.shippingMethod ||
        uiRegistry.pickupPoint)
  )

/**
 * Resolve the single visibility gate shared by every delivery-promise facet
 * group (`shipping`, `dynamic-estimate`, `delivery-options`).
 *
 * Precedence:
 * 1. `showDeliveryPromiseFacets` wins when provided.
 * 2. Otherwise the deprecated `showShippingMethodFacet` acts as the fallback.
 * 3. When neither is provided, presence of any delivery-promise block drives
 *    visibility.
 *
 * An explicit `false` (from either prop) always hides the groups.
 */
export const resolveShowDeliveryPromiseFacets = ({
  showDeliveryPromiseFacets,
  showShippingMethodFacet,
  hasBlock,
}) => {
  const resolved =
    showDeliveryPromiseFacets !== undefined
      ? showDeliveryPromiseFacets
      : showShippingMethodFacet

  if (resolved === undefined) {
    return hasBlock
  }

  return Boolean(resolved)
}
