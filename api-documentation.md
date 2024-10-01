
# API Documentation

## Overview

This document provides an overview of the authentication API for the E-commerce Inventory Management System. It outlines the endpoints available for user registration, login, and inventory management, including the request and response formats.

## Base URL

```
http://localhost:4000/api/v1
```

## Endpoints

### 1. User Registration

- **Endpoint:** `/users/register`
- **Method:** `POST`
- **Description:** Registers a new user in the system.

#### Request Body

```json
{
  "name": "Amen Guda",
  "email": "a@a.com",
  "password": "Amen#197",
  "phone": "0944365493",
  "role": "Admin"
}
```

- **Fields:**
  - `name` (string, required): The user's name (2-50 characters).
  - `email` (string, required): The user's email address.
  - `password` (string, required): The user's password (minimum 8 characters).
  - `phone` (string, required): The user's phone number (exactly 10 digits).
  - `role` (string, optional): User role (Admin, Manager, Employee).

#### Responses

- **201 Created**
  - **Description:** User registered successfully.
  - **Response Body:**

  ```json
  {
    "success": true,
    "message": "User Registered!",
    "user": {
      "id": "user_id",
      "name": "Amen Guda",
      "email": "a@a.com",
      "phone": "0944365493",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "role": "Admin"
    }
  }
  ```

- **400 Bad Request**
  - **Description:** Phone number must be exactly 10 digits or email already registered.

### 2. User Login

- **Endpoint:** `/users/login`
- **Method:** `POST`
- **Description:** Logs in a user and returns a JWT token.

#### Request Body

```json
{
  "email": "amenguda@gmail.com",
  "password": "Amen#197",
  "role": "Admin"
}
```

- **Fields:**
  - `email` (string, required): User's email address.
  - `password` (string, required): User's password.
  - `role` (string, required): User's role (Admin, Manager, Employee).

#### Responses

- **200 OK**
  - **Description:** User logged in successfully.
  - **Response Body:**

  ```json
  {
    "success": true,
    "message": "User Logged In!",
    "user": {
      "id": "user_id",
      "name": "Amen Guda",
      "email": "a@a.com",
      "phone": "0944365493",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "role": "Admin"
    },
    "token": "JWT_TOKEN"
  }
  ```

- **400 Bad Request**
  - **Description:** Invalid email or password.

### 3. Create Inventory Item

- **Endpoint:** `/inventory`
- **Method:** `POST`
- **Description:** Creates a new inventory item in the system.

#### Request Body

```json
{
  "name": "Item Name",
  "description": "Item description.",
  "category": "Item Category",
  "price": 99.99,
  "quantity": 100,
  "lowStockThreshold": 10,
  "author": "Author Name"
}
```

- **Fields:**
  - `name` (string, required): The name of the inventory item (1-100 characters).
  - `description` (string, optional): A description of the inventory item.
  - `category` (string, required): The category of the inventory item.
  - `price` (number, required): The price of the inventory item.
  - `quantity` (number, required): The quantity of the inventory item.
  - `lowStockThreshold` (number, optional): The threshold for low stock alert.
  - `author` (string, optional): The author or creator of the inventory item.

#### Responses

- **201 Created**
  - **Description:** Inventory item created successfully.
  - **Response Body:**

  ```json
  {
    "success": true,
    "message": "Inventory item created successfully",
    "data": {
      "id": "item_id",
      "name": "Item Name",
      "description": "Item description.",
      "category": "Item Category",
      "price": 99.99,
      "quantity": 100,
      "lowStockThreshold": 10,
      "author": "Author Name",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

- **400 Bad Request**
  - **Description:** Missing required fields or validation errors.

- **409 Conflict**
  - **Description:** An inventory item with the same name already exists.

### 4. Get All Inventory Items

- **Endpoint:** `/inventory`
- **Method:** `GET`
- **Description:** Retrieves all inventory items from the system.

#### Responses

- **200 OK**
  - **Description:** Successfully retrieved all inventory items.
  - **Response Body:**

  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "id": "item_id_1",
        "name": "Item Name 1",
        "description": "Description for Item 1",
        "category": "Category 1",
        "price": 49.99,
        "quantity": 100,
        "lowStockThreshold": 10,
        "author": "Author 1",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      {
        "id": "item_id_2",
        "name": "Item Name 2",
        "description": "Description for Item 2",
        "category": "Category 2",
        "price": 99.99,
        "quantity": 200,
        "lowStockThreshold": 20,
        "author": "Author 2",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

- **500 Internal Server Error**
  - **Description:** Unable to fetch inventory items due to server error.

## Error Handling

- All errors will return a JSON response with the following structure:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Kafka Setup with Offset Explorer
Overview
This section describes how to set up Apache Kafka and Offset Explorer using Docker. Offset Explorer is a tool that helps you monitor and manage Kafka topics and consumers easily.

Prerequisites
Docker installed on your machine.
Docker Compose installed.
Step 1: Create a Docker Compose File
Create a file named docker-compose.yml in your project directory with the following content:

yaml
Copy code
version: '3.8'

services:
  app:
    build:
      context: .  # Specifies the build context (current directory)
      dockerfile: Dockerfile  # Use the Dockerfile in the current directory
      args:
        NODE_ENV: development  # Set the build argument for Node.js environment
    ports:
      - "4000:4000"  # Map the host's port 4000 to the container's port 4000
    environment:
      NODE_ENV: ${NODE_ENV}  # Use environment variables from .env or the host machine
      MONGO_URI: ${MONGO_URI}
      KAFKA_BROKER: ${KAFKA_BROKER}  # Ensure this is set correctly in your .env file
    depends_on:
      - mongo  # Wait for MongoDB to start before app
      - kafka  # Wait for Kafka to start before app
    volumes:
      - .:/app  # Mount the current directory into the container
    networks:
      - inventory-network
    healthcheck:  # Health check for the app service
      test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
      interval: 30s
      timeout: 20s
      retries: 5

  mongo:
    image: mongo:5.0  # Use MongoDB version 5.0
    container_name: mongodb  # Name the container "mongodb"
    restart: always  # Always restart the container if it stops
    ports:
      - "27017:27017"  # Map MongoDB's port
    volumes:
      - mongo_data:/data/db  # Persistent volume for MongoDB data
    networks:
      - inventory-network
    healthcheck:  # Health check for MongoDB
      test: ["CMD", "mongo", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 20s
      retries: 5

  zookeeper:
    image: docker.io/bitnami/zookeeper:3.9  # Use Bitnami Zookeeper image
    ports:
      - "2181:2181"  # Map Zookeeper's port
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes  # Allow anonymous login for Zookeeper
    networks:
      - inventory-network

  kafka:
    image: 'bitnami/kafka:3.4'  # Use Bitnami Kafka image
    ports:
      - '9092:9092'  # Map Kafka's port
    environment:
      - KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181  # Connect to Zookeeper
      - KAFKA_CFG_LISTENERS=PLAINTEXT://0.0.0.0:9092,PLAINTEXT_INTERNAL://kafka:9093  # Listen on all interfaces and internal network
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092,PLAINTEXT_INTERNAL://kafka:9093  # Advertise to external and internal clients
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT,PLAINTEXT_INTERNAL:PLAINTEXT  # Protocol mapping
      - KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT_INTERNAL  # Inter-broker communication listener
    depends_on:
      - zookeeper  # Wait for Zookeeper to start before Kafka
    networks:
      - inventory-network
    healthcheck:
      test: ["CMD", "kafka-topics.sh", "--list", "--zookeeper", "zookeeper:2181"]
      interval: 30s
      timeout: 20s
      retries: 5

networks:
  inventory-network:
    driver: bridge  # Use a bridge network for internal communication

volumes:
  mongo_data:

  offset-explorer:
    image: czechitas/offset-explorer
    ports:
      - "8080:8080"
    environment:
      KAFKA_BROKERS: "kafka:9093"
Step 2: Start the Kafka Cluster
Navigate to the directory where you created the docker-compose.yml file in your terminal and run:

bash
Copy code
docker-compose up -d
This command will start the Zookeeper, Kafka, and Offset Explorer services in the background.

Step 3: Access Offset Explorer
Once the containers are up and running, you can access Offset Explorer in your web browser at:

arduino
Copy code
http://localhost:9092
Step 4: Configure Offset Explorer
Add Kafka Cluster:

In Offset Explorer, go to File > New > Cluster.
Enter the broker address: localhost:9092 (OUTSIDE listener).
Click OK to save.
Explore Topics:

After adding the cluster, you can browse topics, view partitions, and check consumer offsets.
Step 5: Create a Topic (Optional)
To create a topic for testing, you can use the Kafka command line tool or Offset Explorer:

Using Command Line
Open a terminal and run the following command:

bash
Copy code
docker exec -it <kafka_container_id> kafka-topics.sh --create --topic test-topic --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
Replace <kafka_container_id> with the actual ID of the Kafka container. You can find the container ID using:

bash
Copy code
docker ps
Using Offset Explorer
Select your Kafka cluster in Offset Explorer.
Right-click on the Topics node and choose Create Topic.
Fill in the topic name and configurations, then click Create.
Step 6: Producing and Consuming Messages
You can use Offset Explorer to produce and consume messages from the topics you created:

Producing Messages:

Select your topic, right-click, and choose Send Message.
Enter the message in the provided field and send it.
Consuming Messages:

Select your topic and go to the Consumer tab to view and read messages.

## Conclusion

This API documentation provides all necessary details for integrating the authentication and inventory functionalities into your application. For further questions or clarifications, please contact the development team.
