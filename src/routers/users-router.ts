import { Router } from "express";
import { validateBody } from "@/middlewares/schema-validation";
import { createUserSchema } from "@/schemas/user-schema";
import { postUser } from "@/controllers";

const usersRouter = Router();

/* usersRouter.post("/", validateBody(createUserSchema), postUser); */
usersRouter.post("/sign-up", validateBody(createUserSchema), postUser)

export { usersRouter };