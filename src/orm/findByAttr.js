import selectData from 'orm/select'
import objRow from 'orm/objRow'

const populateHasMany = async (tables, connection, schema, row, refs) => {
  const {hasMany} = schema

  await Promise.all(Object.keys(hasMany || {}).map(async (hasManyField) => {
    const {table, field} = hasMany[hasManyField]
    const schemaHasMany = tables[table]
    const select = selectData.bind(this, connection, schemaHasMany)
    const {rows} = await select('id').where({[field]: row.id}).run()
    if (!rows || !rows.length) return

    row[hasManyField] = await Promise.all(rows.map(({id}) => findById(tables, connection, schemaHasMany, id, refs)))
  }))
}

const populateManyToMany = async (tables, connection, schema, row, refs) => {
  const {manyToMany} = schema

  await Promise.all(Object.keys(manyToMany || {}).map(async (manyToManyField) => {
    const {table, primary, secondary, extraFields, schema} = manyToMany[manyToManyField]
    const schemaManyToMany = tables[table]
    const select = selectData.bind(this, connection, schemaManyToMany)
    const listExtraFields = Object.keys(extraFields)
    const {rows} = await select(secondary, ...listExtraFields).where({[primary]: row.id}).run()
    if (!rows || !rows.length) return

    row[manyToManyField] = await Promise.all(rows.map(async (rel) => {
      const id = rel[secondary]
      const row = await findById(tables, connection, tables[schema], id, refs)
      listExtraFields.forEach(field => (row[field] = rel[field]))
      return row
    }))
  }))
}

const findById = async (tables, connection, schema, id, refs = {}) => {
  const ref = `${schema.table}-${id}`
  if (refs.hasOwnProperty(ref)) return {...refs[ref]}
  const select = selectData.bind(this, connection, schema)
  const {rows} = await select().where({id}).limit(1).run()
  if (!rows || !rows.length) return undefined

  const row = rows.map(objRow.bind(this, schema)).shift()
  refs[ref] = row
  await populateHasMany(tables, connection, schema, row, refs)
  await populateManyToMany(tables, connection, schema, row, refs)
  return row
}

const findBy = async (tables, connection, schema, attr, value, refs) => {
  const select = selectData.bind(this, connection, schema)
  const {rows} = await select('id').where({[attr]: value}).run()
  if (!rows || !rows.length) return []

  if (!refs) refs = {}
  const searchsById = rows.map(({id}) => findById(tables, connection, schema, id, refs))
  return Promise.all(searchsById)
}

const findByAttr = (tables, connection, schema) => {
  const findObj = {}

  Object.keys(schema.fields).forEach((field) => {
    const findAttr = `findBy${field.charAt(0).toUpperCase().concat(field.slice(1))}`
    if (field === 'id') return (findObj[findAttr] = findById.bind(this, tables, connection, schema))
    findObj[findAttr] = findBy.bind(this, tables, connection, schema, field)
  })

  return findObj
}

export default findByAttr
