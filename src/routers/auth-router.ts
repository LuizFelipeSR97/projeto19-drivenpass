import { Router } from "express";
import { validateBody } from "@/middlewares/schema-validation";
import { signinSchema } from "@/schemas/user-schema";
import { signIn } from "@/controllers";

const authRouter = Router();

authRouter.post("/signin", validateBody(signinSchema), signIn)

export { authRouter };