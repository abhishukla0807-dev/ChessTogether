<div align="center">
  <img width="100" height="100" src="public/android-chrome-192x192.png" alt="ByteMate / ChessTogether Logo" style="border-radius: 20px;">

  # ♟️ ByteMate / ChessTogether

  **High-Throughput Full-Stack Real-Time Chess, Engineering Education & Careers Platform**

  [![Java](https://img.shields.io/badge/Java-25-orange.svg?logo=openjdk&logoColor=white)](https://openjdk.org/)
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.1-6DB33F.svg?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
  [![Next.js](https://img.shields.io/badge/Next.js-16.2.3-black.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2.5-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Netty-SocketIO](https://img.shields.io/badge/Netty--SocketIO-ws%3A%2F%2F9092-00599C.svg?logo=socketdotio&logoColor=white)](https://github.com/mrniko/netty-socketio)
  [![Caffeine](https://img.shields.io/badge/Caffeine-Cache-red.svg)](https://github.com/ben-manes/caffeine)

</div>

---

## 📌 Overview

**ByteMate (ChessTogether)** is a production-grade, full-stack real-time platform combining:
1. ♟️ **Real-Time Multiplayer Chess**: 0ms optimistic latency drag-and-drop chess powered by a high-throughput **Netty-SocketIO** engine and **Java 25 / Spring Boot** backend.
2. 💬 **Global & Match Chat**: Real-time room-based match chat and global community lobby with custom role badges and sound effects.
3. 📚 **Technical Learning Platform**: 640+ curated interactive lessons across **Backend Engineering**, **DevOps & Cloud**, and **Chess Strategy**, loaded dynamically from a Git-friendly Markdown (`.md`) system via Next.js SSG.
4. 💼 **Tech Careers & Jobs Portal**: Searchable, categorized tech job board with filters for experience, salary, skills, and work modes.

---

## 📚 Detailed Documentation (`docs/`)

For in-depth architectural and design documentation, explore the [`docs/`](./docs) directory:

- 🏛️ [**01. Architecture Overview**](./docs/01-architecture-overview.md) — System topology, component boundaries, and end-to-end data flow.
- 🎨 [**02. Frontend Design**](./docs/02-frontend-design.md) — Next.js 16, React 19, Jotai state, 0ms optimistic updates, drag-and-drop, and SSG Markdown parser.
- ☕ [**03. Backend SOLID Architecture**](./docs/03-backend-solid-architecture.md) — Java 25 & Spring Boot 4.1.1, SOLID design principles, Caffeine in-memory caching, and testing suite.
- ⚡ [**04. Netty-SocketIO Real-Time Engine**](./docs/04-websocket-engine.md) — WebSocket architecture, event protocols, room isolation, sequence diagrams, and `<10ms` latency tuning.
- 🛣️ [**05. Platform Evolution & Phases**](./docs/05-evolution-and-phases.md) — Chronological 5-phase development roadmap and engineering milestones.

---

## 🚀 Key Features

### 1. ♟️ Real-Time Multiplayer Chess Engine
- **Fluid Drag & Drop & Click-to-Move**: Built with `react-chessboard` & `chess.js` supporting both intuitive piece dragging and accessible touch/click-to-move.
- **0ms Instant Optimistic UI**: Moves update immediately client-side with zero perceivable delay, paired with client-side move validation.
- **Ultra Low-Latency Sync**: Netty-SocketIO broadcast engine (`<10ms` latency) running on port `9092`.
- **Dynamic Viewport Auto-Scaling**: Responsive layout ensures the board and both player nameplates remain completely visible without scrolling on mobile and desktop viewports.
- **Smart Square Highlights**: Subtle visual cues for last moves, legal target dots, capture rings, and radial red check alerts.
- **Audio Feedback**: Custom Web Audio playback for moves, captures, checkmates, and invalid move alerts.
- **Room Sharing**: 1-click shareable match links with instant lobby joining.

### 2. 💬 Global & Match Chat System
- **Match Chat**: Private real-time room communication per game session.
- **Global Community Chat**: Live public chat with player roles (`Admin`, `Grandmaster`, `Master`, `Pro`, `Player`, `Spectator`).
- **Caffeine In-Memory Caching**: Low-latency message snapshotting and fast eviction handling on the Spring Boot backend.
- **Sound & Polish**: Audio notifications, emoji support, message timestamps, and auto-scrolling message streams.

### 3. 📚 Interactive Engineering & Chess Learn Platform
- **Markdown-Driven Content System (`content/learn/`)**: Complete separation of content and code. All roadmaps, chapters, and subtopics are stored as clean `.md` files with YAML frontmatter.
- **Static Site Generation (SSG)**: Zero runtime overhead via Next.js `getStaticProps` with `gray-matter`.
- **Curated Learning Pathways**:
  - 🛠️ **Backend Engineering**: 5 Phases · 31 Chapters · 169 Lessons (Architecture, Databases, APIs, Distributed Systems, Reliability).
  - ☁️ **DevOps & Cloud Engineering**: 10 Phases · 25 Chapters · 207 Lessons (Git, Linux, Docker, K8s, Terraform, CI/CD, SRE, Observability).
  - ♟️ **Chess Basics & Strategy**: 4 Stages · 14 Chapters · 64 Lessons (Tactics, Openings, Endgames, Positional Play).
- **Rich Reader Interface**: Collapsible sidebar, progress trackers, code snippet syntax styling, bullet highlights, and key takeaway summaries.

### 4. 💼 Tech Careers & Jobs Board
- **Role Search & Filters**: Filter by field (Backend, DevOps, Data Science, AI/ML, Cloud), experience level (Fresher, Mid, Senior), and work mode (Remote, Hybrid, On-site).
- **Direct Application Links**: Detailed salary brackets, job descriptions, required skill tags, and company application portals.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 16.2.3](https://nextjs.org/) (Pages Router, SSG, Turbopack)
- **Library**: [React 19.2.5](https://react.dev/)
- **Language**: [TypeScript 5.7.2](https://www.typescriptlang.org/)
- **UI & Styling**: [Material UI (MUI v6)](https://mui.com/), [Emotion](https://emotion.sh/), [@iconify/react](https://iconify.design/)
- **State Management**: [Jotai](https://jotai.org/)
- **Chess Logic & Rendering**: [react-chessboard](https://www.npmjs.com/package/react-chessboard), [chess.js](https://github.com/jhlywa/chess.js)
- **Real-Time Client**: [socket.io-client](https://socket.io/)
- **Markdown Parser**: [gray-matter](https://github.com/jonschlinkert/gray-matter)

### Backend
- **Platform**: [Java 25](https://openjdk.org/)
- **Framework**: [Spring Boot 4.1.1](https://spring.io/projects/spring-boot)
- **Real-Time Socket Engine**: [Netty-SocketIO 2.0.12](https://github.com/mrniko/netty-socketio)
- **Caching Layer**: [Caffeine In-Memory Cache](https://github.com/ben-manes/caffeine)
- **Chess Game Engine**: [chessgame 2.0.1](https://github.com/wolfraam/chessgame)
- **Build Tool**: [Apache Maven](https://maven.apache.org/)

---

## ⚡ Quickstart & Local Setup

### Prerequisites
- **Node.js**: `v22.11.0` or higher
- **Java JDK**: `Java 25` (or Java 21+)
- **Maven**: `3.9.0` or higher

---

### 1. Start the Backend (Spring Boot + Netty-SocketIO)

```bash
cd backend
mvn spring-boot:run
```

*The backend boots up in ~1.5s:*
- **REST API**: `http://localhost:8080`
- **Netty-SocketIO Server**: `ws://localhost:9092`

---

### 2. Start the Frontend (Next.js)

In the root directory:

```bash
npm install
npm run dev
```

*The frontend is ready at:*
- **Web App**: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Automated Testing

```bash
# Backend unit & integration tests (13/13 passing)
cd backend && mvn test

# Frontend type checking
npx tsc --noEmit

# Frontend production build validation
npm run build
```

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.
