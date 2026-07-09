# 🚀 Codebase Analyzer

A powerful, asynchronous SaaS platform that performs deep static analysis, complexity scoring, duplicate code detection, and secret scanning on public GitHub repositories. 

Built with a scalable message-queue architecture, this tool offloads heavy repository cloning and AST parsing to background workers, ensuring a lightning-fast, non-blocking user experience.

---

## ✨ Features

* **Deep Static Analysis:** Evaluates codebase complexity file-by-file.
* **Security Auditing:** Scans for leaked secrets (e.g., AWS keys, API tokens) and highlights the exact file and line number.
* **Duplicate Code Detection:** Identifies repeated code blocks to help developers refactor and adhere to DRY principles.
* **Tech Stack Recognition:** Automatically detects project dependencies (e.g., Node.js, React, Express) from `package.json`.
* **Asynchronous Processing:** Uses BullMQ and Redis to handle massive repositories in the background without freezing the UI.
* **Smart Polling UI:** The React frontend dynamically polls the server and updates the UI in real-time as the worker progresses.
* **Interactive Dashboards:** Visualizes data using Recharts for complexity graphs and clean Tailwind tables for security audits.
* **Authentication:** Secure JWT-based user authentication, complete with a "1-Click Demo Login" for portfolio showcases.

---

## 🛠️ Tech Stack

**Frontend**
* React.js (Vite)
* Tailwind CSS (v4)
* Recharts (Data Visualization)
* Axios & React Router
* Lucide React (Icons)

**Backend**
* Node.js & Express.js
* MongoDB & Mongoose (Database)
* BullMQ (Message Queue)
* Redis (Broker for BullMQ)
* JSON Web Tokens (Auth)

---

## 🧠 Architecture Flow

1. **User Request:** User submits a GitHub URL via the React Dashboard.
2. **API & Queue:** The Node.js Express server receives the request, instantly drops a job into the Redis-backed BullMQ, and returns a `jobId` to the frontend.
3. **Background Worker:** A separate worker process picks up the job, clones the repo into a temporary folder, parses the ASTs, scans for secrets, and saves the final massive JSON report to MongoDB.
4. **Client Polling:** The React frontend pings a `/status` endpoint every 2 seconds. Once the worker finishes, the UI magically updates to display the full report charts and tables.

---

## 🚀 Local Setup & Installation

### Prerequisites
Make sure you have the following installed on your machine:
* **Node.js** (v18+)
* **MongoDB** (Local instance or MongoDB Atlas URI)
* **Redis** (Must be running locally on port 6379 for the background worker queue)

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/codebase-analyzer.git](https://github.com/your-username/codebase-analyzer.git)
cd codebase-analyzer

Backend Setup

cd backend
npm install

Create a .env file in the backend folder and add your variables:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
Start the backend server and the background worker (in separate terminal windows, or concurrently if configured):
# Terminal 1: Start the Express API
node server.js

3. Frontend Setup

Open a new terminal window:
cd frontend
npm install

Start the Vite development server:
npm run dev

4. Usage
Open your browser to http://localhost:5173.

Click the "1-Click Demo Login" button (or create a new account).

Paste a public GitHub repository URL (e.g., https://github.com/expressjs/express) into the search bar.

Watch the async worker process the code and generate your visual report!

🔒 Security Note
This tool downloads and parses third-party code. Temporary repository files are stored locally during analysis and are designed to be cleaned up after the worker finishes. Do not run this on untrusted infrastructure without proper sandboxing.