import {
  NAME,
  PHONE,
  PRIMARY,
  BOOLEAN,
  REFERENCES
} from 'gen/types'

export default {
  table: 'phones',

  fields: {
    id: PRIMARY,
    name: NAME,
    phone: PHONE,
    deleted: BOOLEAN,
    person: { type: REFERENCES, table: 'persons' }
  }
}
