import express from 'express'
import { IDatabase } from './database'

export function createApp(database: IDatabase) {
  const app = express()

  app.use(express.json())
  app.post('/users', async (req, res) => {
    const { password, username } = req.body
    if (!password || !username) {
      res.sendStatus(400)
      return
    }

    const userId = await database.createUser(username, password)

    res.send({ userId })
  })
  return app
}