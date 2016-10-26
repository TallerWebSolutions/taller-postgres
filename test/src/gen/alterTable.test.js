import {alterTable} from 'gen'

import {
  DATE,
  CHAR1,
  CPFCNPJ,
  NOT_NULL
} from 'gen/types'

import expect from 'support/expect'

describe('generate SQL', () => {
  describe('alter table', () => {
    it('add column.', async () => {
      const sqlAlterTable = alterTable('persons')
        .addColumn('typeDoc', CHAR1, NOT_NULL, 'J')
        .addColumn('codeDoc', CPFCNPJ)
        .addColumn('birthday', DATE)
        .toSQL()

      expect(sqlAlterTable).to.equal(`
ALTER TABLE persons
  ADD COLUMN typeDoc CHAR(1) NOT NULL DEFAULT 'J',
  ADD COLUMN codeDoc VARCHAR(14),
  ADD COLUMN birthday DATE;
      `.trim())
    })

    it('drop column.', async () => {
      const sqlAlterTable = alterTable('persons')
        .dropColumn('typeDoc')
        .dropColumn('codeDoc')
        .dropColumn('birthday')
        .toSQL()

      expect(sqlAlterTable).to.equal(`
ALTER TABLE persons
  DROP COLUMN typeDoc RESTRICT,
  DROP COLUMN codeDoc RESTRICT,
  DROP COLUMN birthday RESTRICT;
      `.trim())
    })

    it('drop default.', async () => {
      const sqlAlterTable = alterTable('persons')
        .dropDefault('typeDoc')
        .dropDefault('codeDoc')
        .dropDefault('birthday')
        .toSQL()

      expect(sqlAlterTable).to.equal(`
ALTER TABLE persons
  ALTER COLUMN typeDoc DROP DEFAULT,
  ALTER COLUMN codeDoc DROP DEFAULT,
  ALTER COLUMN birthday DROP DEFAULT;
      `.trim())
    })

    it('set default.', async () => {
      const sqlAlterTable = alterTable('persons')
        .setDefault('typeDoc', 'F')
        .setDefault('codeDoc', '01509311157')
        .setDefault('birthday', '1988-12-31')
        .setDefault('deleted', false)
        .toSQL()

      expect(sqlAlterTable).to.equal(`
ALTER TABLE persons
  ALTER COLUMN typeDoc SET DEFAULT 'F',
  ALTER COLUMN codeDoc SET DEFAULT '01509311157',
  ALTER COLUMN birthday SET DEFAULT '1988-12-31',
  ALTER COLUMN deleted SET DEFAULT FALSE;
      `.trim())
    })

    it('set type column.', async () => {
      const sqlAlterTable = alterTable('persons')
        .setType('typeDoc', CHAR1)
        .setType('codeDoc', CPFCNPJ)
        .setType('birthday', DATE)
        .toSQL()

      expect(sqlAlterTable).to.equal(`
ALTER TABLE persons
  ALTER COLUMN typeDoc TYPE CHAR(1),
  ALTER COLUMN codeDoc TYPE VARCHAR(14),
  ALTER COLUMN birthday TYPE DATE;
      `.trim())
    })

    it('set not null.', async () => {
      const sqlAlterTable = alterTable('persons')
        .setNotNull('typeDoc')
        .setNotNull('codeDoc')
        .setNotNull('birthday')
        .toSQL()

      expect(sqlAlterTable).to.equal(`
ALTER TABLE persons
  ALTER COLUMN typeDoc SET NOT NULL,
  ALTER COLUMN codeDoc SET NOT NULL,
  ALTER COLUMN birthday SET NOT NULL;
      `.trim())
    })

    it('drop not null.', async () => {
      const sqlAlterTable = alterTable('persons')
        .dropNotNull('typeDoc')
        .dropNotNull('codeDoc')
        .dropNotNull('birthday')
        .toSQL()

      expect(sqlAlterTable).to.equal(`
ALTER TABLE persons
  ALTER COLUMN typeDoc DROP NOT NULL,
  ALTER COLUMN codeDoc DROP NOT NULL,
  ALTER COLUMN birthday DROP NOT NULL;
      `.trim())
    })

    it('rename column.', async () => {
      const sqlAlterTable = alterTable('persons')
        .renameColumn('typeDoc', 'typeDoc2')
        .renameColumn('codeDoc', 'codeDoc2')
        .renameColumn('birthday', 'birthday2')
        .toSQL()

      expect(sqlAlterTable).to.equal(`
ALTER TABLE persons
  RENAME COLUMN typeDoc TO typeDoc2,
  RENAME COLUMN codeDoc TO codeDoc2,
  RENAME COLUMN birthday TO birthday2;
      `.trim())
    })

    it('add unique.', async () => {
      const sqlAlterTable = alterTable('persons')
        .addUnique('typeDoc')
        .addUnique('codeDoc')
        .addUnique('birthday')
        .toSQL()

      expect(sqlAlterTable).to.equal(`
ALTER TABLE persons
  ADD CONSTRAINT unique_persons_typeDoc UNIQUE (typeDoc),
  ADD CONSTRAINT unique_persons_codeDoc UNIQUE (codeDoc),
  ADD CONSTRAINT unique_persons_birthday UNIQUE (birthday);
      `.trim())
    })

    it('drop unique.', async () => {
      const sqlAlterTable = alterTable('persons')
        .dropUnique('typeDoc')
        .dropUnique('codeDoc')
        .dropUnique('birthday')
        .toSQL()

      expect(sqlAlterTable).to.equal(`
ALTER TABLE persons
  DROP CONSTRAINT unique_persons_typeDoc,
  DROP CONSTRAINT unique_persons_codeDoc,
  DROP CONSTRAINT unique_persons_birthday;
      `.trim())
    })

    it('add foreign key.', async () => {
      const sqlAlterTable = alterTable('persons')
        .addForeign('typeDoc', 'kinships')
        .addForeign('codeDoc', 'kinships', 'codeDoc')
        .addForeign('birthday', 'kinships', 'birthday')
        .toSQL()

      expect(sqlAlterTable).to.equal(`
ALTER TABLE persons
  ADD CONSTRAINT foreign_persons_typeDoc FOREIGN KEY (typeDoc) REFERENCES kinships (id),
  ADD CONSTRAINT foreign_persons_codeDoc FOREIGN KEY (codeDoc) REFERENCES kinships (codeDoc),
  ADD CONSTRAINT foreign_persons_birthday FOREIGN KEY (birthday) REFERENCES kinships (birthday);
      `.trim())
    })

    it('drop foreign key.', async () => {
      const sqlAlterTable = alterTable('persons')
        .dropForeign('typeDoc')
        .dropForeign('codeDoc')
        .dropForeign('birthday')
        .toSQL()

      expect(sqlAlterTable).to.equal(`
ALTER TABLE persons
  DROP CONSTRAINT foreign_persons_typeDoc,
  DROP CONSTRAINT foreign_persons_codeDoc,
  DROP CONSTRAINT foreign_persons_birthday;
      `.trim())
    })
  })
})
