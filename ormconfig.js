/* eslint-env node */

module.exports = {
  type: 'postgres',
  host: process.env.PSQL_HOST || 'postgres',
  port: process.env.PSQL_PORT|| 5432,
  username: process.env.PSQL_USER || 'ganbatte',
  database:  process.env.PSQL_DB || 'ganbatte',
  synchronize: true,
  logging: false,
  entities: ['src/models/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
}