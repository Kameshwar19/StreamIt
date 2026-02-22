# StreamIt - The Ultimate Decision Killer

<div align="center">
  <img src="client/public/vite.svg" alt="StreamIt Logo" width="100"/>
  <h3>Stop scrolling. Start streaming. Find your perfect movie in 3 steps.</h3>
</div>

## 📌 Features

- **Decision Engine Quiz:** Select your vibe (Genre, Era, Runtime, Actor) and instantly get exactly 3 curated suggestions.
- **Cinematic UI/UX:** A gorgeous "A Life in Film" Letterboxd-style aesthetic featuring real-time interactive movie cards and fluid Framer Motion animations.
- **Dynamic Cult Wall:** The landing page features a sprawling, generative CSS grid collage randomly populated with iconic, high-resolution Cult Classic movie backdrops fetched dynamically via the TMDB API.
- **Streaming Availability:** Instantly know *where* to watch the suggestion (Netflix, Prime, Hulu, HBO) powered by Watchmode.
- **Interactive Profile System:** Save your Watchlist, track your History, and favorite movies.
- **Share Stats Card:** Generate and download high-resolution, pixel-perfect PNG share cards of your "All-Time Stats" to post on social media (powered by `html-to-image`).

---

## 🚀 Tech Stack

- **Frontend:** React + Vite, Tailwind CSS (v4), Framer Motion, Lucide Icons, Axios.
- **Backend:** Node.js, Express, Mongoose (MongoDB).
- **APIs:** The Movie Database (TMDB) API, Watchmode API.

---

## 🛠️ Local Development Setup

To run StreamIt locally, you need two terminal windows running simultaneously—one for the frontend and one for the backend.

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or a MongoDB Atlas URI)

### 2. Backend Setup (`/server`)

Create a `.env` file in the `server` directory with the following keys:
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/streamit
TMDB_API_KEY=your_tmdb_api_key_here
WATCHMODE_API_KEY=your_watchmode_api_key_here
```

Then, install dependencies and run:
```bash
cd server
npm install
node index.js
```
*(The backend runs on `http://localhost:5001`)*

### 3. Frontend Setup (`/client`)
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
*(The frontend runs on `http://localhost:5173` and proxies `/api` calls to the backend)*

---

## 📸 Screenshots

*A cinematic landing page powered by TMDB.*
*Dynamic "Share Stats" generator producing Letterboxd-style profile summaries.*

---

## 🔒 Security
- **API Keys are heavily protected:** All API logic runs on the backend server. The React client never exposes TMDB or Watchmode API keys to the browser, mitigating quota theft.
- **Environment variables are `.gitignored`** so you don't leak secrets when pushing to GitHub.
