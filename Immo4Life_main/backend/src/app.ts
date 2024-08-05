import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { routeRealEstate } from "./routes/realEstate";
import { routeCreateTestData } from "./routes/createTestData";
import { routeCustomer } from "./routes/customer";

const PORT = 8080;
const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Running");
});

app.use("/realEstate", routeRealEstate);
app.use("/createTestData", routeCreateTestData);
app.use("/customer", routeCustomer);
app.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}`);
});
