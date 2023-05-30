const db = require("../helper/db");

exports.addTransaction = async (req, res) => {
  const {insertRecords , updateRecords} = req.body;
  try {
    let query = `INSERT INTO adm_transactions ( code, qty, price, type, date, account) VALUES ` ;

    let updateQuery = '';

    updateRecords.forEach(async(ta) => {
      query += `( ${ta.stock.code},${ta.quantity},${ta.price},'${ta.type}','${ta.date.split('T')[0]}','${ta.account.name}' ) ,`;
      
      ta.type == "Buy" ? updateQuery = `update adm_financial_tracker set average_price = ((quantity + IFNULL(average_price,0)) + (${ta.quantity}*${ta.price}))/(quantity+${ta.quantity}) , quantity = quantity + ${ta.quantity} where code = ${ta.stock.code} and account = '${ta.account.name}'` : 

      updateQuery = `update adm_financial_tracker set average_price = ((quantity + IFNULL(average_price,0)) - (${ta.quantity}*${ta.price}))/NULLIF((quantity - ${ta.quantity}),0), quantity = quantity - ${ta.quantity} where code = ${ta.stock.code} and account = '${ta.account.name}'`

      await db.query(updateQuery);

    });

    insertRecords.forEach(async(ta) => {
      query += `( ${ta.stock.code},${ta.quantity},${ta.price},'${ta.type}','${ta.date.split('T')[0]}','${ta.account.name}' ) ,`;
      
      let insertQuery = `INSERT INTO adm_financial_tracker ( code, quantity, average_price, account) VALUES 
      ( ${ta.stock.code}, ${ta.quantity}, (${ta.quantity}*${ta.price})/(${ta.quantity}), '${ta.account.name}')`

      await db.query(insertQuery);

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

exports.getTrackerDetails = async (req,res) => {
  let query = `SELECT finTracker.code, ast.name , finTracker.quantity, 
  finTracker.average_price,finTracker.account, asd.price
  FROM EMF.adm_financial_tracker finTracker 
  INNER JOIN adm_stocks ast on ast.code = finTracker.code
  INNER JOIN adm_stocks_data asd on asd.code = finTracker.code 
  where finTracker.quantity > 0`;

  console.log(query);
  try {
    const resData = await db.query(query);
    if (resData) {
      let result = [];
      for (const each of resData) {
        result.push({
          "Code" : each.code,
          "Name" : each.name,
          "Quantity" : each.quantity,
          "Price" : Number(parseFloat(each.price).toFixed(2)),
          "Average Price" : Number(parseFloat(each.average_price).toFixed(2)),
          "Invested Amount" : Number(parseFloat(each.average_price * each.quantity).toFixed(2)),
          "Current Value" : Number(parseFloat(each.price * each.quantity).toFixed(2)),
          "Profit / Loss" : Number(parseFloat((each.price * each.quantity) - (each.average_price * each.quantity)).toFixed(2)),
          "% of Profit / Loss" : Number(parseFloat((((each.price * each.quantity)/(each.average_price * each.quantity)) - 1) * 100).toFixed(2)),
          "Account" : each.account,
        })
      }
      res.status(200).send(result);
    } else {
      res.status(500).send({ message: 'no data' });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}


