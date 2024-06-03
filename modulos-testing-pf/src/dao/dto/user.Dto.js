class UserDTO {
  constructor(data) {
    this.email = data.email;
    this.name = data.name;
    this.lastname = data.lastname;
    this.cartId = data.cart;
    this.role = data.role;
  }
}

module.exports = UserDTO;