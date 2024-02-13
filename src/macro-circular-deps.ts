import {MacroMap, WhereFilter} from './types/query'

function getMacroNames(filter: WhereFilter): string[] {
  if (!Array.isArray(filter)) return []

  const [operator, name] = filter
  if (operator === 'macro' && typeof name === 'string') return [name]

  return filter.reduce(
    (filters, filter) => filters.concat(getMacroNames(filter)),
    [] as string[]
  )
}

function validateMacro(
  macros: MacroMap,
  name: string,
  visited: Set<string>,
  stack: Set<string>
): boolean {
  if (visited.has(name)) return false

  visited.add(name)
  stack.add(name)

  const filter = macros[name]
  if (!name) throw new Error('macro must have a name')
  if (!filter) throw new Error(`macro "${name}" is not defined`)

  for (const macro of getMacroNames(filter)) {
    const isCircular =
      !visited.has(macro) && validateMacro(macros, macro, visited, stack)

    if (isCircular || stack.has(macro))
      throw new Error(`circular dependency detected in macro "${name}"`)
  }

  stack.delete(name)

  return false
}

export function validateMacroMap(macros: MacroMap) {
  const visited = new Set<string>()
  const stack = new Set<string>()

  for (const macroName in macros) {
    validateMacro(macros, macroName, visited, stack)
  }
}
