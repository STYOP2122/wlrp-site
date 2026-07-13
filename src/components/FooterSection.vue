<script setup>
import { useFitScale } from '../composables/useFitScale'
import { BRAND } from '../config/servers'

useFitScale('.content__slide__footer', '.footer-follow', { minScale: 0.78 })

const contacts = [
  {
    href: BRAND.vk,
    img: '/images/vk.png',
    alt: 'vk',
    title: 'Группа ВКонтакте',
    text: 'Новости проекта, скрины и общение с игроками.',
    cta: 'Подписаться',
  },
  {
    href: BRAND.site,
    img: '/images/logo_white.png',
    alt: 'site',
    title: 'Официальный сайт',
    text: 'westland.fun — главная точка входа в проект.',
    cta: 'Перейти',
  },
  {
    href: BRAND.discord,
    img: '/images/discord.png',
    alt: 'discord',
    title: 'Discord',
    text: 'Голос, тикеты и комьюнити Westland.',
    cta: 'Подключиться',
  },
  {
    href: BRAND.vk,
    img: '/images/vk.png',
    alt: 'vk-chat',
    title: 'Общение VK',
    text: 'Быстрые новости и ответы по серверу.',
    cta: 'Открыть',
  },
]
</script>

<template>
  <div class="section content__slide__footer" data-anchor="footer">
    <div class="slide-content slide-content_footer container wrapper">
      <div class="footer-follow">
        <div class="footer-follow__head">
          <div class="footer-follow__title">Следите за нами</div>
          <p class="footer-follow__lead">
            Подписывайтесь, чтобы быть всегда в курсе событий Westland Project!
          </p>
        </div>

        <ul class="footer-follow__grid">
          <li v-for="item in contacts" :key="item.title" class="footer-follow__item">
            <a class="footer-follow__card" :href="item.href" target="_blank" rel="noopener">
              <img class="footer-follow__icon" :alt="item.alt" :src="item.img" />
              <div class="footer-follow__body">
                <div class="footer-follow__name">{{ item.title }}</div>
                <p class="footer-follow__text">{{ item.text }}</p>
              </div>
              <span class="footer-follow__cta">{{ item.cta }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
