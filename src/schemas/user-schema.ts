import { CreateCredentialParams } from "@/services/credentials-service";
import { CreateUserParams } from "@/services/users-service";
import { CreateNetworkParams } from "@/services/networks-service";
import Joi from "joi";

export const createUserSchema = Joi.object<CreateUserParams>({
  email: Joi.string().email().required(),
  password: Joi.string().min(10).required(),
});

export const signinSchema = Joi.object<CreateUserParams>({
  email: Joi.string().email().required(),
  password: Joi.string().min(10).required(),
});

export const createCredentialSchema = Joi.object<CreateCredentialParams>({
  title: Joi.string().required(),
  url: Joi.string().uri().required(),
  username: Joi.string().required(),
  password: Joi.string().required()
});

export const createNetworkSchema = Joi.object<CreateNetworkParams>({
  title: Joi.string().required(),
  network: Joi.string().required(),
  password: Joi.string().required()
});