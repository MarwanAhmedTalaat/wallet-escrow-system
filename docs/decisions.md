## Decision 1: Layered Architecture
The project follows a layered architecture:

Router → Controller → Service → Repository → Database

Rules:
- Controllers contain no business logic
- Services contain business logic only
- Repository handles database access only
- Controllers never access database directly
- Services never use models directly

## Decision 2: Service Layer
Business logic is placed inside the service layer.

Responsibilities:
- Handle use cases
- Coordinate repositories
- Apply validation rules
- Control transactions (future)

Controllers only call services and return responses.

## Decision 3: Repository Pattern
Database access is handled through repository layer.

Responsibilities:
- Query database
- Create documents
- Update documents
- Delete documents

Services interact with repositories instead of models.

This allows switching database implementation later.

## Decision 4: MongoDB First
MongoDB is used as the initial database.

The architecture keeps database logic isolated in repositories.

This allows switching to SQL database later without changing
controllers or services.

## Decision 5: Versioned Development
The project is built using incremental versions.

V1: wallet basics  
V2: transactions  
V3: transfers  

Each version adds features without changing architecture.

This keeps scope controlled and commits organized.