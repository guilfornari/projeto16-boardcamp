import express from "express";
import cors from "cors";
import gamesRouter from "./routes/games.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(gamesRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));