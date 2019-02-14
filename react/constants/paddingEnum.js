import { pluck, values } from 'ramda'

const gapPaddingTypes = {
  NONE: {
    name: 'gallery.gapType.none',
    value:'pa0',
  },
  SMALL: {
    name: 'gallery.gapType.small',
    value:'pa3',
  },
  MEDIUM: {
    name: 'gallery.gapType.medium',
    value:'pa5',
  },
  LARGE: {
    name: 'gallery.gapType.large',
    value:'pa7',
  },
}

export const getGapPaddingNames = () => values(pluck('name', gapPaddingTypes))

export const getGapPaddingValues = () => values(pluck('value', gapPaddingTypes))

export default gapPaddingTypes