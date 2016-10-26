import selectData from 'orm/select'
import deleteData from 'orm/delete'
import findByAttr from 'orm/findByAttr'
import {insertData, updateData} from 'orm/insUpd'

const ormModel = (tables, connection, modelName) => {
  const schema = JSON.parse(JSON.stringify(tables[modelName]))

  if (tables[modelName].hasOwnProperty('afterSave')) schema.afterSave = tables[modelName].afterSave
  if (tables[modelName].hasOwnProperty('beforeSave')) schema.beforeSave = tables[modelName].beforeSave

  const orm = ormModel.bind(this, tables, connection)

  const model = {schema}
  model.select = selectData.bind(this, connection, schema)
  model.delete = deleteData.bind(this, connection, schema)
  model.insert = insertData.bind(this, orm, tables, connection, schema)
  model.update = updateData.bind(this, orm, tables, connection, schema)
  return Object.assign(model, findByAttr(tables, connection, schema))
}

const ormDatabase = (tables, connection) => ormModel.bind(this, tables, connection)

export default (schemas) => {
  const tables = {}
  schemas.forEach((schema) => Object.assign(tables, {[schema.table]: schema}))
  return ormDatabase.bind(this, tables)
}
