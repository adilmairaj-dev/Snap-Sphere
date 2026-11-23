# SnapSphere 📸 — Modern Responsive Photo Gallery & Management Platform (MERN)

A fast, responsive, and feature-rich full-stack photo gallery web application built with the **MERN Stack**: **React 19**, **Node.js**, **Express**, **MongoDB (Mongoose)**, and **CSS3**. SnapSphere features public gallery exploration, high-resolution photo inspection, instant downloads, user collections, and an **Administration Dashboard** with user and photographer tracking.

---

## 📁 Clean Architecture: Client & Server

The repository is organized into two completely independent, self-contained directories:

```text
snap-sphere/
├── client/                     # ⚛️ React 19 Frontend Application
│   ├── public/                 # Static assets, favicon, index.html
│   ├── src/                    # Components, pages, styling, utils
│   ├── package.json            # React frontend scripts and dependencies
│   ├── package-lock.json
│   └── .gitignore
│
├── server/                     # 🚀 Node.js + Express + MongoDB Backend API
│   ├── models/                 # Mongoose schemas (Photo.js, User.js)
│   ├── routes/                 # REST API endpoints (photoRoutes.js, authRoutes.js)
│   ├── middleware/             # JWT auth & admin role verification (auth.js)
│   ├── seedData.js             # Initial 16 gallery photos auto-seeder
│   ├── server.js               # Express server entry point & DB connection
│   ├── .env                    # Environment variables (PORT=5000, MONGO_URI)
│   ├── .env.example            # Environment template
│   ├── package.json            # Backend scripts and dependencies
│   └── .gitignore
│
├── .gitignore                  # Root gitignore
├── LICENSE                     # MIT License
└── README.md
```

---

## 🚀 How to Run

Open two terminal tabs:

### 1. Frontend (Client)
```bash
cd client
npm start
```
- Local URL: **`http://localhost:3000`**

### 2. Backend (Server)
```bash
cd server
npm start
# or during development with live reload:
npm run dev
```
- API URL: **`http://localhost:5000`**

---

## 🧪 Testing

To run the frontend test suite:
```bash
cd client
npm test
```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
