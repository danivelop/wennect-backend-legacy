/* External dependencies */
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

declare const process: {
  env: {
    AUTH_KEY: string
  }
}

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
  try {
    req.decoded = jwt.verify(req.cookies.token, process.env.AUTH_KEY)
    return next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      error.status = 419
      return next(error)
    }

    error.status = 401
    return next(error)
  }
}
