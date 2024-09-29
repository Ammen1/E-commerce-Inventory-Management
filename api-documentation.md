
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

## Conclusion

This API documentation provides all necessary details for integrating the authentication and inventory functionalities into your application. For further questions or clarifications, please contact the development team.
