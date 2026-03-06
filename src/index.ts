import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import * as useragent from "express-useragent";
import { engine } from "express-handlebars";
import path from "path";
import routes from "./routes";
import { initFirebase } from "./services/firebase";

const app = express();

app.use(useragent.express());

// Variáveis globais disponíveis em todos os templates
app.use((_req, res, next) => {
  res.locals.currentYear = new Date().getFullYear();
  next();
});

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

// Arquivos estáticos (SVG, imagens, etc)
app.use("/assets", express.static(path.resolve(__dirname, "./assets")));

// Cloud Run injeta PORT=8080; localmente usa 3000
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Inicializa o Firebase
initFirebase();

app.use(routes);

app.listen(port, () => {
  console.log(`🚀 OneLink rodando em http://localhost:${port}`);
  console.log(`📱 Teste no mobile para ver o redirecionamento de apps`);
});
