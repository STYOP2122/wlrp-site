<script setup>
import { useFitScale } from '../composables/useFitScale'
import { BRAND } from '../config/servers'

useFitScale('.content__slide__news', '.slide-content_news')

const news = [
  {
    href: BRAND.vk,
    img: '/images/content/april.png',
    title: 'Запуск Westland Project',
    date: '13.07.2026',
  },
  {
    href: BRAND.vk,
    img: '/images/content/casino.png',
    title: 'Открытие набора во фракции',
    date: '10.07.2026',
  },
  {
    href: BRAND.vk,
    img: '/images/content/pomoi_ostrafui.png',
    title: 'Ивенты этой недели',
    date: '05.07.2026',
  },
]
</script>

<template>
  <div class="section content__slide__news" data-anchor="news">
    <div class="slide-content slide-content_news container">
      <div class="news slide-content__content wrapper">
        <div
          class="news__main slide-content__content-main slide-content__content-main_max-width container__news"
        >
          <div class="title__h">Обновления проекта</div>
          <div class="news__blocks news__blocks_spread">
            <a
              v-for="item in news"
              :key="item.title"
              class="news__block news__block_card"
              :href="item.href"
              target="_blank"
              rel="noopener"
            >
              <div class="hv">
                <img alt="content" :src="item.img" />
              </div>
              <div class="desc__news">
                <div class="h__t">{{ item.title }}</div>
                <div class="h__desc">
                  <span>Дата публикации:</span> <span>{{ item.date }}</span>
                </div>
              </div>
              <div class="border"></div>
            </a>
            <a class="btn_rond btn__news" target="_blank" rel="noopener" :href="BRAND.vk"
              >Больше новостей</a
            >
          </div>
        </div>
        <div class="news__img"></div>
      </div>
    </div>
  </div>
</template>
