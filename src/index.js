require('dotenv').config();
const Express = require('express')
const pinoHttp = require('pino-http');
const logger = require('./logger');
const publicRoutes = require('./publicRoutes')
const routes = require('./routes')
const connectDB = require('./infra/mongoose/mongooseConect');
const app = new Express()
const swaggerUi = require('swagger-ui-express');
const swaggerDocs =  require('./swagger')
const UserController = require('./controller/User')
const cors = require('cors')

app.use(Express.json())
app.use(pinoHttp({ logger }));

app.use(cors({
    origin: '*'
}))

app.use(publicRoutes)
app.get('/', (req, res) => {
  req.log.info('Rota raiz acessada');
  res.json({
    message: 'API Byte Bank UP!',
    date: new Date().toISOString()
  });
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use((req, res, next) => {
    if (req.url.includes('/docs')) {
        return next();
    }
    const [_, token] = req.headers['authorization']?.split(' ') || []
    const user = UserController.getToken(token)
    if (!user) return res.status(401).json({ message: 'Token inválido' })
    req.user = user
    next()
})
app.use(routes)

const PORT_VALUE = process.env.PORT || 3003;

connectDB().then(() => {
    app.listen(PORT_VALUE, () => {
        logger.info(`[BYTE BANK: API]: Servidor rodando na porta ${PORT_VALUE}`);
    });
});


module.exports = app