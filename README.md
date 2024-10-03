
# E-commerce Inventory Management System

![Inventory Management](./ELST.svg)

## Overview

The E-commerce Inventory Management System (IMS) is a robust backend application designed to help businesses track and manage their inventory efficiently. Built using Node.js, MongoDB, and Kafka, this system enables users to handle stock movements, generate reports, and receive notifications for low stock levels and important transactions.

## Features

- **User Management**:
  - Registration and login functionality with role-based access control.
  
- **Inventory Management**:
  - CRUD operations for inventory items.
  - Track stock movements (purchases, sales, returns, adjustments).
  
- **Reporting**:
  - Generate reports on current inventory levels, transactions, and stock history.
  - Reports can be formatted as CSV or PDF.
  
- **Notifications**:
  - Alert users when inventory levels fall below a predefined threshold.
  - Notify users for key transactions (e.g., large orders, out-of-stock items).

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend server.
- **MongoDB**: NoSQL database for data persistence.
- **Express.js**: Web framework for Node.js to handle HTTP requests.
- **Kafka**: For event-driven architecture to handle notifications and stock updates.

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:Ammen1/E-commerce-Inventory-Management.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ecommerce-inventory-management
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Set up your environment variables. Create a `.env` file in the root directory and add the following:

   ```env
   MONGO_URI=your_mongodb_uri
   PORT=your_port_number
   JWT_EXPIRES=24h
   ```

5. Start the server:

   ```bash
   npm run dev
   ```

## API Documentation

Refer to the [API Documentation](./api-documentation.md) for detailed information on endpoints, request/response formats, and authentication requirements.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License


## Acknowledgments

- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Kafka](https://kafka.apache.org/)

```
