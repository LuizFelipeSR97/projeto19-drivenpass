import userRepository from "@/repositories/user-repository";
import { Credential } from "@prisma/client";
import credentialsRepository from "@/repositories/credentials-repository";
import { notFoundError, unauthorizedError } from "@/errors";
import bcrypt from "bcrypt";

async function getCredentials(userId: number, id: number) {

  if (isNaN(id)){
    const credentials = await credentialsRepository.getCredentials(userId)
    return credentials
  }

  const credentials = await credentialsRepository.getCredentialsById(id)

  if (!credentials){
    throw notFoundError()
  }

  if(credentials.userId!==userId){
    throw unauthorizedError()
  }

  return credentials
}

//Fazer tambem o getCredentials by id

const credentialsService = {
  getCredentials
};

export default credentialsService;