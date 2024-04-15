const User = require("../entities/user");
const { sign } = require("../../frameworks/http/jwt");

class ManageUsersUsecase {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  async createMarketplaceUser(userData) {
    const user = new User(
      undefined,
      userData.name,
      userData.email,
      userData.password,
      userData.shippingAddress
    );
    user.role = "marketplace";
    const id = await this.usersRepository.createUser(user);
    user.id = id;

    return user;
  }

  async login(userData) {
    const user = await this.usersRepository.getUserWithFilters(userData);
    return await sign(user);
  }
}

module.exports = ManageUsersUsecase;
