const { DetailedAccount } = require('../modelos');

const create = async (action) => {
    const detailedAccount = new DetailedAccount(action);
    return detailedAccount.save();
};

const getById = async (id) => {
  return DetailedAccount.findById(id);
};

const get = async (detailedAccount={}) => {
    return DetailedAccount.find(detailedAccount);
};

const deleteById = async (id) => {
    return DetailedAccount.findByIdAndDelete(id);
};

const updateById = async (id, updateData) => {
  return await DetailedAccount.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );
};

module.exports = {
  create,
  getById,
  get,
  deleteById,
  updateById
};