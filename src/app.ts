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
  credentialsRouter
  /* authenticationRouter,
  eventsRouter,
  enrollmentsRouter,
  ticketsRouter,
  paymentsRouter,
  hotelsRouter,
  bookingRouter */
} from "@/routers";

const app = express();
app
  .use(cors())
  .use(express.json())
  .get("/health", (_req, res) => res.send("Everything is OK!"))
  .use("/users", usersRouter)
  .use("/auth", authRouter)
  .use("/credentials", credentialsRouter)
  
  .use(handleApplicationErrors);
/* .use("/auth", authenticationRouter)
  .use("/event", eventsRouter)
  .use("/enrollments", enrollmentsRouter)
  .use("/tickets", ticketsRouter)
  .use("/payments", paymentsRouter)
  .use("/hotels", hotelsRouter)
  .use("/booking", bookingRouter) */
  

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
