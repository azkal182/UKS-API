import { type Prisma } from '@prisma/client'
import { prismaClient } from '../utils/database'

export const createUser = async (payload: Prisma.UserCreateInput) => {
  return await prismaClient.user.create({ data: payload })
}

export const findUserByUsername = async (username: string): Promise<any> => {
  const user = await prismaClient.user.findFirst({
    where: {
      username
    }
  })

  return user
}

export const getAllUser = async () => {
  return await prismaClient.user.findMany()
}
