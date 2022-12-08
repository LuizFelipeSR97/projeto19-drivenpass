import { Router } from "express";
import { validateBody } from "@/middlewares/schema-validation";
import { createCredentialSchema } from "@/schemas/user-schema";
import { authenticateToken } from "@/middlewares/authentication";
import { getCredentials, postCredential, deleteCredential } from "@/controllers";

const credentialsRouter = Router();
  
credentialsRouter
    .all("/*", authenticateToken)
    .get("/", getCredentials)
    .post("/", validateBody(createCredentialSchema), postCredential)
    .delete("/:id", deleteCredential)
    //.delete("/", ?validateBody(createUserSchema), ?postUser)

export { credentialsRouter };