/* eslint-env node */

module.exports = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'ganbatte',
  database: 'ganbatte',
  synchronize: true,
  logging: false,
  entities: ['src/models/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
}
