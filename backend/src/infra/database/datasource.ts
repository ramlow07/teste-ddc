import 'dotenv/config'
import 'reflect-metadata'
import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB,
  logging: false,
  entities: ['src/**/*.entity.ts'], // or "./dist/**/*.entity.js
  migrations: ['src/infra/database/migrations/*.ts'],
  subscribers: [],
})
