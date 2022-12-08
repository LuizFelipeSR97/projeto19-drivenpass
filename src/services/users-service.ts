import userRepository from "@/repositories/user-repository";
import { User } from "@prisma/client";
import { duplicatedEmailError } from "@/errors";
import bcrypt from "bcrypt";

export async function createUser(email: string, password: string): Promise<User> {

  //Verificar se ta de acordo com o schema, se sim prosseguir

  const alreadyExistingUser = await userRepository.findUser(email)
  console.log(alreadyExistingUser)

  if (alreadyExistingUser){
    throw duplicatedEmailError()
  }

  //Falta usar a lib jsonwebtoken (?)
    
  const hashedPassword = await bcrypt.hash(password, 12);

  const userCreated = await userRepository.createUser(email, hashedPassword)
  console.log(userCreated)
  return userCreated
}

const userService = {
  createUser
};

export type CreateUserParams = Pick<User, "email" | "password">;
export default userService;