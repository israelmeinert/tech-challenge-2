const { Router } = require('express');
const AccountController = require('./controller/Account');
const accountController = new AccountController({});
const router = Router();
const upload = require('./multer'); // Caminho para o arquivo multer.js

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
router.get('/account', accountController.find.bind(accountController));


/**
 * @swagger
 * /account/transaction:
 *   post:
 *     summary: Cria uma nova transação
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountId:
 *                 type: string
 *                 description: ID da conta associada
 *               value:
 *                 type: number
 *                 description: Valor da transação
 *               type:
 *                 type: string
 *                 description: Tipo da transação (e.g., débito ou crédito)
 *               from:
 *                 type: string
 *                 description: Origem da transação
 *               to:
 *                 type: string
 *                 description: Destino da transação
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 */
router.post('/account/transaction', upload.single('anexo'), accountController.createTransaction.bind(accountController));

router.get('/account/transaction/:anexo', accountController.getAnexo.bind(accountController));

/**
 * @swagger
 * /account/transaction/{transactionId}:
 *   put:
 *     summary: Edita uma transação existente
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         description: ID da transação a ser editada
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 description: Novo valor da transação
 *               type:
 *                 type: string
 *                 description: Novo tipo da transação
 *               from:
 *                 type: string
 *                 description: Nova origem da transação
 *               to:
 *                 type: string
 *                 description: Novo destino da transação
 *     responses:
 *       200:
 *         description: Transação editada com sucesso
 *       404:
 *         description: Transação não encontrada
 *       500:
 *         description: Erro ao editar a transação
 */
router.put('/account/transaction/:transactionId', upload.single('anexo'), accountController.editTransaction.bind(accountController));

/**
 * @swagger
 * /account/transaction/{transactionId}:
 *   delete:
 *     summary: Exclui uma transação
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         description: ID da transação a ser excluída
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transação excluída com sucesso
 *       404:
 *         description: Transação não encontrada
 *       500:
 *         description: Erro ao excluir a transação
 */
router.delete('/account/transaction/:transactionId', accountController.deleteTransaction.bind(accountController));

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
 *         description: Token inválido
 */
router.get('/account/:accountId/statement', accountController.getStatment.bind(accountController));

module.exports = router;
