# 🌍 Geo Explorer

A **React frontend** application using the **REST Countries API** with **user authentication** and a connected **Node.js/Express/MongoDB backend**.

---

## ✨ Features

- 🌎 List countries in **list view**, **2D map view**, and **3D globe view**
- 📄 View detailed information for each country
- 🔍 Search countries by name
- 🌐 Filter countries by region or language
- 🔐 User authentication (login, register, logout)
- 💖 Favorite countries with a personal profile
- 📱 Responsive design using Tailwind CSS
- ✅ Comprehensive unit and integration testing

---

## 🚀 Technologies Used

### Frontend

- React 19 (Functional Components with Hooks)
- React Router
- Tailwind CSS
- Axios
- Formik & Yup for forms
- React Hot Toast for notifications
- Heroicons for icons
- Leaflet & React Leaflet (2D maps)
- React Three Fiber & Globe.gl (3D globe)
- D3-geo, React Simple Maps
- React Toastify, Swiper, React Spinners
- React Tsparticles, Three.js, Framer Motion
- MSW (Mock Service Worker) for API mocking in tests

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (Access & Refresh tokens)
- Bcrypt for password hashing
- Cookie-parser for secure cookies
- Helmet for security
- Express-rate-limit for rate limiting
- CORS configuration

---

## 🌐 REST Countries API Endpoints Used

- `GET /all` → Get all countries
- `GET /alpha/{code}` → Get country by code
- `GET /alpha?codes={code},{code}` → Get multiple countries
- `GET /name/{name}` → Search countries by name
- `GET /region/{region}` → Filter countries by region
- `GET /lang/{language}` → Filter countries by language

---

## ⚙️ Custom Hooks

- `useCountries` → Fetches and manages countries data
- `useDebounce` → Debounces rapid value changes (e.g., search input)
- `useAuth` → Manages authentication state using AuthContext

---

## 📂 Backend Routes for User Management

```js
POST   /api/auth/register          → Register user
POST   /api/auth/login             → Login user
GET    /api/auth/logout            → Logout user (protected)
GET    /api/auth/refresh           → Refresh access token
GET    /api/auth/me                → Get current user profile (protected)
PUT    /api/auth/favorites         → Toggle favorite country (protected)
```

---

## 🏗️ Project Scripts (Frontend)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

---

## 📦 Key Frontend Dependencies

- `@heroicons/react`, `@react-three/drei`, `@react-three/fiber`, `axios`
- `d3-geo`, `formik`, `framer-motion`, `globe.gl`, `leaflet`, `react`, `react-dom`
- `react-hot-toast`, `react-leaflet`, `react-router-dom`, `react-simple-maps`, `react-spinners`, `react-toastify`, `react-tsparticles`, `swiper`, `three`, `tsparticles`, `yup`

---

## 🧪 Dev & Testing Dependencies

- ESLint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh
- @testing-library/react, jest, jest-environment-jsdom, vitest, jsdom, whatwg-fetch
- @vitejs/plugin-react-swc, tailwindcss, autoprefixer, postcss, msw

---

## 🌍 .env Setup

### Backend `.env`

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`

```
VITE_API_URL=http://localhost:5000/api
VITE_API_KEY=your_api_key_here
```

> ⚠️ **Important:** Do NOT commit `.env` files with sensitive values to your repository.

---

## 🏗️ Installation Instructions

### Prerequisites

- Node.js (v18 or later)
- MongoDB (local or cloud)
- Git

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-yashodalasith
   git checkout branch-dev
   cd AF_ASSIGNMENT2
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

## ⚠️ Important: When you click enter after npm install there will be few vulnerabilities. Just ignore these as they won't break the application.

3. **Install backend dependencies**

   ```bash
   cd ../backend
   npm install
   ```

4. **Set up `.env` files**  
   Create `.env` files in both **frontend** and **backend** folders using the templates above.

5. **Run the backend**

   ```bash
   npm run dev
   ```

6. **Run the frontend**
   ```bash
   cd ../frontend
   npm run dev
   ```

---

## ✅ Testing

- **Run all tests**

  ```bash
  npm run test
  ```

- **Run tests in watch mode**

  ```bash
  npm run test:watch
  ```

- **Generate coverage report**

  ```bash
  npm run test:coverage
  ```

- **Launch test UI**
  ```bash
  npm run test:ui
  ```

---

## 📄 License

This project is licensed under the MIT License.
