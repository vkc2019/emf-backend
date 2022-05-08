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
    "/api/quaterly_trends_parameter",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getQuaterlyParameterTrends
  );
 
  
};