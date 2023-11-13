import { type Request, type Response, type NextFunction } from 'express'

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  next()
}
