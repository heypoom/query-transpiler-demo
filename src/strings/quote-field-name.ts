import {Dialect} from '../types/query'

const isQuoteNeeded = (name: string) => /[^a-zA-Z0-9_]/.test(name)

export function quoteFieldName(name: string, dialect: Dialect) {
  if (!isQuoteNeeded(name)) return name

  if (dialect === 'mysql') {
    return `\`${name}\``
  }

  if (dialect === 'postgres' || dialect === 'sqlserver') {
    return `"${name}"`
  }
}
