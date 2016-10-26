import {createTable} from 'gen'

import {
  DATE,
  NAME,
  TEXT,
  CHAR1,
  CHAR2,
  CHAR8,
  PRIMARY,
  CPFCNPJ,
  BOOLEAN,
  NOT_NULL,
  REFERENCES
} from 'gen/types'

import expect from 'support/expect'

describe('generate SQL', () => {
  describe('create table', () => {
    it('create simple table.', async () => {
      const sqlCreateTable = createTable('persons')
        .column('id', PRIMARY)
        .column('typeDoc', CHAR1, NOT_NULL)
        .column('codeDoc', CPFCNPJ)
        .column('birthday', DATE)
        .column('name', NAME, NOT_NULL)
        .column('nickName', NAME)
        .column('observation', TEXT)
        .column('deleted', BOOLEAN, NOT_NULL, false)
        .column('addrUf', CHAR2)
        .column('addrZipCode', CHAR8)
        .column('addrCity', NAME)
        .column('addrNeighborhood', NAME)
        .column('addrStreet', NAME)
        .column('addrAdjunct', NAME)
        .toSQL()

      expect(sqlCreateTable).to.equal(`
CREATE TABLE persons (
  id SERIAL PRIMARY KEY,
  typeDoc CHAR(1) NOT NULL,
  codeDoc VARCHAR(14),
  birthday DATE,
  name VARCHAR(255) NOT NULL,
  nickName VARCHAR(255),
  observation TEXT,
  deleted BOOLEAN NOT NULL DEFAULT FALSE,
  addrUf CHAR(2),
  addrZipCode CHAR(8),
  addrCity VARCHAR(255),
  addrNeighborhood VARCHAR(255),
  addrStreet VARCHAR(255),
  addrAdjunct VARCHAR(255)
);
      `.trim())
    })

    it('create table with foreign and unique.', async () => {
      const sqlCreateTable = createTable('persons')
        .column('id', PRIMARY)
        .column('typeDoc', CHAR1, NOT_NULL)
        .column('codeDoc', CPFCNPJ)
        .column('birthday', DATE)
        .column('kinship', REFERENCES)
        .unique('codeDoc')
        .foreign('kinship', 'kinships')
        .toSQL()

      expect(sqlCreateTable).to.equal(`
CREATE TABLE persons (
  id SERIAL PRIMARY KEY,
  typeDoc CHAR(1) NOT NULL,
  codeDoc VARCHAR(14),
  birthday DATE,
  kinship INTEGER,
  CONSTRAINT unique_persons_codeDoc UNIQUE (codeDoc),
  CONSTRAINT foreign_persons_kinship FOREIGN KEY (kinship) REFERENCES kinships (id)
);
      `.trim())
    })
  })
})
