const { User } = require('../modelos');

const create = async (userData) => {
  const user = new User(userData);
  return user.save();
};

const getById = async (id) => {
  return User.findById(id);
};

const get = async (user = {}) => {
  return User.find(user);
};

const update = async (id, userData) => {
  return User.findByIdAndUpdate(id, {
    $set: userData
  }, {
    new: true,
    runValidators: true
  });
};

module.exports = {
  create,
  getById,
  get,
  update,
};