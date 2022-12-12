import userRepository from "@/repositories/user-repository";
import { Credential } from "@prisma/client";
import credentialsRepository from "@/repositories/credentials-repository";
import { duplicatedTitleError, notFoundError, unauthorizedError } from "@/errors";
import Cryptr from 'cryptr';
const cryptr = new Cryptr('secretKey');

async function getCredentials(userId: number, id: number) {

  if (isNaN(id)){
    const credentials = await credentialsRepository.getCredentials(userId);

    const decryptedCredentials = credentials.map(cred=>{
      //const decryptedPassword=cryptr.decrypt(cred.password)
      //cred.password=decryptedPassword
      cred.password="Password descriptografado aqui"
      return cred
    });

    return decryptedCredentials
  }

  const credential = await credentialsRepository.getCredentialsById(id)

  if (!credential){
    throw notFoundError()
  }

  if(credential.userId!==userId){
    throw unauthorizedError()
  }

  //const decryptedPassword = cryptr.decrypt(credential.password);
  //const decryptedCredential = {...credential, password: decryptedPassword}
  const decryptedCredential = {...credential, password: "Password descriptografado aqui"}

  return decryptedCredential
}

async function postCredential(title: string, url: string, username: string, password: string, userId:number) {

  const encryptedPassword = cryptr.encrypt(password);

  const existingCredential = await credentialsRepository.getCredentialByTitle(title, userId)

  if(existingCredential){
    throw duplicatedTitleError()
  }

  const createdCredential = await credentialsRepository.postCredential(title, url, username, encryptedPassword, userId)
  return createdCredential
}

async function deleteCredential(id: number, userId: number) {

  if (isNaN(id)){
    throw notFoundError()
  }

  const searchedCredential = await credentialsRepository.getCredentialByIdAndUserId(id, userId)

  if (!searchedCredential){
    throw notFoundError()
  }

  const deletedCredential = await credentialsRepository.deleteCredential(id)
  
  return deletedCredential
}

const credentialsService = {
  getCredentials,
  postCredential,
  deleteCredential
};

export type CreateCredentialParams = Omit<Credential, "id" | "userId">;
export default credentialsService;