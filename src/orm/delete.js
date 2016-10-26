import {deleteTable} from 'gen'
import objRow from 'orm/objRow'

export default async (connection, schema, conditions) => {
  const deleteCommand = deleteTable(schema).objValues(conditions)
  const deleteValues = deleteCommand.values
  const deleteSQL = deleteCommand.toSQL()
  const {rows} = await connection.execute(deleteSQL, deleteValues)
  if (!rows || !rows.length) return undefined
  return rows.map(objRow.bind(this, schema)).shift()
}
