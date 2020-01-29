import { SPACE_REPLACER, SPEC_FILTER, FILTER_TITLE_SEP } from '../constants'

const from =
  'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;'
const to =
  'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------'
const removeAccents = (str: string) => {
  let newStr = str.slice(0)
  for (let i = 0; i < from.length; i++) {
    newStr = newStr.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }
  return newStr
}

// Parameter "S. Coifman" should output "s--coifman"
export function searchSlugify(str: string) {
  // According to Bacelar, the search API uses a legacy method for slugifying strings.
  // replaces special characters with dashes, remove accents and lower cases everything
  // eslint-disable-next-line no-useless-escape
  const replaced = str.replace(/[*+~.()'"!:@&\[\]`,/ %$#?{}|><=_^]/g, '-')
  return removeAccents(replaced).toLowerCase()
}

export const newFacetPathName = (facet: any) => {
  return facet.map && facet.map.includes(SPEC_FILTER)
    ? `${searchSlugify(facet.title)}${FILTER_TITLE_SEP}${facet.value.replace(
        /\s/g,
        SPACE_REPLACER
      )}`
    : facet.value
}
