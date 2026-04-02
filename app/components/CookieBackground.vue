<script setup lang="ts">
const COOKIE_IMAGES = ['/cookies/cookies_10.png']
const MAX_COOKIES = 50
const VISITOR_COUNT_ID = 'visitor-count'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let cleanupFn: (() => void) | null = null

// ロード成功した URL を管理
const loadedImages = new Set<string>()

// 画像を事前ロード
const preloadImage = (url: string): Promise<void> =>
  new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      loadedImages.add(url)
      resolve()
    }
    img.onerror = () => resolve()
    img.src = url
  })

onMounted(async () => {
  if (!canvasRef.value) return

  // Amplify Clientで訪問を記録 & カウント取得
  const client = useAmplifyClient()

  const { data: existing } = await client.models.VisitorCount.get({ id: VISITOR_COUNT_ID })
  const currentCount = existing?.count ?? 0
  const newCount = currentCount + 1

  if (currentCount === 0) {
    await client.models.VisitorCount.create({ id: VISITOR_COUNT_ID, count: newCount })
  } else {
    await client.models.VisitorCount.update({ id: VISITOR_COUNT_ID, count: newCount })
  }

  const visitCount = newCount

  // 降らせるクッキー数
  const cookieCount = Math.min(visitCount, MAX_COOKIES)

  // 画像を事前ロード
  await Promise.all(COOKIE_IMAGES.map(preloadImage))

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

  for (let i = 0; i < cookieCount; i++) {
    setTimeout(() => {
      const x = Math.random() * (W - 80) + 40
      const imageUrl = COOKIE_IMAGES[Math.floor(Math.random() * COOKIE_IMAGES.length)]
      const scale = (RADIUS * 2) / 256

      const body = Bodies.circle(x, -RADIUS - 10, RADIUS, {
        restitution: 0.2,
        friction: 0.5,
        frictionAir: 0.008,
        angle: Math.random() * Math.PI * 2,
        render: loadedImages.has(imageUrl)
          ? {
              sprite: {
                texture: imageUrl,
                xScale: scale,
                yScale: scale,
              },
            }
          : {
              fillStyle: FALLBACK_COLORS[i % FALLBACK_COLORS.length],
              strokeStyle: '#7A4A2A',
              lineWidth: 1.5,
            },
      })
      Composite.add(engine.world, body)
    }, i * 300)
  }

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
