const { verifySignUp } = require("../middleware");
const controller = require("../controllers/stock.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/all_stocks_config",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getAllStocksConfigList
  );

  app.post(
    "/api/all_stocks_config",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.updateStockConfig
  );

  app.get(
    "/api/stock",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getStockList
  );

  app.get(
    "/api/tabs",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getTabList
  );

  app.get(
    "/api/industry",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getIndustryList
  );
  app.get(
    "/api/stocks_by_params",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getStockListByParams
  );

  app.post(
    "/api/stock",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.saveStock
  );

  app.get(
    "/api/portifolio",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getPortifolio
  );

  app.get(
    "/api/eachstock",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getEachStockDetails
  );

  app.get(
    "/api/latestyear",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getLastestYearStockDetails
  );

  app.get(
    "/api/ema_data",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getEMACrossOver
  );

  app.get(
    "/api/get_invested_stocks",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getInvestedStocks
  );
  
  
};