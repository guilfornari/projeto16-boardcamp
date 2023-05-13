import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { addGame, getGames } from "../controllers/games.controllers.js";
import { gameSchema } from "../schemas/games.schema.js";

const gamesRouter = Router();

gamesRouter.post("/games", validateSchema(gameSchema), addGame);
gamesRouter.get("/games", getGames);

export default gamesRouter;