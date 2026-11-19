# ShortURL

Сервіс скорочення посилань: React (Vite) + React Router + Node.js (Express). Інтерфейс українською та англійською.

## Сторінки

| Адреса | Статус |
|---|---|
| `/ShortURL/Home` | порожня |
| `/ShortURL/Links` | порожня |
| `/ShortURL/Company` | порожня (у меню — «Кампанії») |
| `/ShortURL/Domens` | порожня |
| `/ShortURL/Settings` | мова, тема (світла / темна / системна), профіль користувача |

Спільний каркас — `src/components/Layout.jsx` (меню `Navigation` + `<Outlet />`). Список сторінок і меню — `src/routes.js`.
Компоненти колишнього дашборда (форма, статистика, графік, список) лежать у `src/components/`, хук `src/hooks/useLinks.js` — для Home і Links.

## Структура

```
public/            vite.svg, 404.html (маршрути на GitHub Pages)
server/            Node.js + Express: API, редирект, лічильник кліків
src/
  components/      Layout, Navigation, EmptyPage, CreateForm, Stats, Chart, Traffic, LinkList
  pages/           Home, Links, Company, Domens, Settings
  settings/        тема та профіль (context + provider)
  i18n/            переклади uk / en
  hooks/useLinks.js  api.js  routes.js  App.jsx  main.jsx  App.css  index.css
```

## Запуск (Node.js 20.19+ або 22.12+)

```bash
npm install
npm run dev                                # http://localhost:5173/ShortURL/Home
cd server && npm install && npm run dev    # API: http://localhost:3001
```

## Публікація на GitHub Pages

```bash
npm run deploy      # збирає сайт і публікує dist у гілку gh-pages
```

Сайт буде за адресою https://artemiy-13.github.io/ShortURL/Home. У репозиторії: Settings → Pages → гілка `gh-pages`.
`public/404.html` і скрипт в `index.html` потрібні, щоб прямі адреси (`/ShortURL/Settings`) відкривалися після перезавантаження.
GitHub Pages не запускає Node.js, тому API працюватиме лише після окремого розгортання сервера.

## Один сервер (сайт + API)

```bash
npm run build
cd server && npm install && npm start      # сайт: http://localhost:3001/ShortURL/Home
```

Для іншого базового шляху: `BASE_PATH=/ npm run build` (PowerShell: `$env:BASE_PATH='/'; npm run build`).
