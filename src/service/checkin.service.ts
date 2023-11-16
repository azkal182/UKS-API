import { type StatusCheckin, type Prisma } from '@prisma/client'
import { prismaClient } from '../utils/database'
import { type Response, type Request } from 'express'
import { logger } from '../utils/logger'

interface CustomResponse extends Response {
  paginatedResult?: number
}

const getAll = async (req: Request, res: CustomResponse): Promise<any> => {
  try {
    const query = req.query
    const page: number = parseInt(query.page as string, 10) || 1
    const limit: number = parseInt(query.limit as string, 10) || 20
    const lastPage = req.query.last_page
    const status: string = (req.query.status as string) || 'UKS'
    const statusCheckinArray: StatusCheckin[] = status
      .split(',')
      .map((item: string) => item.trim().toUpperCase()) as StatusCheckin[]

    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const result: any = {}

    const totalCount = await prismaClient.checkIn.count({
      where: {
        status: {
          in: statusCheckinArray
        }
      }
    })
    const totalPage = Math.ceil(totalCount / limit)
    const currentPage = page || 0

    try {
      if (page < 0) {
        return res.status(400).json('Page value should not be negative')
      } else if (page === 1 && !lastPage) {
        result.totalCount = totalCount
        result.totalPage = totalPage
        result.currentPage = currentPage
        result.next = {
          page: page + 1,
          limit
        }
        result.data = await prismaClient.checkIn.findMany({
          where: {
            status: {
              in: statusCheckinArray
            }
          },
          take: limit,
          skip: startIndex,
          orderBy: {
            id: 'desc'
          }
        })
        res.paginatedResult = result
        result.currentCountPerPage = Object.keys(result.data).length
        result.range = currentPage * limit
        return result
        //   return res.status(200).json(result);
      } else if (endIndex < totalCount && !lastPage) {
        result.totalCount = totalCount
        result.totalPage = totalPage
        result.currentPage = currentPage
        result.next = {
          page: page + 1,
          limit
        }
        result.data = await prismaClient.checkIn.findMany({
          where: {
            status: {
              in: statusCheckinArray
            }
          },
          take: limit,
          skip: startIndex,
          orderBy: {
            id: 'desc'
          }
        })
        res.paginatedResult = result
        result.currentCountPerPage = Object.keys(result.data).length
        result.range = currentPage * limit
        return result
        //   return res.status(200).json(result);
      } else if (startIndex > 0 && !lastPage) {
        result.totalCount = totalCount
        result.totalPage = totalPage
        result.currentPage = currentPage
        result.previous = {
          page: page - 1,
          limit
        }
        result.data = await prismaClient.checkIn.findMany({
          where: {
            status: {
              in: statusCheckinArray
            }
          },
          take: limit,
          skip: startIndex,
          orderBy: {
            id: 'desc'
          }
        })
        res.paginatedResult = result
        result.currentCountPerPage = Object.keys(result.data).length
        result.range = currentPage * limit
        return result
        //   return res.status(200).json(result);
      } else if (lastPage === 'true' && page === totalPage) {
        result.totalCount = totalCount
        result.totalPage = totalPage
        result.currentPage = totalPage
        result.last = {
          page: totalPage,
          limit
        }
        result.data = await prismaClient.checkIn.findMany({
          where: {
            status: {
              in: statusCheckinArray
            }
          },
          take: limit,
          skip: startIndex,
          orderBy: {
            id: 'desc'
          }
        })
        res.paginatedResult = result
        result.currentCountPerPage = Object.keys(result.data).length
        result.range = totalCount
        return result
        //   return res.status(200).json(result);
      } else {
        return res.status(404).json({ error: 'Resource not found' })
      }
    } catch (error: any) {
      logger.fatal(error.message)
      return res.status(500).json(error)
    }
  } catch (error: any) {
    logger.fatal(error.message)
    return res.status(500).json(error)
  }
}

const create = async (payload: Prisma.checkInCreateInput) => {
  return await prismaClient.checkIn.create({ data: payload })
}

interface checkInUpdate extends Prisma.checkInUpdateInput {
  id: number
}

const update = async (payload: checkInUpdate) => {
  const result: Prisma.checkInUpdateInput = {}

  if (payload.name) {
    result.name = payload.name
  }
  if (payload.address) {
    result.address = payload.address
  }
  if (payload.room) {
    result.room = payload.room
  }
  if (payload.grade) {
    result.grade = payload.grade
  }
  if (payload.complaint) {
    result.complaint = payload.complaint
  }

  if (payload.status) {
    result.status = payload.status
  }

  return await prismaClient.checkIn.update({
    where: {
      id: payload.id
    },
    data: {
      ...result,
      return_at: payload.status ? new Date() : null
    }
  })
}

export default {
  getAll,
  create,
  update
}
