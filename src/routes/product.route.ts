import { Router } from 'express'
export const ProductRouter: Router = Router()

ProductRouter.get('/', (req, res) => {
  res.status(200).send({ status: true, statusCode: 200, data: { name: 'test' } })
})
