import userRepository from "@/repositories/user-repository";
import { User } from "@prisma/client";
import { invalidEmailError, invalidCredentialsError } from "@/errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function signIn(email: string, password: string){

  const existingUser = await userRepository.findUser(email)

  if (!existingUser){
    throw invalidEmailError(email)
  }

  const validPassword = await bcrypt.compare(password, existingUser.password);

  if (!validPassword){
    throw invalidCredentialsError()
  }

  const userId = existingUser.id

  const token = jwt.sign({ userId }, process.env.JWT_SECRET);

  return token
}

const authorizationService = {
  signIn
};

export default authorizationService;