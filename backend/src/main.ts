import { NestFactory } from '@nestjs/core'
import * as bodyParser from 'body-parser'
import { AppModule } from './app.module'
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {})
  app.use(bodyParser.json({ limit: '500mb' }))
  app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }))
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,HEAD')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept')
    next()
  })

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    exposedHeaders: ['FileName'],
  })
  await app.startAllMicroservices()

  await app.listen(process.env.PORT_ADMIN || 4041, () => {
    console.log('Hello World!!! CRM.', process.env.PORT_ADMIN || 4041)
  })
}
bootstrap()
