const db = require("../helper/db");

exports.addTransaction = async (req, res) => {
  const request = req.body;
  try {
    let query = `INSERT INTO adm_transactions ( code, qty, price,isBuy,transDate, account) VALUES 
  ( ${request.code},${request.quantity},${request.price},${request.isBuy},'${request.transDate}','${request.account}' )`;
    console.log(query);
    const resData = await db.query(query);
    if (resData) {
      res.status(200).send({ message: 'success' });
    } else {
      res.status(500).send({ message: 'no data' });
    }
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ message: err.message });
  }
};

exports.getStockPrices = async (req, res) =>{
  
  try {
    let query = `SELECT * FROM adm_stocks_prices WHERE date =( SELECT MAX(date) FROM adm_stocks_prices )`;
    console.log(query);
    const resData = await db.query(query);
    if (resData) {
      res.status(200).send(resData);
    } else {
      res.status(500).send({ message: 'no data' });
    }
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ message: err.message });
  }
}


exports.getTransactions = async (req, res) => {
  const queryInfo = req.query;
  let query = `SELECT * FROM adm_transactions`;
  console.log(query);
  try {
    const resData = await db.query(query);
    if (resData) {
      res.status(200).send(resData);
    } else {
      res.status(500).send({ message: 'no data' });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
