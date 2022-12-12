import authorizationService from "@/services/auth-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function signIn(req: Request, res: Response) {

  const {email, password} = req.body

  try {
    const token = await authorizationService.signIn(email, password)
    return res.status(httpStatus.OK).send({
      token
    });
  } catch (error) {
    if (error.name === "InvalidEmailError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    if (error.name === "InvalidCredentialsError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
  
}