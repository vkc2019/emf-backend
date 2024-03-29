const { verifySignUp } = require("../middleware");
const controller = require("../controllers/quaterlyTrends.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/quaterly_trends",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getQuaterlyTrends
  );
  app.get(
    "/api/getQuaterlyTrendsCompare",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getQuaterlyTrendsCompare
  );
  app.get(
    "/api/quaterly_trends_parameter",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getQuaterlyParameterTrends
  );
  app.get(
    "/api/quaterly_parameter",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getQuaterlyParameter
  );
  app.post(
    "/api/update_quaterly_parameter",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.update_quaterly_parameter
  );
  app.get(
    "/api/get_lastest_results",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getLastestResults
  );
  
  
};