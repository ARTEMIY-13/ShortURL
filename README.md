# ShortURL

Сервіс скорочення посилань: React (Vite) + Node.js (Express). Інтерфейс українською та англійською (перемикач UA / EN у верхньому правому куті).
Дані зберігаються у `server/data.json`.

## Структура

```
shorturl/
├─ public/            статичні файли (vite.svg)
├─ server/            Node.js + Express (API і редирект)
├─ src/
│  ├─ assets/
│  ├─ i18n/           переклади (translations.js) і провайдер мови
│  ├─ App.jsx  App.css
│  ├─ api.js          запити до сервера
│  ├─ index.css  main.jsx
├─ eslint.config.js  index.html  package.json  vite.config.js
```

## Запуск (потрібен Node.js 20.19+ або 22.12+)

Два термінали в корені проєкту:

```bash
npm install
npm run dev                          # сайт: http://localhost:5173

cd server && npm install && npm run dev   # API: http://localhost:3001
```

Короткі посилання виду `http://localhost:3001/abc123` перенаправляють на вихідну адресу й рахують кліки.

## Один сервер

```bash
npm run build
cd server && npm install && npm start    # http://localhost:3001
```

Для бойового домену задайте `BASE_URL=https://ваш-домен`.

## API

- `GET /api/links`
- `POST /api/links` — `{ url, slug?, campaign? }`
- `DELETE /api/links/:id`
- `GET /:slug` — редирект і підрахунок кліків

Помилки API повертають код (`invalidUrl`, `invalidSlug`, `slugTaken`, `notFound`), текст підставляє клієнт на вибраній мові.

## Додати мову

Додайте об'єкт у `src/i18n/translations.js` (`LANGS`, `LOCALES`, `translations`, `plurals`).
