const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.PG_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;
