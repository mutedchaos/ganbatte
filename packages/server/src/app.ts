// import 'dotenv/config'
import 'reflect-metadata'

import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'

import { connectToDatabase } from './db'
import { resolvers } from './resolvers'

async function run() {
  await connectToDatabase()

  const schema = await buildSchema({
    resolvers,
  })
  const server = new ApolloServer({ schema })
  await server.listen(3000)

  console.log('Ready to accept connections.')
}

run().catch((err) => {
  if (err.details) console.error(err.details)
  console.error(err.stack ?? err.message ?? err ?? 'Unknown error')
  process.exit(55)
})
