# 🏦 Vertex Financial - Full-Stack QA Engineering Architecture

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=Playwright&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

## 🎯 Context & Objective

**Vertex Financial** is a fictional fintech environment designed as a **technical proof-of-concept**. 

The goal of this project is not to build a commercial banking app, but to showcase a **QA Architecture** capable of validating financial transactions by controlling the entire stack.

## 💡 The Engineering Vision

Instead of automating a UI against a black box, I built the entire stack (Database, API, and Tests) to demonstrate how a QA Engineer can orchestrate the environment to guarantee data consistency and infrastructure ownership.

## 🛠️ Technical Highlights

### 1. Infrastructure (Docker & Compose)
- **Problem:** Dependency on third parties to provision test databases.
- **Solution:** I created a `docker-compose` architecture that orchestrates a sterile PostgreSQL instance on demand. This ensures every test run starts with a known state, eliminating false positives caused by "dirty data".

### 2. Backend Engineering (Node.js API)
- **Problem:** QA often lacks visibility into backend logic.
- **Solution:** I built a custom REST API (`server.ts`) from scratch using **Express** and **TypeScript**. This demonstrates the ability to read, debug, and contribute to backend code, moving beyond simple black-box testing.

### 3. Data Integrity Validation (The "DbHelper")
- **Problem:** API tests often trust the HTTP 200 OK response without verifying persistence.
- **Solution:** Implemented a **Database Abstraction Layer** using `pg` to perform direct SQL assertions. The tests validate that the transaction was chemically persisted in PostgreSQL, preventing "false success" scenarios.

### 4. CI/CD Pipeline Strategy
- **Problem:** "It works on my machine."
- **Solution:** Configured GitHub Actions to replicate the local Docker infrastructure in the cloud. The pipeline spins up the database service, waits for health checks, and executes the suite in a pristine containerized environment.

---

## 🏗️ Architecture Diagram

The system implements a local micro-environment where the Test Runner (Playwright) validates both the Application Layer (API) and the Data Layer (DB).

```mermaid
graph LR
    subgraph DockerEnv [Dockerized Infrastructure]
        DB[("🐳 PostgreSQL")]
    end

    subgraph AppLayer [Application Layer]
        API["⚡ Node.js Server"]
    end

    subgraph QALayer [QA Layer]
        PW["🎭 Playwright"]
    end

    PW --> |"1. POST /pix"| API
    API --> |"2. INSERT"| DB
    DB --> |"3. COMMIT"| API
    API --> |"4. HTTP 201"| PW
    
    %% Engineering Merit (Dotted Line):
    PW -.-> |"5. SQL Verification"| DB
```
## 📂 Project Structure

The project follows a modular architecture designed for maintainability:

```text
├── tests/              # Playwright Specifications (E2E)
│   └── pix-api.spec.ts # Transaction & Balance Tests
├── utils/
│   └── db-helper.ts    # Database Abstraction Layer (DAL)
├── server.ts           # Node.js Express API (System Under Test)
├── docker-compose.yml  # Infrastructure as Code
└── tsconfig.json       # TypeScript Configuration
```

## ▶️ How to Run 

### 1. Prerequisites

* Node.js (v20+)
* Docker & Docker Compose

### 2. Setup
```bash
npm install
npx playwright install chromium
```

### 3. Start Infrastructure
This command spins up the PostgreSQL container and sets up the schema automatically.
```bash
docker-compose up -d
```
### 4. Run Tests
This will start the Node.js Backend and execute the Playwright test suite.
```bash
# Terminal 1: Start Backend API
npx ts-node server.ts

# Terminal 2: Run Automation
npx playwright test
```





<p align="center"> Built with 💙 by a QA Engineer passionate about automation framework design. </p>