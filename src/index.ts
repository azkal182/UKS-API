import express from 'express'
const app = express()
const posrt = 4000

app.listen(posrt, () => {
  console.log(`Server is running on port ${posrt}`)
})
