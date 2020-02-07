import { createContext, useContext } from 'react'

const FilterNavigatorContext = createContext({})

export default FilterNavigatorContext

export const useFilterNavigator = () => useContext(FilterNavigatorContext)
