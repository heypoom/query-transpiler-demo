import {test, expect} from 'vitest'
import {where} from './helpers'

test('query optimization', () => {
  // Optimize out the statements that are always true or always false
  expect(where(['is-empty', null])).toBe('')
  expect(where(['not-empty', null])).toBe('FALSE')
})
