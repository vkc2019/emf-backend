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
    "/api/all_stocklist",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getStockList
  );

  app.get(
    "/api/notification_user_list",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getNotificationUserlist
  );

  app.post(
    "/api/update_notification_list",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.UpdateNotificationList
  );
  
  
};