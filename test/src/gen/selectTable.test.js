import {selectTable} from 'gen'

import expect from 'support/expect'

describe('generate SQL', () => {
  describe('drop table', () => {
    it('select table.', async () => {
      const sqlSelectTable = selectTable()
        .field('id')
        .field('name')
        .field('birthday')
        .from('persons')
        .toSQL()

      expect(sqlSelectTable).to.equal(`
SELECT id, name, birthday
FROM persons
      `.trim())
    })

    it('order by table.', async () => {
      const sqlSelectTable = selectTable()
        .field('id')
        .field('name')
        .field('birthday')
        .from('persons')
        .orderBy('name', 'ASC')
        .orderBy('birthday', 'desc')
        .orderBy('id')
        .toSQL()

      expect(sqlSelectTable).to.equal(`
SELECT id, name, birthday
FROM persons
ORDER BY name ASC, birthday DESC, id
      `.trim())
    })

    it('group by table.', async () => {
      const sqlSelectTable = selectTable()
        .field('id')
        .field('typeDoc')
        .field('COUNT(-1) AS counter')
        .from('persons')
        .groupBy('id, typeDoc')
        .toSQL()

      expect(sqlSelectTable).to.equal(`
SELECT id, typeDoc, COUNT(-1) AS counter
FROM persons
GROUP BY id, typeDoc
      `.trim())
    })

    it('where equal fields.', async () => {
      const conditionWhere = {id: 10, name: 'Testando'}

      const sqlSelectTable = selectTable()
        .field('id')
        .field('name')
        .field('birthday')
        .from('persons')
        .where(conditionWhere)

      expect(sqlSelectTable.values).to.deep.equal([10, 'Testando'])
      expect(sqlSelectTable.toSQL()).to.equal(`
SELECT id, name, birthday
FROM persons
WHERE (id = $1)
  AND (name = $2)
      `.trim())
    })

    it('where comparators fields.', async () => {
      const conditionWhere = {
        name: 'eq:Test Query 1',
        other: 'gq:Test Query 1',
        phone: 'df:Test Query 1',
        email: 'lk:Test Query 1',
        kinship: 'lq:Test Query 1',
        nickName: 'lt:Test Query 1',
        objservation: 'gt:Test Query 1'
      }

      const sqlSelectTable = selectTable()
        .field('id')
        .field('name')
        .field('birthday')
        .from('persons')
        .where(conditionWhere)

      expect(sqlSelectTable.values).to.deep.equal(['Test Query 1', 'Test Query 1', 'Test Query 1', '%Test Query 1%', 'Test Query 1', 'Test Query 1', 'Test Query 1'])
      expect(sqlSelectTable.toSQL()).to.equal(`
SELECT id, name, birthday
FROM persons
WHERE (name = $1)
  AND (other >= $2)
  AND (phone <> $3)
  AND (email like $4)
  AND (kinship <= $5)
  AND (nickName < $6)
  AND (objservation > $7)
      `.trim())
    })

    it('where comparators symbols fields.', async () => {
      const conditionWhere = {
        name: '==:Test Query 1',
        other: '>=:Test Query 1',
        phone: '<>:Test Query 1',
        email: '%%:Test Query 1',
        kinship: '<=:Test Query 1',
        nickName: '<<:Test Query 1',
        objservation: '>>:Test Query 1'
      }

      const sqlSelectTable = selectTable()
        .field('id')
        .field('name')
        .field('birthday')
        .from('persons')
        .where(conditionWhere)

      expect(sqlSelectTable.values).to.deep.equal(['Test Query 1', 'Test Query 1', 'Test Query 1', '%Test Query 1%', 'Test Query 1', 'Test Query 1', 'Test Query 1'])
      expect(sqlSelectTable.toSQL()).to.equal(`
SELECT id, name, birthday
FROM persons
WHERE (name = $1)
  AND (other >= $2)
  AND (phone <> $3)
  AND (email like $4)
  AND (kinship <= $5)
  AND (nickName < $6)
  AND (objservation > $7)
      `.trim())
    })
  })
})
