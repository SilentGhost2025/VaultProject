REGISTRY ?= ghcr.io/your-org
BUILD_NUMBER ?= latest

SERVICES = quote-service user-service api-gateway

.PHONY: build docker-build docker-push deploy

build:
	@echo "Building all services..."
	@./build-scripts/01-maven-build.sh

docker-build:
	@echo "Building Docker images..."
	@for svc in $(SERVICES); do \
		docker build -t $(REGISTRY)/$$svc:$(BUILD_NUMBER) ./backend/$$svc; \
	done

docker-push:
	@echo "Pushing Docker images..."
	@./build-scripts/02-docker-build-push.sh $(REGISTRY) $(BUILD_NUMBER)

deploy:
	@echo "Deploying to Kubernetes..."
	@./build-scripts/03-k8s-deploy.sh $(REGISTRY) $(BUILD_NUMBER)
