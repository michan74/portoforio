<script setup lang="ts">
const COOKIE_IMAGES = ['/cookies/cookies_10.png']
const MAX_COOKIES = 50
const VISITOR_COUNT_ID = 'visitor-count'

const containerRef = ref<HTMLDivElement | null>(null)
let cleanupFn: (() => void) | null = null

onMounted(async () => {
  if (!containerRef.value) return

  const client = useAmplifyClient()

  const STORAGE_KEY = 'visitor_counted_date'
  const todayStr = new Date().toISOString().slice(0, 10)

  let alreadyCounted = false
  try {
    alreadyCounted = localStorage.getItem(STORAGE_KEY) === todayStr
  } catch {}

  const { data: existing } = await client.models.VisitorCount.get({ id: VISITOR_COUNT_ID })
  const currentCount = existing?.count ?? 0

  let visitCount: number

  if (alreadyCounted) {
    visitCount = currentCount
  } else {
    const newCount = currentCount + 1
    if (currentCount === 0) {
      await client.models.VisitorCount.create({ id: VISITOR_COUNT_ID, count: newCount })
    } else {
      await client.models.VisitorCount.update({ id: VISITOR_COUNT_ID, count: newCount })
    }
    try {
      localStorage.setItem(STORAGE_KEY, todayStr)
    } catch {}
    visitCount = newCount
  }

  const cookieCount = Math.min(visitCount, MAX_COOKIES)

  const Matter = await import('matter-js')
  const { Engine, Runner, Bodies, Composite } = Matter

  const W = window.innerWidth
  const H = window.innerHeight

  const engine = Engine.create({ gravity: { y: 1.2 } })

  const floor = Bodies.rectangle(W / 2, H + 30, W * 2, 60, { isStatic: true })
  Composite.add(engine.world, [floor])

  const runner = Runner.create()
  Runner.run(runner, engine)

  // 表示サイズと物理ボディの比率（前実装と同じ size/2.5）
  const DISPLAY_SIZE = 120
  const RADIUS = DISPLAY_SIZE / 2.5

  type CookieEntry = { body: (typeof Bodies extends (...args: any[]) => infer R ? R : never); img: HTMLImageElement }
  const cookies: CookieEntry[] = []

  // アニメーションループ：物理位置をDOMに反映
  let rafId: number
  const animate = () => {
    cookies.forEach(({ body, img }) => {
      const { x, y } = body.position
      const angle = body.angle
      img.style.left = `${x - DISPLAY_SIZE / 2}px`
      img.style.top = `${y - DISPLAY_SIZE / 2}px`
      img.style.transform = `rotate(${angle}rad)`
    })
    rafId = requestAnimationFrame(animate)
  }
  animate()

  // クッキーを順番に落とす
  for (let i = 0; i < cookieCount; i++) {
    setTimeout(() => {
      if (!containerRef.value) return
      const x = Math.random() * (W - DISPLAY_SIZE) + DISPLAY_SIZE / 2

      const body = Bodies.circle(x, -RADIUS - 10, RADIUS, {
        restitution: 0.3,
        friction: 0.5,
        frictionAir: 0.02,
        angle: Math.random() * Math.PI * 2,
      })
      Composite.add(engine.world, body)

      const img = document.createElement('img')
      img.src = COOKIE_IMAGES[Math.floor(Math.random() * COOKIE_IMAGES.length)]
      img.style.cssText = `
        position: absolute;
        width: ${DISPLAY_SIZE}px;
        height: ${DISPLAY_SIZE}px;
        pointer-events: none;
        object-fit: contain;
      `
      containerRef.value.appendChild(img)
      cookies.push({ body, img })
    }, i * 300)
  }

  cleanupFn = () => {
    cancelAnimationFrame(rafId)
    Runner.stop(runner)
    Engine.clear(engine)
    cookies.forEach(({ img }) => img.remove())
    cookies.length = 0
  }
})

onUnmounted(() => {
  cleanupFn?.()
})
</script>

<template>
  <div ref="containerRef" class="cookie-background" />
</template>

<style scoped>
.cookie-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
</style>
