import {deleteTable} from 'gen'

import expect from 'support/expect'
import phoneSchema from 'support/schemas/phoneSchema'

describe('generate SQL', () => {
  describe('delete table', () => {
    it('get sql by conditions.', async () => {
      const deleteCommand = deleteTable(phoneSchema)

      expect(deleteCommand.values).to.deep.equal([])
      expect(deleteCommand.toSQL()).to.equal(`
DELETE FROM phones
RETURNING id, name, phone, deleted, person;
`.trim())
    })
  })

  describe('delete table', () => {
    it('get sql by conditions.', async () => {
      const conditionWhere = {id: 10, name: 'Testando'}
      const deleteCommand = deleteTable(phoneSchema).objValues(conditionWhere)

      expect(deleteCommand.values).to.deep.equal([10, 'Testando'])
      expect(deleteCommand.toSQL()).to.equal(`
DELETE FROM phones
WHERE (id = $1)
  AND (name = $2)
RETURNING id, name, phone, deleted, person;
`.trim())
    })
  })
})
