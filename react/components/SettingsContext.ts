import { createContext } from 'react'

interface SettingsContext {
  trackingId?: string
  [key: string]: unknown
}

const SettingsContext = createContext<SettingsContext>({})

export default SettingsContext
