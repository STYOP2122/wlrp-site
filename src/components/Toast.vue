<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: { type: String, default: '' },
})

const emit = defineEmits(['clear'])
const items = ref([])
let seq = 0

watch(
  () => props.message,
  (msg) => {
    if (!msg) return
    const id = ++seq
    items.value.push({ id, text: msg })
    window.setTimeout(() => {
      items.value = items.value.filter((i) => i.id !== id)
      emit('clear')
    }, 3000)
  },
)
</script>

<template>
  <div class="toast-stack" aria-live="polite">
    <div
      v-for="item in items"
      :key="item.id"
      class="ajs-message ajs-default_rd ajs-visible"
    >
      {{ item.text }}
    </div>
  </div>
</template>
