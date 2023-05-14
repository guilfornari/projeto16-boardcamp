import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { customerSchema } from "../schemas/customers.schema.js";
import { addCustomer, editCustomer, getCustomers, getCustomersById } from "../controllers/customers.controllers.js";

const customersRouter = Router();

customersRouter.post("/customers", validateSchema(customerSchema), addCustomer);
customersRouter.put("/customers/:id", validateSchema(customerSchema), editCustomer);
customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomersById);

export default customersRouter;