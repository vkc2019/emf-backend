const { verifySignUp } = require("../middleware");
const controller = require("../controllers/notifications.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/ignore-notifications",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getIgnoreNotificationsList
  );
  app.post(
    "/api/ignore-notifications",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.createUpdateNotification
  );

  app.get(
    "/api/notificationlist",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getNotificationList
  );
  app.post(
    "/api/updatenews",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.updateNewsDetails
  );

  
};