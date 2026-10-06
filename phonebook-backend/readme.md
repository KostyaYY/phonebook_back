# Phonebook Backend

REST API бэкенд для React-приложения [Phonebook](https://github.com/KostyaYY/Phonebook).
Написан по аналогии с проектом `node-js-project` (Express + MongoDB/Mongoose + JWT),
но повторяет контракт API `https://connections-api.herokuapp.com`, на который изначально
завязан фронтенд Phonebook.

## Стек

- Express
- MongoDB / Mongoose
- JWT (jsonwebtoken) + bcrypt
- Joi (валидация тела запроса)
- cors, morgan, dotenv

## Установка

```bash
npm install
cp .env-examples .env
```

Заполните `.env`:

```
DB_HOST=<connection string MongoDB>
PORT=3000
SECRET_KEY=<любая секретная строка для подписи JWT>
```

## Запуск

```bash
npm run start:dev   # режим разработки (nodemon)
npm start            # production
```

## Как подключить к фронтенду Phonebook

В `src/redux/auth/operations.js` фронтенда замените:

```js
axios.defaults.baseURL = 'https://connections-api.herokuapp.com';
```

на адрес этого бэкенда, например:

```js
axios.defaults.baseURL = 'http://localhost:3000';
```

## Эндпоинты

Модель данных и маршруты повторяют то, что ожидает фронтенд Phonebook (redux `operations.js` /
`auth/operations.js`):

### Auth (`/users`)

| Метод | Путь | Тело | Ответ |
|---|---|---|---|
| POST | `/users/signup` | `{ name, email, password }` | `{ token, user: { name, email } }` |
| POST | `/users/login` | `{ email, password }` | `{ token, user: { name, email } }` |
| POST | `/users/logout` | — (`Authorization: Bearer <token>`) | `204 No Content` |
| GET | `/users/current` | — (`Authorization: Bearer <token>`) | `{ name, email }` |

### Contacts (`/contacts`, все требуют `Authorization: Bearer <token>`)

| Метод | Путь | Тело | Ответ |
|---|---|---|---|
| GET | `/contacts` | — | `[{ id, name, number }, ...]` |
| GET | `/contacts/:id` | — | `{ id, name, number }` |
| POST | `/contacts` | `{ name, number }` | `{ id, name, number }` |
| PATCH | `/contacts/:id` | `{ name?, number? }` | `{ id, name, number }` |
| DELETE | `/contacts/:id` | — | `{ id, name, number }` (удалённый контакт) |

Контакты привязаны к пользователю (`owner`) — каждый пользователь видит только свои контакты.

## Структура проекта

```
app.js                       # express app, middlewares, роуты, обработка ошибок
server.js                    # подключение к MongoDB и запуск сервера
controllers/
  auth-controllers.js        # signup/login/logout/current
  contacts-controllers.js    # CRUD контактов
decorators/
  authenticate.js            # проверка JWT
  ctrlWrapper.js             # обёртка для async-контроллеров
  validateBody.js            # валидация тела запроса через Joi
middleWares/
  isValidId.js                # проверка валидности MongoDB ObjectId
models/
  user.js                     # схема User + Joi-схемы
  contact.js                   # схема Contact + Joi-схемы
routes/api/
  users.js
  contacts.js
helpers/
  HttpError.js
  handleMongooseError.js
```
