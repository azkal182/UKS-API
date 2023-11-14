import { Router } from 'express'
import checkinController from '../controller/checkin.controller'
import { requireUser } from '../middleware/auth'
export const CheckinRouter: Router = Router()

CheckinRouter.get('/', requireUser, checkinController.get)
CheckinRouter.post('/', requireUser, checkinController.create)
