import {describe, it, expect} from 'vitest'
import {generateSql} from '../src'
import {FIELDS} from './helpers'

describe('macro filter', () => {
  it('expands the defined macro', () => {
    expect(
      generateSql(
        'postgres',
        FIELDS,
        {where: ['and', ['<', ['field', 1], 5], ['macro', 'is_joe']]},
        {macros: {is_joe: ['=', ['field', 2], 'joe']}}
      )
    ).toBe(`SELECT * FROM data WHERE id < 5 AND name = 'joe'`)
  })
})
