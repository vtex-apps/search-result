import {
  MAP_CATEGORY_CHAR,
  DEPARTMENT,
  CATEGORY,
  FULLTEXT_QUERY_KEY,
} from '../constants'

const CATEGORY_DEPARTMENTS_FT = [
  MAP_CATEGORY_CHAR,
  CATEGORY,
  DEPARTMENT,
  FULLTEXT_QUERY_KEY,
]

/* With the addition of the new VTEX search, it is possible to have different maps.
  This function checks the equivalent possibilities for the 'c' map */
export const isSameMap = (map1: string, map2: string) => {
  if (CATEGORY_DEPARTMENTS_FT.includes(map1)) {
    return CATEGORY_DEPARTMENTS_FT.includes(map2)
  }
  return map1 === map2
}
