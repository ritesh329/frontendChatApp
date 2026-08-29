# ConnectAI Chat App — React Version

Yeh aapke original HTML/vanilla-JS chat app ka React (Vite) conversion hai.
**Logic bilkul same rakha gaya hai** — sirf DOM manipulation (`el()`, `render()`) ki jagah React components aur hooks (`useState`, `useRef`, `useEffect`) use kiye hain. Saare API endpoints, socket events, aur payload shapes original ke exact same hain.

## Folder structure

```
react-chat-app/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx          # entry point
│   ├── App.jsx           # top-level state + all API/socket logic
│   ├── api.js            # axios instance + API_BASE/SOCKET_URL config
│   ├── helpers.js         # truncate, formatTime, formatFileSize, getId
│   ├── index.css          # original styles, unchanged
│   └── components/
│       ├── AuthScreen.jsx
│       ├── Sidebar.jsx
│       ├── ChatPanel.jsx
│       ├── MessageItem.jsx
│       ├── NewChatModal.jsx
│       └── Avatar.jsx
```

## Run karne ke liye

```bash
npm install
npm run dev
```

App `http://localhost:5173` par khulega.

## Backend config

`src/api.js` ke top par yeh do lines hain — agar aapka backend kisi aur port/path par hai to inhe update kar dein:

```js
export const API_BASE = 'http://localhost:3000/api';
export const SOCKET_URL = 'http://localhost:3000';
```

## Kya same rakha gaya

- Saare API calls (`/auth/login`, `/auth/register`, `/chat/personal`, `/group`, `/upload/single`, `/ai/personal`, etc.) same paths/payloads ke sath.
- Saare socket events (`personal-message`, `group-message`, `receive-message`, `message-edited`, `message-deleted`, `message-read`, `typing-start/stop`, `group-typing`, `mark-read`, `ai-response`, `join-group`) same names/payloads ke sath.
- File upload flow (50MB limit, FormData, socket emit after upload) same.
- AI tab, AI mode toggle for groups — same behavior.
- LocalStorage keys (`chat_token`, `chat_me`) same.
- CSS/UI bilkul same look & feel.

Build test bhi pass ho chuka hai (`npm run build`), koi syntax/import error nahi hai.
