import React from 'react'

import QueryContext from './QueryContext'
import SettingsContext from './SettingsContext'

const ContextProviders = ({ children, queryVariables, settings }) => {
  return (
    <QueryContext.Provider value={queryVariables}>
      <SettingsContext.Provider value={settings}>
        {children}
      </SettingsContext.Provider>
    </QueryContext.Provider>
  )
}

export default ContextProviders
