<script setup>
import { onMounted, ref } from 'vue'

const visible = ref(true)
const fading = ref(false)

onMounted(() => {
  const hide = () => {
    fading.value = true
    window.setTimeout(() => {
      visible.value = false
    }, 600)
  }

  if (document.readyState === 'complete') {
    window.setTimeout(hide, 500)
  } else {
    window.addEventListener('load', () => window.setTimeout(hide, 500), { once: true })
  }
})
</script>

<template>
  <div
    v-if="visible"
    id="p_prldr"
    :class="{ 'preloader-hidden': fading }"
  >
    <div class="contpre">
      <span class="svg_anm" :style="fading ? { display: 'none' } : undefined"></span>
      <br />Подождите<br />
      <small>идет загрузка</small>
    </div>
  </div>
</template>
