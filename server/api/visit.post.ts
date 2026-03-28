interface CookieEntry {
  id: number
  seed: number
  shape: string
  imageUrl: string
}

const SHAPES = [
  'star', 'heart', 'flower', 'butterfly', 'moon',
  'cat', 'leaf', 'bear', 'rabbit', 'mushroom',
  'snowflake', 'crown', 'fish', 'apple', 'bird',
]

export default defineEventHandler(async () => {
  const storage = useStorage('data')

  const visitCount = (await storage.getItem<number>('visitCount')) ?? 0
  const cookies = (await storage.getItem<CookieEntry[]>('cookies')) ?? []

  const newCount = visitCount + 1
  const shape = SHAPES[visitCount % SHAPES.length] ?? 'star'
  const seed = newCount * 13 + 7

  const prompt = encodeURIComponent(
    `cute ${shape} shaped cookie, top view, bakery style, isolated on white background, no shadow`,
  )
  const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=256&height=256&seed=${seed}&nologo=true`

  const newCookie: CookieEntry = { id: newCount, seed, shape, imageUrl }

  const updatedCookies = [...cookies, newCookie].slice(-100)
  await storage.setItem('visitCount', newCount)
  await storage.setItem('cookies', updatedCookies)

  return {
    visitCount: newCount,
    cookies: updatedCookies,
  }
})
