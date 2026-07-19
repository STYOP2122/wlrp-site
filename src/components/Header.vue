<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { goToSection } from '../composables/useFullpage'
import { asset } from '../utils/asset'
import { isDesktopLayout } from '../utils/breakpoints'

const emit = defineEmits(['toast'])
const route = useRoute()
const router = useRouter()

const menuOpen = ref(false)
const scrolled = ref(false)
const homeHref = asset('')
const donateHref = asset('donate')

const isDonate = () => route.path.startsWith('/donate')

function setMenuLock(open) {
  if (open) {
    document.body.style.overflow = 'hidden'
    return
  }
  document.body.style.overflow = isDesktopLayout() ? 'hidden' : ''
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  setMenuLock(menuOpen.value)
}

function closeMenu() {
  menuOpen.value = false
  setMenuLock(false)
}

async function go(section) {
  closeMenu()
  if (route.path !== '/') {
    await router.push({ name: 'home' })
    await nextTick()
    window.setTimeout(() => goToSection(section), 120)
    return
  }
  goToSection(section)
}

async function onDonate(e) {
  e.preventDefault()
  closeMenu()
  if (!isDonate()) await router.push({ name: 'donate' })
}

function onScroll() {
  scrolled.value = window.pageYOffset > 50 || document.documentElement.scrollTop > 50
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  setMenuLock(false)
})
</script>

<template>
  <div class="layout__header">
    <div class="container">
      <div class="header" id="myMenu" :class="{ scrolled }">
        <div class="header__content">
          <div class="header__logo">
            <a class="logo active" :href="homeHref" @click.prevent="go('home')"></a>
          </div>
          <div class="header__bars">
            <div
              class="bars js-controller"
              :class="{ active: menuOpen }"
              data-controlled=".header__links"
              @click="toggleMenu"
            ></div>
          </div>
        </div>
        <div class="header__links" :class="{ active: menuOpen }">
          <div class="header__nav">
            <div class="nav">
              <a
                class="nav__link"
                data-menuanchor="home"
                :href="homeHref"
                @click.prevent="go('home')"
                >Главная</a
              >
              <a
                class="nav__link"
                data-menuanchor="about-the-project"
                :href="homeHref"
                @click.prevent="go('about-the-project')"
                >О проекте</a
              >
              <a
                class="nav__link"
                data-menuanchor="How-to-start-playing"
                :href="homeHref"
                @click.prevent="go('How-to-start-playing')"
                >Как играть ?</a
              >
              <a
                class="nav__link"
                data-menuanchor="news"
                :href="homeHref"
                @click.prevent="go('news')"
                >Новости</a
              >
              <a class="nav__link" href="https://vk.com/westlandproject" target="_blank" rel="noopener"
                >Форум</a
              >
              <a
                class="nav__link nav__link_donate"
                :class="{ active: isDonate() }"
                :href="donateHref"
                @click="onDonate"
                >Донат</a
              >
              <a
                class="nav__link nav__link_donate__mob"
                :class="{ active: isDonate() }"
                :href="donateHref"
                @click="onDonate"
                >Донат</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
