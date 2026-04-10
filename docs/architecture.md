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

## Request Flow

## Versioning Strategy

## Database Design (High level)

## Future Extensions