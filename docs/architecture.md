# Wallet API Architecture

## Overview
Wallet API is a RESTful backend service for managing wallets, balances, transactions, and marketplace payment flows.

The system follows MVC architecture with a dedicated service layer and loosely coupled data access.

The business logic is isolated, testable, and scalable.

---

## Goals
- Clear separation of concerns
- Scalable architecture
- Testable business logic
- Loosely coupled data access
- Clean commit history
- Easy feature extension
- Transaction traceability
- Atomic financial operations

---

## Non-Goals
- No microservices architecture
- No event-driven system (for now)
- No real-time updates
- No distributed transactions
- No multi-database runtime support

---

## High Level Architecture

Client → Router → Controller → Service → Repository → Database

Each layer has a single responsibility and communicates only with the next layer.

---

## Layers

### Router Layer
Responsible for defining routes and attaching controllers.

### Controller Layer
Handles request/response and calls services.

### Service Layer
Contains business logic and use cases.

Examples:
- purchase
- refund
- withdraw
- transfer

### Repository Layer
Handles database operations and abstracts persistence.

---

## Folder Structure

wallet-api/
├── docs/
├── scripts/
│   └── migrate-transaction-operation.js
│
├── src/
│   ├── config/
│   │
│   ├── core/
│   │   ├── middleware/
│   │   │   ├── GlobalError.js
│   │   │   └── rateLimit.js
│   │   │
│   │   └── utils/
│   │       ├── apiFeatures.js
│   │       ├── AppError.js
│   │       └── catchAsync.js
│   │
│   ├── modules/
│   │   ├── transaction/
│   │   │   ├── transaction.model.js
│   │   │   └── transaction.repository.js
│   │   │
│   │   └── wallet/
│   │       ├── wallet.model.js
│   │       ├── wallet.repository.js
│   │       ├── wallet.service.js
│   │       ├── wallet.controller.js
│   │       ├── wallet.validation.js
│   │       └── wallet.router.js
│   │
│   ├── app.js
│   └── server.js
│
└── package.json

---

## Request Flow

1. Client sends HTTP request
2. Server receives request
3. Router forwards request
4. Validation middleware validates input
5. Controller extracts request data
6. Service executes business logic
7. Repository interacts with database
8. Response returned to client

---

## Core Business Flows

### Purchase Flow

Buyer → Escrow  
Escrow → Revenue (Fee)  
Escrow → Pending Payout  

---

### Refund Flow

Reverse Payout  
Reverse Fee  
Refund Buyer  

---

### Withdraw Flow

Escrow → Seller

Supports:
- delayed payouts
- partial withdrawals

---

## Database Design

### Wallet Collection
Fields:
- _id
- name
- balance
- type (user / escrow / revenue)

### Transaction Collection
Fields:
- walletId
- operation
- category
- amount
- balanceAfter
- relatedWallet
- referenceId
- status
- remainingAmount
- createdAt

---

## Transaction Categories
- purchase
- fee
- payout
- withdraw
- refund
- transfer

---

## Payout Status Lifecycle

pending → available → used

---

## Atomic Operations
Critical operations use MongoDB sessions:

- purchase
- transfer
- refund
- withdraw

This ensures rollback on failure.

---

## Versioning Strategy

### V1
- Wallet basics

### V2
- Transactions

### V3
- Transfers

### V4
- Escrow / Refund / Withdraw

---

## Future Extensions
- External payment providers
- Deposit integration
- Multiple currencies
- Rate limiting
- Notifications
- Audit logs
- Analytics