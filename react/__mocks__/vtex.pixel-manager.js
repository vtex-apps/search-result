import { useContext, createContext } from 'react'

const PixelContext = createContext({ push: () => undefined })

export const usePixel = () => {
  return useContext(PixelContext)
}
