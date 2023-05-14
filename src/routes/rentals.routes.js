import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { rentalsSchema } from "../schemas/rentals.schema.js";
import { addRentals, listRentals } from "../controllers/rentals.controllers.js";


const rentalsRouter = Router();

rentalsRouter.post("/rentals", validateSchema(rentalsSchema), addRentals);
rentalsRouter.get("/rentals", listRentals);

export default rentalsRouter;