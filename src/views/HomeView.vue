<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Preloader from '../components/Preloader.vue'
import Header from '../components/Header.vue'
import HomeSection from '../components/HomeSection.vue'
import AboutSection from '../components/AboutSection.vue'
import PlaySection from '../components/PlaySection.vue'
import NewsSection from '../components/NewsSection.vue'
import FooterSection from '../components/FooterSection.vue'
import VideoModal from '../components/VideoModal.vue'
import Toast from '../components/Toast.vue'
import { useFullpage } from '../composables/useFullpage'
import { useParallax } from '../composables/useParallax'
import { useReveal } from '../composables/useReveal'
import { useServerStatus } from '../composables/useServerStatus'
import { VIDEO_URL } from '../config/servers'

const { servers } = useServerStatus()
useFullpage('#fullpage')
useParallax(['scene', 'scene2'])
useReveal('body')

const videoOpen = ref(false)
const videoUrl = ref(VIDEO_URL)
const toastMessage = ref('')

function openVideo(url) {
  videoUrl.value = url || VIDEO_URL
  videoOpen.value = true
}

function closeVideo() {
  videoOpen.value = false
}

function showToast(msg) {
  toastMessage.value = msg
}

function clearToast() {
  toastMessage.value = ''
}

onMounted(() => {
  document.body.classList.add('layout', 'fp-viewing-intro', 'fp-responsive')
  document.documentElement.style.maxWidth = '100%'
  document.body.style.maxWidth = '100%'
})

onUnmounted(() => {
  document.body.classList.remove('fp-viewing-intro', 'fp-responsive')
  document.body.style.overflow = ''
  document.body.style.height = ''
  document.documentElement.style.overflow = ''
  document.documentElement.style.height = ''
})
</script>

<template>
  <Preloader />
  <Header @toast="showToast" />
  <div class="layout__content">
    <div class="content fullpage-wrapper" id="fullpage">
      <HomeSection :servers="servers" @open-video="openVideo" />
      <AboutSection @open-video="openVideo" />
      <PlaySection @open-video="openVideo" />
      <NewsSection />
      <FooterSection />
    </div>
  </div>
  <VideoModal :open="videoOpen" :url="videoUrl" @close="closeVideo" />
  <Toast :message="toastMessage" @clear="clearToast" />
</template>
