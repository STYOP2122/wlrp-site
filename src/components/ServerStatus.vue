<script setup>
import { ref } from 'vue'

defineProps({
  servers: { type: Array, required: true },
})

const copyLabels = ref({})

async function copyIp(server) {
  const text = server.address
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const temp = document.createElement('input')
    temp.style.opacity = '0'
    temp.value = text
    document.body.appendChild(temp)
    temp.select()
    document.execCommand('copy')
    temp.remove()
  }
  copyLabels.value = { ...copyLabels.value, [server.id]: 'Скопирован!' }
  window.setTimeout(() => {
    const next = { ...copyLabels.value }
    delete next[server.id]
    copyLabels.value = next
  }, 700)
}

function label(server) {
  return copyLabels.value[server.id] || 'Скопировать ip'
}
</script>

<template>
  <div class="server slick-initialized slick-slider" id="serv_upd">
    <div class="slick-list draggable">
      <div
        class="slick-track server-track"
        style="display: flex; flex-wrap: nowrap; gap: 36px; overflow-x: auto"
      >
        <div
          v-for="server in servers"
          :key="server.id"
          class="slick-slide slick-active"
          style="width: auto; display: block; float: none; margin-right: 0"
        >
          <div class="serv__rd" :id="'upd_' + server.id">
            <div class="serv__rd__title h2">{{ server.title }}</div>
            <div class="serv__rd__text">
              Игроков:
              <span v-if="server.offline" style="color: red">Выключен</span>
              <span v-else>{{ server.playersLabel }}</span>
            </div>
            <div class="serv__rd__line">
              <span class="gradient_btn__orange" :style="{ width: server.lineWidth }"></span>
            </div>
            <div class="serv__rd__text">IP сервера:</div>
            <div class="serv__rd__ip" :id="'serv_' + server.id">
              <span>{{ server.address }}</span>
              <a href="#" @click.prevent="copyIp(server)">{{ label(server) }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
