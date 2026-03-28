<script setup lang="ts">
import yaml from 'js-yaml'
import profileYaml from '~/content/profile.yaml?raw'
import worksYaml from '~/content/works.yaml?raw'

interface ProfileItem {
  year: string
  text: string
}

interface WorkItem {
  name: string
  url: string
  description: string
}

const profile = yaml.load(profileYaml) as ProfileItem[]
const works = yaml.load(worksYaml) as WorkItem[]
</script>

<template>
  <div class="container">
    <header class="header">
      <h1>Portfolio</h1>
    </header>

    <section class="section">
      <h2>Profile</h2>
      <ul class="timeline">
        <li v-for="item in profile" :key="item.year" class="timeline-item">
          <span class="year">{{ item.year }}</span>
          <span class="text">{{ item.text }}</span>
        </li>
      </ul>
    </section>

    <section class="section">
      <h2>Works</h2>
      <ul class="works">
        <li v-for="work in works" :key="work.name" class="work-item">
          <a :href="work.url" target="_blank" rel="noopener">
            {{ work.name }}
          </a>
          <span class="description">{{ work.description }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: #333;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  color: #5a3d2b;
}

.section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section h2 {
  font-size: 1.5rem;
  color: #7a4a2a;
  margin-bottom: 1rem;
  border-bottom: 2px solid #d4a574;
  padding-bottom: 0.5rem;
}

.timeline {
  list-style: none;
  padding: 0;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.timeline-item:last-child {
  border-bottom: none;
}

.year {
  font-weight: bold;
  color: #7a4a2a;
  min-width: 80px;
}

.works {
  list-style: none;
  padding: 0;
}

.work-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.work-item:last-child {
  border-bottom: none;
}

.work-item a {
  color: #5a3d2b;
  font-weight: bold;
  text-decoration: none;
}

.work-item a:hover {
  text-decoration: underline;
}

.description {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
}
</style>
