const User = require("../../models/User")

const updateUser = async ({
  user, repository
}) => {
  const resultado = await repository.update(user)
  return new User(resultado.toJSON())
}

module.exports = updateUser 