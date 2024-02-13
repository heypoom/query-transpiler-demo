import {describe, it, expect} from 'vitest'

import {generateWhereClause} from '../src/where-clause'
import {WhereFilter} from '../src/types/query'

const FIELDS = {1: 'id', 2: 'name', 3: 'date_joined', 4: 'age'}

const where = (filter: WhereFilter) =>
  generateWhereClause(filter, FIELDS, 'postgres')

describe('logical filters in where clauses', () => {
  it('supports a standalone AND clause', () => {
    expect(where(['and', ['=', ['field', 3], null]])).toBe(
      'date_joined IS NULL'
    )
  })

  it('supports logical operators', () => {
    expect(
      where(['and', ['=', ['field', 2], 'Sally'], ['=', ['field', 4], 50]])
    ).toBe(`(name = 'Sally') AND (age = 50)`)

    expect(
      where(['or', ['=', ['field', 2], 'Sally'], ['=', ['field', 4], 50]])
    ).toBe(`(name = 'Sally') OR (age = 50)`)
  })

  it('supports NOT operator', () => {
    expect(where(['not', ['>', ['field', 4], 18]])).toBe('NOT (age > 18)')
  })
})
