<div align="center">

# ⚡ Telemetry & AI Log Analyzer

**Enterprise-Grade Real-Time System Telemetry Ingestion & Autonomous LLM Anomaly Diagnostics**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Groq AI](https://img.shields.io/badge/Groq_LLM-F05032?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

<br />

<a href="#-overview">Overview</a> •
<a href="#-key-features">Key Features</a> •
<a href="#-system-architecture">Architecture</a> •
<a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
<a href="#-getting-started">Getting Started</a> •
<a href="#-environment-configuration">Environment Variables</a> •
<a href="#-license">License</a>

</div>

---

## 📖 Overview

**Telemetry & AI Log Analyzer** is a high-throughput, full-stack observability platform designed to intercept system events, record telemetry metrics, and perform automated root-cause diagnostics on application runtime exceptions.

Combining dynamic **Spring AOP aspect interception**, **PostgreSQL 16 persistence**, and **Groq LLM diagnostics**, this application converts unorganized log streams into real-time, actionable engineering insights — surfaced through a dark, glassmorphic command-center dashboard.

---

## ✨ Key Features

| | |
|---|---|
| 📊 **Live Telemetry Stream** | Real-time event monitoring with instant severity classification (`INFO`, `WARN`, `ERROR`), sortable columns, and live search filters. |
| 🤖 **Autonomous AI Diagnostics** | One-click root-cause analysis powered by Groq's high-speed LLM inference engine. |
| ⚡ **Spring AOP Exception Interception** | Non-invasive, aspect-oriented interception of unhandled runtime exceptions and execution performance. |
| 🚨 **Active Alert Detection** | Dynamic banner warnings surfacing memory spikes and resource-consumption events the moment they're ingested. |
| 💎 **Glassmorphic Command Center** | Dark, data-dense UI built with React 18, Vite, Tailwind CSS, and Lucide icons. |
| 🗄️ **Relational Log Persistence** | Structured, indexed log storage optimized for high-volume writes on PostgreSQL 16. |

---

## 📐 System Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                      Client Browser                     │
│               [ React + Vite + Tailwind ]                │
└───────────────────────────┬─────────────────────────────┘
                             │
                             │  HTTPS / REST APIs
                             ▼
┌─────────────────────────────────────────────────────────┐
│               Spring Boot Backend Engine                 │
│ ┌────────────────────────┐   ┌─────────────────────────┐ │
│ │  REST Log Controllers  │   │   Spring AOP Aspect     │ │
│ └────────────┬────────────┘   └────────────┬────────────┘ │
└──────────────┼───────────────────────────────┼─────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────┐    ┌───────────────────────────┐
│      Groq LLM Engine      │    │    PostgreSQL 16 Engine    │
│  (AI Diagnostics Logic)   │    │     (Persistent Logs)      │
└──────────────────────────┘    └───────────────────────────┘
```

---

## 🛠️ Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend UI** | React 18, Vite, Tailwind CSS, Lucide Icons |
| **Frontend Deployment** | Vercel Serverless Hosting |
| **Backend API** | Java 17+, Spring Boot 3.x, Spring Data JPA, Spring AOP |
| **Backend Deployment** | Render / Railway |
| **AI / Machine Learning** | Groq Llama-3 API Inference Engine |
| **Database** | PostgreSQL 16 Relational Engine |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed locally:

- Java Development Kit (**JDK 17+**)
- **Node.js** (v18+) & npm
- **PostgreSQL 16** database
- A **Groq API Key** — get one free at [console.groq.com](https://console.groq.com)

### 1. Database Setup

Create a local database instance named `log_analyzer`:

```sql
CREATE DATABASE log_analyzer;
```

### 2. Backend Setup (Spring Boot)

```bash
# Clone the repository
git clone https://github.com/milind2411/log-analyzer.git
cd log-analyzer

# Configure database credentials and API keys in application.properties
# Location: src/main/resources/application.properties

# Run the backend application
./mvnw spring-boot:run
```

The Spring Boot backend will start on **http://localhost:8080**.

### 3. Frontend Setup (React + Vite)

```bash
# Navigate to the frontend workspace
cd frontend

# Install project dependencies
npm install

# Start the development server
npm run dev
```

The dashboard will be available at **http://localhost:5173**.

---

## 🔒 Environment Configuration

Set the following variables in your production environment (Vercel & Render/Railway):

```env
# ── Backend Environment Variables ──────────────────────────
SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/log_analyzer
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password
GROQ_API_KEY=gsk_your_groq_api_key_here

# ── Frontend Environment Variables (.env.production) ───────
VITE_API_BASE_URL=https://your-backend-api-url.onrender.com/api
```

> **Security note:** `GROQ_API_KEY` must only ever live in the backend environment. Never expose it in frontend code, `.env` files committed to Git, or client-side network requests.

---

## 🗺️ Roadmap

- [ ] Cross-dataset filtering & sorting (server-side query params)
- [ ] Role-based access control for the dashboard
- [ ] Configurable alert thresholds (CPU, memory, error rate)
- [ ] Exportable diagnostic reports (PDF/CSV)

---

## 🤝 Contributing

Contributions are welcome. Please open an issue to discuss significant changes before submitting a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

<div align="center">

Built with ☕ and Spring AOP by [milind2411](https://github.com/milind2411)

</div>
