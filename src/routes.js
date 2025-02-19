const { Router } = require('express')
const AccountController = require('./controller/Account')
const accountController = new AccountController({})
const router = Router()
console.log('exemplo de preview')
/**
 * @swagger
 * /account:
 *   get:
 *     summary: Busca contas
 *     tags: [Contas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contas encontradas
 */
router.get('/account', accountController.find.bind(accountController))

/**
 * @swagger
 * /account/transaction:
 *   post:
 *     summary: Cria uma nova transação
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 */
router.post('/account/transaction', accountController.createTransaction.bind(accountController))

/**
 * @swagger
 * /account/{accountId}/statement:
 *   get:
 *     summary: Obtém extrato da conta
 *     tags: [Extratos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         description: ID da conta
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Extrato encontrado
 *       401:
 *         description: Token invalido
 */
router.get('/account/:accountId/statement', accountController.getStatment.bind(accountController))

module.exports = router
