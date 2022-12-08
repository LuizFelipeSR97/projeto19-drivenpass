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
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
  
}