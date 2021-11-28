module.exports = (sequelize, Sequelize) => {
    const NotificationList = sequelize.define("stocksNotificationLists", {
      code: { type: Sequelize.INTEGER , primaryKey: true},
      name: { type: Sequelize.STRING },
      industry: { type: Sequelize.STRING },
      assignee_usrId: { type: Sequelize.INTEGER },
      approver_usrId: { type: Sequelize.INTEGER },
    }, {
      timestamps: false
    });
  
    return NotificationList;
  };