# Witty Tale Vault — DevOps Deployment Guide

## Table of Contents
1. Architecture Overview  
2. Prerequisites  
3. Infrastructure Setup (Terraform)  
4. Jenkins Setup  
5. Application Server Setup  
6. CI/CD Pipeline  
7. Application Deployment  
8. Accessing the Application  
9. Monitoring and Logging  
10. Design Decisions  
11. Assumptions  
12. Limitations and Future Improvements  

---

## 1. Architecture Overview

Witty Tale Vault is a microservices-based web application deployed on AWS using modern DevOps practices. The system consists of three Spring Boot backend services and a React frontend. All services are containerized using Docker and deployed on EC2 instances within a secure VPC.

### Architecture Diagram

![Architecture Diagram](.)

### High-Level Flow

Internet
    |
    v
[Application Load Balancer] (Public)
    |
    v
[Frontend - Nginx:80] (Private Subnet)
    |
    |-- /api/* --> [API Gateway:8080]
                        |
                        |-- /api/quotes --> [Quote Service:8081]
                        |-- /api/users  --> [User Service:8082]

[Bastion Host] (Public Subnet)
    |
    --> SSH Access to Private Servers

[Jenkins Server] (Private Subnet)
[App Server] (Private Subnet - Runs Docker Containers)

---

## 2. Prerequisites

Ensure the following tools are installed:

- Terraform (>= 1.6.0)
- AWS CLI (configured with credentials)
- Git
- DockerHub account
- AWS account with permissions for:
  - EC2
  - VPC
  - IAM
  - ALB
  - S3
  - DynamoDB
- EC2 Key Pair

---

## 3. Infrastructure Setup (Terraform)

### Step 1 — Create Remote Backend

cd terraform/scripts
chmod +x bootstrap-backend.sh
./bootstrap-backend.sh

### Step 2 — Configure Variables

cd terraform
cp terraform.tfvars.example terraform.tfvars

Update:

your_ip_cidr = "YOUR_IP/32"
key_name     = "your-key-pair"
ami_id       = "ami-0c7217cdde317cfec"

### Step 3 — Deploy Infrastructure

terraform init
terraform plan
terraform apply --auto-approve

---

## 4. Jenkins Setup

### Access Jenkins via Bastion Host

ssh -i your-key.pem ubuntu@<BASTION_PUBLIC_IP>
ssh -i your-key.pem ubuntu@<JENKINS_PRIVATE_IP>

### Install Dependencies

sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install -y openjdk-21-jdk maven

### Install Docker

sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable docker && sudo systemctl start docker

### Install Jenkins

sudo apt-get install -y jenkins
sudo systemctl restart jenkins

### Add Swap Space

sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile

### Access Jenkins UI

ssh -i your-key.pem -L 8080:<JENKINS_PRIVATE_IP>:8080 ubuntu@<BASTION_PUBLIC_IP> -N

http://localhost:8080

---

## 5. Application Server Setup

ssh -i your-key.pem ubuntu@<APP_SERVER_PRIVATE_IP>

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable docker && sudo systemctl start docker

sudo mkdir -p /opt/witty-tale-vault
sudo chown ubuntu:ubuntu /opt/witty-tale-vault

---

## 6. CI/CD Pipeline

Pipeline stages:
- Checkout
- Build
- Test
- Docker Build
- Docker Push
- Deploy

---

## 7. Application Deployment

Docker Compose:

services:
  frontend:
    image: silentghost1/frontend:latest
    ports:
      - "80:80"

  api-gateway:
    image: silentghost1/api-gateway:latest
    ports:
      - "8080:8080"

  quote-service:
    image: silentghost1/quote-service:latest
    ports:
      - "8081:8081"

  user-service:
    image: silentghost1/user-service:latest
    ports:
      - "8082:8082"

---

## 8. Accessing the Application

http://<ALB_DNS_NAME>

---

## 9. Monitoring and Logging

AWS CloudWatch is used for logs and CPU alarms.

---

## 10. Design Decisions

- EC2 for simplicity and control  
- Jenkins for CI/CD control  
- Docker for consistency  
- Bastion host for secure access  
- ALB for routing and scalability  

---

## 11. Assumptions

- AWS limits are sufficient  
- Key pair exists  
- DockerHub is accessible  
- Single server is acceptable  

---

## 12. Limitations and Future Improvements

- Add HTTPS  
- Add auto scaling  
- Add database  
- Migrate to private registry  
- Introduce staging environment  

### Note on SonarQube and Nexus

Due to limited available vCPU resources (8 vCPUs), SonarQube and Nexus were not included.

In a production environment, they would be integrated for:
- Code quality analysis  
- Artifact management  
