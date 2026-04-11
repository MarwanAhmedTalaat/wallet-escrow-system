# Wallet API Architecture

## Overview
Wallet API is a RESTful backend service for managing user wallets, balances, and transactions.

The system follows MVC architecture with a dedicated service layer and loosely coupled data access.

The goal is to keep business logic isolated, testable, and scalable.
## Goals
- Clear separation of concerns
- Scalable architecture
- Testable business logic
- Loosely coupled data access
- Versioned API (V1, V2, V3)
- Clean commit history
- Easy feature extension
## Non-Goals
- No microservices architecture
- No event-driven system (for now)
- No real-time updates
- No distributed transactions
- No multi-database runtime support
## High Level Architecture
Client ---> Router ---> Controller ---> Service ---> Data Access ---> Database

Each layer has a single responsibility and communicates only with the next layer.

## Layers

### Router Layer
Responsible for defining routes and attaching controllers.

### Controller Layer
Handles request/response and calls services.

### Service Layer
Contains business logic and use cases.

### Data Access Layer
Handles database operations and abstracts persistence.

## Folder Structure
wallet-api/
 ├── docs/
 ├── src/
 │    ├── config/
 │    ├── core/
 │    │    ├── middleware/
 │    │    └── errors/
 │    ├── modules/
 │    │    └── wallet/
 │    ├── routes/
 │    ├── app.js
 │    └── server.js
 └── package.json
## Request Flow
1. **Client**: Sends HTTP request.
2. **Server (server.js)**: Receives request and passes it to `app.js`.
3. **Router (routes/index.js)**: Directs request to the `wallet.router.js`.
4. **Validation (wallet.validation.js)**: Middleware checks if the input is correct.
5. **Controller (wallet.controller.js)**: Extracts data and calls the Service.
6. **Service (wallet.service.js)**: Executes business logic (The "Brain").
7. **Repository (wallet.repository.js)**: Interacts with the `wallet.model.js`.
8. **Response**: The Controller sends the final JSON back to the Client.
## Versioning Strategy
The project evolves using incremental versions.

V1
- Create wallet
- Get wallet
- Basic balance

V2
- Credit wallet
- Debit wallet
- Transaction history

V3
- Transfer between wallets
- Concurrency handling
- Idempotency
## Database Design (High level)
Initial database: MongoDB

Wallet
- _id
- userId
- balance
- currency
- createdAt
- updatedAt

Transactions will be introduced in V2.
## Future Extensions
- Wallet to wallet transfer
- Multiple currencies
- Transaction limits
- Scheduled payments
- External payment providers
- Notifications
- Audit logs