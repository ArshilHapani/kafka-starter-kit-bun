# Variables
NETWORK_NAME = kafka-network
ZOOKEEPER_NAME = zookeeper
KAFKA_NAME = kafka
ZOOKEEPER_IMAGE = zookeeper
KAFKA_IMAGE = docker.io/bitnami/kafka:latest
ZOOKEEPER_PORT = 2181
KAFKA_PORT = 9092

# Create Podman Network
.PHONY: network
network:
	@echo "Creating network: $(NETWORK_NAME)"
	@if ! podman network exists $(NETWORK_NAME); then \
		podman network create $(NETWORK_NAME); \
	else \
		echo "Network $(NETWORK_NAME) already exists."; \
	fi

# Run Zookeeper
.PHONY: run-zookeeper
run-zookeeper: network # require network
	@echo "Starting Zookeeper container..."
	podman run -d --name $(ZOOKEEPER_NAME) \
		--network $(NETWORK_NAME) \
		-e ALLOW_ANONYMOUS_LOGIN=yes \
		-p $(ZOOKEEPER_PORT):$(ZOOKEEPER_PORT) \
		$(ZOOKEEPER_IMAGE)

# Run Kafka
.PHONY: run-kafka
run-kafka: run-zookeeper # require run-zookeeper which requires network
	@echo "Starting Kafka container..."
	podman run -d --name $(KAFKA_NAME) \
		--network $(NETWORK_NAME) \
		-e KAFKA_CFG_ZOOKEEPER_CONNECT=$(ZOOKEEPER_NAME):$(ZOOKEEPER_PORT) \
		-e KAFKA_CFG_LISTENERS=PLAINTEXT://:$(KAFKA_PORT) \
		-e KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:$(KAFKA_PORT) \
		-e ALLOW_ANONYMOUS_LOGIN=yes \
		-p $(KAFKA_PORT):$(KAFKA_PORT) \
		$(KAFKA_IMAGE)

# Stop Containers
.PHONY: stop
stop:
	@echo "Stopping Kafka and Zookeeper containers..."
	-podman stop $(KAFKA_NAME) $(ZOOKEEPER_NAME)

# Remove Containers
.PHONY: clean
clean: stop remove-volumes
	@echo "Removing Kafka and Zookeeper containers..."
	@podman rm $(KAFKA_NAME) $(ZOOKEEPER_NAME)
	@echo "Removing network: $(NETWORK_NAME)"
	@if podman network exists $(NETWORK_NAME); then \
		podman network rm $(NETWORK_NAME); \
	else \
		echo "Network $(NETWORK_NAME) does not exist."; \
	fi

# Logs
.PHONY: logs
logs:
	@echo "Fetching logs for Kafka..."
	podman logs $(KAFKA_NAME)

# removes all volumes
.PHONY: remove-volumes
remove-volumes:
	@docker volume rm $$(docker volume ls -q)