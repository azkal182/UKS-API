import { type Router, type Application } from 'express'
import { HealtRouter } from './health.route'
import { ProductRouter } from './product.route'
import { AuthRouter } from './auth.route'
import { CheckinRouter } from './checkin.route'

const _routes: Array<[string, Router]> = [
  ['/health', HealtRouter],
  ['/product', ProductRouter],
  ['/auth', AuthRouter],
  ['/checkin', CheckinRouter]
]

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route
    app.use(url, router)
  })
}
