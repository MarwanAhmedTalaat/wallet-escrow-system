# Architecture Decisions

## Decision 1: Layered Architecture
The project follows a layered architecture:

Router → Controller → Service → Repository → Database

### Rules
- Controllers contain no business logic
- Services contain business logic only
- Repositories handle database access only
- Controllers never access database directly
- Services never use models directly

This improves maintainability and scalability.

---

## Decision 2: Service Layer
Business logic is placed inside the service layer.

### Responsibilities
- Handle use cases
- Coordinate repositories
- Apply validation rules
- Manage business workflows
- Control transactions

Controllers only call services and return responses.

---

## Decision 3: Repository Pattern
Database access is handled through repository layer.

### Responsibilities
- Query database
- Create documents
- Update documents
- Delete documents

Services interact with repositories instead of models.

This allows switching database implementation later.

---

## Decision 4: MongoDB First
MongoDB is used as the initial database.

The architecture keeps database logic isolated in repositories.

This allows switching to SQL later without changing services/controllers.

---

## Decision 5: MongoDB Transactions / Sessions
Critical operations use MongoDB sessions.

### Used for:
- Purchase
- Transfer
- Refund
- Withdraw

This ensures atomicity and consistency.

Example:

If one step fails → rollback all changes.

---

## Decision 6: Escrow-Based Payment Logic
Marketplace transactions use escrow logic.

### Flow:
Buyer → Escrow → Revenue / Pending Payout

This allows:
- Delayed seller payouts
- Refund support
- Safer transaction handling

---

## Decision 7: Delayed Payout Strategy
Seller payouts are not transferred immediately.

Payout transactions move through statuses:

- pending
- available
- used

This supports:
- Refund windows
- Withdrawal holding periods

---

## Decision 8: Partial Withdrawals
Withdrawals consume payouts partially.

Each payout tracks:

- amount
- remainingAmount
- status

This allows partial withdrawals without affecting unrelated payouts.

---

## Decision 9: Ledger-Based Transactions
Every money movement creates transaction records.

Examples:
- purchase
- fee
- payout
- withdraw
- refund

This improves:
- traceability
- auditability
- history tracking

---

## Decision 10: Versioned Development
The project is built incrementally.

### Versions
- V1: wallet basics
- V2: transactions
- V3: transfers
- V4: escrow / refund / withdraw

This keeps commits organized and scope controlled.