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


  
};