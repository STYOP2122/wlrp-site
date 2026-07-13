<script setup>
import { MULTIPLAYER_DOWNLOAD, VIDEO_URL, BRAND } from '../config/servers'
import { useFitScale } from '../composables/useFitScale'

const emit = defineEmits(['open-video'])

useFitScale('.content__slide__playing', '.slide-content_playing')

function downloadClient(e) {
  e.preventDefault()
  window.location = MULTIPLAYER_DOWNLOAD
}
</script>

<template>
  <div class="section content__slide__playing" data-anchor="How-to-start-playing">
    <div class="bg-play"></div>
    <div class="slide-content slide-content_playing container wrapper">
      <div class="playing slide-content__content">
        <div class="slide-content__content-side">
          <div class="md">
            <div class="h_tabs">Как начать играть?</div>
            <p>
              {{ BRAND.fullName }} — RolePlay в мире San Andreas на платформе SAMP. Выбери свой путь:
              бандит или коп, бизнесмен или медик — и впишись в жизнь сервера.
            </p>
          </div>
        </div>
        <div class="md_bt">
          <div class="video_play__play">
            <div class="video_play__lds__play">
              <a
                class="modal-video-redage"
                href="#"
                @click.prevent="emit('open-video', VIDEO_URL)"
              >
                <div class="lds-css ng-scope">
                  <div class="lds-eclipse__play" style="width: 100%; height: 100%">
                    <div></div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="page__width__play">
        <div class="container__play">
          <div class="container_item__play">
            <img alt="content" src="/images/content/play_1.png" />
            <div class="block">
              <h3 class="block__heading">Установите GTA San Andreas</h3>
              <p class="block__content">
                Для игры нужна лицензионная или рабочая копия GTA: San Andreas (версия под SAMP).
                <span>Без оригинальной игры клиент SAMP не запустится.</span>
              </p>
            </div>
            <a
              class="btn__play gradient_btn__orange"
              href="https://store.steampowered.com/app/12120/Grand_Theft_Auto_San_Andreas/"
              target="_blank"
              rel="noopener"
            >
              <span class="ic__download"></span> Купить GTA SA
            </a>
          </div>
          <div class="container_item__play">
            <img alt="content" src="/images/content/play_2.png" />
            <div class="block">
              <h3 class="block__heading">Установите клиент SA-MP</h3>
              <p class="block__content">
                Скачайте и установите официальный клиент San Andreas Multiplayer. Он бесплатный.
              </p>
            </div>
            <a
              class="btn__play gradient_btn__orange download__multiplayer"
              href="#"
              @click="downloadClient"
            >
              <span class="ic__download"></span> Скачать SA-MP
            </a>
          </div>
          <div class="container_item__play">
            <img alt="content" src="/images/content/play_3.png" />
            <div class="block">
              <h3 class="block__heading">Подключитесь к Westland</h3>
              <p class="block__content">
                В SA-MP откройте список серверов или добавьте IP вручную — найдите
                «{{ BRAND.fullName }}» / westland.fun.
              </p>
            </div>
            <a
              class="btn__play gradient_btn__orange"
              href="#"
              style="background: rgba(255, 255, 255, 0.16); box-shadow: none; color: #fff"
            >
              <span class="ic__chain"></span> Подключиться на сервер
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
