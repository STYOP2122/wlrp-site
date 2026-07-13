<script setup>
import { youtubeEmbedUrl } from '../composables/useMetrika'

defineProps({
  open: { type: Boolean, default: false },
  url: { type: String, required: true },
})

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="video-modal-overlay my-mfp-zoom-in">
      <button
        type="button"
        class="video-modal-backdrop"
        aria-label="Close backdrop"
        @click="emit('close')"
      ></button>
      <div class="video-modal-dialog">
        <button type="button" class="mfp-close" aria-label="Close" @click="emit('close')">
          ×
        </button>
        <div class="mfp-iframe-scaler">
          <iframe
            class="mfp-iframe"
            :src="youtubeEmbedUrl(url)"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </Teleport>
</template>
