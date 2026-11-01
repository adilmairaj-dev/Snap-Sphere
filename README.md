# SnapSphere 📸 — Modern Responsive Photo Gallery & Management Platform

A fast, responsive, and feature-rich photo gallery web application built with **React 19**, **React Router v6**, and modern **CSS3**. SnapSphere features public gallery exploration, high-resolution photo inspection, instant downloads, user collections, and a dedicated **Administration Dashboard** with user and photographer tracking.

---

## ✨ Features

### 👤 User Features
- **🖼️ Curated Photo Gallery**: High-quality imagery displayed in an adaptive responsive grid with smooth hover cards.
- **🔍 Real-Time Search**: Instant filtering by photo title, photographer name, location, and description.
- **🏷️ Category Filtering**: Filter seamlessly between *All*, *Nature*, *Architecture*, *Travel*, *Animals*, *People*, and *Street*.
- **⬇️ Instant Photo Downloads**: Direct high-resolution image downloads directly from gallery cards or detail pages.
- **❤️ Favorites & Likes**: Save favorite shots and like photos with immediate visual feedback.
- **📁 My Collection (`/collection`)**: Dedicated user space with interactive tabs to switch between *Total Liked Photos* and *Favourites Saved*.
- **🌗 Dark / Light Mode**: System-aware theme toggle with persistent user preference across sessions.
- **📄 Deep Photo Detail Page (`/photo/:id`)**: High-res display with complete metadata, photographer info, location, like counters, and related recommendations.

### 🛡️ Administration Section (`/admin`)
- **🔐 Unified Authentication Flow**: Tabbed role switcher supporting credentialed Admin access (`admin@bwu.edu` / `admin123`) and User access.
- **📊 Real-Time Metric Cards**:
  - **Total Gallery Photos**: Live count of all catalog items.
  - **👥 Our Users**: Interactive modal listing registered user emails, active status badges, and login activity.
  - **📸 Photographers**: Interactive modal showing unique artists, shot locations, total likes, and a horizontal gallery strip of their photos.
  - **👍 Total Likes**: Aggregate community engagement across all photos.
- **🔎 Table Search, Filter & Multi-Sort**: Search photos by title, photographer, or location, filter by category, and sort by Newest, Oldest, Most Liked, or Title (A-Z / Z-A).
- **🖼️ Live Image Preview in Add/Edit Modal**: Instant URL preview with real-time image validation before publishing.
- **👁️ Quick "View in Gallery" Action**: Direct row links to inspect the public photo page in a new tab.
- **📱 Responsive Mobile/Desktop UX**: Horizontal scrolling table for desktop and tablet screens, adaptive card grid for mobile devices, and a manual `Auto | Table | Cards` view switcher.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Styling**: Vanilla CSS3 with CSS Custom Properties (Theme tokens, Grid, Flexbox, Animations)
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)
- **Persistence**: Web Storage API (`localStorage`)
- **Assets & Imagery**: Unsplash CDN

---

## 📁 Project Structure

```text
snap-sphere/
├── public/
│   ├── favicon.ico
│   ├── index.html            # HTML entry point with metadata
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── FilterBar.jsx     # Search input & category pills
│   │   ├── Footer.jsx        # Footer with brand reload trigger
│   │   ├── Header.jsx        # Navigation, logo, user dropdown & theme toggle
│   │   ├── ImageCard.jsx     # Interactive gallery card (like & download)
│   │   └── ScrollToTop.jsx   # Window scroll-to-top handler
│   ├── data/
│   │   └── galleryData.js    # Curated photo collection catalog
│   ├── pages/
│   │   ├── AdminPage.jsx     # Admin dashboard, users/photographers modals & photo CRUD
│   │   ├── DetailPage.jsx    # Photo view with metadata & related photos
│   │   ├── GalleryPage.jsx   # Public photo catalog view
│   │   ├── LoginPage.jsx     # Unified user & admin login portal
│   │   └── MyCollectionPage.jsx # User liked photos & favourites
│   ├── utils/
│   │   └── downloadHelper.js # High-res image download helper
│   ├── App.css               # Application styling & dark/light theme tokens
│   ├── App.jsx               # Root router, global auth & application state
│   ├── App.test.js           # Integration and unit test suite
│   ├── index.css             # Base styles & resets
│   ├── index.js              # React DOM entry point
│   ├── reportWebVitals.js
│   └── setupTests.js         # Jest testing environment configuration
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v16 or higher) and [npm](https://www.npmjs.com/) installed on your machine.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/adilmairaj-dev/Snap-Sphere.git
   cd snap-sphere
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   # or
   npm start
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🧪 Running Tests

To run the unit and integration test suite:

```bash
npm test
```

To run once in CI mode:
```bash
CI=true npm test
```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` / `npm start` | Starts the development server with hot reload at `http://localhost:3000` |
| `npm run build` | Builds an optimized production bundle ready for deployment |
| `npm test` | Runs the Jest / React Testing Library test suite |
| `npm run eject` | Ejects Create React App configuration (irreversible) |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
