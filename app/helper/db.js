const mysql = require('mysql2/promise');
const config = require('config');

async function query(sql) {
  try {
    let connect = mysql.createPool(config.get('mainDbConfig'));
    const [results,] = await connect.execute(sql);
    return results;
  } catch (err) {
    console.log(`ERROR IN EXECUTING SQL ${err.message}`)
  }

}

module.exports = { query }