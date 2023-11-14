import jwt, { type SignOptions } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

// eslint-disable-next-line @typescript-eslint/ban-types
export const signJWT = (payload: Object, options?: SignOptions | undefined) => {
  console.log({ parametre: [options && options] })
  return jwt.sign(payload, process.env.JWT_SECRET_KEY ?? '', {
    ...options,
    algorithm: 'HS256'
  })
}

export const verifyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY ?? '')
    // logger.info({ token, decoded })
    return {
      valid: true,
      expired: false,
      decoded
    }
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === 'jwt is expired or not rligible to use'
    }
  }
}
