<script setup lang="ts">
const isWorksOpen = ref(false)
</script>

<template>
  <div class="page">
    <div class="profile">
      <img src="/kuma.JPG" alt="icon" class="icon" />
      <div class="info">
        <h1 class="name">dorayaki</h1>
        <ul class="details">
          <li>webエンジニア(2021.10~)</li>
          <li>くまになりたい。</li>
        </ul>
        <ul class="details">
            <li><a href="https://x.com/SPuemi"><img src="/x_logo.png"></a></li>
            <li><a href="https://zenn.dev/michan74"><img src="/zenn_logo.png"></a></li>
        </ul>
        <p class="works" @click="isWorksOpen = true">works</p>
      </div>
    </div>
  </div>

  <WorksModal :is-open="isWorksOpen" @close="isWorksOpen = false" />
</template>

<style scoped>
.page {
  position: relative;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.profile {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}

.icon {
  width: 150px;
  height: auto;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.name {
  font-size: 1.5rem;
  font-weight: normal;
  margin: 0;
  color: #333;
}

.details {
  list-style: none;
  padding: 0;
  margin: 0;
}

.details li {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
}

.details li img {
  height: 1.5rem;
  width: auto;
}

.works {
  margin-top: 1rem;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  transition: opacity 0.2s;
}

.works:hover {
  opacity: 0.7;
}
</style>
