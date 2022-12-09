import { Router } from "express";
import { validateBody } from "@/middlewares/schema-validation";
import { createNetworkSchema } from "@/schemas/user-schema";
import { authenticateToken } from "@/middlewares/authentication";
import { getNetworks, postNetwork, deleteNetwork } from "@/controllers";

const networksRouter = Router();
  
networksRouter
    .all("/*", authenticateToken)
    .get("/", getNetworks)
    .post("/", validateBody(createNetworkSchema), postNetwork)
    .delete("/:id", deleteNetwork)

export { networksRouter };