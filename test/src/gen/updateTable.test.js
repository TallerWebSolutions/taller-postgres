import {updateTable} from 'gen'

import expect from 'support/expect'
import phoneSchema from 'support/schemas/phoneSchema'

describe('generate SQL', () => {
  describe('update table', () => {
    it('get sql and values.', async () => {
      const emailData = {
        name: 'Person name',
        phone: '(48) 8810-8161',
        person: 20
      }

      const updateCommand = updateTable(phoneSchema).objValues(emailData)

      expect(updateCommand.values).to.deep.equal(['Person name', '(48) 8810-8161', 20])
      expect(updateCommand.toSQL()).to.equal(`
UPDATE phones SET
  name = $1,
  phone = $2,
  person = $3
RETURNING id, name, phone, deleted, person;
`.trim())
    })

    it('get sql by conditions.', async () => {
      const emailData = {
        name: 'Person name',
        phone: '(48) 8810-8161',
        person: 20
      }

      const conditionWhere = {id: 10, name: 'Testando'}
      const updateCommand = updateTable(phoneSchema).objValues(emailData, conditionWhere)

      expect(updateCommand.values).to.deep.equal(['Person name', '(48) 8810-8161', 20, 10, 'Testando'])
      expect(updateCommand.toSQL()).to.equal(`
UPDATE phones SET
  name = $1,
  phone = $2,
  person = $3
WHERE (id = $4)
  AND (name = $5)
RETURNING id, name, phone, deleted, person;
`.trim())
    })
  })
})
