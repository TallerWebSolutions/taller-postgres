import {dropTable} from 'gen'

import expect from 'support/expect'

describe('generate SQL', () => {
  describe('drop table', () => {
    it('drop table.', async () => {
      const sqlDropTable = dropTable('persons').toSQL()
      expect(sqlDropTable).to.equal('DROP TABLE persons;')
    })
  })
})
