const userDTO = require('../models/User');
const accountDTO = require('../models/Account');
const cardDTO = require('../models/Card');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tech-challenge';

class UserController {
  constructor(di = {}) {
    this.di = Object.assign({
      userRepository: require('../infra/mongoose/repository/userRepository'),
      accountRepository: require('../infra/mongoose/repository/accountRepository'),
      transactionRepository: require('../infra/mongoose/repository/detailedAccountRepository'),
      cardRepository: require('../infra/mongoose/repository/cardRepository'),
      saveTransaction: require('../feature/Transaction/saveTransaction'),

      saveCard: require('../feature/Card/saveCard'),
      salvarUsuario: require('../feature/User/salvarUsuario'),
      saveAccount: require('../feature/Account/saveAccount'),
      getUser: require('../feature/User/getUser'),
    }, di);
  }

  async create(req, res) {
    const user = new userDTO(req.body);
    const {
      userRepository,
      accountRepository,
      cardRepository,
      salvarUsuario,
      saveAccount,
      saveCard,
      transactionRepository,
      saveTransaction
    } = this.di;

    if (!user.isValid()) return res.status(400).json({ 'message': 'não houve informações enviadas' });
    try {
      const userCreated = await salvarUsuario({
        user, repository: userRepository
      });

      const accountCreated = await saveAccount({
        account: new accountDTO({ userId: userCreated.id, type: 'Debit' }),
        repository: accountRepository
      });

      function generateRandomTransactions() {
        const names = ['Ana', 'Rafael', 'João', 'Maria', 'Carlos', 'Beatriz', 'Lucas', 'Fernanda'];
        const types = ['Debit', 'Credit'];
        const transactions = [];

        for (let i = 0; i < 300; i++) {
          const from = names[Math.floor(Math.random() * names.length)];
          let to;
          do {
            to = names[Math.floor(Math.random() * names.length)];
          } while (to === from);

          const value = parseFloat((Math.random() * 1000).toFixed(2));
          const type = types[Math.floor(Math.random() * types.length)];
          const date = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);

          const transaction = {
            transaction: {
              accountId: accountCreated.id,
              value,
              from,
              to,
              type,
              date,
            },
            repository: transactionRepository,
          };

          transactions.push(transaction);
        }

        return transactions;
      }

      const transactions = generateRandomTransactions();
      for (const { transaction, repository } of transactions) {
        await saveTransaction({
          transaction: transaction,
          repository: repository
        });
      }

      const firstCard = new cardDTO({
        type: 'GOLD',
        number: 13748712374891010,
        dueDate: '2027-01-07',
        functions: 'Debit',
        cvc: '505',
        paymentDate: null,
        name: userCreated.username,
        accountId: accountCreated.id,
      });

      const cardCreated = await saveCard({ card: firstCard, repository: cardRepository });

      res.status(201).json({
        message: 'usuário criado com sucesso',
        result: userCreated,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'caiu a aplicação' });
    }

  }

  async find(req, res) {

    const { userRepository, getUser } = this.di;
    try {
      const users = await getUser({ repository: userRepository });
      res.status(200).json({
        message: 'Usuário carregado com sucesso',
        result: users
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro no servidor'
      });
    }

  }

  async auth(req, res) {
    const { userRepository, getUser } = this.di;
    const { email, password } = req.body;
    const user = await getUser({ repository: userRepository, userFilter: { email, password } });

    if (!user?.[0]) return res.status(401).json({ message: 'Usuário não encontrado' });
    const userToTokenize = { ...user[0], id: user[0].id.toString() };
    res.status(200).json({
      message: 'Usuário autenticado com sucesso',
      result: {
        token: jwt.sign(userToTokenize, JWT_SECRET, { expiresIn: '12h' })
      }
    });
  }

  static getToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}


module.exports = UserController;