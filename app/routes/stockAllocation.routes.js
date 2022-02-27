const { verifySignUp } = require("../middleware");
const controller = require("../controllers/stockAllocation.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/allStocklist",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getStockList
  );

  app.get(
    "/api/notificationUserlist",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getNotificationUserlist
  );

  app.post(
    "/api/updateNotificationList",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.UpdateNotificationList
  );
  
  
};