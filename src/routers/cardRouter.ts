import { Router } from "express";
import joiValidation from "../middlewares/joiValidation";
import * as cardController from "../controllers/cardController.js";
import { activateCardSchema, createCardSchema } from "../schemas/cardSchemas";

const cardRouter = Router();
cardRouter.post(
  "cards",
  joiValidation(createCardSchema),
  cardController.create
);
cardRouter.patch(
  "/cards/:id/activate",
  joiValidation(activateCardSchema),
  cardController.activate
);
export default cardRouter;
