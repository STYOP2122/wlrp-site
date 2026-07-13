<script setup>
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import { initYandexMetrika } from './composables/useMetrika'

onMounted(() => {
  document.body.classList.add('layout')
  initYandexMetrika(53059735)
})
</script>

<template>
  <RouterView />
  <noscript>
    <div>
      <img
        src="https://mc.yandex.ru/watch/53059735"
        style="position: absolute; left: -9999px"
        alt=""
      />
    </div>
  </noscript>
</template>
