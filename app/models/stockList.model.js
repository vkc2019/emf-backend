module.exports = (sequelize, Sequelize) => {
    const StockList = sequelize.define("all_stock_list", {
      code: { type: Sequelize.INTEGER ,  primaryKey: true },
      name: { type: Sequelize.STRING },
      industry: { type: Sequelize.STRING },
      security_id: { type: Sequelize.STRING },
    }, {
      freezeTableName: true,
      timestamps: false
    });
  
    return StockList;
  };

  