import { logger } from '../utils/logger'
import checkinService from '../service/checkin.service'
import { type Request, type Response } from 'express'
import { createCheckinValidation, updateCheckinValidation } from '../validation/checkin.validation'

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
    const { error, value } = createCheckinValidation(req.body)
    if (error != null) {
      logger.error('ERR checkin - create Checkin = ', error.details[0].message)
      return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
    }

    const data = await checkinService.create(value)
    return res.send({ status: true, statusCode: 200, data })
  } catch (error: any) {
    logger.error('ERR checkin - create Checkin = ', error.message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}

const update = async (req: Request, res: Response): Promise<any> => {
  try {
    const { error, value } = updateCheckinValidation(req.body)
    if (error != null) {
      logger.error('ERR checkin - update Checkin = ', error.details[0].message)
      return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
    }
    const data = await checkinService.update(value)
    res.send({ status: true, statusCode: 200, data })
  } catch (error: any) {
    logger.error('ERR checkin - update Checkin = ', error.message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.message })
  }
}

export default {
  get,
  create,
  update
}
