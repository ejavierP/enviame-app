

class User {
  constructor(id,name, email,password,shippingAddress,role) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.email = email;
    this.shippingAddress = shippingAddress;
    this.role = role;
  }
}

module.exports = User;