import {
  DATE,
  NAME,
  TEXT,
  CHAR1,
  CHAR2,
  CHAR8,
  SELECT,
  PRIMARY,
  CPFCNPJ,
  BOOLEAN
} from 'gen/types'

export default {
  table: 'persons',

  fields: {
    id: PRIMARY,
    typeDoc: CHAR1,
    codeDoc: CPFCNPJ,
    birthday: DATE,
    name: NAME,
    nickName: NAME,
    observation: TEXT,
    deleted: BOOLEAN,
    addrUf: CHAR2,
    addrZipCode: CHAR8,
    addrCity: NAME,
    addrNeighborhood: NAME,
    addrStreet: NAME,
    addrAdjunct: NAME
  },

  hasMany: {
    phones: {table: 'phones', field: 'person'},
    emails: {table: 'emails', field: 'person'}
  },

  manyToMany: {
    kinships: {
      table: 'kinships',
      primary: 'person',
      secondary: 'kinship',
      schema: 'persons',
      extraFields: {
        kin: SELECT,
        deleted: BOOLEAN
      }
    }
  }
}
