import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";

// Primary DB Instance that is initialized on build. Uses Typescript source files
export const typeOrmModuleDetails: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'resybot',
  entities: [],
  migrations: ["src/migrations/**/*.ts"],
  autoLoadEntities: true,
  synchronize: false
}

export const dataSourceDetails: DataSourceOptions = {
  name: "resybot",
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "resybot",
  entities: [
    "src/entities/resybot-user/resybot-user.entity.ts",
    "src/entities/payment-method/payment-method.entity.ts",
    "src/entities/restaurant/restaurant.entity.ts",
    "src/entities/reservation/reservation.entity.ts"
  ],
  migrations: ["src/migrations/**/*.ts"],
  synchronize: false,
  logging: true,
}

export const dataSource = new DataSource(dataSourceDetails)