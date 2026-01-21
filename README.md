# 🧸 Nanny.Services — Babysitter Marketplace App

**Nanny.Services** — це сучасний веб-застосунок для компанії, що надає послуги нянь.  
Мета проєкту — дати батькам зручний, швидкий та безпечний спосіб знайти няню, переглянути детальну інформацію, відгуки, додати в обране та записатися на особисту зустріч.

Проєкт реалізований відповідно до технічного завдання з використанням **Next.js, TypeScript та Firebase**, з акцентом на адаптивність, UX та чисту архітектуру.

---

## 🔗 Live Demo & Repository

- **Live demo:** 👉 _додай посилання після деплою_
- **GitHub repo:** 👉 (https://github.com/AleksPolishcuk/nanny-services-app)

---

## 🛠 Tech Stack

**Frontend**

- Next.js (App Router)
- React 19
- TypeScript
- CSS Modules
- modern-normalize

**Forms & Validation**

- react-hook-form
- yup

**Backend / Services**

- Firebase Authentication
- Firebase Realtime Database

**Architecture**

- Context API (Auth, Favorites, Modals, Toasts)
- Client-side pagination
- Optimistic UI updates

---

## 📄 Pages & Routing

### 🏠 Home (`/`)

- Заголовок та слоган сервісу
- Call-to-action кнопка **Get started**
- Перехід до сторінки з переліком нянь

---

### 👩‍🍼 Nannies (`/nannies`)

- Список нянь з Firebase Realtime Database
- Початково відображається **3 картки**
- Кнопка **Load more** завантажує наступну порцію з БД

**Фільтрація та сортування**

- Alphabet: `A → Z`, `Z → A`
- Price: `< 10$`, `> 10$`
- Rating: `Popular`, `Not popular`

**Інтерактивність**

- ❤️ Додавання в обране
- 📖 Read more — розгортання повної інформації
- 🗓 Make an appointment — форма запису на зустріч

---

### ⭐ Favorites (`/favorites`) — приватна сторінка

- Доступна **лише авторизованим користувачам**
- Повний список обраних нянь
- Така ж логіка фільтрів, як на сторінці Nannies
- Стан зберігається після перезавантаження сторінки

---

## 🔐 Authentication & Authorization

Реалізовано через **Firebase Authentication**:

- Реєстрація
- Логін
- Отримання поточного користувача
- Логаут

### Модальне вікно авторизації

- Побудоване на `react-hook-form + yup`
- Всі поля обов’язкові
- Мінімальна валідація
- Закривається:
  - по кліку на ✖
  - по кліку на backdrop
  - по клавіші `Esc`

---

## ❤️ Favorites Logic

- Неавторизований користувач → показується модалка **Authorization required**
- Авторизований користувач:
  - додає / видаляє няню з обраних
  - стан кнопки-серця змінюється
- Дані зберігаються в Firebase:
- Після refresh сторінки обрані залишаються активними

---

## 🗓 Appointment Modal

Форма запису на особисту зустріч з нянею:

- RHF + yup
- Всі поля обовʼязкові
- Вибір часу зустрічі
- Toast-повідомлення після успішної відправки
- Закриття по ✖ / backdrop / Esc

---

## 🗄 Firebase Realtime Database Structure

### `nannies/{id}`

```ts
{
name: string
avatar_url: string
birthday: string
experience: string
reviews: Review[]
education: string
kids_age: string
price_per_hour: number
location: string
about: string
characters: string[]
rating: number
createdAt: number
}
```

📱 Responsive Design

- Повністю адаптивна верстка
- Діапазон: 320px → 1440px
- Mobile-first підхід
- Окреме мобільне меню
- Семантична та валідна HTML-структура

🚀 Getting Started

1. Install dependencies

npm install 2. Environment variables
Створи .env.local:

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=... 3. Run locally

npm run dev 4. Build production

npm run build
npm run start

✅ Task Checklist

- ✔️ 3 сторінки (Home / Nannies / Favorites)
- ✔️ Firebase Auth + Realtime DB
- ✔️ Filters, sorting, pagination
- ✔️ Favorites with persistence
- ✔️ RHF + yup forms
- ✔️ Modals with correct UX behavior
- ✔️ Responsive design
- ✔️ Clean, formatted code (no comments)
- ✔️ README with full project description
