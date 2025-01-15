const TransactionDTO = require('../models/DetailedAccount');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

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
        message: 'Erro ao recuperar dados da conta', error: error.message,
      });
    }
  }

  async createTransaction(req, res) {
    const { saveTransaction, transactionRepository } = this.di;
    const { accountId, value, type, from, to } = req.body;
    const anexo = req.file;

    if (!anexo) {
      return res.status(400).json({ message: 'Arquivo não enviado!' });
    }

    const transactionDTO = new TransactionDTO({
      accountId,
      value,
      from,
      to,
      type,
      date: new Date(),
    });
    if (anexo) {
      transactionDTO.anexo = anexo.filename;
    }

    try {
      const transaction = await saveTransaction({
        transaction: transactionDTO,
        repository: transactionRepository
      });

      res.status(201).json({
        message: 'Transação criada com sucesso',
        result: transaction
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro ao criar a transação',
        error: error.message
      });
    }
  }

  async editTransaction(req, res) {
    const { transactionRepository } = this.di;
    const { transactionId } = req.params;
    const { value, type, from, to } = req.body;
    const anexo = req.file;

    const transactionDTO = new TransactionDTO({
      value,
      from,
      to,
      type,
    });
    if (anexo) {
      transactionDTO.anexo = anexo.filename;
    }


    try {
      const updatedTransaction = await transactionRepository.update(transactionId, transactionDTO);

      if (!updatedTransaction) {
        return res.status(404).json({ message: 'Transação não encontrada' });
      }

      res.status(200).json({
        message: 'Transação editada com sucesso', result: updatedTransaction,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro ao editar a transação', error: error.message,
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
        message: 'Erro ao excluir a transação', error: error.message,
      });
    }
  }

  async getAnexo(req, res) {
    try {
      const { anexo } = req.params;
      const filePath = path.join(__dirname, '../../', '/uploads', anexo);

      res.download(filePath, anexo, (err) => {
        if (err) {
          console.error('Erro ao enviar o arquivo:', err);
          res.status(500).json({ message: 'Erro ao enviar o arquivo' });
        }
      });
    } catch (error) {
      console.error('Erro ao tentar fazer o download do arquivo:', error);
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }

  async getStatment(req, res) {
    const { getTransaction, transactionRepository } = this.di;
    const { accountId } = req.params;
    const { type, valueInitial, valueFinal, dateInitial, dateFinal, text, anexo } = req.query;

    const filter = {
      accountId,
      type: type || '',
      valueInitial: valueInitial ? Number(valueInitial) : undefined,
      valueFinal: valueFinal ? Number(valueFinal) : undefined,
      dateInitial: dateInitial || '',
      dateFinal: dateFinal || '',
      text: text || '',
      anexo: anexo === 'true' ? true : anexo === 'false' ? false : undefined,
    };

    try {
      const transactions = await getTransaction({ filter, repository: transactionRepository });
      res.status(200).json({
        message: 'Transações recuperadas com sucesso', result: { transactions },
      });
    } catch (error) {
      console.error('Erro ao recuperar transações:', error);
      res.status(500).json({
        message: 'Erro ao recuperar transações',
        error: error.message,
      });
    }
  }
}

module.exports = AccountController;
