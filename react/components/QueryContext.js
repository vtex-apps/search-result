import { createContext, useContext } from 'react'

const QueryContext = createContext({})

export default QueryContext

export const useQuery = () => useContext(QueryContext)
