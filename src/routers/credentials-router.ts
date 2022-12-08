import { Router } from "express";
import { validateBody } from "@/middlewares/schema-validation";
import { createUserSchema } from "@/schemas/user-schema";
import { postUser } from "@/controllers";
import { authenticateToken } from "@/middlewares/authentication";
import { getCredentials } from "@/controllers";

const credentialsRouter = Router();
  
credentialsRouter
    .all("/*", authenticateToken)
    .get("/", getCredentials)
    //.post("/", validateBody(?createUserSchema), ?postUser)
    //.delete("/", ?validateBody(createUserSchema), ?postUser)

export { credentialsRouter };