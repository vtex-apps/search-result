interface Window extends Window {
  __hostname__: string | undefined
}

declare module '../utils/removeTreePath' {
  export function removeTreePath<T = unknown>(props: T): T
}
