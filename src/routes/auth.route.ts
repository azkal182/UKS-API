import { Router } from 'express'
import { createSession, getAllUserController, registerUser } from '../controller/auth.controller'
import { requireUser } from '../middleware/auth'
export const AuthRouter: Router = Router()

AuthRouter.post('/register', registerUser)
AuthRouter.post('/login', createSession)
AuthRouter.get('/', requireUser, getAllUserController)
