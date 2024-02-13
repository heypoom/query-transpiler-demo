import {describe, it, expect} from 'vitest'

import {generateWhereClause} from './where-clause'
import {WhereClause} from './types/query'

const FIELDS = {1: 'id', 2: 'name', 3: 'date_joined', 4: 'age'}

const where = (clause: WhereClause) =>
  generateWhereClause(clause, FIELDS, 'postgres')

describe('equality checks in where clauses', () => {
  it('supports checking for NULL with "=" operator', () => {
    expect(where(['=', ['field', 3], null])).toBe('date_joined IS NULL')
    expect(where(['=', null, ['field', 4]])).toBe('age IS NULL')
  })

  it('supports equality checks', () => {
    expect(where(['=', ['field', 4], 50])).toBe('age = 50')
    expect(where(['=', ['field', 2], 'Rainicorn'])).toBe('name = "Rainicorn"')

    // SQL allows expressions on the either side of the comparison operator.
    expect(where(['=', 'Baba', ['field', 2]])).toBe('"Baba" = name')
  })

  it('supports inequality checks', () => {
    expect(where(['!=', ['field', 4], 50])).toBe('age != 50')
    expect(where(['!=', ['field', 2], 'Rainicorn'])).toBe('name != "Rainicorn"')
    expect(where(['!=', 'Baba', ['field', 2]])).toBe('"Baba" != name')
  })

  it('supports IN and NOT IN operators', () => {
    expect(where(['=', ['field', 2], 'fo', 'ba'])).toBe('name IN ("fo", "ba")')
    expect(where(['=', ['field', 4], 5, 6, 7, 8])).toBe('age IN (5, 6, 7, 8)')
    expect(where(['!=', ['field', 4], 20, 30])).toBe('age NOT IN (20, 30)')
  })

  it('supports empty operator', () => {
    expect(where(['is-empty', ['field', 4]])).toBe('age IS NULL')
    expect(where(['not-empty', ['field', 1]])).toBe('id IS NOT NULL')
  })
})
