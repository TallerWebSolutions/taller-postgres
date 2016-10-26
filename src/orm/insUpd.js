import {insertTable, updateTable} from 'gen'
import selectData from 'orm/select'
import objRow from 'orm/objRow'

const saveManyToMany = async (orm, tables, connection, {manyToMany}, rowSaved, data) => {
  const {id} = rowSaved
  return Promise.all(Object.keys(manyToMany || {}).map(async (manyToManyField) => {
    const manyToManyRows = data[manyToManyField]
    if (!manyToManyRows || !manyToManyRows.length) return
    const {table, primary, secondary, schema, extraFields} = manyToMany[manyToManyField]
    const manyToManySchema = tables[schema]
    rowSaved[manyToManyField] = await Promise.all(manyToManyRows.map((manyToManyRow, index) => {
      let manyToManyData = {...manyToManyRow}
      Object.keys(extraFields).forEach(field => delete manyToManyData[field])
      const manyToManyId = manyToManyData.id
      return manyToManyId
        ? updateData(orm, tables, connection, manyToManySchema, manyToManyData, {id: manyToManyId})
        : insertData(orm, tables, connection, manyToManySchema, manyToManyData)
    }))

    await Promise.all(manyToManyRows.map(async (manyToManyRow, index) => {
      const tableData = {}
      Object.keys(extraFields).forEach(field => (tableData[field] = manyToManyRow[field]))
      const secondaryId = rowSaved[manyToManyField][index].id
      tableData[primary] = id
      tableData[secondary] = secondaryId
      const select = selectData.bind(this, connection, tables[table])
      const {rows} = await select('id')
        .from('kinships')
        .where({[primary]: id, [secondary]: secondaryId})
        .limit(1)
        .run()

      const dataId = rows && rows.length ? rows.shift().id : undefined

      const manyToManySaved = dataId
        ? await updateData(orm, tables, connection, tables[table], tableData, {id: dataId})
        : await insertData(orm, tables, connection, tables[table], tableData)
      Object.keys(extraFields).forEach(field => Object.assign(rowSaved[manyToManyField][index], {[field]: manyToManySaved[field]}))
    }))
  }))
}

const saveHasMany = async (orm, tables, connection, {hasMany}, rowSaved, data) => {
  const {id} = rowSaved
  await Promise.all(Object.keys(hasMany || {}).map(async (hasManyField) => {
    const hasManyRows = data[hasManyField]
    if (!hasManyRows || !hasManyRows.length) return
    const {table, field} = hasMany[hasManyField]
    const hasManySchema = tables[table]

    rowSaved[hasManyField] = await Promise.all(hasManyRows.map((hasManyRow, index) => {
      const hasManyData = {...hasManyRow, [field]: id}
      const hasManyId = hasManyData.id
      return hasManyId
        ? updateData(orm, tables, connection, hasManySchema, hasManyData, {id: hasManyId})
        : insertData(orm, tables, connection, hasManySchema, hasManyData)
    }))
  }))
}

const saveRelations = async (orm, tables, connection, schema, rowSaved, data) => {
  await saveHasMany(orm, tables, connection, schema, rowSaved, data)
  await saveManyToMany(orm, tables, connection, schema, rowSaved, data)
  return rowSaved
}

export const insertData = async (orm, tables, connection, schema, data) => {
  let beforeSave
  if (schema.hasOwnProperty('beforeSave')) beforeSave = await schema.beforeSave(data, orm(schema.table), orm)
  if (beforeSave && Object.keys(beforeSave).length) data = beforeSave

  const insertCommand = insertTable(schema).objValues(data)
  const insertValues = insertCommand.values
  const insertSQL = insertCommand.toSQL()
  const {rows} = await connection.execute(insertSQL, insertValues)
  if (!rows || !rows.length) return undefined
  let rowSaved = rows.map(objRow.bind(this, schema)).shift()

  let afterSaved
  if (schema.hasOwnProperty('afterSave')) afterSaved = await schema.afterSave(rowSaved, orm(schema.table), orm)
  if (afterSaved && afterSaved.id) rowSaved = afterSaved

  const dataInserted = await saveRelations(orm, tables, connection, schema, rowSaved, data)
  if (schema.ignoreFields) schema.ignoreFields.forEach(field => delete dataInserted[field])

  return dataInserted
}

export const updateData = async (orm, tables, connection, schema, data, conditions) => {
  let beforeSave
  if (schema.hasOwnProperty('beforeSave')) beforeSave = await schema.beforeSave(data, orm(schema.table), orm)
  if (beforeSave && Object.keys(beforeSave).length) data = beforeSave

  const updateCommand = updateTable(schema).objValues(data, conditions)
  const updateValues = updateCommand.values
  const updateSQL = updateCommand.toSQL()
  const {rows} = await connection.execute(updateSQL, updateValues)
  if (!rows || !rows.length) return undefined
  let rowSaved = rows.map(objRow.bind(this, schema)).shift()

  let afterSaved
  if (schema.hasOwnProperty('afterSave')) afterSaved = await schema.afterSave(rowSaved, orm(schema.table), orm)
  if (afterSaved && afterSaved.id) rowSaved = afterSaved
  const dataUpdated = await saveRelations(orm, tables, connection, schema, rowSaved, data)
  if (schema.ignoreFields) schema.ignoreFields.forEach(field => delete dataUpdated[field])
  return dataUpdated
}
