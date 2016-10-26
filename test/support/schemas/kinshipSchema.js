import {
  SELECT,
  PRIMARY,
  BOOLEAN,
  REFERENCES
} from 'gen/types'

export default {
  table: 'kinships',

  fields: {
    id: PRIMARY,
    kin: SELECT,
    person: { type: REFERENCES, table: 'persons' },
    kinship: { type: REFERENCES, table: 'persons' },
    deleted: BOOLEAN
  }
}
