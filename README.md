# Westland Project (SAMP) — landing site

Сайт проекта **Westland Project** (San Andreas Multiplayer).

## Локальный запуск

```bash
npm install
npm run dev
```

Онлайн сервера в dev идёт через локальный UDP API: `/api/samp-status`.

## Сборка

```bash
npm run build
npm run preview
```

## GitHub Pages

Репозиторий: [STYOP2122/wlrp-site](https://github.com/STYOP2122/wlrp-site)

Сайт: https://STYOP2122.github.io/wlrp-site/

Деплой автоматически из ветки `main` (Actions → Deploy GitHub Pages).

После первого пуша включи в настройках репозитория:

**Settings → Pages → Source: GitHub Actions**

На Pages онлайн берётся через публичный SAMonitor API (статический хостинг без UDP).

## Сервер

- IP: `147.45.38.102:7777`
- VK: https://vk.com/westlandproject
- Сайт: https://westland.fun
