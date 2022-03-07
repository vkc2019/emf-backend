const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: 0,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.stock = require("../models/stock.model")(sequelize, Sequelize);
db.tab = require("../models/tabdetails.model")(sequelize, Sequelize);
db.formula = require("../models/formula.model")(sequelize, Sequelize);
db.portifolio = require("../models/portifolio.model")(sequelize, Sequelize);

db.notification = require("../models/notification.model")(sequelize, Sequelize);
db.news = require("../models/news.model")(sequelize, Sequelize);
db.stockList = require("../models/stockList.model")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.notification.hasMany(db.news, {
  foreignKey: 'code'
});

db.news.belongsTo(db.notification , {
  foreignKey: 'code'
});


db.ROLES = ["user", "admin"];

module.exports = db;