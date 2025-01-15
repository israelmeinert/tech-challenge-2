const DetailedAccountModel = require('../../models/DetailedAccount');

const getTransaction = async ({ filter, repository }) => {
  const mongoFilter = {};

  if (!!filter.dateInitial) {
    mongoFilter.date = { ...mongoFilter.date, $gte: new Date(filter.dateInitial) };
  }
  if (!!filter.dateFinal) {
    mongoFilter.date = { ...mongoFilter.date, $lte: new Date(filter.dateFinal) };
  }

  if (filter.accountId) mongoFilter.accountId = filter.accountId;
  if (filter.type) mongoFilter.type = filter.type;

  if (!!filter.valueInitial) {
    mongoFilter.value = { ...mongoFilter.value, $gte: filter.valueInitial };
  }
  if (!!filter.valueFinal) {
    mongoFilter.value = { ...mongoFilter.value, $lte: filter.valueFinal };
  }

  if (filter.text) {
    mongoFilter.$or = [
      { from: { $regex: filter.text, $options: 'i' } },
      { to: { $regex: filter.text, $options: 'i' } },
    ];
  }

  if (filter.anexo !== undefined) {
    mongoFilter.anexo = filter.anexo ? { $ne: '' } : { $eq: '' };
  }
  const result = await repository.get(mongoFilter);

  return result?.map(transaction => new DetailedAccountModel(transaction));
};

module.exports = getTransaction;
