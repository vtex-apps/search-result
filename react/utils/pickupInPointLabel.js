import { PICKUP_IN_POINT_STORAGE_KEY } from '../constants/pickupSearch'

const PICKUP_IN_POINT_PREFIX = 'pickup-in-point-'

/** API facet value for pickup in point (before `pickup-in-point-{id}` is applied). */
export const PICKUP_IN_POINT_BASE_VALUE = 'pickup-in-point'

/** `pickup-in-point` or `pickup-in-point-{id}` (URL-selected point). */
export function isPickupInPointShippingValue(value) {
  if (value === PICKUP_IN_POINT_BASE_VALUE) {
    return true
  }

  const suffix = `${PICKUP_IN_POINT_BASE_VALUE}-`

  return (
    typeof value === 'string' &&
    value.startsWith(suffix) &&
    value.length > suffix.length
  )
}

/**
 * Pickup with smallest `distance` from intelligent-search pickup-point-availability.
 * Kept in search-result (not imported from delivery-promise-components) so VTEX
 * bundling always resolves the module at runtime.
 *
 * @param {Array<{ distance?: number }>} pickups
 * @returns {object | undefined}
 */
export function getNearestPickup(pickups) {
  if (!pickups?.length) {
    return undefined
  }

  return pickups.reduce((best, p) =>
    (p.distance ?? Infinity) < (best.distance ?? Infinity) ? p : best
  )
}

/**
 * Reads `pickup-in-point-{id}` from the current search path (query + map),
 * aligned with buildSelectedFacetsAndFullText / facet navigation.
 *
 * @param {string | undefined} query
 * @param {string | undefined} map
 * @returns {string | undefined} pickup point id when present
 */
export function getPickupInPointIdFromQueryMap(query, map) {
  if (!map || !query) {
    return undefined
  }

  const queryValues = query.split('/')
  const mapValues = decodeURIComponent(map).split(',')

  if (queryValues.length < mapValues.length) {
    return undefined
  }

  for (let i = 0; i < mapValues.length; i++) {
    if (mapValues[i] !== 'shipping') {
      continue
    }

    let seg = queryValues[i]

    try {
      seg = decodeURIComponent(seg)
    } catch {
      // keep raw segment
    }

    if (
      seg &&
      seg.startsWith(PICKUP_IN_POINT_PREFIX) &&
      seg.length > PICKUP_IN_POINT_PREFIX.length
    ) {
      return seg.slice(PICKUP_IN_POINT_PREFIX.length)
    }
  }

  return undefined
}

/**
 * Full pickup payload from PLP localStorage (same shape as modal confirm).
 *
 * @returns {{ id: string | number, friendlyName?: string, address?: unknown } | null}
 */
export function readStoredPickupPayload() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null
  }

  try {
    const raw = localStorage.getItem(PICKUP_IN_POINT_STORAGE_KEY)

    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)

    if (parsed && parsed.id != null) {
      return parsed
    }
  } catch {
    return null
  }

  return null
}

const normalizePostal = postal =>
  (postal ?? '').replace(/\s/g, '').replace(/-/g, '').toLowerCase()

/**
 * Whether PLP localStorage has a pickup preference for the current zip (same rules as facet navigation).
 *
 * @param {string | undefined} zipcode — current session / context postal code
 */
export function hasStoredPickupPreferenceForZip(zipcode) {
  const stored = readStoredPickupPayload()

  if (!stored?.id) {
    return false
  }

  if (!stored.postalCode) {
    return true
  }

  return normalizePostal(stored.postalCode) === normalizePostal(zipcode)
}

/**
 * Persists pickup data for URL label resolution (aligned with PickupModal confirm).
 *
 * @param {{ pickupPoint?: { id?: string | number, friendlyName?: string, address?: unknown } } | undefined} selectedPickup
 */

export function persistPickupInPointForSearch(selectedPickup, zipcode) {
  if (!selectedPickup?.pickupPoint?.id) {
    return
  }

  const payload = {
    id: selectedPickup.pickupPoint.id,
    friendlyName: selectedPickup.pickupPoint.friendlyName,
    address: selectedPickup.pickupPoint.address,
    ...(zipcode != null && zipcode !== ''
      ? { postalCode: String(zipcode).trim() }
      : {}),
  }

  try {
    localStorage.setItem(PICKUP_IN_POINT_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // ignore quota / private mode
  }
}

/**
 * When the shipping radio uses base value `pickup-in-point`, resolve id + facet shape
 * like {@link useSearchPickupModal} (URL `pickup-in-point-{id}` + localStorage).
 *
 * @param {{ pickupSuggestion?: { pickupPoint?: { id?: unknown, friendlyName?: string } } }, zipcode?: string }} [options]
 * @returns {{ facet: object } | { modal: true }}
 */
export function resolvePickupInPointFacetForNavigation(
  clickedFacet,
  selectedPickup,
  options = {}
) {
  if (clickedFacet.key !== 'shipping' || clickedFacet.map !== 'shipping') {
    return { facet: clickedFacet }
  }

  if (clickedFacet.value !== PICKUP_IN_POINT_BASE_VALUE) {
    return { facet: clickedFacet }
  }

  const { pickupSuggestion, zipcode } = options
  const fromCtx = selectedPickup?.pickupPoint
  const fromSuggestion = pickupSuggestion?.pickupPoint
  const fromStorage = readStoredPickupPayload()

  const storageMatchesZip =
    fromStorage &&
    fromStorage.id != null &&
    (!fromStorage.postalCode ||
      normalizePostal(fromStorage.postalCode) === normalizePostal(zipcode))

  const idFromStorage = storageMatchesZip ? fromStorage.id : null

  const id =
    fromCtx?.id != null
      ? fromCtx.id
      : idFromStorage != null
      ? idFromStorage
      : fromSuggestion?.id != null
      ? fromSuggestion.id
      : null

  if (id == null || id === '') {
    return { modal: true }
  }

  if (fromCtx?.id != null && String(fromCtx.id) === String(id)) {
    persistPickupInPointForSearch(selectedPickup, zipcode)
  } else if (
    idFromStorage == null &&
    fromSuggestion?.id != null &&
    String(fromSuggestion.id) === String(id)
  ) {
    persistPickupInPointForSearch({ pickupPoint: fromSuggestion }, zipcode)
  }

  const friendlyName =
    (fromCtx?.id != null && String(fromCtx.id) === String(id)
      ? fromCtx.friendlyName
      : null) ??
    (fromSuggestion?.id != null && String(fromSuggestion.id) === String(id)
      ? fromSuggestion.friendlyName
      : null) ??
    (storageMatchesZip ? fromStorage?.friendlyName : null) ??
    clickedFacet.name

  return {
    facet: {
      ...clickedFacet,
      value: `${PICKUP_IN_POINT_PREFIX}${id}`,
      name: friendlyName,
    },
  }
}

/**
 * Returns friendlyName from localStorage when the stored id matches pickupPointId.
 *
 * @param {string | undefined} pickupPointId
 * @returns {string}
 */
export function readStoredPickupFriendlyName(pickupPointId) {
  if (!pickupPointId) {
    return ''
  }

  const parsed = readStoredPickupPayload()

  if (
    parsed &&
    String(parsed.id) === String(pickupPointId) &&
    parsed.friendlyName
  ) {
    return String(parsed.friendlyName)
  }

  return ''
}
