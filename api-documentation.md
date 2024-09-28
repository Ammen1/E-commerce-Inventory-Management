
# API Documentation

## Overview

This document provides an overview of the authentication API for the E-commerce Inventory Management System. It outlines the endpoints available for user registration and login, including the request and response formats.

## Base URL

```
http://localhost:4000/api/v1/users
```

## Endpoints

### 1. User Registration

- **Endpoint:** `/register`
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

- **Endpoint:** `/login`
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

## Error Handling

- All errors will return a JSON response with the following structure:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Conclusion

This API documentation provides all necessary details for integrating the authentication functionalities into your application. For further questions or clarifications, please contact the development team.
```
