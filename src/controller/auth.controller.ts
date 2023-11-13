import { type Request, type Response } from 'express'
import { createSessionValidation, createUserValidation } from '../validation/auth.validation'
import { logger } from '../utils/logger'
import { checkPassword, hashing } from '../utils/hashing'
import { createUser, findUserByUsername, getAllUser } from '../service/auth.service'
import { signJWT } from '../utils/jwt'

export const registerUser = async (req: Request, res: Response) => {
  const { error, value } = createUserValidation(req.body)
  if (error != null) {
    logger.error('ERR auth - register = ', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  try {
    value.password = `${hashing(value.password)}`
    await createUser(value)
    return res.status(201).send({ status: true, statusCode: 201, message: 'Success register user' })
  } catch (error: any) {
    logger.error('ERR auth - register = ', error.message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}

export const createSession = async (req: Request, res: Response) => {
  const { error, value } = createSessionValidation(req.body)
  if (error != null) {
    logger.error('ERR auth - createSession = ', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  try {
    const user: any = await findUserByUsername(value.username)
    const isValidPassword = checkPassword(value.password, user.password)
    if (!isValidPassword) {
      return res.status(401).send({ status: false, statusCode: 401, message: 'invalid username or password' })
    }
    const accessToken = signJWT({ ...user }, { expiresIn: '1d' })
    return res.status(200).send({ status: true, statusCode: 200, accessToken })
  } catch (error: any) {
    logger.error('ERR auth - createSession = ', error.message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}

export const getAllUserController = async (req: Request, res: Response) => {
  try {
    const user: any = await getAllUser()
    return res.status(200).send({ status: true, statusCode: 200, data: user })
  } catch (error: any) {
    logger.error('ERR auth - createSession = ', error.message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}
