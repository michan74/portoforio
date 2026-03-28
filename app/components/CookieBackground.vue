<script setup lang="ts">
interface CookieEntry {
  id: number
  seed: number
  shape: string
  imageUrl: string
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
let cleanupFn: (() => void) | null = null

// ロード成功した URL を管理
const loadedImages = new Set<string>()

// 画像を事前ロード（成功したものだけ Set に登録）
const preloadImage = (url: string): Promise<void> =>
  new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      loadedImages.add(url)
      resolve()
    }
    img.onerror = () => resolve() // 失敗してもブロックしない
    img.src = url
  })

onMounted(async () => {
  if (!canvasRef.value) return

  // 訪問を記録 & 全クッキー取得
  const res = await fetch('/api/visit', { method: 'POST' })
  const { cookies } = await res.json() as { cookies: CookieEntry[]; visitCount: number }

  // 表示するのは最新50件まで（パフォーマンス考慮）
  const displayCookies = cookies.slice(-50)

  // Pollinations.ai への直リクエストは403になるため自サーバー経由でプロキシ
  const proxyUrl = (url: string) => `/api/image?url=${encodeURIComponent(url)}`

  // 画像を並列プリロード（最大15秒でタイムアウト）
  await Promise.race([
    Promise.all(displayCookies.map((c: CookieEntry) => preloadImage(proxyUrl(c.imageUrl)))),
    new Promise(resolve => setTimeout(resolve, 15000)),
  ])

  const Matter = await import('matter-js')
  const { Engine, Render, Runner, Bodies, Composite } = Matter

  const W = window.innerWidth
  const H = window.innerHeight

  const engine = Engine.create({ gravity: { y: 1.2 } })

  const render = Render.create({
    canvas: canvasRef.value,
    engine,
    options: {
      width: W,
      height: H,
      background: 'transparent',
      wireframes: false,
    },
  })

  // 画面下に見えないフロア
  const floor = Bodies.rectangle(W / 2, H + 30, W * 2, 60, {
    isStatic: true,
    render: { fillStyle: 'rgba(0,0,0,0)', strokeStyle: 'rgba(0,0,0,0)', lineWidth: 0 },
  })
  Composite.add(engine.world, [floor])

  const runner = Runner.create()
  Runner.run(runner, engine)
  Render.run(render)

  // クッキーを順番に降らせる
  const RADIUS = 26
  const FALLBACK_COLORS = ['#C8956C', '#D4A574', '#B8855C', '#E0B48A', '#C07050']

  displayCookies.forEach((cookie: CookieEntry, index: number) => {
    setTimeout(() => {
      const x = Math.random() * (W - 80) + 40
      const scale = (RADIUS * 2) / 256

      const body = Bodies.circle(x, -RADIUS - 10, RADIUS, {
        restitution: 0.2,
        friction: 0.5,
        frictionAir: 0.008,
        angle: Math.random() * Math.PI * 2,
        render: loadedImages.has(proxyUrl(cookie.imageUrl))
          ? {
              sprite: {
                texture: proxyUrl(cookie.imageUrl),
                xScale: scale,
                yScale: scale,
              },
            }
          : {
              // 画像ロード失敗時はカラーで代替
              fillStyle: FALLBACK_COLORS[index % FALLBACK_COLORS.length],
              strokeStyle: '#7A4A2A',
              lineWidth: 1.5,
            },
      })
      Composite.add(engine.world, body)
    }, index * 300) // 300ms間隔で順番に落とす
  })

  cleanupFn = () => {
    Render.stop(render)
    Runner.stop(runner)
    Engine.clear(engine)
  }
})

onUnmounted(() => {
  cleanupFn?.()
})
</script>

<template>
  <div class="cookie-background">
    <canvas ref="canvasRef" class="physics-canvas" />
  </div>
</template>

<style scoped>
.cookie-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.physics-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
