import 'reflect-metadata'

import * as fs from 'fs'

import { printSchema } from 'graphql'
import { buildSchema } from 'type-graphql'

import { resolvers } from './resolvers'

async function run() {
  const schema2 = await buildSchema({
    resolvers,
    authChecker() {
      return true
    },
  })
  const dir = __dirname + '/../lib'
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  await fs.promises.writeFile(dir + '/schema.graphql', printSchema(schema2), 'utf-8')
}

run().catch((err) => {
  console.error(err.stack ?? err.message ?? err ?? 'Unknown error')
  process.exit(55)
})
