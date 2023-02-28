import { useCallback } from 'react'

const useSession = () => {
  const getSession = useCallback(async () => {
    const headers = new Headers()

    headers.append('Content-Type', 'application/json')

    const requestOptions: RequestInit = {
      method: 'GET',
      headers,
      redirect: 'follow',
    }

    const session = await fetch(
      `${window.location.origin}/api/sessions?items=public.shippingOption`,
      requestOptions
    )

    const data = await session.json()

    if (!data?.namespaces?.public?.shippingOption?.value) {
      return null
    }

    return JSON.parse(data.namespaces.public.shippingOption.value)
  }, [])

  return { getSession }
}

export default useSession
