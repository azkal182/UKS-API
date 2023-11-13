import { Router } from 'express'
export const HealtRouter: Router = Router()

HealtRouter.get('/', (req, res) => {
  res.status(200).send({ status: '200' })
})
