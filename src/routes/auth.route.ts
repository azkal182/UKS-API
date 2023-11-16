import { Router } from 'express'
import authController from '../controller/auth.controller'
import { requireUser } from '../middleware/auth'
export const AuthRouter: Router = Router()

AuthRouter.post('/register', authController.registerUser)
AuthRouter.post('/login', authController.createSession)
AuthRouter.post('/refresh', authController.refreshSession)
AuthRouter.get('/all', requireUser, authController.getAllUser)
AuthRouter.get('/current', requireUser, authController.current)
