<script setup lang="ts">
interface Work {
  icon: string
  title: string
  tech: string
  url?: string
}

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const works: Work[] = [
  { icon: '/kuma.JPG', title: 'Web App', tech: 'React / Next.js', url: '#' },
  { icon: '/kuma.JPG', title: 'iOS App', tech: 'Swift', url: '#' },
  { icon: '/kuma.JPG', title: 'ToDo App', tech: 'Vue.js', url: '#' },
  { icon: '/kuma.JPG', title: 'レシピサイト', tech: 'Laravel / Vue.js', url: '#' },
  { icon: '/kuma.JPG', title: 'ブログサイト', tech: 'Nuxt / Tailwind', url: '#' },
  { icon: '/kuma.JPG', title: 'イラスト制作', tech: 'Clip Studio Paint / Illustrator', url: '#' },
]

const handleOverlayClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="overlay" @click="handleOverlayClick">
        <div class="frame">
          <div class="frame-inner">
            <!-- 上部の照明 -->
            <div class="top-lights">
              <div class="light"></div>
              <div class="light"></div>
            </div>

            <!-- ヘッダー -->
            <div class="header">
              <img src="/kuma.JPG" alt="icon" class="kuma-icon" />
              <h2 class="title">works</h2>
            </div>

            <!-- カードグリッド -->
            <div class="cards-grid">
              <div v-for="work in works" :key="work.title" class="card">
                <div class="card-lights">
                  <div class="card-light"></div>
                  <div class="card-light"></div>
                </div>
                <div class="card-content">
                  <img :src="work.icon" :alt="work.title" class="card-icon" />
                  <h3 class="card-title">{{ work.title }}</h3>
                  <p class="card-tech">{{ work.tech }}</p>
                  <a :href="work.url" class="view-btn">View</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.frame {
  background: #f5f5f5;
  border: 3px solid #333;
  border-radius: 4px;
  padding: 8px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.frame-inner {
  border: 1px solid #ccc;
  padding: 2rem;
  position: relative;
}

.top-lights {
  position: absolute;
  top: -10px;
  left: 20px;
  display: flex;
  gap: 30px;
}

.light {
  width: 20px;
  height: 30px;
  background: linear-gradient(to bottom, #666 0%, #888 50%, #aaa 100%);
  clip-path: polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%);
}

.light::before {
  content: '';
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 15px;
  background: #666;
}

.header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.kuma-icon {
  width: 100px;
  height: auto;
}

.title {
  font-size: 2rem;
  font-weight: normal;
  color: #333;
  margin: 0;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  position: relative;
}

.card-lights {
  position: absolute;
  top: -8px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
}

.card-light {
  width: 12px;
  height: 18px;
  background: linear-gradient(to bottom, #888 0%, #aaa 100%);
  clip-path: polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 0.5rem;
}

.card-icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.card-title {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 0.25rem 0;
}

.card-tech {
  font-size: 0.8rem;
  color: #666;
  margin: 0 0 0.75rem 0;
}

.view-btn {
  display: inline-block;
  padding: 0.25rem 1rem;
  border: 1px solid #333;
  border-radius: 4px;
  color: #333;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.view-btn:hover {
  background: #333;
  color: #fff;
}

/* トランジション */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* レスポンシブ */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
