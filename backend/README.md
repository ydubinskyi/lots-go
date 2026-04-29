# Project backend

One Paragraph of project description goes here

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## MakeFile

Run build make command with tests

```bash
make all
```

Build the application

```bash
make build
```

Run the application

```bash
make run
```

Create DB container

```bash
make docker-run
```

Shutdown DB Container

```bash
make docker-down
```

DB Integrations Test:

```bash
make itest
```

Database seeds (test data for categories with nested tree and en/uk/pl translations; idempotent, uses separate version table):

```bash
# From backend dir with DB_URL set (e.g. copy .env.example to .env and: source .env)
make seed-up    # apply seeds
make seed-down  # rollback last seed
```

Run schema migrations first (`goose up` or your migration command), then run seeds. Safe to run `seed-up` multiple times.

Live reload the application:

```bash
make watch
```

Run the test suite:

```bash
make test
```

Clean up binary from the last build:

```bash
make clean
```
