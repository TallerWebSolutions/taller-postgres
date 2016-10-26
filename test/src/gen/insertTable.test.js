import {insertTable} from 'gen'

import expect from 'support/expect'
import emailSchema from 'support/schemas/emailSchema'

describe('generate SQL', () => {
  describe('insert table', () => {
    it('get sql and values.', async () => {
      const emailData = {
        name: 'Person name',
        email: 'person@email.com',
        person: 10
      }

      const insertCommand = insertTable(emailSchema).objValues(emailData)

      expect(insertCommand.values).to.deep.equal(['Person name', 'person@email.com', 10])
      expect(insertCommand.toSQL()).to.equal(`
INSERT INTO emails (name, email, person)
VALUES ($1, $2, $3)
RETURNING id, name, email, deleted, person;
      `.trim())
    })

    it('ignore undefined values.', async () => {
      const emailData = {
        name: 'Person name',
        email: 'person@email.com',
        person: undefined
      }

      const insertCommand = insertTable(emailSchema).objValues(emailData)

      expect(insertCommand.values).to.deep.equal(['Person name', 'person@email.com'])
      expect(insertCommand.toSQL()).to.equal(`
INSERT INTO emails (name, email)
VALUES ($1, $2)
RETURNING id, name, email, deleted, person;
      `.trim())
    })

    it('ignore values not filled.', async () => {
      const emailData = {
        email: 'person@email.com',
        person: 10
      }

      const insertCommand = insertTable(emailSchema).objValues(emailData)

      expect(insertCommand.values).to.deep.equal(['person@email.com', 10])
      expect(insertCommand.toSQL()).to.equal(`
INSERT INTO emails (email, person)
VALUES ($1, $2)
RETURNING id, name, email, deleted, person;
      `.trim())
    })

    it('ignore fields that are not of schema.', async () => {
      const emailData = {
        name: 'Person name 2',
        email: 'person@email3.com',
        person: 11,
        other1: false,
        other2: 2,
        other3: 'A'
      }

      const insertCommand = insertTable(emailSchema).objValues(emailData)

      expect(insertCommand.values).to.deep.equal(['Person name 2', 'person@email3.com', 11])
      expect(insertCommand.toSQL()).to.equal(`
INSERT INTO emails (name, email, person)
VALUES ($1, $2, $3)
RETURNING id, name, email, deleted, person;
      `.trim())
    })
  })
})
