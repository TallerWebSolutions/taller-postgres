import {
  DATE,
  TEXT,
  NAME,
  EMAIL,
  CHAR1,
  CHAR2,
  CHAR8,
  PHONE,
  SELECT,
  CPFCNPJ,
  BOOLEAN,
  PRIMARY
} from 'gen/types'
import tallerPostgres from 'taller-postgres'

export const dropTables = async(connection) => {
  await connection.startTransaction()
  await connection.execute(`
    DROP TABLE IF EXISTS emails;
    DROP TABLE IF EXISTS phones;
    DROP TABLE IF EXISTS kinships;
    DROP TABLE IF EXISTS persons;
  `)

  return connection.commit()
}

export const createTables = async(connection) => {
  await connection.startTransaction()
  await connection.execute(`
    CREATE TABLE persons (
      id          ${PRIMARY},
      typeDoc     ${CHAR1},
      codeDoc     ${CPFCNPJ},
      birthday    ${DATE},
      name        ${NAME},
      nickName    ${NAME},
      observation ${TEXT},
      deleted     ${BOOLEAN} NOT NULL DEFAULT FALSE,

      addrUf           ${CHAR2},
      addrZipCode      ${CHAR8},
      addrCity         ${NAME},
      addrNeighborhood ${NAME},
      addrStreet       ${NAME},
      addrAdjunct      ${NAME}
    );

    CREATE TABLE emails (
      id      ${PRIMARY},
      name    ${NAME},
      email   ${EMAIL},
      deleted ${BOOLEAN} NOT NULL DEFAULT FALSE,
      person  INTEGER NOT NULL REFERENCES persons(id)
    );

    CREATE TABLE phones (
      id      ${PRIMARY},
      name    ${NAME},
      phone   ${PHONE},
      deleted ${BOOLEAN} NOT NULL DEFAULT FALSE,
      person  INTEGER NOT NULL REFERENCES persons(id)
    );

    CREATE TABLE kinships (
      id ${PRIMARY},
      kin ${SELECT},
      deleted ${BOOLEAN} NOT NULL DEFAULT FALSE,
      person INTEGER NOT NULL REFERENCES persons(id),
      kinship INTEGER NOT NULL REFERENCES persons(id)
    );
  `)

  return connection.commit()
}

export const configDatabase = {
  user: 'taller',
  database: 'taller',
  password: 'RE7531PH',
  port: 5432,
  max: 10,
  host: 'database',
  idleTimeoutMillis: 30000
}

export const createDatabase = async () => {
  const {connect, orm} = tallerPostgres(configDatabase)
  const connection = await connect().then(dropTables).then(createTables)
  return {connect, orm, connection}
}
