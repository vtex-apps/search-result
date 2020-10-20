import { Context, createContext } from 'react'

const SettingsContext: Context<Record<string, unknown>> = createContext({})

export default SettingsContext
