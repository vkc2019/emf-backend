const db = require("../helper/db");

exports.addTransaction = async (req, res) => {
  const request = req.body;
  try {
    let query = `INSERT INTO adm_transactions ( code, qty, price, type, date, account) VALUES ` ;

    request.forEach(ta => {
      query += `( ${ta.stock.code},${ta.quantity},${ta.price},'${ta.type}','${ta.date.split('T')[0]}','${ta.account.name}' ) ,`;
    });
  
    query = query.substring(0,query.length-1); // to remove the comma

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
  let query = `SELECT admtran.code, ast.name , admtran.qty, admtran.price, admtran.type, admtran.date, admtran.account
   FROM EMF.adm_transactions admtran 
  INNER JOIN adm_stocks ast Where ast.code = admtran.code`;
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

exports.getAccountDetails = async (req, res) => {
  let query = `SELECT * FROM EMF.adm_accounts`;
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


