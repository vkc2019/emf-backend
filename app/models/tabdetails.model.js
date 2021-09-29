

module.exports = (sequelize, Sequelize) => {
    const TabDetails = sequelize.define("tabdetails", {
      tabName : { type: Sequelize.STRING },
      parameter	: { type: Sequelize.STRING },
      isFormula	: { type: Sequelize.INTEGER },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
      },
    });
  
    return TabDetails;
  };
  