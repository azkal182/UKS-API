import { Router } from 'express'
import { createSession, refreshSession, registerUser, getAllUserController } from '../controller/auth.controller'
import { requireUser } from '../middleware/auth'
export const AuthRouter: Router = Router()

AuthRouter.post('/register', registerUser)
AuthRouter.post('/login', createSession)
AuthRouter.post('/refresh', refreshSession)
AuthRouter.get('/all', requireUser, getAllUserController)
