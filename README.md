# partinator

Backend System for Fastener E-Commerce Catalog

## Setup Instructions

### Environment Variables

You will need to set up the following environment variables.

```bash
export DB_HOST=localhost;
export DB_PASSWORD=password;
export DB_SCHEMA=gen2;
export DB_USERNAME=gen2_app_user;
export NODE_ENV=local;
export DEBUG=true;
````

### Postgres

#### Install and Start MySQL

`brew install postgresql@15`

`brew services start postgreql@15`

#### Create the Users and Schemas

```sql
CREATE SCHEMA partinator;
CREATE USER 'partinator_app_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON partinator.* TO 'partinator_app_user'@'localhost';

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
