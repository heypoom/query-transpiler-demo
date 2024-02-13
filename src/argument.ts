import {escapeString} from './strings/escape-string'
import {quoteFieldName} from './strings/quote-field-name'
import {Dialect, SqlFields} from './types/query'

export type ArgValue = ['field', number] | number | string

export const makeArgumentResolver =
  (fields: SqlFields, dialect: Dialect) => (value: ArgValue) => {
    if (typeof value === 'number') return value
    if (typeof value === 'string') return `'${escapeString(value, dialect)}'`

    if (Array.isArray(value) && value[0] === 'field') {
      return quoteFieldName(fields[value[1]], dialect)
    }
  }
