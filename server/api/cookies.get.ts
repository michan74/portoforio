export default defineEventHandler(async () => {
  const storage = useStorage('data')

  const visitCount = (await storage.getItem<number>('visitCount')) ?? 0
  const cookies = (await storage.getItem<Array<{ id: number; seed: number; shape: string; imageUrl: string }>>('cookies')) ?? []

  return { visitCount, cookies }
})
