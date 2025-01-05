const TransactionDTO = require('../models/DetailedAccount');


class AccountController {
  constructor(di = {}) {
    this.di = Object.assign({
      userRepository: require('../infra/mongoose/repository/userRepository'),
      accountRepository: require('../infra/mongoose/repository/accountRepository'),
      cardRepository: require('../infra/mongoose/repository/cardRepository'),
      transactionRepository: require('../infra/mongoose/repository/detailedAccountRepository'),

      saveCard: require('../feature/Card/saveCard'),
      salvarUsuario: require('../feature/User/salvarUsuario'),
      saveAccount: require('../feature/Account/saveAccount'),
      getUser: require('../feature/User/getUser'),
      getAccount: require('../feature/Account/getAccount'),
      saveTransaction: require('../feature/Transaction/saveTransaction'),
      getTransaction: require('../feature/Transaction/getTransaction'),
      getCard: require('../feature/Card/getCard'),
    }, di);
  }

  async find(req, res) {
    const { accountRepository, getAccount, getCard, getTransaction, transactionRepository, cardRepository } = this.di;

    try {
      const userId = req.user.id;
      const account = await getAccount({ repository: accountRepository, userId });
      const transactions = await getTransaction({
        filter: { accountId: account[0].id },
        repository: transactionRepository
      });
      const cards = await getCard({ filter: { accountId: account[0].id }, repository: cardRepository });

      res.status(200).json({
        message: 'Conta encontrada carregado com sucesso',
        result: {
          account,
          transactions,
          cards,
        }
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro no servidor'
      });
    }

  }

  async createTransaction(req, res) {
    const { saveTransaction, transactionRepository } = this.di;
    const { accountId, value, type, from, to } = req.body;
    const transactionDTO = new TransactionDTO({ accountId, value, from, to, type, date: new Date() });

    const transaction = await saveTransaction({ transaction: transactionDTO, repository: transactionRepository });

    res.status(201).json({
      message: 'Transação criada com sucesso',
      result: transaction
    });
  }

  async editTransaction(req, res) {
    const { transactionRepository } = this.di;
    const { transactionId } = req.params;
    const { value, type, from, to } = req.body;

    try {
      const updatedTransaction = await transactionRepository.update(transactionId, {
        value,
        type,
        from,
        to,
      });

      if (!updatedTransaction) {
        return res.status(404).json({ message: 'Transação não encontrada' });
      }

      res.status(200).json({
        message: 'Transação editada com sucesso',
        result: updatedTransaction,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro ao editar a transação',
        error: error.message,
      });
    }
  }


  async deleteTransaction(req, res) {
    const { transactionRepository } = this.di;
    const { transactionId } = req.params;

    try {
      const deletedTransaction = await transactionRepository.deleteById(transactionId);

      if (!deletedTransaction) {
        return res.status(404).json({ message: 'Transação não encontrada' });
      }

      res.status(200).json({
        message: 'Transação excluída com sucesso',
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro ao excluir a transação',
        error: error.message,
      });
    }
  }


  async getStatment(req, res) {
    const { getTransaction, transactionRepository } = this.di;

    const { accountId } = req.params;

    const transactions = await getTransaction({ filter: { accountId }, repository: transactionRepository });
    res.status(201).json({
      message: 'Transação criada com sucesso',
      result: {
        transactions
      }
    });
  }
}

module.exports = AccountController;