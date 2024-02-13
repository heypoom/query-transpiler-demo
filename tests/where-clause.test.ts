import {test, expect} from 'vitest'

import {generateWhereClause} from '../src/where-clause'

const FIELDS = {1: 'id', 2: 'name', 3: 'date_joined', 4: 'age'}

test('generate non-nested "where equal" clauses', () => {
  const clause = generateWhereClause(
    ['=', ['field', 3], null],
    FIELDS,
    'postgres'
  )

  expect(clause).toBe('date_joined IS NULL')
})
