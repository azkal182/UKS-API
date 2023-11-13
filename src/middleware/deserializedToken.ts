import { type Request, type Response, type NextFunction } from 'express'
import { verifyJWT } from '../utils/jwt'

const deserializeToken = async (req: Request, res: Response, next: NextFunction) => {
  console.log('middleware running ', req.headers.authorization)
  const accesToken = req.headers.authorization?.replace(/^Bearer\s/, '')
  if (!accesToken) {
    next()
    return
  }

  const { decoded, expired } = verifyJWT(accesToken)
  if (decoded) {
    res.locals.user = decoded
    next()
    return
  }
  if (expired) {
    next()
    return
  }

  next()
}

export default deserializeToken
