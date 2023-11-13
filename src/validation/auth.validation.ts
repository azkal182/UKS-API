import Joi from 'joi'
import { type Prisma } from '@prisma/client'

export const createUserValidation = (payload: Prisma.UserCreateInput) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().required()
  })
  return schema.validate(payload)
}

export const createSessionValidation = (payload: Prisma.UserCreateInput) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })
  return schema.validate(payload)
}
