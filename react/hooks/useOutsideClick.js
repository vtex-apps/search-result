import { useLayoutEffect } from 'react'

const useOutsideClick = (ref, handler, when) => {
  const handle = e =>
    ref && ref.current && !ref.current.contains(e.target) && handler(e)

  useLayoutEffect(() => {
    when && document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [when])
}

export default useOutsideClick
