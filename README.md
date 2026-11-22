# MERN Stack Blog Application with Docker, Compose, CI/CD & Cloud Run

**Course:** Web Application Projects with React (CSE 3395)  
**Academic Year:** 2026–2027 | B.Tech CSIT – 5th Semester  
**Assignment 4:** Containerization, Cloud Deployment, and CI/CD Automation of a MERN Stack Blog Application  

---

## 📋 Table of Contents
1. [Project Overview & Architecture](#-project-overview--architecture)
2. [Folder Structure](#-folder-structure)
3. [Question 1: Docker Containerization](#1-docker-containerization)
4. [Question 2: Docker Compose Configuration](#2-docker-compose-configuration)
5. [Question 3: Cloud Deployment (MongoDB Atlas & Google Cloud Run)](#3-cloud-deployment)
6. [Question 4: Continuous Integration (CI)](#4-continuous-integration-ci)
7. [Question 5: Continuous Delivery / Deployment (CD)](#5-continuous-delivery--deployment-cd)
8. [Submission Checklist & Screenshots Guide](#-submission-checklist--screenshots-guide)
9. [Comprehensive Deployment Report & Demonstration Notes](#-comprehensive-deployment-report--demonstration-notes)

---

## 🏗 Project Overview & Architecture

This enterprise-grade application is a full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** Blog Application integrated with **TanStack Query (React Query v5)** for optimistic UI updates, automated caching, and efficient server-state management.

```
       +-------------------------------------------------------------+
       |                      USER / BROWSER                         |
       +-------------------------------------------------------------+
                                      |
                      HTTP Port 3000  | (or Cloud Run HTTPS)
                                      v
       +-------------------------------------------------------------+
       |                    FRONTEND CONTAINER                       |
       |  - React 18 + Vite (SPA)                                    |
       |  - TanStack Query v5 (Data Fetching & Cache Management)     |
       |  - Nginx 1.25 Alpine (Web Server & Reverse Proxy)           |
       +-------------------------------------------------------------+
                                      |
                      /api/ reverse proxy | Port 5000
                                      v
       +-------------------------------------------------------------+
       |                     BACKEND CONTAINER                       |
       |  - Node.js 18 + Express REST API                            |
       |  - Mongoose ODM Models                                      |
       |  - Healthcheck Endpoint (/health)                           |
       +-------------------------------------------------------------+
                                      |
                      MongoDB Protocol | Port 27017
                                      v
       +-------------------------------------------------------------+
       |               DATABASE CONTAINER / ATLAS                    |
       |  - Local: MongoDB 6.0 Engine + Named Volume (mongo_data)     |
       |  - Cloud: MongoDB Atlas Managed Cluster                     |
       +-------------------------------------------------------------+
```

---

## 📁 Folder Structure

```
Asset_Tracker - Copy/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Question 4: Automated CI Pipeline (Lint + Test)
│       └── cd.yml                 # Question 5: Automated CD Pipeline (Docker Hub + Cloud Run)
├── backend/
│   ├── models/
│   │   └── Post.js               # Mongoose Post Model
│   ├── routes/
│   │   └── postRoutes.js         # RESTful API Endpoints (CRUD)
│   ├── tests/
│   │   └── post.test.js          # Jest + Supertest Automated Tests
│   ├── .dockerignore             # Docker build exclusions
│   ├── .env                      # Local environment configuration
│   ├── .env.example              # Template environment variables
│   ├── .eslintrc.json            # ESLint code standard rules
│   ├── Dockerfile                # Production multi-stage backend container
│   ├── package.json              # Backend dependencies & test scripts
│   └── server.js                 # Express server & DB connection
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation header
│   │   │   └── PostCard.jsx      # Card component with image, tags, metadata
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Post feed with TanStack Query caching
│   │   │   ├── PostDetails.jsx   # Article view with delete & edit buttons
│   │   │   ├── CreatePost.jsx    # Mutation-driven post creation
│   │   │   └── EditPost.jsx      # Mutation-driven post updating
│   │   ├── api.js                # TanStack query functions & Axios client
│   │   ├── App.jsx               # Application router & layout
│   │   ├── App.css               # Clean responsive styling
│   │   └── main.jsx              # React DOM root with QueryClientProvider
│   ├── .dockerignore             # Docker build exclusions
│   ├── .env                      # Vite environment variables
│   ├── .eslintrc.json            # Frontend lint rules
│   ├── Dockerfile                # Multi-stage container (Node builder -> Nginx)
│   ├── index.html                # Entry HTML
│   ├── nginx.conf                # Nginx reverse proxy configuration
│   ├── package.json              # React dependencies (TanStack Query, Vite)
│   └── vite.config.js            # Vite build configuration
├── docker-compose.yml            # Question 2: Multi-container orchestration
├── .gitignore                    # Git version control exclusions
└── README.md                     # Complete project documentation & guide
```

---

## 1. Docker Containerization

### A. Backend Dockerfile (`backend/Dockerfile`)
The backend image uses a minimal Node.js Alpine base image, installs production dependencies (`npm ci --only=production`), copies application code, defines a Docker health check against `/health`, and exposes port 5000.

```bash
# Build backend image manually
cd backend
docker build -t mern-blog-backend:latest .

# Run standalone backend container
docker run -d -p 5000:5000 --name backend-container mern-blog-backend:latest
```

### B. Frontend Dockerfile (`frontend/Dockerfile`)
Uses a **multi-stage build**:
1. **Stage 1 (`builder`)**: Uses `node:18-alpine` to install dependencies and execute `npm run build` using Vite.
2. **Stage 2 (`production`)**: Uses lightweight `nginx:1.25-alpine`, copies the compiled static assets into `/usr/share/nginx/html`, and mounts `nginx.conf` to serve the SPA and route `/api/` calls seamlessly to the backend.

```bash
# Build frontend image manually
cd frontend
docker build -t mern-blog-frontend:latest .

# Run standalone frontend container
docker run -d -p 3000:80 --name frontend-container mern-blog-frontend:latest
```

---

## 2. Docker Compose Configuration

The root `docker-compose.yml` orchestrates all three application tiers:
- **`mongo`**: Official MongoDB 6.0 image with persistent volume `mongo_data` and internal healthcheck.
- **`backend`**: Built from `./backend`, depends on `mongo` being healthy, exposes port `5000`.
- **`frontend`**: Built from `./frontend`, depends on `backend` being healthy, exposes port `3000`.
- **`mern_network`**: An isolated bridge network allowing containers to communicate using container service names (`mongo`, `backend`).

### Running the Application with One Command:
```bash
# Start all containers in detached mode (builds images if not present)
docker-compose up --build -d

# Check status of containers
docker-compose ps

# View real-time logs
docker-compose logs -f

# Access the application:
# Open browser at: http://localhost:3000
# Backend API: http://localhost:5000/api/posts
# Healthcheck: http://localhost:5000/health

# Stop and remove all containers and network
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

---

## 3. Cloud Deployment

### A. MongoDB Atlas Configuration
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a user (e.g., `blog_user`) with read/write privileges.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere) so Cloud Run instances can connect.
5. In **Database -> Connect -> Drivers**, copy your connection string:
   ```
   mongodb+srv://blog_user:<password>@cluster0.mongodb.net/mern_blog?retryWrites=true&w=majority
   ```

### B. Docker Hub Repositories & Pushing
```bash
# 1. Log in to Docker Hub
docker login -u <YOUR_DOCKERHUB_USERNAME>

# 2. Tag images with Docker Hub repository name
docker tag mern-blog-backend:latest <YOUR_DOCKERHUB_USERNAME>/mern-blog-backend:latest
docker tag mern-blog-frontend:latest <YOUR_DOCKERHUB_USERNAME>/mern-blog-frontend:latest

# 3. Push images to Docker Hub
docker push <YOUR_DOCKERHUB_USERNAME>/mern-blog-backend:latest
docker push <YOUR_DOCKERHUB_USERNAME>/mern-blog-frontend:latest
```

### C. Google Cloud Run Deployment
Deploy the backend first, then provide its live URL to the frontend:

```bash
# 1. Authenticate with Google Cloud CLI
gcloud auth login
gcloud config set project <YOUR_GCP_PROJECT_ID>

# 2. Deploy Backend to Google Cloud Run
gcloud run deploy mern-blog-backend \
  --image docker.io/<YOUR_DOCKERHUB_USERNAME>/mern-blog-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI="mongodb+srv://blog_user:<password>@cluster0.mongodb.net/mern_blog?retryWrites=true&w=majority",PORT="5000",CLIENT_ORIGIN="*" \
  --port 5000

# 3. Deploy Frontend to Google Cloud Run
gcloud run deploy mern-blog-frontend \
  --image docker.io/<YOUR_DOCKERHUB_USERNAME>/mern-blog-frontend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80
```

---

## 4. Continuous Integration (CI)

The CI workflow is defined in `.github/workflows/ci.yml`. It runs automatically whenever changes are pushed or a pull request is made to `main`.

### Pipeline Steps:
1. **Backend CI**:
   - Checks out repository (`actions/checkout@v4`).
   - Sets up Node.js 18 (`actions/setup-node@v4`) with cache.
   - Installs clean dependencies via `npm ci`.
   - Runs code linting (`npm run lint`).
   - Executes automated Jest and Supertest suites (`npm test`).
2. **Frontend CI**:
   - Installs frontend packages via `npm ci`.
   - Runs ESLint validation.
   - Executes `npm run build` to guarantee zero bundling errors.

---

## 5. Continuous Delivery / Deployment (CD)

The CD workflow in `.github/workflows/cd.yml` automates pushing Docker images and deploying to Google Cloud Run when changes land on the `main` branch.

### GitHub Repository Secrets to Configure:
In GitHub, navigate to **Settings -> Secrets and variables -> Actions** and create:
- `DOCKERHUB_USERNAME`: Your Docker Hub username.
- `DOCKERHUB_TOKEN`: Personal Access Token from Docker Hub.
- `GCP_PROJECT_ID`: Google Cloud Project ID.
- `GCP_SA_KEY`: JSON service account key with Cloud Run Admin permissions.
- `MONGODB_ATLAS_URI`: Your production MongoDB Atlas connection string.
- `CLOUD_RUN_BACKEND_URL`: The deployed Cloud Run backend service URL.

---

## 📸 Submission Checklist & Screenshots Guide

| Req # | Item | Location / Instruction |
|:---:|:---|:---|
| 1 | Complete MERN Blog Source Code | `backend/` and `frontend/` folders |
| 2 | Dockerfiles & `.dockerignore` files | `backend/Dockerfile`, `frontend/Dockerfile` |
| 3 | Docker Compose Configuration | `docker-compose.yml` |
| 4 | GitHub Repository URL | Push this repo to GitHub and submit URL |
| 5 | Docker Hub URLs | `https://hub.docker.com/r/<username>/mern-blog-backend` |
| 6 | Public Cloud Run URL | `https://mern-blog-frontend-<id>.a.run.app` |
| 7 | CI/CD Workflow YAML Files | `.github/workflows/ci.yml` & `cd.yml` |
| 8 | **Screenshot 1: Docker Image Creation** | Run `docker images` showing both images built |
| 8 | **Screenshot 2: Docker Compose Execution** | Run `docker-compose ps` showing all 3 containers healthy |
| 8 | **Screenshot 3: Docker Hub Published Images** | Browser screenshot of Docker Hub repositories |
| 8 | **Screenshot 4: Google Cloud Run Services** | GCP Console screenshot showing both services active |
| 8 | **Screenshot 5: Successful GitHub Actions CI/CD** | Actions tab showing green checkmarks for CI & CD runs |
| 8 | **Screenshot 6: Blog Application Running in Cloud** | Browser screenshot of the blog creating/viewing posts |
| 9 | Written Report & Demonstration | Provided below |

---

## 📝 Comprehensive Deployment Report & Demonstration Notes

### 1. Role of Each Tool in Modern DevOps:
- **Docker**: Solves the "it works on my machine" problem by bundling the application, runtime, system libraries, and settings into immutable, reproducible container images.
- **Docker Compose**: Simplifies local multi-container development. Instead of executing multiple separate `docker run` commands with complex network flags, a single declarative YAML file orchestrates database, API, and web tiers with dependency ordering.
- **Docker Hub**: Serves as the centralized container registry where built, tagged, and versioned Docker images are securely stored and fetched by deployment runners.
- **GitHub Actions**: Provides end-to-end automation. CI ensures tests pass and code adheres to quality standards before merging; CD eliminates manual deployment risks by building container images and shipping them to production upon merge.
- **Google Cloud Run**: Fully managed serverless container runtime that scales down to zero when idle (cost-efficient) and automatically scales up with traffic demand, abstracting away Kubernetes/infrastructure management.

### 2. Challenges Encountered & Solutions:
1. **Container Networking & CORS**: In Docker Compose, backend and frontend communicate via internal Docker DNS (`http://backend:5000`), but in the user's browser, API calls must be routed via Nginx reverse proxy (`/api/`) or have permissive CORS configured. Solved by mounting a custom `nginx.conf` that proxies `/api/` directly to `http://backend:5000/api/`.
2. **Service Startup Race Conditions**: MongoDB may take several seconds to initialize its socket. If Express attempts to connect immediately, it crashes. Solved using Docker Compose `healthcheck` on MongoDB (`mongosh --eval "db.adminCommand('ping')"`) with `depends_on: { mongo: { condition: service_healthy } }`.
3. **Optimistic UI with TanStack Query**: State synchronization across CRUD actions was streamlined using `queryClient.invalidateQueries({ queryKey: ['posts'] })`, which automatically triggers a refetch without full page reload.
4. **Environment Variables in Static SPAs**: Vite environment variables are bundled at build time. Solved by passing `ARG VITE_API_BASE_URL` in the multi-stage Dockerfile and GitHub Actions CD workflow.
