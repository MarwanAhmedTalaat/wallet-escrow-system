# Wallet API

A RESTful backend service for managing wallets, balances, transactions, and marketplace payment flows.

## Features

- Create wallet
- Get wallet details
- Get wallet balance
- Credit / Debit wallet
- Transfer between wallets
- Purchase flow
- Refund flow
- Delayed payouts
- Partial withdrawals
- Transaction history with pagination
- Rate limiting

---

## Architecture

The project follows layered architecture:

Client → Router → Controller → Service → Repository → Database

### Architecture Diagram

![Architecture Diagram](docs\diagram\wallet-api-architecture-diagram.png)

---

## Core Business Flows

### Purchase Flow
Buyer → Escrow  
Escrow → Revenue (Fee)  
Escrow → Pending Payout  

### Refund Flow
Reverse Payout  
Reverse Fee  
Refund Buyer  

### Withdraw Flow
Escrow → Seller  

Supports delayed payouts and partial withdrawals.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose

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