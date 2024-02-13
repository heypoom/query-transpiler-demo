import {WhereFilter} from '../../src/types/query'
import {generateWhereClause} from '../../src/where-clause'

export const FIELDS = {1: 'id', 2: 'name', 3: 'date_joined', 4: 'age'}

export const where = (filter: WhereFilter) =>
  generateWhereClause(filter, {fields: FIELDS, dialect: 'postgres'})
