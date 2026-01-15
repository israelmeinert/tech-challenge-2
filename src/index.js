const Express = require("express");
const publicRoutes = require("./publicRoutes");
const routes = require("./routes");
const connectDB = require("./infra/mongoose/mongooseConect");
const app = new Express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger");
const UserController = require("./controller/User");
const cors = require("cors");

app.use(Express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(publicRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use((req, res, next) => {
  if (req.url.includes("/docs")) {
    return next();
  }
  const [_, token] = req.headers["authorization"]?.split(" ") || [];
  const user = UserController.getToken(token);
  if (!user) return res.status(401).json({ message: "Token inválido" });
  req.user = user;
  next();
});
app.use(routes);

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

const serverPromise = connectDB().then(() => {
  if (NODE_ENV !== "test") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor rodando na porta ${PORT} (${NODE_ENV})`);
    });
  }
});

module.exports = app;
module.exports.ready = serverPromise;
