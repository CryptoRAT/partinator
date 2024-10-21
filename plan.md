# BoltWise Backend Project Plan

## Overview
This project is a backend system for a simplified e-commerce platform focused on fasteners. The solution involves data ingestion, data model design, API development, concurrency management, and problem-solving.

The project will follow Test-Driven Development (TDD) and a feature-by-feature approach, where both the data layer and API layer for each feature are developed together. The core requirements will be prioritized, with bonus features added if time permits.

## Assumptions
- **Project Type:** Writing this for a microservice, not as far as to dockerize, but think of that when making design decisions.
## Development Approach
- **Test-Driven Development (TDD):** Write tests before implementing functionality using Jest for unit tests.
- **Feature Development:** Implement each feature fully before moving to the next, including the data and API layers.
- **Version Control:** Use Git branches to manage each feature, ensuring changes remain isolated and manageable.

## Suggested Tools and Dependencies
- **Backend Framework:** Express.js (Node.js)
- **Database ORM:** Sequelize
- **Testing Framework:** Jest
- **Development Utilities:** `dotenv` for environment variables, `ts-node-dev` for live-reloading during development

## Project Plan
### Feature Breakdown
#### 1. Initial Setup
- Set up a simple Express server (`app.ts`) to serve as the base of the project.
- Install required dependencies:
    - `express`, `typescript`, `jest`, `dotenv`, `ts-node-dev`
- **Basic Test**: Create a simple test for the `Hello World` endpoint to verify the project setup.

### Feature 1: CSV Import
- **Goal:** Ingest CSV data from sellers and standardize it.

1. **Write Tests First**
    - Create tests for a CSV parsing utility that standardizes seller CSV data to a common format.
    - Write tests for a `/api/import-csv` endpoint that accepts CSV files via HTTP POST.

2. **Implement CSV Parsing Utility**
    - Write a utility to parse incoming CSV files, standardize headers, and transform the data.

3. **Implement CSV Import API Endpoint**
    - Add a POST endpoint at `/api/import-csv` that accepts seller CSV files and stores standardized data.

### Feature 2: ProductModel Catalog Management
- **Goal:** Manage product listings, including querying and filtering products.

1. **Write Tests First**
    - Create tests for product model CRUD operations.
    - Create tests for the `/api/products` endpoint, including listing and filtering by attributes.

2. **Implement ProductModel Model**
    - Use Sequelize to define a model to store product information.

3. **Implement Products API Endpoint**
    - Create a GET endpoint at `/api/products` to list products and support filtering by attributes like `category`, `material`, etc.

### Feature 3: Inventory Management
- **Goal:** Manage inventory levels for the catalog.

1. **Write Tests First**
    - Write tests for inventory management, including stock updates and queries.
    - Handle edge cases like insufficient stock or invalid updates.

2. **Expand ProductModel Model**
    - Update the product model to track inventory levels.

3. **Implement Inventory API Endpoints**
    - Implement a PUT endpoint for updating inventory levels.
    - Implement a GET endpoint for querying inventory levels.

### Feature 4: Orders System
- **Goal:** Record and manage customer orders.

1. **Write Tests First**
    - Write tests for creating orders, including scenarios involving inventory management and concurrency.

2. **Design the Order Model**
    - Define a model for capturing orders, including details such as products ordered, quantities, and order status.

3. **Implement Orders API Endpoint**
    - Add a POST endpoint at `/api/orders` to create new orders.
    - Ensure concurrency control (e.g., optimistic locking) to manage inventory accurately during high-demand scenarios.

### Optional Bonus Features
#### 1. ProductModel Recommendation
- **Goal:** Suggest products based on user queries.

1. **Write Tests First**
    - Create tests for the recommendation system, ensuring responses match simulated queries.

2. **Implement Recommendation Utility**
    - Create a `recommendation.ts` utility using a rules-based system or an LLM if accessible.

3. **Implement Recommendation API Endpoint**
    - Create a GET endpoint at `/api/recommend` to accept a text query and return relevant products.

#### 2. Basic UI
- **Goal:** Create a simple frontend for product browsing and order submission.

1. **Frontend Setup**
    - Set up a basic React application that communicates with the backend API.

2. **Implement UI Features**
    - **Browse Products:** Allow users to view available products.
    - **Place Orders:** Enable basic order submission via the frontend.
    - **Request Recommendations:** Include a text input to simulate product recommendations.

## Summary
- **Initial Setup:** Get a basic server up and running with tests for setup validation.
- **CSV Import Feature:** Implement CSV parsing and ingestion via HTTP POST.
- **ProductModel Catalog Management:** Implement product listing and filtering capabilities.
- **Inventory Management:** Expand the product model to manage stock and support stock update operations.
- **Orders System:** Implement customer orders with concurrency control to ensure data integrity.
- **Bonus Features:** Add product recommendation and a basic UI if time permits.

Each feature will follow the TDD approach with tests written prior to implementation, ensuring high code quality and functionality. Let me know if you need more details on any part of the plan!

