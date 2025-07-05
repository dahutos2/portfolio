/**
 * public/data/ 以下の JSON を取得する共通関数
 *   ex)  fetchData('user.json') → JSON
 */
export async function fetchData<T = unknown>(file: string): Promise<T> {
  // import.meta.env.BASE_URL は dev では '/', build では '/repo名/'
  const url = `${import.meta.env.BASE_URL}/data/${file}`
  const res = await fetch(url)

  if (!res.ok) throw new Error(`Failed to GET ${url} → ${res.status}`)
  return res.json() as Promise<T>
}
