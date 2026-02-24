# 🏛️ Witty Tale Vault

A full-stack microservices application deployed on **Amazon EKS**, featuring a React frontend and three Spring Boot backend services orchestrated with Kubernetes.

---

## 📐 Architecture Overview

```
Internet
    │
    ▼
┌─────────────────────────────────────────┐
│           React Frontend (Vite)          │
│         NodePort :30090 → Pod :80        │
│           Served via Nginx               │
└────────────────┬────────────────────────┘
                 │ /api/*
                 ▼
┌─────────────────────────────────────────┐
│         API Gateway (Spring Cloud)       │
│         NodePort :30080 → Pod :8080      │
└──────────┬──────────────┬───────────────┘
           │              │
     /api/quotes    /api/users
           │              │
           ▼              ▼
┌──────────────┐  ┌──────────────────┐
│ Quote Service│  │   User Service   │
│  ClusterIP   │  │   ClusterIP      │
│   :8081      │  │    :8082         │
└──────────────┘  └──────────────────┘
```

### Infrastructure Layout

```
AWS
├── EC2 Instance (Docker Build Server)
│   ├── Docker + Buildx installed
│   └── Used to build & push images to DockerHub
│
├── EC2 Instance (Bastion Host)
│   ├── kubectl installed
│   ├── AWS CLI configured
│   └── Used to manage EKS cluster
│
└── EKS Cluster
    ├── api-gateway       (2 replicas, HPA enabled)
    ├── quote-service     (2 replicas, HPA enabled)
    ├── user-service      (2 replicas, HPA enabled)
    └── frontend          (2 replicas)
```

---

## 🗂️ Repository Structure

```
witty-tale-vault/
├── Dockerfile                        # Frontend Dockerfile
├── nginx.conf                        # Nginx config for frontend container
├── docker-compose.yml                # Local development setup
├── Makefile                          # Build automation
│
├── backend/
│   ├── api-gateway/                  # Spring Cloud Gateway
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src/main/
│   │       ├── java/.../ApiGatewayApplication.java
│   │       └── resources/application.yml
│   │
│   ├── quote-service/                # Quote management microservice
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src/main/java/.../
│   │       ├── controller/QuoteController.java
│   │       ├── model/Quote.java
│   │       └── service/QuoteService.java
│   │
│   └── user-service/                 # User management microservice
│       ├── Dockerfile
│       ├── pom.xml
│       └── src/main/java/.../
│           ├── client/QuoteServiceClient.java
│           ├── controller/UserController.java
│           ├── model/{User,Quote}.java
│           └── service/UserService.java
│
├── build-scripts/
│   ├── 01-maven-build.sh
│   ├── 02-docker-build-push.sh
│   └── 03-k8s-deploy.sh
│
├── k8s/
│   ├── api-gateway/{configmap,deployment,hpa,service}.yaml
│   ├── quote-service/{configmap,deployment,hpa,service}.yaml
│   ├── user-service/{configmap,deployment,hpa,service}.yaml
│   └── frontend-deployment.yaml
│
└── src/                              # React frontend (Vite + TypeScript)
    ├── pages/
    │   ├── Index.tsx
    │   ├── QuotesPage.tsx
    │   ├── UsersPage.tsx
    │   └── DiscoveryPage.tsx
    ├── components/
    └── lib/api.ts
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| API Gateway | Spring Cloud Gateway (Java 21) |
| Microservices | Spring Boot 3 (Java 21) |
| Containerization | Docker, Docker Buildx |
| Container Registry | DockerHub |
| Orchestration | Kubernetes (Amazon EKS) |
| Web Server | Nginx (frontend container) |
| Build Tool | Maven 3.9 |
| Autoscaling | Kubernetes HPA |

---

## 🚀 Deployment Guide

### Prerequisites

- AWS account with EKS cluster running
- EC2 instance as Docker build server (with Docker installed)
- EC2 Bastion Host (with `kubectl` and AWS CLI installed)
- DockerHub account
- GitHub repository cloned on both servers

---

### Step 1 — Configure kubectl on the Bastion Host

SSH into your Bastion Host and run:

```bash
aws eks update-kubeconfig --region us-east-1 --name TeamCity_EKS

# Verify access
kubectl get nodes
```

---

### Step 2 — Build & Push Backend Images (Docker Build Server)

SSH into your Docker Build Server, clone the repo, and build each backend service:

```bash
git clone https://github.com/SilentGhost2025/witty-tale-vault.git
cd witty-tale-vault
```

**API Gateway:**
```bash
cd backend/api-gateway
docker buildx build --push -t silentghost1/api-gateway:1 .
```

**Quote Service:**
```bash
cd ../quote-service
docker buildx build --push -t silentghost1/quote-service:1 .
```

**User Service:**
```bash
cd ../user-service
docker buildx build --push -t silentghost1/user-service:1 .
```

---

### Step 3 — Deploy Backend to EKS (Bastion Host)

SSH into your Bastion Host, clone the repo, and apply the Kubernetes manifests:

```bash
git clone https://github.com/SilentGhost2025/witty-tale-vault.git
cd witty-tale-vault
```

**Deploy each service:**
```bash
kubectl apply -f k8s/api-gateway/
kubectl apply -f k8s/quote-service/
kubectl apply -f k8s/user-service/
```

**Verify everything is running:**
```bash
kubectl get pods
kubectl get svc
```

---

### Step 4 — Build & Push Frontend Image (Docker Build Server)

Back on your Docker Build Server, from the repo root:

```bash
cd ~/witty-tale-vault
docker buildx build --push -t silentghost1/witty-tale-frontend:1 .
```

---

### Step 5 — Deploy Frontend to EKS (Bastion Host)

```bash
kubectl apply -f k8s/frontend-deployment.yaml

# Watch until pods are Running
kubectl get pods -w
```

---

### Step 6 — Open AWS Security Group Ports

Go to **AWS Console → EC2 → Security Groups** → select your worker node security group → **Edit Inbound Rules** and add:

| Port | Purpose |
|---|---|
| 30080 | API Gateway (NodePort) |
| 30090 | Frontend (NodePort) |

---

## 🌐 Accessing the Application

Once deployed, access the app through any worker node's public IP:

```
Frontend:    http://<NODE_IP>:30090
API Gateway: http://<NODE_IP>:30080
```

Get your node IPs with:
```bash
kubectl get nodes -o wide
```

---

## 📡 API Endpoints

All API traffic routes through the **API Gateway** on port `30080`:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/quotes` | Get all quotes |
| GET | `/api/quotes/random` | Get a random quote |
| GET | `/api/quotes/{id}` | Get quote by ID |
| GET | `/api/quotes/category/{category}` | Get quotes by category |
| POST | `/api/quotes` | Create a new quote |
| GET | `/api/users` | Get all users |
| GET | `/api/users/{id}` | Get user by ID |
| POST | `/api/users` | Create a new user |

**Example:**
```bash
curl http://<NODE_IP>:30080/api/quotes/random
curl http://<NODE_IP>:30080/api/quotes/category/tech
```

---

## 🔧 Local Development

Run the full stack locally using Docker Compose:

```bash
docker-compose up --build
```

| Service | Local URL |
|---|---|
| Frontend | http://localhost:8080 |
| API Gateway | http://localhost:8080 |
| Quote Service | http://localhost:8081 |
| User Service | http://localhost:8082 |

---

## ⚙️ Kubernetes Resources

Each backend service has:
- **Deployment** — 2 replicas
- **Service** — ClusterIP (internal) except api-gateway which is NodePort
- **ConfigMap** — environment variables (ports, service URLs)
- **HPA** — Horizontal Pod Autoscaler (scales up to 5 pods at 70% CPU)

```bash
# Check autoscalers
kubectl get hpa

# Check all resources
kubectl get all
```

---

## 🐳 Docker Images

| Image | DockerHub |
|---|---|
| API Gateway | `silentghost1/api-gateway:1` |
| Quote Service | `silentghost1/quote-service:1` |
| User Service | `silentghost1/user-service:1` |
| Frontend | `silentghost1/witty-tale-frontend:1` |

---

## 📝 Notes

- The frontend uses **Nginx** to serve the built React app and proxy `/api/` requests to the api-gateway service inside the cluster.
- All backend services communicate with each other via **Kubernetes DNS** (e.g., `http://quote-service:8081`).
- The user-service calls the quote-service internally using the `QuoteServiceClient`.
- Health checks are available at `/actuator/health` on all backend services.
