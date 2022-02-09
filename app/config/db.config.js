module.exports = {
  HOST: process.env.DB_HOST || "3.140.194.136",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "Cherry@2020",
  DB: process.env.DB_NAME || "EMF",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
