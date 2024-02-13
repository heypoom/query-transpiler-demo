import {describe, it, expect} from 'vitest'
import {generateSql} from '../src'
import {FIELDS} from './helpers'
import {MacroMap} from '../src/types/query'
import {validateMacroMap} from '../src/macro-circular-deps'

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

  it('supports nested macros', () => {
    const macros = {
      is_joe: ['=', ['field', 2], 'joe'],
      is_old: ['>', ['field', 4], 18],
      is_old_joe: ['and', ['macro', 'is_joe'], ['macro', 'is_old']],
    } satisfies MacroMap

    expect(
      generateSql(
        'postgres',
        FIELDS,
        {where: ['and', ['<', ['field', 1], 5], ['macro', 'is_old_joe']]},
        {macros}
      )
    ).toBe(`SELECT * FROM data WHERE id < 5 AND (name = 'joe' AND age > 18)`)
  })

  it('detects circular dependencies in macro definition', () => {
    expect(() => {
      validateMacroMap({
        is_good: ['and', ['macro', 'is_decent'], ['>', ['field', 4], 18]],
        is_decent: ['and', ['macro', 'is_good'], ['<', ['field', 5], 5]],
      })
    }).toThrowError('circular dependency detected')

    expect(() => {
      validateMacroMap({
        bob: ['not', true],
        is_good: ['and', ['macro', 'bob'], ['>', ['field', 4], 18]],
        is_decent: ['and', ['macro', 'bob'], ['<', ['field', 5], 5]],
      })
    }).not.toThrowError()

    expect(() => {
      validateMacroMap({
        is_decent: ['and', ['macro', 'is_awesome'], ['<', ['field', 5], 5]],
        is_good: ['and', ['macro', 'is_decent'], ['>', ['field', 4], 18]],
        is_awesome: ['not', 1024],
      })
    }).not.toThrowError()
  })

  it('raises an error when encountering circular macros', () => {
    const macros = {
      is_good: ['and', ['macro', 'is_decent'], ['>', ['field', 4], 18]],
      is_decent: ['and', ['macro', 'is_good'], ['<', ['field', 5], 5]],
    } satisfies MacroMap

    expect(() => {
      generateSql('postgres', FIELDS, {}, {macros})
    }).toThrowError(`circular dependency detected in macro "is_decent"`)
  })

  it('raises an error when encountering undefined or empty macros', () => {
    expect(() => {
      generateSql('postgres', FIELDS, {}, {macros: {a: ['not', ['macro', '']]}})
    }).toThrowError('macro must have a name')

    expect(() => {
      generateSql(
        'postgres',
        FIELDS,
        {},
        {macros: {a: ['not', ['macro', 'is_b']]}}
      )
    }).toThrowError('macro "is_b" is not defined')
  })
})
