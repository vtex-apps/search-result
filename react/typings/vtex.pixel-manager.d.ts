declare module 'vtex.pixel-manager/PixelContext' {
  type EventType =
    | 'homeView'
    | 'productView'
    | 'productClick'
    | 'productImpression'
    | 'otherView'
    | 'categoryView'
    | 'departmentView'
    | 'internalSiteSearchView'
    | 'pageInfo'
    | 'pageView'
    | 'cart'
    | 'cartLoaded'
    | 'addToCart'
    | 'removeFromCart'
    | 'checkout'
    | 'checkoutOption'
    | 'sendPayments'
    | 'finishPayment'
    | 'pageComponentInteraction'
    | 'orderPlaced'
    | 'installWebApp'
    | 'openDrawer'

  export interface PixelData {
    id?: string
    event?: EventType
    [data: string]: unknown
  }

  export interface PixelContextType {
    push: (data: PixelData) => void
  }

  export const usePixel: () => PixelContextType
}
