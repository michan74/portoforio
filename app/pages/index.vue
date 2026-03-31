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
        <ul class="social-links">
            <li><a href="https://x.com/SPuemi"><img src="/x_logo.png"></a></li>
            <li><a href="https://zenn.dev/michan74"><img src="/zenn_logo.png"></a></li>
        </ul>
        <button class="works-btn" @click="isWorksOpen = true">works→</button>
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
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
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

.social-links {
  list-style: none;
  padding: 0;
  margin: 1.0rem 0 0 0;
  display: flex;
  gap: 0.75rem;
}

.social-links li img {
  height: 1.2rem;
  width: auto;
}

.works-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  color: #333;
  background: transparent;
  border: 1px solid #333;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.works-btn:hover {
  background: #333;
  color: #fff;
}

@media (max-width: 600px) {
  .profile {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }
}
</style>
