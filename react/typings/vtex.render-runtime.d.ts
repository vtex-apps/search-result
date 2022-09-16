declare module 'vtex.render-runtime' {
  interface Runtime {
    account: string
    rootPath: string
    query: Record<string, string>
    navigate: (args: NavigateArgs) => void
    getSettings(id: string): StoreSettings
    route: {
      routeId: string
    }
  }

  interface RuntimeWithRoute extends Runtime {
    route: {
      routeId: string
      title?: string
      metaTags?: MetaTagsParams
      canonicalPath?: string
    }
  }

  export function useRuntime(): Runtime
  export const Helmet
}
