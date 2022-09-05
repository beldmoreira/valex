import cors from "cors";
import express, { json } from "express";
import "express-async-errors";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler.js";
import cardRouter from "./routers/cardRouter.js";
dotenv.config();

const app = express();
app.use(json());
app.use(cors());
app.use(errorHandler);
app.use(cardRouter);

const port = +process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});
