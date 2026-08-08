# 📡 LogPulse — Telemetry & AI Log Analyzer

> **LogPulse** is a cloud-native, full-stack observability and telemetry platform built with **Java 17, Spring Boot 3, PostgreSQL 16, React/Next.js, and Groq LLM**. It streams live system events, intercepts unhandled application exceptions in real time via **Spring AOP**, and provides one-click AI diagnostics to deliver immediate root-cause analyses and actionable remediation steps.

---

## 📸 System Overview & Live Dashboard

![LogPulse Dashboard Preview](./assets/dashboard-preview.jpg)

* **Real-time Active Warning Banners:** Prominently displays live system alerts (e.g., `ACTIVE WARNING: Slow query detected: runtime > 450ms`).
* **Ingestion Metrics:** Live tracking of persisted log counts (**8,200+ logs ingested**) into the PostgreSQL 16 engine.
* **AOP Interception Status:** Indicates active global exception guarding (`Active & Guarding`).
* **Groq AI Diagnosis Panel:** Displays health summaries, root cause diagnoses, and recommended immediate actions based on live stack traces.

### 🔗 Project Resources
* 📱 **Live Application Dashboard:** [log-analyzer-brown.vercel.app](https://log-analyzer-brown.vercel.app/)
* ⚡ **Live API Endpoint:** [logpulse-api.onrender.com/api/logs](https://logpulse-api.onrender.com/api/logs)
* 💻 **GitHub Repository:** [github.com/milind2411/log-analyzer](https://github.com/milind2411/log-analyzer)
* 🏷️ **Current Version:** `v1.0.0`

## 🎯 The Problem & Vision

Debugging microservices in production often involves sifting through thousands of unstructured log lines across cloud environments. Identifying critical failures—such as database pool exhaustion, slow SQL queries, or third-party rate limits—takes valuable incident response time.

**LogPulse** solves this problem by:
1. Standardizing and streaming log ingestion across severity levels (`INFO`, `WARN`, `ERROR`).
2. Automatically intercepting runtime exceptions without invasively polluting business logic.
3. Leveraging high-performance LLM inference (**Groq API**) to translate complex backend stack traces into plain-English root causes and immediate action plans.

---

## 🛠️ Complete Tech Stack & Architecture

### **Backend Framework & Core**
* **Language:** Java 17 (LTS)
* **Framework:** Spring Boot 3.x
* **Persistence Layer:** Spring Data JPA / Hibernate
* **Aspect-Oriented Logic:** Spring AOP (Exception Interception)
* **Connection Management:** HikariCP Connection Pool

### **Database & Search**
* **Engine:** PostgreSQL 16 (Hosted on Render)
* **Optimization:** Custom composite indexing on `timestamp` and `severity` fields

### **Frontend & UI**
* **Framework:** React / Next.js
* **Styling:** Tailwind CSS (Dark-themed dashboard layout)
* **Hosting:** Vercel

### **AI Diagnostics Engine**
* **API:** Groq LLM Inference API (Llama 3 Model)

### **DevOps & Infrastructure**
* **Containerization:** Multi-stage Dockerfile (JRE Alpine runtime)
* **Deployment:** Render Web Service
* **Version Control:** Git / GitHub (`v1.0.0`)
  
  [ Simulated Operations / Background Events ]
                       │
                       ▼
        [ Spring AOP Exception Catch ]
                       │
                       ▼
      [ Spring Data JPA / HikariCP Pool ]
                       │
                       ▼
        [ PostgreSQL 16 DB Instance ]
                       │
                       ▼
       [ REST API / Vercel React UI ]
                       │
                       ▼
     [ Groq LLM Real-Time Error Analysis ]

  1. **Telemetry Ingestion:** Background services emit application events (`INFO`, `WARN`, `ERROR`).
2. **Aspect-Oriented Exception Interception:** Custom `@Aspect` handlers intercept unhandled runtime exceptions globally, format the message payload and stack trace, and prepare telemetry for persistence.
3. **Database Persistence:** Events write to PostgreSQL 16 via Spring Data JPA utilizing HikariCP connection pooling.
4. **Live Visualization:** A responsive React frontend polls REST API endpoints to display log feeds, severity badges, and persistence metrics.
5. **LLM Diagnostic Engine:** One-click AI analysis sends active error payloads to the Groq API, producing an instant **Health Summary**, **Root Cause Diagnosis**, and **Recommended Action Plan**.

---

## 💥 Real-World Engineering & Bottlenecks Solved

Building for `localhost` differs heavily from deploying to cloud infrastructure. During cloud deployment on Render, the system encountered real production bottlenecks under load:

### 1. HikariCP Connection Pool Exhaustion
* **Issue:** Concurrent background writes caused `CannotCreateTransactionException` and `Connection refused on port 5432` errors.
* **Fix:** Reconfigured HikariCP parameters (`maximum-pool-size=10`, `connection-timeout=20000`, `idle-timeout=300000`) to ensure connection reuse and prevent starvation.

### 2. Database Query Bottlenecks
* **Issue:** Log read queries on large telemetry volumes caused execution delays (`>450ms`).
* **Fix:** Created composite JPA indexes across high-frequency lookup columns (`timestamp`, `severity`), cutting query times significantly.

### 3. Third-Party Rate Limit Handlers
* **Issue:** Rapid AI diagnostic triggers caused HTTP `429 Too Many Requests` responses from external APIs.
* **Fix:** Implemented graceful error handling and request throttling logic on the backend.

---

## 💡 Key Use Cases & Applications

* **Production Incident Response:** Converts unhandled exceptions into instant diagnosis reports for faster MTTR (Mean Time to Resolution).
* **Microservice Observability:** Provides centralized log viewing and automated error trapping for Java applications.
* **Developer Staging & Testing:** Offers instant feedback on simulated runtime faults during integration testing.

---

## 🔮 Planned Future Enhancements

* [ ] **Automated Alerting:** Slack, Discord, and Webhook integrations for high-severity `ERROR` spikes.
* [ ] **Distributed Search:** Integration with Elasticsearch / OpenSearch for full-text regex querying.
* [ ] **Metrics & Telemetry Visuals:** Graphical time-series charts tracking memory usage and error velocity over time.
* [ ] **Authentication & Security:** OAuth2 / JWT login for multi-tenant developer access control.

---

## 📄 License & Maintainer

Developed and maintained by **[Milind](https://github.com/milind2411)**.  
Distributed under the MIT License. Contributions and feedback are welcome!

---

## 🏗️ How It Works (System Workflow)
