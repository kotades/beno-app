# Industrial Backend: Clean Architecture Structure

This document defines the "Reasoning Anchors" for our backend architecture. Following these rules ensures that the core business logic remains independent of frameworks, databases, and UI details.

## 🏛️ The Four Layers

### 1. Domain Layer (`src/domain/`)
- **What**: Entities and Value Objects.
- **Rules**:
    - **NO DEPENDENCIES**. This layer must be pure TypeScript/JavaScript.
    - Contains the "Enterprise Business Rules".
    - Data structures that represent the core concepts (e.g., `User`, `Order`).
    - Business logic that is true regardless of the application (e.g., `User.validatePassword()`).

### 2. Application Layer (`src/application/`)
- **What**: Use Cases (Interactors).
- **Rules**:
    - Depends ONLY on the **Domain** layer.
    - Contains "Application Business Rules".
    - Orchestrates the flow of data: fetches an entity, calls business logic, saves the entity.
    - Defines **Input/Output Ports** (Interfaces) for external services (e.g., `UserRepository`).

### 3. Interface Layer (`src/interface/`)
- **What**: Interface Adapters (Controllers, Presenters, Gateways).
- **Rules**:
    - Depends on **Application** and **Domain**.
    - Translates data from a format convenient for the UI/External world to a format convenient for Use Cases.
    - Contains Repository Interfaces (Gateways) that the Application layer uses.

### 4. Infrastructure Layer (`src/infrastructure/`)
- **What**: Frameworks and Drivers (DB, Web, External APIs).
- **Rules**:
    - Depends on all other layers.
    - This is where the "Details" live.
    - Concrete implementations of repositories (e.g., `SqlUserRepository`).
    - Web framework configuration (e.g., Express routes).

## 🚀 The Main Component (`src/main.ts`)
- The ultimate dependency injector.
- It is the "Plugin" that glues everything together.
- This is the ONLY place where you should see `new ConcreteRepository()` and `new WebServer()`.

## 🛡️ The Dependency Rule
> **Source code dependencies must point only inward, toward higher-level policies.**

Nothing in an inner circle can know anything at all about something in an outer circle.
