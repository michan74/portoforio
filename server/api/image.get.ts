// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default defineEventHandler(async (event: any) => {
  const { url } = getQuery(event) as { url: string }

  if (!url || !url.startsWith('https://image.pollinations.ai/')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid image URL' })
  }

  // URL から seed を取り出してキャッシュキーに使う
  const seedMatch = url.match(/[?&]seed=(\d+)/)
  const cacheKey = seedMatch ? seedMatch[1] : null

  // キャッシュヒット → そのまま返す
  if (cacheKey) {
    const cached = await useStorage('images').getItem<{ data: string; contentType: string }>(cacheKey)
    if (cached) {
      const binary = atob(cached.data)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      setHeader(event, 'Content-Type', cached.contentType)
      setHeader(event, 'Cache-Control', 'public, max-age=86400')
      return bytes
    }
  }

  // キャッシュなし → Pollinations.ai から取得してキャッシュ保存
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw createError({ statusCode: response.status, statusMessage: 'Image fetch failed' })
    }

    const buffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    if (cacheKey) {
      const bytes = new Uint8Array(buffer)
      let binary = ''
      bytes.forEach(b => (binary += String.fromCharCode(b)))
      await useStorage('images').setItem(cacheKey, { data: btoa(binary), contentType })
    }

    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', 'public, max-age=86400')
    return new Uint8Array(buffer)
  }
  catch (e: unknown) {
    const status = (e as { statusCode?: number }).statusCode
    throw createError({ statusCode: status ?? 502, statusMessage: 'Failed to fetch image' })
  }
})
