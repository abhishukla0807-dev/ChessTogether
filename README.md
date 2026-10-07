# ChessTogether (ByteMate)

**Full-Stack Real-Time Multiplayer Chess, Technical Learning Platform & Careers Portal**

[![Java](https://img.shields.io/badge/Java-21%2B-orange.svg?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.1-6DB33F.svg?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.3-black.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.5-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Netty-SocketIO](https://img.shields.io/badge/Netty--SocketIO-ws%3A%2F%2F9092-00599C.svg?logo=socketdotio&logoColor=white)](https://github.com/mrniko/netty-socketio)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

---

## 🙏 Credits & Attribution

This project is built upon the open-source foundation of **[Chesskit](https://github.com/GuillaumeSD/Chesskit)** created by **[GuillaumeSD](https://github.com/GuillaumeSD)** ([chesskit.org](https://chesskit.org/)).

* **Original Project**: [Chesskit by GuillaumeSD](https://github.com/GuillaumeSD/Chesskit)
* **Original Author**: [GuillaumeSD](https://github.com/GuillaumeSD)
* **Original License**: [GNU Affero General Public License 3.0 (AGPL-3.0)](./COPYING.md)

### What comes from the original Chesskit:
- ♟️ Comprehensive client-side chess analysis board with Stockfish evaluation.
- 🎯 Move classification engine (Brilliant, Great, Good, Inaccuracy, Mistake, Blunder).
- 🔍 Game import and review integration from [Chess.com](https://chess.com) and [Lichess.org](https://lichess.org).
- 🧩 Puzzles and Chess960 support with local browser database caching.
- 🎨 Core board rendering, piece sets, and Material UI component styling.

### What has been built and extended in ChessTogether:
- ⚡ **Spring Boot 4.1.1 & Netty-SocketIO Real-Time Backend**: Authoritative game session management, room orchestration, and persistent `<10ms` WebSocket synchronization.
- 👥 **Live Multiplayer Gameplay**: Optimistic 0ms drag-and-drop gameplay, move broadcasting, and spectator mode.
- 💬 **Ephemeral Real-Time Chat & Matchmaking**: In-memory private room chat and peer discussion matching based on technical fields (Backend, Frontend, DevOps, AI).
- 📚 **Engineering & Chess Learning Platform (`/learn`)**: 640+ interactive lessons across Backend Engineering, DevOps & Cloud, and Chess Strategy dynamically parsed from Git-friendly Markdown.
- 💼 **Tech Careers & Jobs Board (`/jobs`)**: Filterable tech roles with automated Google Sheets lead capture webhook integration.
- ☁️ **Hybrid Cloud Deployment Architecture**: Frontend edge-hosted on **Vercel** + Containerized Backend & Nginx reverse proxy on **AWS EC2 Free Tier (`t3.micro`)** with Let's Encrypt SSL.

---

## 📌 Overview

**ChessTogether** expands the solo analysis capabilities of Chesskit into a collaborative community platform where developers and chess lovers can play live matches, discuss engineering topics, learn structured curriculum, and find tech jobs.

---

## 📚 Detailed Documentation (`docs/`)

For in-depth architectural and design documentation, explore the [`docs/`](./docs) directory:

- 🏛️ [**01. Architecture Overview**](./docs/01-architecture-overview.md) — System topology, component boundaries, and end-to-end data flow.
- 🎨 [**02. Frontend Design**](./docs/02-frontend-design.md) — Next.js 16, React 19, Jotai state, 0ms optimistic updates, and SSG Markdown parser.
- ☕ [**03. Backend SOLID Architecture**](./docs/03-backend-solid-architecture.md) — Java & Spring Boot, SOLID design principles, and Caffeine in-memory caching.
- ⚡ [**04. Netty-SocketIO Real-Time Engine**](./docs/04-websocket-engine.md) — WebSocket architecture, event protocols, room isolation, and `<10ms` latency tuning.
- ☁️ [**05. Vercel Frontend + AWS Backend Deployment Guide**](./docs/vercel-frontend-aws-backend-guide.md) — Complete walkthrough for Free Tier deployment, Nginx proxy, and SSL.

---

## 🚀 Key Features

### 1. ♟️ Real-Time Multiplayer Chess Engine
- **Fluid Drag & Drop & Click-to-Move**: Built with `react-chessboard` & `chess.js` supporting intuitive dragging and accessible touch/click-to-move.
- **0ms Instant Optimistic UI**: Moves update immediately client-side with zero perceived delay paired with authoritative backend validation.
- **Ultra Low-Latency Sync**: Netty-SocketIO broadcast engine running on port `9092` (tunable down to `<10ms` latency).
- **Dynamic Viewport Auto-Scaling**: Responsive layout ensures the board and both player nameplates remain completely visible without scrolling.
- **Smart Square Highlights**: Subtle visual cues for last moves, legal target dots, capture rings, and check alerts.
- **Audio Feedback**: Web Audio playback for moves, captures, checkmates, and invalid move alerts.
- **Room Sharing**: 1-click shareable match links with instant lobby joining.

### 2. 💬 Global & Match Chat with Peer Matchmaking
- **Match Chat**: Private real-time room communication per game session.
- **Ephemeral In-Memory Architecture**: Chat messages are streamed live via WebSockets and are strictly non-persistent (zero disk/database retention for privacy and optimal performance).
- **Technical Topic Discussions**: Filter peers and matchmaking queues by interest (Frontend, Backend, DevOps, AI, Chess Openings).

### 3. 📚 Interactive Engineering & Chess Learn Platform
- **Markdown-Driven Content System (`content/learn/`)**: Complete separation of content and code. All roadmaps, chapters, and subtopics are stored as clean `.md` files with YAML frontmatter.
- **Static Site Generation (SSG)**: Zero runtime overhead via Next.js `getStaticProps` with `gray-matter`.
- **Curated Learning Pathways**:
  - 🛠️ **Backend Engineering**: 5 Phases · 31 Chapters · 169 Lessons.
  - ☁️ **DevOps & Cloud Engineering**: 10 Phases · 25 Chapters · 207 Lessons.
  - ♟️ **Chess Basics & Strategy**: 4 Stages · 14 Chapters · 64 Lessons.

### 4. 💼 Tech Careers & Jobs Board
- **Role Search & Filters**: Filter by field, experience level (Fresher, Mid, Senior), and work mode (Remote, Hybrid, On-site).
- **Google Sheets Lead Webhook**: Instant asynchronous sync of candidate applications directly into Google Sheets.

---

## 🏛️ Architecture & Tech Stack

```
[ Users Worldwide ]
        │
        ├──────────────────────────────┐
        ▼ (HTTPS)                      ▼ (WSS / Secure WebSocket)
 [ Vercel Edge CDN ]            [ AWS EC2 t3.micro ]
  Next.js 16 Frontend             Nginx (Port 80/443 SSL)
        │                                │
        ▼ (API Proxy)                    ├─► Spring Boot (Port 8080)
        └────────────────────────────────┴─► Netty Socket.IO (Port 9092)
```

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (Pages Router, Turbopack, SSG)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**: [Material UI (MUI v6)](https://mui.com/), [Emotion](https://emotion.sh/), [@iconify/react](https://iconify.design/)
- **Chess Engine**: [Stockfish 11 - 18](https://stockfishchess.org/) (Web Worker & WASM)
- **State Management**: [Jotai](https://jotai.org/)
- **Real-Time Client**: [socket.io-client](https://socket.io/)
- **Markdown Parser**: [gray-matter](https://github.com/jonschlinkert/gray-matter)

### Backend
- **Platform**: [Java 21 / Java 25](https://openjdk.org/)
- **Framework**: [Spring Boot 4.1.1](https://spring.io/projects/spring-boot)
- **WebSocket Engine**: [Netty-SocketIO](https://github.com/mrniko/netty-socketio)
- **Caching Layer**: [Caffeine In-Memory Cache](https://github.com/ben-manes/caffeine)
- **Chess Validation**: [chessgame](https://github.com/wolfraam/chessgame)
- **Reverse Proxy**: [Nginx](https://nginx.org/) with Let's Encrypt SSL

---

## ⚡ Quickstart & Local Setup

### Prerequisites
- **Node.js**: `v22.11.0` or higher
- **Java JDK**: `Java 21` or `Java 25`
- **Maven**: `3.9.0` or higher

---

### 1. Start the Backend (Spring Boot + Netty-SocketIO)

```bash
cd backend
mvn spring-boot:run
```

*The backend boots up in ~2s:*
- **REST API**: `http://localhost:8080`
- **Netty-SocketIO Server**: `ws://localhost:9092`

---

### 2. Start the Frontend (Next.js)

In the root directory:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Production Deployment

- **Frontend**: Edge-deployed on [Vercel](https://vercel.com) with automatic HTTPS and instant CI builds.
- **Backend**: Automated Docker deployment on AWS EC2 Free Tier (`t3.micro`) using `deploy-backend.sh` and `docker-compose.backend.yml`.
- See the full deployment guide in [`docs/vercel-frontend-aws-backend-guide.md`](./docs/vercel-frontend-aws-backend-guide.md).

---

## 🧪 Automated Testing

```bash
# Backend unit & integration tests
cd backend && mvn test

# Frontend type checking
npx tsc --noEmit

# Frontend production build validation
npm run build
```

---

## 📄 License & Attribution

This program is free software: you can redistribute it and/or modify it under the terms of the **GNU Affero General Public License** as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

- See [COPYING.md](./COPYING.md) for full license details.
- Special thanks to **[GuillaumeSD](https://github.com/GuillaumeSD)** and all contributors of the original **[Chesskit](https://github.com/GuillaumeSD/Chesskit)** project.
