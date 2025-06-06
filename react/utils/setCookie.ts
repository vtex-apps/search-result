export default function setCookie(name: string, val: string) {
  const date = new Date()
  const value = val

  date.setTime(date.getTime() + 30 * 60 * 1000)

  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`
}
