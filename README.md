# partinator

Backend System for Fastener E-Commerce Catalog

## Setup Instructions


### Environment Setup
In order to run you will need to set NO DE_ENV in your environment. Currently, there are a couple environments this service knows about:
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
You can create a new environment by adding a new .env file. The app does have defaults to use if you don't set this, but they are not guaranteed.

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
