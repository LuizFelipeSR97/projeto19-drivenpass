import "reflect-metadata";
import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";
import { handleApplicationErrors } from "./middlewares/error-handling";

import { loadEnv, connectDb, disconnectDB } from "@/config";

loadEnv();

/* import { handleApplicationErrors } from "@/middlewares"; */

import {
  usersRouter,
  authRouter,
  credentialsRouter,
  networksRouter
} from "@/routers";

const app = express();
app
  .use(cors())
  .use(express.json())
  .get("/health", (_req, res) => res.send("OK!"))
  .use("/users", usersRouter)
  .use("/auth", authRouter)
  .use("/credentials", credentialsRouter)
  .use("/networks", networksRouter)  
  //.use(handleApplicationErrors); //Essa daqui é necessaria?
  

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
