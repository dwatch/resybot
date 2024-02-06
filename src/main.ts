import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { readFileSync } from 'fs'
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as session from 'express-session'
import Redis from 'ioredis'
import RedisStore from 'connect-redis'

async function bootstrap () {
  const httpsOptions = {
    key: readFileSync(join(__dirname, '../secrets/private-key.pem'), 'utf8'),
    cert: readFileSync(join(__dirname, '../secrets/public-certificate.pem'), 'utf8')
  }
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { httpsOptions })

  const redisClient = new Redis({ host: 'localhost', port: 6379 });
  const redisStore = new RedisStore({ client: redisClient, prefix: "resybot:" })
  app.use(session({
    store: redisStore,
    secret: readFileSync(join(__dirname, '../secrets/session-secret-key'), 'utf8'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // ensure you're using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  }));

  await app.listen(3000, '0.0.0.0')
  console.log(`Application with TypeORM and Express is running on: ${await app.getUrl()}`)
}
bootstrap()