import {escapeString} from './strings/escape-string'
import {quoteFieldName} from './strings/quote-field-name'
import {Dialect, SqlFields} from './types/query'

export type ArgValue = ['field', number] | number | string

export const makeArgumentResolver =
  (fields: SqlFields, dialect: Dialect) =>
  (value: ArgValue): string | number => {
    if (typeof value === 'number') return value
    if (typeof value === 'string') return `'${escapeString(value, dialect)}'`
    if (value === null || value === undefined) return 'NULL'

    if (Array.isArray(value) && value[0] === 'field') {
      return quoteFieldName(fields[value[1]], dialect)
    }

    throw new Error(`argument "${value}" cannot be mapped to SQL value`)
  }
