# partinator

Backend System for Fastener E-Commerce Catalog

## Setup Instructions

### Environment Variables

You will need to set up the following environment variables.

```bash
None needed at this point
````

### Postgres

#### Install and Start MySQL

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

### Download and Install
If you are reading this file you have extracted the zip. In a terminal, go to the partinator folder and run the following:
```bash
yarn install
```

### Migrate the Database

```bash
yarn migrate
```

### Start the server

```bash
yarn run dev
```

### Testing

[Testing Documentation](src/__test__/testing.md)

## Deployment

TBD
