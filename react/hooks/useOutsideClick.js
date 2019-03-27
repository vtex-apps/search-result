import { useLayoutEffect } from 'react'

const useOutsideClick = (ref, handler, activeWhen) => {
  const handle = e =>
    ref && ref.current && !ref.current.contains(e.target) && handler(e)

  useLayoutEffect(() => {
    activeWhen && document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [activeWhen])
}

export default useOutsideClick
