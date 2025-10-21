## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run dev
```

## Run tests

```bash
# unit tests
$ npm run test
```

## Postman collection

- **Location**: `buuking.postman_collection.json`
- **Usage**: Import this file into Postman to quickly exercise the API endpoints.

## Database (Prisma + SQLite)

- **DB file**: `prisma/dev.db`
- **Reset locally**: Delete `prisma/dev.db`, then run:

```bash
npm run prisma:migrate
```

## Tests and database state

- **No automatic DB setup/teardown**: Tests do not tear down or reset the database.
- After running tests, data may persist. Remove `prisma/dev.db` and rerun `npm run prisma:migrate` to start fresh.
