# E-commerce Inventory Management System API Documentation

## Overview

This document provides an overview of the authentication and inventory management API for the E-commerce Inventory Management System. It outlines the available endpoints for user registration, login, and managing inventory items. Request and response formats are provided for each endpoint.

---

## Prerequisites

Before starting, ensure the following are installed on your system:

- **Node.js** (v14.x or higher)
- **Docker & Docker Compose** (for Kafka and MongoDB setup)
- **Git** (for cloning the repository)

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and configure the following:

   ```bash
   MONGO_URI=mongodb://localhost:27017/inventory
   KAFKA_BROKER=localhost:9092
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```

4. **Run Kafka with Docker Compose:**
   Run Kafka and Zookeeper with the provided Docker Compose configuration:

   ```bash
   docker-compose up -d
   ```

5. **Run MongoDB:**
   If using Docker for MongoDB, run it separately:

   ```bash
   docker run -d -p 27017:27017 --name mongo mongo
   ```

6. **Start the Server:**
   After setting up the environment, start the API server:

   ```bash
   npm run dev
   ```

   The server will be available at [http://localhost:5000](http://localhost:5000).

---

## API Documentation (Swagger)

Full API documentation is available using Swagger at:

- **Swagger UI:** [http://localhost:5000/api-docs/](http://localhost:5000/api-docs/)

You can explore and test all API endpoints, view request/response models, and more.

---

## Endpoints

### 1. User Registration

- **Endpoint:** `/users/register`
- **Method:** `POST`
- **Description:** Registers a new user.

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
  - `name` (string, required): 2-50 characters.
  - `email` (string, required)
  - `password` (string, required): Minimum 8 characters.
  - `phone` (string, required): 10 digits.
  - `role` (string, optional): Admin, Manager, or Employee.

#### Responses

- **201 Created**

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

- **400 Bad Request:** Invalid phone number or email already registered.

---

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
  - `email` (string, required)
  - `password` (string, required)
  - `role` (string, required): Admin, Manager, Employee.

#### Responses

- **200 OK**

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

- **400 Bad Request:** Invalid email or password.

---

### 3. Create Inventory Item

- **Endpoint:** `/inventory`
- **Method:** `POST`
- **Description:** Creates a new inventory item.

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
  - `name` (string, required)
  - `description` (string, optional)
  - `category` (string, required)
  - `price` (number, required)
  - `quantity` (number, required)
  - `lowStockThreshold` (number, optional)
  - `author` (string, optional)

#### Responses

- **201 Created**

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

- **400 Bad Request:** Missing required fields or validation errors.
- **409 Conflict:** Inventory item with the same name already exists.

---

### 4. Get All Inventory Items

- **Endpoint:** `/inventory`
- **Method:** `GET`
- **Description:** Retrieves all inventory items.

#### Responses

- **200 OK**

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

- **500 Internal Server Error:** Unable to fetch inventory items due to server error.

---

## Error Handling

All errors return a JSON response in this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## Kafka Setup with Offset Explorer

### Overview

Apache Kafka is used for real-time event handling, such as stock movement notifications. Offset Explorer helps monitor Kafka topics and consumers.

### Prerequisites

- **Docker** and **Docker Compose** installed.

### Step 1: Create Docker Compose File

Create a `docker-compose.yml` file with the following content:

```yaml
version: '3.8'

services:
  mongo:
    image: mongo:5.0  
    container_name: mongodb  
    restart: always  
    ports:
      - "27017:27017"  
    volumes:
      - mongo_data:/data/db  

  zookeeper:
    image: docker.io/bitnami/zookeeper:3.9  
    ports:
      - "2181:2181"  
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes  

  kafka:
    image: 'bitnami/kafka:3.4'  
    ports:
      - '9092:9092'  
    environment:
      KAFKA_ZOOKEEPER_SERVERS: 'zookeeper:2181'
      KAFKA_ADVERTISED_LISTENERS: 'PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:9092'
      KAFKA_LISTENERS: 'PLAINTEXT://0.0.0.0:9092'

networks:
  inventory-network:
    driver: bridge

volumes:
  mongo_data:
```

### Step 2

: Run Kafka with Docker Compose

1. Navigate to the folder containing the `docker-compose.yml` file.

2. Run the command:

```bash
docker-compose up -d
```

### Step 3: Install Offset Explorer

1. Download Offset Explorer from [Offset Explorer](https://www.kafkalizard.com/download).

2. Install and launch the application.

3. Add a new connection with:
   - **Name:** `Kafka Connection`
   - **Broker List:** `localhost:9092`

4. You can now monitor topics, producers, and consumers.

### Step 2: Run Kafka with Docker Compose

To run Kafka using Docker Compose, follow these detailed instructions:

#### 1. **Navigate to the Folder**

Make sure you are in the directory where your `docker-compose.yml` file is located. Open a terminal or command prompt and use the `cd` command to navigate to the correct folder. For example:

```bash
cd path/to/your/docker-compose-file
```

#### 2. **Run the Docker Compose Command**

Execute the following command to start all the services defined in the `docker-compose.yml` file, which includes MongoDB, Zookeeper, and Kafka:

```bash
docker-compose up -d
```

- The `-d` flag stands for "detached mode," which means the services will run in the background, allowing you to continue using the terminal.

#### 3. **Verify the Services are Running**

After running the above command, you can check the status of the running containers by executing:

```bash
docker-compose ps
```

This command will display a list of the services and their current states. You should see something like this:

```
   Name                 Command               State          Ports
---------------------------------------------------------------------
mongodb         docker-entrypoint.sh --...   Up      0.0.0.0:27017->27017/tcp
zookeeper       /opt/bitnami/bin/zookeep...   Up      0.0.0.0:2181->2181/tcp
kafka           /opt/bitnami/bin/kafka ...   Up      0.0.0.0:9092->9092/tcp
```

#### 4. **Check Logs for Errors**

If you encounter any issues, you can check the logs of a specific service to troubleshoot:

```bash
docker-compose logs <service_name>
```

Replace `<service_name>` with either `mongodb`, `zookeeper`, or `kafka` to view logs for that particular service. For example:

```bash
docker-compose logs kafka
```

#### 5. **Access Kafka from Your Application**

Now that Kafka is running, you can connect to it from your application using the broker address specified in your code (e.g., `localhost:9092`). 

Make sure your application is configured to point to this address when producing or consuming messages.

---

### Next Steps

After successfully running Kafka and confirming that all services are operational, you can proceed with using your E-commerce Inventory Management System, including sending and receiving messages via Kafka, or move on to the next setup steps if applicable.

### Conclusion

This documentation provides a comprehensive overview of the API for the E-commerce Inventory Management System, covering authentication, inventory management, and integration with Kafka for real-time updates. For any questions or support, please contact the development team.