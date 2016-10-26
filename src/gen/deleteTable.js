import comWhere from 'gen/comparatorWhere'
const breakline = `
`

const toSQL = (orm) => {
  const {schema, conditions} = orm
  const {table, fields} = schema
  const sqlWhere = conditions && conditions.length
    ? `${breakline}WHERE (${conditions.join(`)${breakline}  AND (`)})`
    : ''

  return `
DELETE FROM ${table}${sqlWhere}
RETURNING ${Object.keys(fields).join(', ')};
`.trim()
}

const objValues = (orm, conditions) => {
  orm.values = []
  orm.conditions = Object.keys(conditions || {}).map((field, index) => {
    const {comparator, value} = comWhere(conditions[field])
    orm.values.push(value)
    return `${field} ${comparator} $${index + 1}`
  })

  return orm
}

export default (schema) => {
  const orm = {schema, values: [], conditions: []}

  orm.toSQL = toSQL.bind(this, orm)
  orm.objValues = objValues.bind(this, orm)

  return orm
}
