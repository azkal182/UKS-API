import express, { type Application } from 'express'
import { routes } from './routes'
import { logger } from './utils/logger'
import bodyParser from 'body-parser'
import cors from 'cors'
import deserializeToken from './middleware/deserializedToken'
const app: Application = express()
const posrt: number = 4000

// parse body request
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// // cors access handler
app.use(cors())
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   res.setHeader('Access-Control-Allow-Methods', '*')
//   res.setHeader('Access-Control-Allow-Headers', '*')
// })

app.get('/', (req, res) => {
  res.json({ app_name: 'api poskestren' })
})

app.use(deserializeToken)
routes(app)
app.listen(posrt, () => {
  logger.info(`Server is running on port ${posrt}`)
})
