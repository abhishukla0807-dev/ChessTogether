# 📖 ByteMate / ChessTogether — Technical Documentation

Welcome to the engineering and architectural documentation for **ByteMate (ChessTogether)**. This directory contains in-depth documentation covering system design, frontend architecture, backend SOLID design, real-time Netty-SocketIO communication, and the multi-phase evolution of the platform.

---

## 📑 Table of Contents

| Document | Description |
|---|---|
| [**01. System Architecture Overview**](./01-architecture-overview.md) | High-level system design, topology, full-stack data flow, and runtime components. |
| [**02. Frontend Design & UI Architecture**](./02-frontend-design.md) | Next.js 16, React 19, Jotai state, 0ms optimistic updates, drag-and-drop mechanics, and SSG Markdown parser. |
| [**03. Backend SOLID Architecture**](./03-backend-solid-architecture.md) | Java 25 & Spring Boot 4.1.1 design, SOLID principles breakdown, repository pattern, and Caffeine caching layer. |
| [**04. Netty-SocketIO Real-Time Engine**](./04-websocket-engine.md) | High-throughput WebSocket architecture, event protocols, room isolation, sequence diagrams, and `<10ms` latency tuning. |
| [**05. Platform Evolution & Phases**](./05-evolution-and-phases.md) | Chronological development roadmap: from monolithic baseline to real-time SOLID architecture, SSG Markdown learn engine, and zero-delay drag & drop. |

---

## 🏛️ Quick Architectural Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                   │
│   Next.js 16 (Turbopack) · React 19 · TypeScript 5.7 · Material UI (MUI v6) │
│   • 0ms Optimistic Drag & Drop Board (react-chessboard + chess.js)          │
│   • Jotai Atoms (Piece Sets, Theme States)                                  │
│   • SSG Markdown Content Engine (640+ Lessons across 3 Pathways)            │
└───────────────────────┬─────────────────────────────┬───────────────────────┘
                        │                             │
             REST API (Port 8080)             WebSocket (Port 9092)
           HTTP JSON Client Sync               Netty-SocketIO Events
                        │                             │
┌───────────────────────▼─────────────────────────────▼───────────────────────┐
│                              BACKEND LAYER                                  │
│         Java 25 · Spring Boot 4.1.1 · Netty-SocketIO · Caffeine Cache       │
│                                                                             │
│   [ Controllers & Handlers ] ──► SessionController, GameSocketHandler       │
│   [ Core Services (SOLID)  ] ──► GameServiceImpl, ChessMoveValidator        │
│   [ Storage & Persistence  ] ──► InMemorySessionRepository (Thread-Safe)   │
│   [ High-Speed Cache Layer ] ──► Caffeine Cache (Active Sessions & Chat)    │
└─────────────────────────────────────────────────────────────────────────────┘
```
