# taller-postgres
Sample with Webpack.

Environment with:

* [Docker](https://www.docker.com/products/docker#/linux)
* [Docker Compose](https://docs.docker.com/compose/install/)
* [Debian](https://www.debian.org/releases/stable/)
* [Make](http://www.gnu.org/software/make/manual/make.html#Running)
* [NodeJS](https://nodejs.org/dist/latest-v6.x/docs/api/)


Make tasks of environment

* Build docker environment - ```$ make build```
* UP and RUN docker environment - ```$ make run```
* Stop docker environment - ```$ make stop```
* Destroy docker environment - ```$ make down```


First steps after environment builded
```sh
taller:~/app$ npm install
taller:~/app$ npm test
taller:~/app$ npm run build
```


##How to usage?
```javascript
import tallerPostgres from 'taller-postgres'

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
const config = {
  user: 'foo', //env var: PGUSER
  database: 'my_db', //env var: PGDATABASE
  password: 'secret', //env var: PGPASSWORD
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
}

//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
const pool = tallerPostgres(config)

try {
  // to run a query we can acquire a client from the pool,
  // run a query on the client, and then return the client to the pool
  const client = await pool.connect()

  // Start transaction
  await client.startTransaction()

  // Execute SQL of searches
  const {rows} = await client.execute('SELECT * FROM customers')

  // Execute SQL of inserts
  const {rows} = await client.execute('INSERT INTO customers (name, birthday) VALUES ("Test", "1988-06-10")')

  // Execute SQL of updates
  const {rows} = await client.execute('UPDATE customers SET name = "Test", birthday = "1988-06-10" WHERE (id = 1)')

  // Execute SQL of deletes
  const {rows} = await client.execute('DELETE FROM customers WHERE (id = 1)')

  // Commit transaction
  await client.commit()

  // Or rollback transaction
  await client.rollback()

  // release the client back to the pool
  await client.release()
} catch (error) {
  console.log(error)
}
```
