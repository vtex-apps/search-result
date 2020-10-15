declare module 'vtex.render-runtime' {
  interface Runtime {
    setQuery: (vars: { skuId: string }, options?: { replace?: boolean }) => void
    query?: Record<string, string>
    getSettings(app: string): StoreSettings
  }

  interface StoreSettings {
    enableSearchRenderingOptimization?: boolean
  }

  export const useRuntime: () => Runtime
}
