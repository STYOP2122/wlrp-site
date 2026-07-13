<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { VIDEO_URL } from '../config/servers'

const TAB_KEY = 'qpsstats-active-tab'
const emit = defineEmits(['open-video'])

const tabs = [
  {
    id: 'tabs-1',
    title: 'Свой мод',
    text: 'Westland Project — RolePlay на SAMP с удобными системами и живым геймплеем. Легко войти, интересно развиваться: фракции, бизнес, улицы и события сервера без лишней каши из команд.',
  },
  {
    id: 'tabs-2',
    title: 'Администрация',
    text: 'Мы на связи с игроками: слушаем фидбэк, решаем конфликты по делу и держим порядок на сервере. Цель — честная атмосфера, в которую хочется возвращаться.',
  },
  {
    id: 'tabs-3',
    title: 'Комьюнити',
    text: 'Westland строится вокруг игроков. Новости, общение и ивенты — в Discord и VK. Подключайся, находи своих и будь в курсе жизни сервера.',
  },
]

function loadIndex() {
  try {
    const stored = window.sessionStorage.getItem(TAB_KEY)
    const n = Number(stored)
    if (!Number.isNaN(n) && n >= 0 && n < tabs.length) return n
  } catch {
    // ignore
  }
  return 0
}

const activeIndex = ref(loadIndex())
const slideClass = ref(`animated fadeInLeft tabs${activeIndex.value}`)
const indicator = ref({ left: '0px', width: '0px' })
const tabRefs = ref([])

function setTabRef(el, index) {
  if (el) tabRefs.value[index] = el
}

function updateIndicator() {
  const el = tabRefs.value[activeIndex.value]
  if (!el) return
  indicator.value = {
    left: `${el.offsetLeft}px`,
    width: `${el.offsetWidth}px`,
  }
}

function selectTab(index) {
  if (index === activeIndex.value) return
  activeIndex.value = index
  slideClass.value = `animated fadeInLeft tabs${index}`
  try {
    window.sessionStorage.setItem(TAB_KEY, String(index))
  } catch {
    // ignore
  }
  nextTick(updateIndicator)
}

function onSlideAnimEnd() {
  slideClass.value = `tabs${activeIndex.value}`
}

watch(activeIndex, () => nextTick(updateIndicator))

onMounted(() => {
  nextTick(updateIndicator)
  window.addEventListener('resize', updateIndicator)
  // clear animation class after first paint like original
  window.setTimeout(onSlideAnimEnd, 1000)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIndicator)
})
</script>

<template>
  <div class="section content__slide__about" data-anchor="about-the-project">
    <div class="pxl">
      <div id="scene2">
        <div class="slide-main__about" data-depth="0.2"></div>
      </div>
    </div>
    <div class="slide-content slide-content_about container">
      <div class="about-the-project slide-content__content wrapper">
        <div
          class="about-the-project__main slide-content__content-main slide-content__content-main_max-width container__about"
        >
          <div
            id="redage_slide"
            class="slide_tabs"
            :class="slideClass"
            @animationend="onSlideAnimEnd"
          ></div>
        </div>
        <div class="slide-content__content-side">
          <div class="about_tabs" id="tabs">
            <ul class="ui-tabs-nav">
              <li
                v-for="(tab, index) in tabs"
                :key="tab.id"
                :ref="(el) => setTabRef(el, index)"
                :class="[
                  `tabs-${index + 1}`,
                  {
                    'ui-tabs-active': activeIndex === index,
                    'ui-state-active': activeIndex === index,
                  },
                ]"
              >
                <a href="#" @click.prevent="selectTab(index)"><span></span></a>
              </li>
              <li id="slider">
                <span
                  class="slide__redage"
                  :style="{ left: indicator.left, width: indicator.width }"
                ></span>
              </li>
            </ul>
            <div class="tabs-container-wrapper">
              <div class="tabs-container">
                <div
                  v-for="(tab, index) in tabs"
                  :id="tab.id"
                  :key="tab.id"
                  v-show="activeIndex === index"
                  class="ui-tabs-panel"
                >
                  <div class="h_tabs">{{ tab.title }}</div>
                  <p>{{ tab.text }}</p>
                </div>
                <div class="button">
                  <a
                    class="btn gradient_btn__orange btn__tabs"
                    href="https://vk.com/westlandproject"
                    target="_blank"
                    rel="noopener"
                    >Узнать больше</a
                  >
                  <a
                    class="btn btn_rond_orange btn__tabs modal-video-redage"
                    href="#"
                    @click.prevent="emit('open-video', VIDEO_URL)"
                    >Видео о проекте</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
