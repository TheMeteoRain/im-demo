import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Hello World')
})

router.post('/user/:userId/messages', (req, res) => {
  res.send('Hello World')
})

export = router
