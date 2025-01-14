const DetailedAccountModel = require('../../models/DetailedAccount');

const getTransaction = async ({
                                filter, repository
                              }) => {
  const mongoFilter = {};

  if (filter.dateInitial && filter.dateFinal) {
    mongoFilter.date = {
      $gte: new Date(filter.dateInitial),
      $lte: new Date(filter.dateFinal),
    };
  }

  if (filter.accountId) mongoFilter.accountId = filter.accountId;
  if (filter.type) mongoFilter.type = filter.type;
  if (filter.value) mongoFilter.value = filter.value;
  if (filter.from) mongoFilter.from = { $regex: filter.from, $options: 'i' };
  if (filter.to) mongoFilter.to = { $regex: filter.to, $options: 'i' };
  if (filter.anexo !== undefined) {
    mongoFilter.anexo = { $ne: '' };
  }
  const result = await repository.get(mongoFilter);

  return result?.map(transaction => new DetailedAccountModel(transaction));
};

module.exports = getTransaction;
