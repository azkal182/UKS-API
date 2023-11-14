import { type Request, type Response } from 'express'
import { createSessionValidation, createUserValidation, refreshSessionValidation } from '../validation/auth.validation'
import { logger } from '../utils/logger'
import { checkPassword, hashing } from '../utils/hashing'
import { createUser, findUserByUsername, getAllUser } from '../service/auth.service'
import { signJWT } from '../utils/jwt'
import { prismaClient } from '../utils/database'
import jwt from 'jsonwebtoken'
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
  //   const cookies = req.cookies
  //   logger.info(`cookie available at login: ${JSON.stringify(cookies)}`)
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
    const accessToken = signJWT(
      { name: user.name, username: user.username },
      { expiresIn: process.env.JWT_TOKEN_EXPIRED_IN }
    )
    const newRefreshToken = signJWT(
      { name: user.name, username: user.username },
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRED_IN }
    )

    let newRefreshTokenArray = value.refresh_token
      ? user.refreshToken
      : user.refreshToken.filter((rt: string) => rt !== value.refresh_token)

    logger.info('new refresh token', newRefreshTokenArray)

    if (value.refresh_token) {
      /*
        Scenario added here:
            1) User logs in but never uses RT and does not logout
            2) RT is stolen
            3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
        */
      const refreshToken = value.refresh_token
      const foundToken = await prismaClient.user.findFirst({ where: { refreshToken } })

      // Detected refresh token reuse!
      if (!foundToken) {
        logger.info('attempted refresh token reuse at login!')
        newRefreshTokenArray = []
      }

      res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
    }

    user.refreshToken = [...newRefreshTokenArray, newRefreshToken]
    await prismaClient.user.update({
      where: {
        username: value.username
      },
      data: user
    })

    // Creates Secure Cookie with refresh token
    res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 })

    return res.status(200).send({ status: true, statusCode: 200, accessToken, newRefreshToken })
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

export const findUserByRefreshToken = async (refreshToken: string): Promise<any> => {
  const foundUser = await prismaClient.user.findFirst({
    where: {
      refreshToken: {
        hasSome: ['...refreshToken']
      }
    }
  })

  return foundUser
}
export const refreshSession = async (req: Request, res: Response) => {
  //   const cookies = req.cookies
  //   if (!cookies?.jwt) {
  //     return res.sendStatus(401)
  //   }
  const { error, value: refreshToken } = refreshSessionValidation(req.body)
  if (error != null) {
    logger.error('ERR auth - refresh session = ', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }
  //   res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
  const foundUser = await prismaClient.user.findFirst({
    where: {
      refreshToken: {
        hasSome: [refreshToken.refresh_token]
      }
    }
  })
  //   Detected refresh token reuse!
  if (!foundUser) {
    jwt.verify(refreshToken.refresh_token, process.env.JWT_SECRET_KEY ?? '', async (err: any, decoded: any) => {
      if (err) {
        // return res.sendStatus(403).send({ error: true })
        logger.info(err)
        return res.status(403).send({ status: false, statusCode: 403, message: err.message })
      }

      const hackedUser = await prismaClient.user.findFirst({ where: { username: decoded.username } })

      if (hackedUser) {
        const result = await prismaClient.user.update({
          where: {
            username: decoded.username
          },
          data: {
            refreshToken: []
          }
        })
        console.log(result)
        res.sendStatus(403)
      }
    })
    logger.info('refreshtoken not found in user database!')
    return
  }

  //   res.send({ foundUser })

  const newRefreshTokenArray = foundUser.refreshToken.filter((rt) => rt !== refreshToken.refresh_token)

  jwt.verify(refreshToken.refresh_token, process.env.JWT_SECRET_KEY ?? '', async (err: any, decoded: any) => {
    if (err) {
      logger.info('expired refresh token')
      foundUser.refreshToken = [...newRefreshTokenArray]
      await prismaClient.user.update({
        where: { username: foundUser.username },
        data: foundUser
      })
    }
    if (err || foundUser.username !== decoded.username) return res.sendStatus(403).send({ status: false })

    // Refresh token was still valid
    const accessToken = signJWT(
      { name: foundUser.name, username: foundUser.username },
      { expiresIn: process.env.JWT_TOKEN_EXPIRED_IN }
    )

    const newRefreshToken = signJWT(
      { name: foundUser.name, username: foundUser.username },
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRED_IN }
    )
    // Saving refreshToken with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
    await prismaClient.user.update({
      where: {
        username: foundUser.username
      },
      data: {
        refreshToken: [...newRefreshTokenArray, newRefreshToken]
      }
    })

    // res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 })

    return res.status(200).send({ status: true, statusCode: 200, accessToken, newRefreshToken })
  })
}
