export interface BackendSubTopic {
  id: string;
  title: string;
  readTime: string;
  summary: string;
  sections: {
    heading: string;
    bullets: string[];
    code?: string;
  }[];
  keyTakeaway: string;
}

export interface BackendChapter {
  id: string;
  num: string;
  title: string;
  subtopics: BackendSubTopic[];
}

export interface BackendPhase {
  id: string;
  phaseNum: string;
  title: string;
  description: string;
  chapters: BackendChapter[];
}

export const BACKEND_PHASES: BackendPhase[] = [
  // ── PHASE 1 · FUNDAMENTALS ───────────────────────────────────────────
  {
    id: "phase-1",
    phaseNum: "PHASE 1",
    title: "FUNDAMENTALS",
    description: "Core concepts of web architecture, request lifecycle, protocols, and data modeling.",
    chapters: [
      {
        id: "01",
        num: "01",
        title: "Backend Systems",
        subtopics: [
          {
            id: "client-and-server",
            title: "Client & Server",
            readTime: "3 min",
            summary: "Client-server architecture is a network model where clients request services or data, and servers process those requests and provide a response.",
            sections: [
              {
                heading: "1. What Is Client-Server Architecture?",
                bullets: [
                  "Client-server architecture is a network model where clients request services or data, and servers process those requests and provide a response.",
                  "Client → Requests a service or resource.",
                  "Server → Processes the request and provides the response.",
                  "Network → Connects the client and server.",
                ],
                code: "Client → Request → Server\nClient ← Response ← Server",
              },
              {
                heading: "2. Client",
                bullets: [
                  "A client is the system that interacts with the user and sends requests to a server.",
                  "Examples: Web browser, Mobile application, Desktop application, CLI application.",
                  "For example, when you open a website, your browser acts as the client.",
                ],
              },
              {
                heading: "3. Server",
                bullets: [
                  "A server receives client requests, processes them, and returns the required data or service.",
                  "Process application logic and business rules.",
                  "Access databases and manage persistent resources.",
                  "Return structured data or UI assets to clients.",
                  "The client does not need to know how the server internally processes the request.",
                ],
              },
              {
                heading: "4. How a Request Works",
                bullets: [
                  "1. The client requests a resource.",
                  "2. DNS resolves the domain to an IP address.",
                  "3. The client sends an HTTP/HTTPS request.",
                  "4. The server processes the request.",
                  "5. The server sends a response.",
                  "6. The client displays the result.",
                ],
                code: "Browser\n   ↓\nDNS\n   ↓\nWeb Server\n   ↓\nApplication\n   ↓\nDatabase\n   ↓\nResponse\n   ↓\nBrowser",
              },
              {
                heading: "5. Client-Server Architecture Types",
                bullets: [
                  "1-Tier: Client, application logic, and data are on one system.",
                  "2-Tier: Client communicates directly with the server/database.",
                  "3-Tier: Presentation → Application → Database.",
                  "N-Tier: Multiple layers are introduced for complex systems, such as authentication, business logic, caching, and data access.",
                ],
              },
              {
                heading: "6. Real-World Examples",
                bullets: [
                  "Web applications → Browser ↔ Web Server",
                  "Mobile applications → Mobile App ↔ Backend API",
                  "Email systems → Email Client ↔ Mail Server",
                  "File services → Client ↔ File Server",
                  "Online games → Game Client ↔ Game Server",
                ],
              },
            ],
            keyTakeaway: "The client asks, the server processes, and the server responds. Understanding this request-response relationship is the foundation for learning how modern backend systems work.",
          },
          { id: "request-flow", title: "Request Flow", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "web-and-app-servers", title: "Web & App Servers", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "databases-and-cache", title: "Databases & Cache", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "monolith-vs-microservices", title: "Monolith vs Microservices", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "02",
        num: "02",
        title: "HTTP Protocol",
        subtopics: [
          { id: "http-request-and-response", title: "HTTP Request & Response", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "http-methods", title: "HTTP Methods", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "status-codes", title: "Status Codes", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "headers", title: "Headers", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "http-versions", title: "HTTP Versions", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "https-and-tls", title: "HTTPS & TLS", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "03",
        num: "03",
        title: "Routing",
        subtopics: [
          { id: "routes-and-handlers", title: "Routes & Handlers", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "static-routes", title: "Static Routes", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "dynamic-routes", title: "Dynamic Routes", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "query-parameters", title: "Query Parameters", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "route-organization", title: "Route Organization", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "04",
        num: "04",
        title: "Serialization",
        subtopics: [
          { id: "serialization", title: "Serialization", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "deserialization", title: "Deserialization", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "json-and-xml", title: "JSON & XML", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "binary-formats", title: "Binary Formats", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "schema-evolution", title: "Schema Evolution", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "05",
        num: "05",
        title: "Authentication & Authorization",
        subtopics: [
          { id: "auth-vs-authz", title: "Authentication vs Authorization", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "sessions", title: "Sessions", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "jwt", title: "JWT", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "oauth-and-oidc", title: "OAuth 2.0 & OIDC", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "rbac-and-permissions", title: "RBAC & Permissions", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "06",
        num: "06",
        title: "Validation & Transformation",
        subtopics: [
          { id: "input-validation", title: "Input Validation", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "type-and-format-validation", title: "Type & Format Validation", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "business-validation", title: "Business Validation", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "sanitization", title: "Sanitization", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "data-transformation", title: "Data Transformation", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "07",
        num: "07",
        title: "Middleware",
        subtopics: [
          { id: "middleware-pipeline", title: "Middleware Pipeline", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "auth-middleware", title: "Authentication", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "logging", title: "Logging", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "cors", title: "CORS", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "rate-limiting", title: "Rate Limiting", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "error-middleware", title: "Error Middleware", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "08",
        num: "08",
        title: "Request Context",
        subtopics: [
          { id: "request-scoped-data", title: "Request-Scoped Data", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "request-id", title: "Request ID", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "user-context", title: "User Context", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "trace-context", title: "Trace Context", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "cancellation-and-deadlines", title: "Cancellation & Deadlines", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "09",
        num: "09",
        title: "Handlers & Controllers",
        subtopics: [
          { id: "request-handling", title: "Request Handling", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "controllers", title: "Controllers", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "service-calls", title: "Service Calls", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "response-mapping", title: "Response Mapping", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "thin-controllers", title: "Thin Controllers", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "10",
        num: "10",
        title: "CRUD",
        subtopics: [
          { id: "create", title: "Create", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "read", title: "Read", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "update", title: "Update", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "delete", title: "Delete", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "put-vs-patch", title: "PUT vs PATCH", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
    ],
  },

  // ── PHASE 2 · API & DATA ─────────────────────────────────────────────
  {
    id: "phase-2",
    phaseNum: "PHASE 2",
    title: "API & DATA",
    description: "RESTful API design, database modeling, business logic layers, caching, and search systems.",
    chapters: [
      {
        id: "11",
        num: "11",
        title: "REST API Design",
        subtopics: [
          { id: "resource-design", title: "Resource Design", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "rest-http-methods", title: "HTTP Methods", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "api-versioning", title: "API Versioning", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "pagination", title: "Pagination", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "filtering-and-sorting", title: "Filtering & Sorting", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "error-responses", title: "Error Responses", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "12",
        num: "12",
        title: "Databases",
        subtopics: [
          { id: "sql-fundamentals", title: "SQL Fundamentals", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "relationships-and-joins", title: "Relationships & Joins", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "indexing", title: "Indexing", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "transactions", title: "Transactions", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "nosql", title: "NoSQL", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "database-scaling", title: "Database Scaling", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "13",
        num: "13",
        title: "Business Logic",
        subtopics: [
          { id: "service-layer", title: "Service Layer", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "business-rules", title: "Business Rules", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "domain-models", title: "Domain Models", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "logic-transactions", title: "Transactions", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "clean-architecture", title: "Clean Architecture", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "14",
        num: "14",
        title: "Caching",
        subtopics: [
          { id: "why-caching", title: "Why Caching", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "cache-aside", title: "Cache-Aside", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "write-through", title: "Write-Through", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "cache-invalidation", title: "Cache Invalidation", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "redis", title: "Redis", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "cache-problems", title: "Cache Problems", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "15",
        num: "15",
        title: "Transactional Emails",
        subtopics: [
          { id: "email-types", title: "Email Types", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "email-providers", title: "Email Providers", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "templates", title: "Templates", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "background-sending", title: "Background Sending", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "delivery-and-retry", title: "Delivery & Retry", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "16",
        num: "16",
        title: "Task Queues & Scheduling",
        subtopics: [
          { id: "queues-and-workers", title: "Queues & Workers", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "producers-and-consumers", title: "Producers & Consumers", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "retries", title: "Retries", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "dead-letter-queues", title: "Dead Letter Queues", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "scheduled-jobs", title: "Scheduled Jobs", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "backpressure", title: "Backpressure", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "17",
        num: "17",
        title: "Elasticsearch",
        subtopics: [
          { id: "index-and-documents", title: "Index & Documents", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "inverted-index", title: "Inverted Index", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "mapping", title: "Mapping", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "query-dsl", title: "Query DSL", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "aggregations", title: "Aggregations", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "database-synchronization", title: "Database Synchronization", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
    ],
  },

  // ── PHASE 3 · RELIABILITY & SECURITY ─────────────────────────────────
  {
    id: "phase-3",
    phaseNum: "PHASE 3",
    title: "RELIABILITY & SECURITY",
    description: "Production fault tolerance, application configuration, telemetry, and security defense in depth.",
    chapters: [
      {
        id: "18",
        num: "18",
        title: "Error Handling",
        subtopics: [
          { id: "error-types", title: "Error Types", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "http-error-mapping", title: "HTTP Error Mapping", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "global-error-handling", title: "Global Error Handling", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "retry-strategies", title: "Retry Strategies", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "circuit-breakers", title: "Circuit Breakers", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "19",
        num: "19",
        title: "Configuration",
        subtopics: [
          { id: "environment-variables", title: "Environment Variables", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "configuration-files", title: "Configuration Files", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "secrets", title: "Secrets", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "environment-separation", title: "Environment Separation", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "feature-flags", title: "Feature Flags", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "20",
        num: "20",
        title: "Observability",
        subtopics: [
          { id: "logging-observability", title: "Logging", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "metrics", title: "Metrics", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "distributed-tracing", title: "Distributed Tracing", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "health-checks", title: "Health Checks", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "alerts-and-slos", title: "Alerts & SLOs", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "21",
        num: "21",
        title: "Graceful Shutdown",
        subtopics: [
          { id: "shutdown-signals", title: "Shutdown Signals", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "stop-new-requests", title: "Stop New Requests", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "complete-in-flight-requests", title: "Complete In-Flight Requests", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "resource-cleanup", title: "Resource Cleanup", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "shutdown-timeouts", title: "Shutdown Timeouts", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "22",
        num: "22",
        title: "Security",
        subtopics: [
          { id: "owasp-top-10", title: "OWASP Top 10", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "injection-prevention", title: "Injection Prevention", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "https-and-tls-security", title: "HTTPS & TLS", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "rate-limiting-security", title: "Rate Limiting", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "security-headers", title: "Security Headers", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "dependency-security", title: "Dependency Security", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
    ],
  },

  // ── PHASE 4 · ADVANCED BACKEND ───────────────────────────────────────
  {
    id: "phase-4",
    phaseNum: "PHASE 4",
    title: "ADVANCED BACKEND",
    description: "High-scale engineering, concurrency models, S3 object storage, WebSockets, and test automation.",
    chapters: [
      {
        id: "23",
        num: "23",
        title: "Scaling & Performance",
        subtopics: [
          { id: "vertical-vs-horizontal-scaling", title: "Vertical vs Horizontal Scaling", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "load-balancing", title: "Load Balancing", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "database-scaling-adv", title: "Database Scaling", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "cdn-and-edge", title: "CDN & Edge", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "profiling", title: "Profiling", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "capacity-planning", title: "Capacity Planning", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "24",
        num: "24",
        title: "Concurrency & Parallelism",
        subtopics: [
          { id: "concurrency-vs-parallelism", title: "Concurrency vs Parallelism", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "threads-and-processes", title: "Threads & Processes", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "async-programming", title: "Async Programming", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "race-conditions", title: "Race Conditions", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "locks-and-synchronization", title: "Locks & Synchronization", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "backpressure-concurrency", title: "Backpressure", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "25",
        num: "25",
        title: "Object Storage",
        subtopics: [
          { id: "object-storage-concepts", title: "Object Storage Concepts", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "buckets-and-objects", title: "Buckets & Objects", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "presigned-urls", title: "Presigned URLs", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "multipart-upload", title: "Multipart Upload", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "file-processing", title: "File Processing", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "26",
        num: "26",
        title: "Real-Time Systems",
        subtopics: [
          { id: "websockets", title: "WebSockets", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "server-sent-events", title: "Server-Sent Events", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "long-polling", title: "Long Polling", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "pub-sub", title: "Pub/Sub", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "presence", title: "Presence", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "real-time-scaling", title: "Real-Time Scaling", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "27",
        num: "27",
        title: "Testing",
        subtopics: [
          { id: "unit-testing", title: "Unit Testing", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "integration-testing", title: "Integration Testing", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "end-to-end-testing", title: "End-to-End Testing", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "test-doubles", title: "Test Doubles", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "api-testing", title: "API Testing", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "ci-testing", title: "CI Testing", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
    ],
  },

  // ── PHASE 5 · STANDARDS & DEVOPS ─────────────────────────────────────
  {
    id: "phase-5",
    phaseNum: "PHASE 5",
    title: "STANDARDS & DEVOPS",
    description: "Industry architectural standards, OpenAPI specs, webhook reliability, and modern containerized CI/CD.",
    chapters: [
      {
        id: "28",
        num: "28",
        title: "12-Factor App",
        subtopics: [
          { id: "codebase", title: "Codebase", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "dependencies", title: "Dependencies", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "configuration-12factor", title: "Configuration", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "backing-services", title: "Backing Services", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "stateless-processes", title: "Stateless Processes", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "dev-prod-parity", title: "Dev/Prod Parity", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "29",
        num: "29",
        title: "OpenAPI",
        subtopics: [
          { id: "openapi-specification", title: "OpenAPI Specification", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "paths-and-operations", title: "Paths & Operations", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "schemas", title: "Schemas", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "openapi-authentication", title: "Authentication", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "api-documentation", title: "API Documentation", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "30",
        num: "30",
        title: "Webhooks",
        subtopics: [
          { id: "webhook-fundamentals", title: "Webhook Fundamentals", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "event-payloads", title: "Event Payloads", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "signature-verification", title: "Signature Verification", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "idempotency", title: "Idempotency", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "retry-and-delivery", title: "Retry & Delivery", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
      {
        id: "31",
        num: "31",
        title: "DevOps",
        subtopics: [
          { id: "git-and-code-review", title: "Git & Code Review", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "ci-cd", title: "CI/CD", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "docker", title: "Docker", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "kubernetes", title: "Kubernetes", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "infrastructure-as-code", title: "Infrastructure as Code", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
          { id: "deployment-strategies", title: "Deployment Strategies", readTime: "—", summary: "", sections: [], keyTakeaway: "" },
        ],
      },
    ],
  },
];
