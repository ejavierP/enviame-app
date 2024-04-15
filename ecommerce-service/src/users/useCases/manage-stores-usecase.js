const User = require("../entities/user");

class ManageUsersUsecase {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  async createMarketplaceUser(userData) {
    const user = new User(undefined, userData.name, userData.email,userData.password,userData.shippingAddress);
    user.role = 'marketplace';
    const id = await this.usersRepository.createUser(user);
    user.id = id;

    return user;
  }
}

module.exports = ManageUsersUsecase;
