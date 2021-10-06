module.exports = (sequelize, Sequelize) => {
    const Portifolio = sequelize.define("portifolio", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      code: {
        type: Sequelize.STRING
      },
      buy_price:{
        type: Sequelize.STRING
      },
      qty:{
        type: Sequelize.INTEGER
      },
      sell_price:{
        type: Sequelize.STRING
      },
      is_active:{
        type: Sequelize.STRING
      },
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
  
    return Portifolio;
  };