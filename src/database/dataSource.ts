import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: false,
  logger: 'file',
  entities: ['dist/**/*.entity{.ts,.js}'], //   entities: [__dirname + '/../**/entities/*.{ts,js}']
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  migrationsTableName: 'migration_table',
});

export default AppDataSource;
