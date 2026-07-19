<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import Header from '../components/Header.vue'
import Toast from '../components/Toast.vue'
import { SERVERS } from '../config/servers'
import { asset } from '../utils/asset'

const donateBg = asset('images/bg/donate.jpg')

const login = ref('')
const email = ref('')
const serverId = ref(SERVERS[0]?.id || 'Black')
const amount = ref(5000)
const convertDollars = ref('')
const payMethod = ref('sbp')
const currency = ref('rc')
const accepted = ref(false)
const payOpen = ref(false)
const toastMessage = ref('')

const RATES = { rc: 1, cash: 100, rp: 0.5 }

const discounts = [
  { percent: 50, from: 100000 },
  { percent: 25, from: 15000 },
  { percent: 15, from: 5000 },
]

const serverOptions = SERVERS.map((s) => ({ id: s.id, label: s.title }))

const selectedServer = computed(
  () => serverOptions.find((s) => s.id === serverId.value) || serverOptions[0],
)

function bonusPercent(value) {
  const n = Number(value) || 0
  for (const tier of discounts) {
    if (n >= tier.from) return tier.percent
  }
  return 0
}

const percent = computed(() => bonusPercent(amount.value))
const baseCoins = computed(() => {
  const rub = Number(amount.value) || 0
  return Math.floor(rub * (RATES[currency.value] || 1))
})
const bonusCoins = computed(() => Math.floor((baseCoins.value * percent.value) / 100))
const totalCoins = computed(() => baseCoins.value + bonusCoins.value)

const currencyLabel = computed(() => {
  if (currency.value === 'cash') return '$'
  if (currency.value === 'rp') return 'RP'
  return 'RC'
})

const formattedAmount = computed(() =>
  new Intl.NumberFormat('ru-RU').format(Number(amount.value) || 0),
)
const formattedBase = computed(() =>
  new Intl.NumberFormat('ru-RU').format(baseCoins.value),
)
const formattedTotal = computed(() =>
  new Intl.NumberFormat('ru-RU').format(totalCoins.value),
)

watch(convertDollars, (val) => {
  const n = Number(String(val).replace(/\s/g, ''))
  if (!n || Number.isNaN(n)) return
  // ~$100 in-game ≈ 1 RC at rate cash:100 → rub = dollars / 100 for cash currency
  amount.value = Math.max(50, Math.round(n / 100))
  currency.value = 'cash'
})

function showToast(msg) {
  toastMessage.value = msg
}
function clearToast() {
  toastMessage.value = ''
}

function openPay(e) {
  e.preventDefault()
  if (!login.value.trim()) {
    showToast('Введите логин персонажа')
    return
  }
  if (!email.value.trim() || !email.value.includes('@')) {
    showToast('Введите корректный e-mail')
    return
  }
  const n = Number(amount.value)
  if (!n || n < 50) {
    showToast('Минимальная сумма — 50 ₽')
    return
  }
  if (!accepted.value) {
    showToast('Примите условия пользовательского соглашения')
    return
  }
  payOpen.value = true
}

function closePay() {
  payOpen.value = false
}

function confirmPay() {
  payOpen.value = false
  showToast('Платёжная система будет подключена позже')
}

onMounted(() => {
  document.title = 'Пополнение | Westland Project'
  document.body.classList.add('layout', 'donate-page')
  document.body.style.overflow = 'hidden'
  document.body.style.height = '100%'
  document.documentElement.style.overflow = 'hidden'
  document.documentElement.style.height = '100%'
})

onUnmounted(() => {
  document.title = 'Westland Project | SAMP Role Play'
  document.body.classList.remove('donate-page')
})
</script>

<template>
  <div class="donate-shell">
    <Header @toast="showToast" />

    <main class="donate-main">
      <div
        class="donate-bg"
        aria-hidden="true"
        :style="{ '--donate-photo': `url(${donateBg})` }"
      ></div>

      <h1 class="donate-title">Пополнение</h1>

      <div class="donate-grid">
        <!-- Left: converter -->
        <aside class="donate-side">
          <h2 class="donate-side__title">Пополняете для конвертации в игровую валюту?</h2>
          <p class="donate-side__text">
            Введите сумму в игровых долларах — мы подставим нужное пополнение в рублях.
          </p>
          <label class="donate-field">
            <span>Введите сумму в игровых долларах, $</span>
            <input
              v-model="convertDollars"
              type="number"
              min="0"
              placeholder="500000"
            />
          </label>
          <p class="donate-side__hint">
            Курс ориентировочный. Точное зачисление зависит от выбранной валюты справа.
          </p>
        </aside>

        <!-- Center: form -->
        <form class="donate-card" @submit="openPay">
          <div class="pay-methods">
            <button
              type="button"
              class="pay-method"
              :class="{ active: payMethod === 'sbp' }"
              @click="payMethod = 'sbp'"
            >
              <span class="pay-method__icon pay-method__icon--sbp" aria-hidden="true"></span>
              СБП
            </button>
            <button
              type="button"
              class="pay-method"
              :class="{ active: payMethod === 'card' }"
              @click="payMethod = 'card'"
            >
              <span class="pay-method__icon pay-method__icon--card" aria-hidden="true"></span>
              Банковская карта
            </button>
          </div>

          <label class="donate-field">
            <span class="sr-only">Логин</span>
            <input v-model="login" type="text" placeholder="Логин" autocomplete="username" />
          </label>

          <label class="donate-field">
            <span class="sr-only">Почта</span>
            <input
              v-model="email"
              type="email"
              placeholder="Почта"
              autocomplete="email"
            />
          </label>

          <label class="donate-field">
            <span class="sr-only">Сервер</span>
            <select v-model="serverId">
              <option v-for="opt in serverOptions" :key="opt.id" :value="opt.id">
                {{ opt.label }}
              </option>
            </select>
          </label>

          <label class="donate-field">
            <span class="sr-only">Сумма пополнения</span>
            <input
              v-model.number="amount"
              type="number"
              min="50"
              step="1"
              placeholder="Сумма пополнения"
            />
          </label>

          <div class="donate-receive">
            Вы получите
            <template v-if="percent > 0">
              <s>{{ formattedBase }}</s>
              <strong>{{ formattedTotal }} {{ currencyLabel }}</strong>
            </template>
            <template v-else>
              <strong>{{ formattedTotal }} {{ currencyLabel }}</strong>
            </template>
          </div>

          <div class="currency-row">
            <button
              type="button"
              class="currency-btn"
              :class="{ active: currency === 'rc' }"
              @click="currency = 'rc'"
            >
              Получить RC
            </button>
            <button
              type="button"
              class="currency-btn"
              :class="{ active: currency === 'cash' }"
              @click="currency = 'cash'"
            >
              Получить $
            </button>
            <button
              type="button"
              class="currency-btn"
              :class="{ active: currency === 'rp' }"
              @click="currency = 'rp'"
            >
              Получить RP
            </button>
          </div>

          <label class="donate-check">
            <input v-model="accepted" type="checkbox" />
            <span>
              Принимаю условия
              <a href="../doc/user-agreement.pdf" target="_blank">пользовательского соглашения</a>
            </span>
          </label>

          <button type="submit" class="donate-submit">
            Оплатить
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <!-- Right: discounts -->
        <aside class="donate-side donate-side--right">
          <h2 class="donate-side__title">Получите скидку при пополнении:</h2>
          <ul class="discount-list">
            <li v-for="tier in discounts" :key="tier.percent">
              <span class="discount-list__pct">{{ tier.percent }}%</span>
              <span class="discount-list__desc">
                пополнение от {{ tier.from.toLocaleString('ru-RU') }} ₽
              </span>
            </li>
          </ul>
          <p class="donate-side__hint">
            Бонус начисляется автоматически к выбранной валюте после успешной оплаты.
          </p>
        </aside>
      </div>
    </main>

    <Teleport to="body">
      <div v-if="payOpen" class="donate-modal">
        <button type="button" class="donate-modal__backdrop" @click="closePay" />
        <div class="donate-modal__panel" role="dialog" aria-modal="true">
          <button type="button" class="donate-modal__close" @click="closePay">×</button>
          <h3>Подтверждение оплаты</h3>
          <dl class="donate-modal__rows">
            <div><dt>Способ</dt><dd>{{ payMethod === 'sbp' ? 'СБП' : 'Банковская карта' }}</dd></div>
            <div><dt>Логин</dt><dd>{{ login }}</dd></div>
            <div><dt>Сервер</dt><dd>{{ selectedServer.label }}</dd></div>
            <div><dt>Сумма</dt><dd>{{ formattedAmount }} ₽</dd></div>
            <div><dt>К зачислению</dt><dd>{{ formattedTotal }} {{ currencyLabel }}</dd></div>
          </dl>
          <button type="button" class="donate-submit" @click="confirmPay">
            Оплатить {{ formattedAmount }} ₽
          </button>
        </div>
      </div>
    </Teleport>

    <Toast :message="toastMessage" @clear="clearToast" />
  </div>
</template>

<style scoped>
.donate-shell {
  --don-bg: #0c0b14;
  --don-panel: #16151f;
  --don-panel-2: #1c1b28;
  --don-border: rgba(255, 255, 255, 0.08);
  --don-text: #f3f1f7;
  --don-muted: #8b879c;
  --don-accent: #e8eef5;
  --don-accent-2: #c4a574;
  --don-grad: linear-gradient(105deg, #f2f5f8 0%, #c9d2dc 100%);
  --don-header: 88px;
  --don-gap: clamp(6px, 1.1vh, 12px);
  --don-field-h: clamp(34px, 4.6vh, 46px);
  height: 100dvh;
  max-height: 100dvh;
  overflow: hidden;
  color: var(--don-text);
  background: var(--don-bg);
  font-family: UniNeueRegular, Uni Neue, sans-serif;
  display: flex;
  flex-direction: column;
}

.donate-main {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: calc(var(--don-header) + 0.8vh) clamp(16px, 2vw, 24px) clamp(10px, 1.5vh, 20px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
}

.donate-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 70% 50% at 50% -10%, rgba(255, 110, 105, 0.18), transparent 55%),
    radial-gradient(ellipse 40% 40% at 90% 80%, rgba(255, 176, 112, 0.08), transparent 50%),
    var(--donate-photo) center / cover no-repeat;
  opacity: 0.35;
  filter: saturate(0.85);
}

.donate-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(12, 11, 20, 0.55) 0%, rgba(12, 11, 20, 0.92) 70%);
}

.donate-title {
  position: relative;
  flex-shrink: 0;
  margin: 0 0 clamp(10px, 2vh, 28px);
  text-align: center;
  font-family: UniNeueBlack, UniNeueBold, sans-serif;
  font-size: clamp(28px, 5.5vh, 64px);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1;
  background: var(--don-grad);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: title-in 0.7s ease both;
}

.donate-grid {
  position: relative;
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 380px) minmax(0, 1fr);
  gap: clamp(14px, 2vw, 28px);
  align-items: center;
  animation: grid-in 0.75s ease 0.08s both;
}

.donate-side {
  padding: 0 4px;
  min-height: 0;
  overflow: hidden;
}

.donate-side__title {
  margin: 0 0 clamp(6px, 1vh, 12px);
  font-family: UniNeueBold, sans-serif;
  font-size: clamp(15px, 2vh, 20px);
  line-height: 1.3;
  font-weight: 700;
}

.donate-side__text,
.donate-side__hint {
  margin: 0 0 clamp(8px, 1.2vh, 14px);
  color: var(--don-muted);
  font-size: clamp(12px, 1.5vh, 14px);
  line-height: 1.45;
}

.donate-side--right .donate-side__title {
  margin-bottom: clamp(8px, 1.4vh, 18px);
}

.discount-list {
  list-style: none;
  margin: 0 0 clamp(8px, 1.2vh, 16px);
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(6px, 1.2vh, 14px);
}

.discount-list li {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.discount-list__pct {
  font-family: UniNeueBlack, sans-serif;
  font-size: clamp(20px, 3vh, 28px);
  background: var(--don-grad);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1.1;
}

.discount-list__desc {
  color: var(--don-muted);
  font-size: clamp(12px, 1.5vh, 14px);
}

.donate-card {
  background: rgba(22, 21, 31, 0.92);
  border: 1px solid var(--don-border);
  border-radius: 4px;
  padding: clamp(10px, 1.6vh, 18px);
  display: flex;
  flex-direction: column;
  gap: var(--don-gap);
  backdrop-filter: blur(10px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  min-height: 0;
  max-height: 100%;
  overflow: hidden;
}

.pay-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.pay-method {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: var(--don-field-h);
  height: var(--don-field-h);
  padding: 0 10px;
  border: 1px solid var(--don-border);
  border-radius: 4px;
  background: var(--don-panel-2);
  color: var(--don-text);
  font-family: UniNeueHeavy, sans-serif;
  font-size: clamp(11px, 1.5vh, 13px);
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.pay-method:hover {
  border-color: rgba(255, 122, 92, 0.45);
}

.pay-method.active {
  border-color: var(--don-accent);
  background: rgba(255, 110, 105, 0.08);
  box-shadow: inset 0 0 0 1px rgba(255, 122, 92, 0.25);
}

.pay-method__icon {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  flex-shrink: 0;
}

.pay-method__icon--sbp {
  background: linear-gradient(135deg, #1ea3ff, #5ad0ff 40%, #ff4d6d 70%, #ffc107);
}

.pay-method__icon--card {
  background: linear-gradient(135deg, #3a3848, #6a6780);
  position: relative;
}

.pay-method__icon--card::after {
  content: '';
  position: absolute;
  inset: 6px 3px auto;
  height: 2px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 1px;
}

.donate-field {
  display: block;
  flex-shrink: 0;
}

.donate-field span:not(.sr-only) {
  display: block;
  margin-bottom: clamp(4px, 0.7vh, 8px);
  color: var(--don-muted);
  font-size: clamp(11px, 1.4vh, 13px);
}

.donate-field input,
.donate-field select {
  width: 100%;
  box-sizing: border-box;
  height: var(--don-field-h) !important;
  padding: 0 12px;
  border: 1px solid var(--don-border);
  border-radius: 4px;
  background: #12111a;
  color: var(--don-text);
  font-family: UniNeueHeavy, sans-serif;
  font-size: clamp(13px, 1.7vh, 15px);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  appearance: none;
  position: static;
  overflow: visible;
  opacity: 1 !important;
  z-index: auto;
}

.donate-field select {
  background-image: linear-gradient(45deg, transparent 50%, var(--don-muted) 50%),
    linear-gradient(135deg, var(--don-muted) 50%, transparent 50%);
  background-position: calc(100% - 18px) calc(50% - 2px), calc(100% - 12px) calc(50% - 2px);
  background-size: 6px 6px, 6px 6px;
  background-repeat: no-repeat;
  padding-right: 36px;
}

.donate-field input::placeholder {
  color: #6a667a;
}

.donate-field input:focus,
.donate-field select:focus {
  border-color: rgba(255, 122, 92, 0.7);
  box-shadow: 0 0 0 3px rgba(255, 110, 105, 0.12);
}

.donate-receive {
  padding: 0 2px;
  color: var(--don-muted);
  font-size: clamp(12px, 1.6vh, 15px);
  flex-shrink: 0;
}

.donate-receive s {
  margin: 0 6px;
  color: rgba(255, 255, 255, 0.45);
}

.donate-receive strong {
  margin-left: 4px;
  color: var(--don-accent);
  font-family: UniNeueBold, sans-serif;
  font-size: clamp(15px, 2vh, 18px);
}

.currency-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  flex-shrink: 0;
}

.currency-btn {
  height: var(--don-field-h);
  min-height: 0;
  border: 1px solid var(--don-border);
  border-radius: 4px;
  background: var(--don-panel-2);
  color: var(--don-text);
  font-family: UniNeueHeavy, sans-serif;
  font-size: clamp(10px, 1.4vh, 12px);
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.currency-btn:hover {
  border-color: rgba(255, 122, 92, 0.4);
}

.currency-btn.active {
  border-color: var(--don-accent);
  background: rgba(255, 110, 105, 0.1);
}

.donate-check {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: var(--don-muted);
  font-size: clamp(11px, 1.4vh, 13px);
  line-height: 1.35;
  cursor: pointer;
  flex-shrink: 0;
}

.donate-check input {
  margin-top: 1px;
  accent-color: var(--don-accent);
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.donate-check a {
  color: var(--don-text);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.donate-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: clamp(40px, 5.2vh, 50px);
  min-height: 0;
  border: 0;
  border-radius: 4px;
  background: var(--don-grad);
  color: #fff;
  font-family: UniNeueBold, sans-serif;
  font-size: clamp(13px, 1.8vh, 16px);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(255, 110, 105, 0.28);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
  flex-shrink: 0;
}

.donate-submit:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

.donate-submit:active {
  transform: translateY(0);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.donate-modal {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.donate-modal__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(6, 5, 12, 0.78);
  cursor: pointer;
}

.donate-modal__panel {
  position: relative;
  z-index: 1;
  width: min(420px, 100%);
  max-height: calc(100dvh - 40px);
  overflow: auto;
  padding: 28px 24px 24px;
  border: 1px solid var(--don-border);
  border-radius: 6px;
  background: var(--don-panel);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  animation: modal-in 0.25s ease both;
}

.donate-modal__panel h3 {
  margin: 0 0 18px;
  font-family: UniNeueBold, sans-serif;
  font-size: 22px;
}

.donate-modal__close {
  position: absolute;
  top: 10px;
  right: 12px;
  border: 0;
  background: transparent;
  color: var(--don-muted);
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
}

.donate-modal__rows {
  margin: 0 0 20px;
}

.donate-modal__rows > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid var(--don-border);
  font-size: 14px;
}

.donate-modal__rows dt {
  color: var(--don-muted);
}

.donate-modal__rows dd {
  margin: 0;
  font-family: UniNeueHeavy, sans-serif;
  text-align: right;
}

@keyframes title-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes grid-in {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Short screens: compress side copy */
@media (max-height: 820px) {
  .donate-side__hint {
    display: none;
  }

  .donate-side__text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

@media (max-height: 700px) {
  .donate-shell {
    --don-header: 72px;
  }

  .donate-side__text {
    display: none;
  }

  .discount-list {
    gap: 4px;
  }
}

@media (max-width: 1024px) {
  .donate-shell {
    height: auto;
    max-height: none;
    overflow: auto;
  }

  .donate-main {
    justify-content: flex-start;
    padding-top: calc(var(--don-header) + 16px);
    padding-bottom: 32px;
    overflow: visible;
  }

  .donate-title {
    font-size: clamp(28px, 9vw, 40px);
    margin-bottom: 20px;
  }

  .donate-grid {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin: 0 auto;
    flex: none;
    gap: 20px;
  }

  .donate-side {
    overflow: visible;
  }

  .donate-side--right {
    order: 3;
  }

  .donate-card {
    order: 2;
    max-height: none;
  }
}

@media (max-width: 600px) {
  .currency-row,
  .pay-methods {
    grid-template-columns: 1fr 1fr;
  }

  .currency-row {
    grid-template-columns: 1fr;
  }

  .donate-main {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
