const { Sequelize } = require("sequelize");

let sequelize;

if (!global._sequelize) {
  global._sequelize = new Sequelize(process.env.PG_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    }
  });
}

sequelize = global._sequelize;

module.exports = sequelize;
