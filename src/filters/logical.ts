import {Filter} from '../types/filter'

export const LogicalFilter: Filter = {
  match: ['and', 'or', 'not'],

  process(context) {
    const {operator, args, generate, depth = 0} = context

    if (operator === 'not' && args.length === 1) {
      return `NOT ${generate(args[0])}`
    }

    if (operator === 'and' && args.length === 1) return generate(args[0])

    const opKey = operator.toUpperCase()
    const values = args.map(generate)

    const out = values.join(` ${opKey} `)

    return depth > 0 ? `(${out})` : out
  },
}
