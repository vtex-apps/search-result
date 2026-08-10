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
 * Precedence (first defined prop wins):
 * 1. `showDeliveryPromiseFacets` — the current prop.
 * 2. `showShippingMethodFacet` — deprecated alias.
 * 3. `showShippingFacet` — legacy alias (name before the rename to
 *    `showShippingMethodFacet`), kept for backward compatibility.
 * 4. When none is provided, presence of any delivery-promise block drives
 *    visibility.
 *
 * An explicit `false` (from any prop) always hides the groups.
 */
export const resolveShowDeliveryPromiseFacets = ({
  showDeliveryPromiseFacets,
  showShippingMethodFacet,
  showShippingFacet,
  hasBlock,
}) => {
  const resolved = [
    showDeliveryPromiseFacets,
    showShippingMethodFacet,
    showShippingFacet,
  ].find(value => value !== undefined)

  if (resolved === undefined) {
    return hasBlock
  }

  return Boolean(resolved)
}
