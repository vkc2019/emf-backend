const { verifySignUp } = require("../middleware");
const controller = require("../controllers/transaction.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/add_transaction",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.addTransaction
  );

  app.get(
    "/api/transactions",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getTransactions
  );

  app.get(
    "/api/get_stock_prices",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getStockPrices
  );

  app.get(
    "/api/get_account_details",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getAccountDetails
  )
};