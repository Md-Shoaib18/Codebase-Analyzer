# 🚀 Codebase Analyzer

A powerful, asynchronous SaaS platform that performs deep static analysis, complexity scoring, duplicate code detection, and secret scanning on public GitHub repositories.

**🔴 Live Demo:** [https://codebase-analyzer-five.vercel.app](https://codebase-analyzer-five.vercel.app) *(Features a "1-Click Demo Login" so you can test the platform instantly!)*

---

## ✨ Features

* **Deep Static Analysis:** Evaluates codebase complexity file-by-file.
* **Security Auditing:** Scans for leaked secrets (e.g., AWS keys, API tokens) and highlights the exact file and line number.
* **Duplicate Code Detection:** Identifies repeated code blocks to help developers refactor and adhere to DRY principles.
* **Tech Stack Recognition:** Automatically detects project dependencies (e.g., Node.js, React, Express) from `package.json`.
* **Asynchronous Processing:** Uses BullMQ and Redis to handle massive repositories in the background without freezing the UI.
* **Smart Polling UI:** The React frontend dynamically polls the server and updates the UI in real-time as the worker progresses.
* **Interactive Dashboards:** Visualizes data using Recharts for complexity graphs and clean Tailwind tables for security audits.

---

## 🛠️ Tech Stack & Production Architecture

This project is built as a **Monorepo** and deployed across a modern serverless stack:

* **Frontend:** React.js (Vite), Tailwind CSS, Recharts — Hosted on **Vercel**
* **Backend API & Worker:** Node.js, Express, BullMQ — Hosted on **Render.com**
* **Message Broker:** Redis — Hosted on **Upstash** (Serverless Cloud Redis)
* **Database:** MongoDB & Mongoose — Hosted on **MongoDB Atlas**

---

## 🧠 How It Works (The Async Flow)

1. **User Request:** User submits a GitHub URL via the React Dashboard.
2. **API & Queue:** The Express server receives the request, instantly drops a job into the Upstash Redis queue, and returns a `jobId` to the frontend.
3. **Background Worker:** A background worker process picks up the job, clones the repo, parses the ASTs, scans for secrets, and saves the final JSON report to MongoDB.
4. **Client Polling:** The React frontend pings a `/status` endpoint every 2 seconds. Once the worker finishes, the UI magically updates to display the full report charts and tables.

---

## 🚀 Local Setup & Installation

### Prerequisites

Make sure you have Node.js (v18+) installed. You will also need a free MongoDB Atlas URI and an Upstash Redis URL.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/codebase-analyzer.git
cd codebase-analyzer
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder and add your variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
REDIS_URL=rediss://default:YourPassword@your-upstash-url.upstash.io:6379
```

Start the backend server (this spins up both the Express API and the BullMQ worker):

```bash
node server.js
```

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:

```bash
npm run dev
```

### 4. Usage

1. Open your browser to `http://localhost:5173`.
2. Click the "1-Click Demo Login" button (or create a new account).
3. Paste a public GitHub repository URL (e.g., `https://github.com/expressjs/express`) into the search bar.
4. Watch the async worker process the code and generate your visual report!

---

## 🔒 Security Note

This tool downloads and parses third-party code. Temporary repository files are stored locally during analysis and are automatically cleaned up after the worker finishes. Do not run this on untrusted infrastructure without proper sandboxing.

---

## 👨‍💻 Author

Built by [Your Name] - [Your LinkedIn Profile URL]
