const mysql = require('mysql2/promise');
const config = require('config');

async function query(sql) {
  let connect = mysql.createPool(config.get('mainDbConfig'));
  try {
    const [results,] = await connect.execute(sql);
    connect.end();
    return results;
  } catch (err) {
    connect.end();
    console.log(`ERROR IN EXECUTING SQL ${err.message}`)
  }

}

module.exports = { query }