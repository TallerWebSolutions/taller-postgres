import {
  NAME,
  EMAIL,
  PRIMARY,
  BOOLEAN,
  REFERENCES
} from 'gen/types'

export default {
  table: 'emails',

  fields: {
    id: PRIMARY,
    name: NAME,
    email: EMAIL,
    deleted: BOOLEAN,
    person: { type: REFERENCES, table: 'persons' }
  }
}
