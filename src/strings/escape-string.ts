import {Dialect} from '../types/query'

const mysqlEscapeChars: Record<string, string> = {
  '\0': '\\0',
  '\n': '\\n',
  '\r': '\\r',
  '\b': '\\b',
  '\t': '\\t',
  '\\': '\\\\',
  '"': '\\"',
  '\x1a': '\\Z',
}

export function escapeString(input: string, dialect: Dialect): string {
  // Double the single quotes to escape single quotes.
  const output = input.replace(/'/g, "''")

  // MySQL supports the backslash character as an escape character.
  if (dialect === 'mysql') {
    return output.replace(
      /[\0\n\r\b\t\\'"\x1a]/g,
      (str) => mysqlEscapeChars[str] ?? str
    )
  }

  return output
}
