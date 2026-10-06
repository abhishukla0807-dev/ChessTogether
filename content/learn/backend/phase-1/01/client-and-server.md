---
id: "client-and-server"
title: "Client & Server"
readTime: "3 min"
summary: "Client-server architecture is a network model where clients request services or data, and servers process those requests and provide a response."
keyTakeaway: "The client asks, the server processes, and the server responds. Understanding this request-response relationship is the foundation for learning how modern backend systems work."
---

## 1. What Is Client-Server Architecture?

- Client-server architecture is a network model where clients request services or data, and servers process those requests and provide a response.
- Client → Requests a service or resource.
- Server → Processes the request and provides the response.
- Network → Connects the client and server.

```
Client → Request → Server
Client ← Response ← Server
```

## 2. Client

- A client is the system that interacts with the user and sends requests to a server.
- Examples: Web browser, Mobile application, Desktop application, CLI application.
- For example, when you open a website, your browser acts as the client.

## 3. Server

- A server receives client requests, processes them, and returns the required data or service.
- Process application logic and business rules.
- Access databases and manage persistent resources.
- Return structured data or UI assets to clients.
- The client does not need to know how the server internally processes the request.

## 4. How a Request Works

- 1. The client requests a resource.
- 2. DNS resolves the domain to an IP address.
- 3. The client sends an HTTP/HTTPS request.
- 4. The server processes the request.
- 5. The server sends a response.
- 6. The client displays the result.

```
Browser
   ↓
DNS
   ↓
Web Server
   ↓
Application
   ↓
Database
   ↓
Response
   ↓
Browser
```

## 5. Client-Server Architecture Types

- 1-Tier: Client, application logic, and data are on one system.
- 2-Tier: Client communicates directly with the server/database.
- 3-Tier: Presentation → Application → Database.
- N-Tier: Multiple layers are introduced for complex systems, such as authentication, business logic, caching, and data access.

## 6. Real-World Examples

- Web applications → Browser ↔ Web Server
- Mobile applications → Mobile App ↔ Backend API
- Email systems → Email Client ↔ Mail Server
- File services → Client ↔ File Server
- Online games → Game Client ↔ Game Server
