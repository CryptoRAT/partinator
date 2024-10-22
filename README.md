# partinator

Backend System for Fastener E-Commerce Catalog

## Project Structure
These are the main folders in this project, if it's obvious, the contents are not mentioned.
- /docs/ - Has the original challenge, the plan I started with, and a markdown for testing.
- /config/ - Has as many of the configs I could move out of the baseDir. In microservices, there clear line between responsibilities is needed.
- /migrations/ - Has the migrations files.
- /src/
  - __test\__/ - You will see this in pretty much every folder. Contains tests related to the modules in the folder.
  - controller/
  - datasources/
  - loggers/ - for now just one file declaring all the loggers, until it needs to be split out.
  - models/
  - routes/
  - utils/
  
## Setup Instructions


### Environment Setup
In order to run you will need to set NODE_ENV in your environment. Currently, there are a couple environments this service knows about:
* test (expects postgres to be running with the database config from above run)
* development
  Each of these environments has a .env file in /config. You can change which one you are using with:
```bash
export NODE_ENV=development
```
Or
```bash
export NODE_ENV=test
```
The following are the variables you can override, along with the default.
```bash
DATABASE_NAME || 'defaultdb';
DATABASE_USER || 'gary';
DATABASE_PASSWORD || 'indiana';
process.env.DATABASE_HOST || 'localhost';
process.env.DATABASE_DIALECT || 'sqlite';
process.env.DATABASE_PORT || 5432;
````
You can create a new environment by adding a new .env file.

### Workspace setup
If you are reading this file you have extracted the zip. In a terminal, go to the partinator folder and run the following:
```bash
yarn install
```

### Run Tests
[Testing Documentation](src/__test__/testing.md)

### Start the server

To start the development server:
```bash
yarn run dev
```
To start the server as run in production:
```bash
yarn run start
```

There are many more target scripts in the package.json, please go look at them.
### Pushing Changes
Before pushing changes, run 
```bash
yarn run test:prepush
```
This will 
- set the NODE_ENV=test
- do a clean:full 
- run all tests
- run `yarn run start`

At this point you can use postman to integration test the endpoints

### Postgres

Postgres is needed to run test:prepush, if you run in the development environment it will use sqlite.
#### Install and Start PostgreSQL

`brew install postgresql@15`

`brew services start postgreql@15`

#### Create the Users and Schemas

```sql
-- Start out in the postgres db
\c postgres
-- Create the database
CREATE DATABASE partinator_test;
-- Create the user
CREATE USER partinator_test_service_user WITH PASSWORD 'look it up';
-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE partinator_test TO partinator_test_service_user;
-- switch connection to the new db
\c partinator_test;
-- Grant privileges on the public schema
GRANT USAGE ON SCHEMA public TO partinator_test_service_user;
GRANT CREATE ON SCHEMA public TO partinator_test_service_user;

```
#### Migrate the Database

```bash
yarn run migrate
```


## Deployment

TBD
