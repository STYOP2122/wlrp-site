# Westland RP Website

Сайт игрового проекта Westland RP на Vue 3. Включает главную страницу и страницу доната, маршрутизацию, полноэкранные секции и параллакс-эффекты.

## Технологии

Vue 3, Vue Router, Vite, fullPage.js и parallax.js.

## Локальный запуск

Понадобятся Node.js и npm с поддержкой версии Vite из `package.json`.

```bash
git clone https://github.com/STYOP2122/wlrp-site.git
cd wlrp-site
npm install
npm run dev
```

Откройте адрес, который выведет Vite в терминале.

## Сборка

```bash
npm run build
npm run preview
```

Результат сборки находится в `dist/`. Перед публикацией для другого проекта замените ссылки, ресурсы и настройки счётчика Яндекс Метрики.

## Структура

- `src/App.vue` — корневой компонент и подключение аналитики.
- `src/views/HomeView.vue` — главная страница.
- `src/views/DonateView.vue` — страница доната.
- `src/composables/` — переиспользуемая логика.
- `vite.config.js` — настройки сборки.
