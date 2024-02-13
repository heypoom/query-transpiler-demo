# SQL Query Transpiler

SQL query transpiler for educational purposes.

## How to run

Please install the `node v21.6.0` and `pnpm` package manager before proceeding.

```bash
# install packages with pnpm.
pnpm install

# runs unit and integration tests with vitest.
# should result in 26 tests passed.
pnpm test
```

## Project Structure

- `src/`:

  - `filters/` - define new filter clause types
  - `strings/` - quote and escape identifiers/strings
  - `types/` - TypeScript type definitions
  - `argument.ts` - transforms the argument into SQL value format
  - `generate.ts` - generates SQL from expression
  - `macro-circular-deps.ts` - identifies circular dependencies and missing macros
  - `where-clause.ts` - transforms the expression's where clause to SQL
  - `optimizer.ts` - optimizes the structured expressions

- `tests/`: contains unit and integration tests for each modules
  - contains both the pre-defined cases and specific unit tests (e.g. for WHERE clauses)

## Notes

- Users can add new filter clause types and pass them as the argument of the `generateSql` method. See `src/filters/` for example.
