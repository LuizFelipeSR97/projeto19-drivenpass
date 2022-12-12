import userRepository from "@/repositories/user-repository";
import { User } from "@prisma/client";
import { duplicatedEmailError } from "@/errors";
import bcrypt from "bcrypt";

async function createUser(email: string, password: string): Promise<User> {

  const alreadyExistingUser = await userRepository.findUser(email)

  if (alreadyExistingUser){
    throw duplicatedEmailError()
  }
    
  const hashedPassword = await bcrypt.hash(password, 12);

  const userCreated = await userRepository.createUser(email, hashedPassword)
  return userCreated
}

const userService = {
  createUser
};

export type CreateUserParams = Pick<User, "email" | "password">;
export type CreateToken = {token: string};
export default userService;