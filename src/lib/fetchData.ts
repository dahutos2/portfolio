let buildId: string | null = null
let buildIdPromise: Promise<string> | null = null

async function getBuildId(): Promise<string> {
  if (buildId) return buildId            // すでに取得済み

  // 取得中に複数リクエストが来ても 1 回だけ fetch
  if (!buildIdPromise) {
    const url = `${import.meta.env.BASE_URL}data/build.json`
    buildIdPromise = fetch(url, { cache: 'no-store' })
      .then(res => res.json())
      .then(({ version }) => {
        buildId = version
        return version
      })
  }
  return buildIdPromise
}

/**
 * public/data/ 以下の JSON を取得する共通関数
 *   ex)  fetchData('user.json') → JSON
 */
export async function fetchData<T = unknown>(file: string): Promise<T> {
  const id  = await getBuildId()
  const url = `${import.meta.env.BASE_URL}data/${file}?v=${id}`
  const res = await fetch(url)

  if (!res.ok) throw new Error(`Failed to GET ${url} → ${res.status}`)
  return res.json() as Promise<T>
}
