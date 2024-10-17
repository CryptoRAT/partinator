# BoltWise
## Assignment
Take-Home Assignment: Backend System for Fastener E-Commerce Catalog
## Overview
In this assignment, you’ll build a simplified e-commerce platform focused on fasteners. Your solution will demonstrate skills in data ingestion, data model design, API development, concurrency management, and problem-solving.

You have one week to complete the assignment.

You are free to use any programming language, framework, or libraries of your choice. Feel free to interpret the requirements loosely and be creative!



## Submission Guidelines
Code: Submit your complete codebase in a zip file.

## Documentation

Include a README with setup instructions and a guide to navigating your solution.

Any additional Notes. Briefly explain any design decisions or optional features you implemented.

## Evaluation Criteria
Functional code that compiles and runs without issues

Readable, maintainable, and well-structured code

Any additional features or improvements that highlight your skills and attention to detail



## Problems
### Data Ingestion and Storage

Create a mechanism to ingest and store inventory data from different sellers. Each seller provides a CSV file export of their inventory with distinct naming conventions and headers.

File Naming Convention: Each file follows the format <seller-name>-<exported-timestamp>.csv.

Attribute Standardization: Sellers use different headers, which you’ll need to standardize to the following attributes:

* Category 
* Thread Size 
* Material 
* Finish 
* Quantity 
* Price

#### Sample CSV files:

##### Seller A
File name: seller-a-20240625.csv

###### Content:

product_id,description,thread_size,material,finish,quantity,price,category

A001,"M10-1.5 X 100 HCS DIN 931 8.8 PLN","M10-1.5","Steel","Plain",500,0.75,"Hex Cap Screw"

Download: https://drive.google.com/file/d/14_yET5MVCwrhAZUHsX3T3WoUtNmWoUin/view?usp=sharing

##### Seller B

File name: seller-b-20240625.csv

###### Content:
item_number,product_name,thread_size,material,surface_treatment,stock,unit_cost,product_category

B001,"M12/1.75 X 220 HCS DIN 931 10.9 PLN","M12/1.75","Steel","Plain",700,1.30,"Hex Cap Screw"

Download: https://drive.google.com/file/d/1ZZZt3GjltFn7XIQW6rLathOSmkbZxIZE/view?usp=sharing

### API Development

Design and implement a RESTful API that supports querying and managing the catalog, handling core e-commerce functionality:

### Products

List all products, and their attributes

Filter by category and any attributes

### Inventory

Manage inventory levels for stock updates and availability queries.

### Orders

Record customer orders, capturing details such as products ordered, quantities, order dates, and order status.

Design a solution to handle stock management during concurrent order placement:

Ensure inventory updates in real-time, even with multiple customers ordering the same item concurrently.

Describe how you would manage concurrency and maintain data integrity, especially in high-demand scenarios.



## Bonus Problems
These bonus problems are designed to give you a chance to showcase your creativity and problem-solving skills beyond the core requirements. While optional, completing one or both of these will allow you to demonstrate additional expertise and a unique approach. Think of them as opportunities to impress and explore solutions that could enhance a real-world application!



### Product Recommendation

Implement a recommendation feature. You can use a large language model (LLM) or simulate responses if an LLM isn’t accessible.

Goal: Interpret a user’s text query and suggest relevant products from the inventory.

Example Query: "What fasteners are best for outdoor use?" should return products that match these criteria.

### Basic UI

If time permits, create a simple frontend interface that allows users to:

Browse Products: Display available products.

Place Orders: Enable basic order submission.

Request Recommendations: Include a text input to simulate product recommendations.
