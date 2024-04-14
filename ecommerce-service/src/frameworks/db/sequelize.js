const { Sequelize } = require('sequelize');

// Conexión a una base de datos SQL por medio del ORM 
// Es agnóstico a la base de datos misma (MySQL, Postgres, etc).

class SequelizeClient {

  constructor() {


    const dialect = process.env.SEQUELIZE_DIALECT;
    const username = process.env.SEQUELIZE_USERNAME;
    const password = process.env.SEQUELIZE_PASSWORD;
    const database = process.env.SEQUELIZE_DATABASE;


    const host = process.env.SEQUELIZE_HOST;

    this.sequelize = new Sequelize(database, username, password, {
      dialect: dialect,
      host: host,
      logging: false,
    });

  }

  syncDatabase() {

    var syncOptions = {
      alter: false,
    };

    this.sequelize.sync(syncOptions)
      .catch(error => {
        console.log("Couldn't sync database", error);
      });

  }

}

module.exports = SequelizeClient;