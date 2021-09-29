module.exports = (sequelize, Sequelize) => {
  const TabDetails = sequelize.define("formulas", {
    parameter: { type: Sequelize.STRING },
    formula: { type: Sequelize.STRING },
    requiredParameter: { type: Sequelize.STRING },
    preYearParameter: { type: Sequelize.STRING },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
    },
  });

  return TabDetails;
};
