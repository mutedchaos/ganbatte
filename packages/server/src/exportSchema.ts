import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import * as fs from 'fs'
import { printSchema } from 'graphql'
import { resolvers } from './resolvers'

async function run() {
  const schema2 = await buildSchema({
    resolvers,
  })

  await fs.promises.writeFile(__dirname + '/../lib/schema.graphql', printSchema(schema2), 'utf-8')
}

run().catch((err) => {
  console.error(err.stack ?? err.message ?? err ?? 'Unknown error')
  process.exit(55)
})
