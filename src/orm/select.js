import {selectTable} from 'gen'

export default (connection, schema, ...fields) => {
  if (!fields || !fields.length) fields = Object.keys(schema.fields)
  let selectCommand = selectTable()
  selectCommand.from(schema.table)
  fields.forEach(field => selectCommand.field(field))

  selectCommand.run = async () => {
    const whereConditions = selectCommand.values
    const selectSQL = selectCommand.toSQL()
    return connection.execute(selectSQL, whereConditions)
  }

  return selectCommand
}
