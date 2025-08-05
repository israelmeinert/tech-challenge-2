const DetailedAccountModel = require("../../models/DetailedAccount")

const deleteTransaction = async ({
    transactionId, accountId, repository
}) => {
  if (!transactionId || !accountId) {
    throw new Error('Dados da transação incompletos');
  }  
  const result = await repository.deleteById(transactionId);
  return result;
}

module.exports = deleteTransaction