import {Filter} from '../types/filter'

export const MacroFilter: Filter = {
  match: ['macro'],

  process(context) {
    const {macros, args, generate} = context
    const [name] = args

    if (args.length > 1) throw new Error('macro requires exactly one argument')
    if (!macros) throw new Error('macro mapping must be defined to use macros')
    if (typeof name !== 'string') throw new Error('macro name must be a string')

    const filter = macros[name]
    if (!filter) throw new Error(`macro "${name}" is not defined`)

    return generate(filter)
  },
}
