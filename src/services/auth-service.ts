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

export async function authorization(token: string) {

  //Recebe token
  //Verifica se o token bate com o jwt
  const userInfo = jwt.decode(token)
  //Retorna o userId do usuario
  //Retorna esse userId pro usuario e res.status(200)

}

const authorizationService = {
  signIn,
  authorization
};

export default authorizationService;