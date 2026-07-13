<script setup>
import ServerStatus from './ServerStatus.vue'
import { VIDEO_URL, BRAND } from '../config/servers'
import { goToSection } from '../composables/useFullpage'

defineProps({
  servers: { type: Array, required: true },
})

const emit = defineEmits(['open-video'])
</script>

<template>
  <div class="section content__slide_home" data-anchor="home">
    <div class="pxl">
      <div id="scene">
        <div class="slide-main__bg" data-depth="0.2"></div>
      </div>
    </div>
    <div class="slide-content slide-content_home container">
      <div class="home slide-content__content wrapper">
        <div class="home__main revealator-slideright revealator-once">
          <h1 class="home__title h1">
            <span class="home__brand-name">Westland</span>
            <span class="home__brand-sub">Project</span>
          </h1>
          <h2 class="home__text h2__home">
            RolePlay сервер в San Andreas Multiplayer. Атмосфера улиц, живой онлайн и свой путь в
            Westland.
          </h2>
          <div class="home__button">
            <a
              class="primary_btn gradient_btn__orange start_play"
              href="/"
              @click.prevent="goToSection('How-to-start-playing')"
              >Начать играть</a
            >
            <div class="video_play">
              <div class="video_play__lds">
                <a
                  class="modal-video-redage"
                  href="#"
                  @click.prevent="emit('open-video', VIDEO_URL)"
                >
                  <div class="lds-css ng-scope">
                    <div class="lds-eclipse" style="width: 100%; height: 100%">
                      <div></div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <ServerStatus :servers="servers" />
        </div>
        <div class="per__main">
          <div class="person__left revealator-slideright revealator-once"></div>
          <div class="person__right revealator-slideleft revealator-delay2 revealator-once">
            <div class="dialog__left">
              <span class="circle__left__a revealator-delay10 revealator-fade revealator-once"></span>
              <span class="circle__left__b revealator-delay11 revealator-fade revealator-once"></span>
              <span
                class="text__dialog revealator-delay14 revealator-fade revealator-once"
                id="d1"
                >Кости даже есть, да и всего полно..</span
              >
            </div>
            <div class="dialog__right">
              <span class="circle__right__a revealator-delay2 revealator-fade revealator-once"></span>
              <span class="circle__right__b revealator-delay5 revealator-fade revealator-once"></span>
              <span
                class="text__dialog revealator-delay7 revealator-fade revealator-once"
                id="d2"
                >Есть войс чат..</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
