/* External dependencies */
import express, { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import https, { Server } from 'https'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import hpp from 'hpp'
import dotenv from 'dotenv'
import cors from 'cors'
import { Sequelize } from 'sequelize/types'

/* Internal dependencies */
import sequelize from 'models'
import SocketIO from 'routes/socket'
import authRouter from 'routes/auth'
import logger from 'logger'

dotenv.config()

async function stopServer(server: Server, sequelize: Sequelize, signal?: string) {
  logger.info(`Stopping server with signal: ${signal}`)
  await server.close()
  await sequelize.close()
  process.exit()
}

async function runServer() {
  const options = {
    key: fs.readFileSync('./private/192.168.2.17-key.pem'),
    cert: fs.readFileSync('./private/192.168.2.17.pem'),
  }

  const app = express()
  const server = https.createServer(options, app)
  const { PORT: port = 4000 } = process.env

  SocketIO.init(server)

  if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'))
    app.use(helmet())
    app.use(hpp())
  } else {
    app.use(morgan('dev'))
  }

  app.use(cors({ origin: '*' }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser(process.env.COOKIE_SECRET))

  app.use('/api/auth', authRouter)

  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(error.message)
    return res.status(error.status || 500).send({
      message: error.message,
    })
  })

  server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })

  try {
    await sequelize.authenticate()
    await sequelize.sync()
  } catch (error) {
    stopServer(server, sequelize)
    throw error
  }
}

runServer()
  .then(() => {
    logger.info('run successfully')
  })
  .catch((ex: Error) => {
    logger.error('Unable run:', ex)
  })
