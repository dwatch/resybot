import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { readFileSync } from 'fs'
import { join } from 'path'

async function bootstrap () {
  const httpsOptions = {
    key: readFileSync(join(__dirname, '../secrets/private-key.pem'), 'utf8'),
    cert: readFileSync(join(__dirname, '../secrets/public-certificate.pem'), 'utf8')
  }
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true, https: httpsOptions })
  )
  await app.listen(3000, '0.0.0.0')
  console.log(`Application with TypeORM and Fastify is running on: ${await app.getUrl()}`)
}
bootstrap()
