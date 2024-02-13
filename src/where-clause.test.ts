import {describe, it, expect} from 'vitest'

import {generateWhereClause} from './where-clause'
import {WhereClause} from './types/query'

const FIELDS = {1: 'id', 2: 'name', 3: 'date_joined', 4: 'age'}

const where = (clause: WhereClause) =>
  generateWhereClause(clause, FIELDS, 'postgres')

describe('where clause generation', () => {
  it('supports testing for NULL with "=" operator', () => {
    expect(where(['=', ['field', 3], null])).toBe('date_joined IS NULL')
    expect(where(['=', null, ['field', 4]])).toBe('age IS NULL')
  })

  it('supports equality tests', () => {
    expect(where(['=', ['field', 4], 50])).toBe('age = 50')
    expect(where(['=', ['field', 2], 'Rainicorn'])).toBe('name = "Rainicorn"')
    expect(where(['=', 'Baba', ['field', 2]])).toBe('"Baba" = name')
  })
})
