// "Back to <list>" buttons should land on the list the way the user left it
// (filters, search, page), not on a freshly reset table. useTableQuery records
// each list's query string here, and back buttons read it with listReturnTo.
// sessionStorage keeps it per tab and survives a reload; failures are ignored
// because losing the saved filters only costs the user a click.
const STORAGE_KEY = 'list-return-search'

const normalize = (pathname: string) => pathname.replace(/\/+$/, '') || '/'

function readSaved(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

/** Remember the query string a list page is currently showing. */
export function rememberListSearch(pathname: string, search: string) {
  const saved = readSaved()
  const key = normalize(pathname)
  if (saved[key] === search) return
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...saved, [key]: search }),
    )
  } catch {
    // Storage is full or blocked; the back button falls back to the bare path.
  }
}

/** Target for a back button: the list path plus the filters it last had. */
export function listReturnTo<TPath extends string>(pathname: TPath) {
  return { pathname, search: readSaved()[normalize(pathname)] ?? '' }
}

/** String form of listReturnTo, for props that only accept a path. */
export function listReturnHref(pathname: string) {
  // A caller that already built its own query string knows best.
  if (/[?#]/.test(pathname)) return pathname
  const { search } = listReturnTo(pathname)
  return `${pathname}${search}`
}
