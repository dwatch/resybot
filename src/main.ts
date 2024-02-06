import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { readFileSync } from 'fs'
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap () {
  const httpsOptions = {
    key: readFileSync(join(__dirname, '../secrets/private-key.pem'), 'utf8'),
    cert: readFileSync(join(__dirname, '../secrets/public-certificate.pem'), 'utf8')
  }
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { httpsOptions })

  await app.listen(3000, '0.0.0.0')
  console.log(`Application with TypeORM and Express is running on: ${await app.getUrl()}`)
}
bootstrap()
