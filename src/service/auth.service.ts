import { type Prisma } from '@prisma/client'
import { prismaClient } from '../utils/database'

const createUser = async (payload: Prisma.UserCreateInput) => {
  return await prismaClient.user.create({ data: payload })
}

const findUserByUsername = async (username: string): Promise<any> => {
  const user = await prismaClient.user.findFirst({
    where: {
      username
    }
  })

  return user
}

const getAllUser = async () => {
  return await prismaClient.user.findMany()
}

export default {
  createUser,
  findUserByUsername,
  getAllUser
}
