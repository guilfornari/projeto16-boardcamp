import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { customerSchema } from "../schemas/customers.schema.js";
import { addCustomer, getCustomers } from "../controllers/customers.controllers.js";

const customersRouter = Router();

customersRouter.post("/customers", validateSchema(customerSchema), addCustomer);
customersRouter.get("/customers", getCustomers);

export default customersRouter;