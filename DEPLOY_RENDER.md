# Guia de Deploy no Render

## Pré-requisitos

- Conta no [Render.com](https://render.com/)
- Repositório GitHub com este projeto
- MongoDB Atlas (banco de dados na nuvem) -
  [mongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## Passo 1: Preparar o MongoDB Atlas

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie uma conta ou faça login
3. Crie um novo projeto/cluster
4. Na seção "Security", crie um usuário com senha
5. Na seção "Network Access", adicione `0.0.0.0/0` (permitir todas as conexões)
6. Copie a string de conexão no formato:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```

---

## Passo 2: Criar variáveis de ambiente

Você precisará das seguintes variáveis de ambiente no Render:

- `MONGODB_URI`: String de conexão do MongoDB
- `JWT_SECRET`: Chave secreta para JWT (crie uma string aleatória forte)
- `NODE_ENV`: `production`
- `PORT`: `3000` (opcional, o Render usa por padrão)

---

## Passo 3: Preparar o repositório GitHub

1. Faça push de todo o código para o GitHub
2. Certifique-se de que o `package.json` tem o script `start`:
   ```json
   "start": "cross-env NODE_ENV=production node src/index.js"
   ```
   ✅ Seu projeto já tem isso!

---

## Passo 4: Deploy no Render

### Opção A: Usando Web Service (Recomendado)

1. Acesse [Render Dashboard](https://dashboard.render.com/)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub
4. Preencha as informações:
   - **Name**: `tech-challenge-backend` (ou outro nome)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (para testes) ou Paid (para produção)
5. Clique em **"Advanced"** e adicione as variáveis de ambiente:
   - `MONGODB_URI`: (string de conexão do MongoDB)
   - `JWT_SECRET`: (gere uma chave aleatória, ex: `openssl rand -base64 32`)
   - `NODE_ENV`: `production`
6. Clique em **"Create Web Service"**
7. Aguarde o deploy (2-5 minutos)

### Opção B: Usando Docker

Se preferir usar Docker:

1. Siga os passos 1-3 acima
2. Na página de criação do Web Service, selecione **"Docker"** em vez de Node
3. O Render detectará automaticamente seu `Dockerfile`
4. Complete as variáveis de ambiente (mesmo passo 5 acima)
5. Clique em **"Create Web Service"**

---

## Passo 5: Configurar variáveis de ambiente no código

Verifique se seu `src/index.js` usa as variáveis corretamente:

```javascript
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

// Garantir que a porta está ouvindo corretamente
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${port}`);
});
```

Confirme que seu arquivo `mongooseConect.js` usa a variável `MONGODB_URI`:

```javascript
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/seu-db";
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

---

## Passo 6: Adicionar healthcheck (opcional, mas recomendado)

Adicione uma rota de health check para evitar que o Render reinicie a aplicação:

```javascript
// Em seu index.js ou routes
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
```

Configure no Render em **Settings** → **Health Check Path**: `/health`

---

## Passo 7: Acessar a aplicação

Após o deploy ser concluído:

- URL da aplicação: `https://seu-app-name.onrender.com`
- Documentação Swagger: `https://seu-app-name.onrender.com/docs`

---

## Troubleshooting

### Erro: "Failed to build"

- Verifique se todas as dependências estão no `package.json`
- Confirme se o `npm start` funciona localmente
- Veja os logs no dashboard do Render

### Erro: "Conexão recusada ao MongoDB"

- Verifique a string `MONGODB_URI`
- Confirme que o IP `0.0.0.0/0` está permitido no MongoDB Atlas
- Teste a conexão localmente

### Erro: "Port is already in use"

- Use `process.env.PORT` em vez de uma porta fixa
- Render atribui a porta dinamicamente

### A aplicação fica reiniciando continuamente

- Verifique os logs de erro
- Adicione um healthcheck
- Certifique-se das variáveis de ambiente

---

## Monitoramento e Logs

1. No dashboard do Render, você pode ver os logs em tempo real
2. Configure alertas para quando a aplicação cair
3. Configure auto-deploy quando há push para a branch principal

---

## Próximos Passos

- Configure auto-deploy: Enable **auto-deploy** quando houver commits
- Configure domain customizado: Em **Settings** → **Custom Domain**
- Configure SSL/TLS: Render faz isso automaticamente
- Monitore o uso: Verifique CPU, memória e requisições no dashboard
