const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.PG_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectModule: require("pg"),
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;
