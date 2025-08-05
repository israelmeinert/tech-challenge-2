const userDTO = require('../models/User')
const accountDTO = require('../models/Account')
const cardDTO = require('../models/Card')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'tech-challenge'
const TIMEOUT = 120000 // 2 minutes in milliseconds

class UserController {
  constructor(di = {}) {
    this.di = Object.assign({
      userRepository: require('../infra/mongoose/repository/userRepository'),
      accountRepository: require('../infra/mongoose/repository/accountRepository'),
      cardRepository: require('../infra/mongoose/repository/cardRepository'),

      saveCard: require('../feature/Card/saveCard'),
      salvarUsuario: require('../feature/User/salvarUsuario'),
      updateUser: require('../feature/User/updateUser'),
      saveAccount: require('../feature/Account/saveAccount'),
      getUser: require('../feature/User/getUser'),
    }, di)
  }

  async create(req, res) {
    const user = new userDTO(req.body)
    const { userRepository, accountRepository, cardRepository, salvarUsuario, saveAccount, saveCard } = this.di

    if (!user.isValid()) return res.status(400).json({ 'message': 'não houve informações enviadas' })
    
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Operation timed out')), TIMEOUT)
    );

    try {
      const userOperation = (async () => {
        const userCreated = await salvarUsuario({
          user, repository: userRepository
        })

        const accountCreated = await saveAccount({ 
          account: new accountDTO({ userId: userCreated.id, type: 'Debit' }), 
          repository: accountRepository 
        })

        const firstCard = new cardDTO({
          type: 'GOLD',
          number: 13748712374891010,
          dueDate: '2027-01-07',
          functions: 'Debit',
          cvc: '505',
          paymentDate: null,
          name: userCreated.username,
          accountId: accountCreated.id,
          type: 'Debit'
        })

        const cardCreated = await saveCard({ card: firstCard, repository: cardRepository })
        return { userCreated, accountCreated, cardCreated }
      })();

      const result = await Promise.race([userOperation, timeout]);

      res.status(201).json({
        message: 'usuário criado com sucesso',
        result: result.userCreated,
      })
    } catch (error) {
      console.error('[UserController][create] Error:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      // Send a more graceful error response
      res.status(500).json({ 
        message: 'Erro ao processar a requisição',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        requestId: Date.now().toString(36)
      })
    }

  }
  async update(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ message: 'ID não fornecido' });
      }

      // Remove id and _id from update data to avoid conflicts
      const { id: bodyId, _id, ...updateData } = req.body;

      const user = new userDTO({
        ...updateData,
        updatedAt: new Date()
      });

      const { userRepository, updateUser } = this.di;

      if (!user.isValid()) {
        return res.status(400).json({ message: 'dados inválidos' });
      }

      const userUpdated = await userRepository.update(id, updateData);

      if (!userUpdated) {
        return res.status(404).json({ message: 'usuário não encontrado' });
      }

      res.status(200).json({
        message: 'usuário atualizado com sucesso',
        result: userUpdated,
      });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({
        message: 'Erro ao atualizar usuário',
        error: error.message
      });
    }
  }
  async find(req, res) {

    const { userRepository, getUser } = this.di
    try {
      const users = await getUser({ repository: userRepository })
      res.status(200).json({
        message: 'Usuário carregado com sucesso',
        result: users
      })
    } catch (error) {
      res.status(500).json({
        message: 'Erro no servidor'
      })
    }

  }
  async auth(req, res) {
    const { userRepository, getUser } = this.di
    const { email, password } = req.body

    try {
      const authOperation = new Promise(async (resolve, reject) => {
        try {
          const user = await getUser({ repository: userRepository, userFilter: { email, password } })
          if (!user?.[0]) {
            reject(new Error('User not found'))
            return
          }
          const userToTokenize = { ...user[0], id: user[0].id.toString() }
          resolve(userToTokenize)
        } catch (err) {
          reject(err)
        }
      })

      const result = await Promise.race([
        authOperation,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Auth timeout')), TIMEOUT))
      ])

      res.status(200).json({
        message: 'Usuário autenticado com sucesso',
        result: {
          token: jwt.sign(result, JWT_SECRET, { expiresIn: '12h' })
        }
      })
    } catch (error) {
      console.error('[UserController][auth] Error:', {
        message: error.message,
        email,
        timestamp: new Date().toISOString()
      });

      res.status(error.message === 'User not found' ? 401 : 500).json({
        message: error.message === 'User not found' ? 'Usuário não encontrado' : 'Erro na autenticação',
        requestId: Date.now().toString(36)
      })
    }
  }
  static getToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      return decoded
    } catch (error) {
      return null
    }
  }
}



module.exports = UserController