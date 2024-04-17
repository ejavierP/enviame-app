const { DataTypes } = require("sequelize");
const { db } = require("../../frameworks/db/sequelize");

class SequelizeUserRepository {
  constructor() {
    this.userModel = db.User;
  }

  async getUsers() {
    const users = await this.userModel.findAll({
      raw: true,
    });

    return users;
  }

  async getUser(id) {
    return await this.userModel.findByPk(id);
  }

  async getUserWithFilters(filters) {
    return await this.userModel.findOne({
      where: { ...filters },
    });
  }

  async createUser(user) {
    const data = await this.userModel.create(user);
    return data.id;
  }

  async updateUser(user) {
    const options = {
      where: {
        id: user.id,
      },
    };

    await this.userModel.update(user, options);
  }

  async deleteUser(id) {
    const options = {
      where: {
        id: id,
      },
    };

    await this.userModel.destroy(options);
  }

  async deleteAllUsers() {
    if (this.test) {
      const options = {
        truncate: true,
      };

      await this.userModel.destroy(options);
    }
  }

  async dropUsersTable() {
    if (this.test) {
      await this.userModel.drop();
    }
  }
}

module.exports = SequelizeUserRepository;
