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
    "/api/notificationList",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.getNotificationList
  );
  app.post(
    "/api/updateNews",
    [
      verifySignUp.checkRolesExisted
    ],
    controller.updateNewsDetails
  );

  
};