import { createContext, useContext } from 'react'

const QueryContext = createContext({ lol: 'a'})

export default QueryContext

export const useQuery = () => useContext(QueryContext)
