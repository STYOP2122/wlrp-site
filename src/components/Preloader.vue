<script setup>
import { onMounted, ref } from 'vue'

const visible = ref(true)
const fading = ref(false)

onMounted(() => {
  let done = false
  const hide = () => {
    if (done) return
    done = true
    fading.value = true
    window.setTimeout(() => {
      visible.value = false
    }, 500)
  }

  // Never block the UI if some asset hangs on load
  window.setTimeout(hide, 1800)

  if (document.readyState === 'complete') {
    window.setTimeout(hide, 400)
  } else {
    window.addEventListener('load', () => window.setTimeout(hide, 400), { once: true })
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
