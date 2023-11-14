import { logger } from '../utils/logger'
import checkinService from '../service/checkin.service'
import { type Request, type Response } from 'express'

const get = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = await checkinService.getAll(req, res)
    return res.send({ status: true, statusCode: 200, ...data })
  } catch (error: any) {
    logger.error('ERR auth - get Checkin All = ', error.message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}

const create = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = await checkinService.create(req.body)
    return res.send({ statusCode: 200, data })
  } catch (error: any) {
    logger.error('ERR auth - get Checkin All = ', error.message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}

export default {
  get,
  create
}
