// import 'dotenv/config'
import 'reflect-metadata'

import { ApolloServer } from 'apollo-server'
import jwt from 'jsonwebtoken'
import { AuthChecker, buildSchema } from 'type-graphql'

import { connectToDatabase } from './db'
import { expiringSoon, getJWTConfig, issueNewToken } from './jwt'
import User from './models/User'
import { userRepository } from './repositories'
import { resolvers } from './resolvers'
import { Role } from './services/roles'

export const checkAuth: AuthChecker<{ user: User | null }> = ({ context }, roles) => {
  if (!context.user) return false
  if (context.user.role === Role.ADMIN) return true
  if (!roles.length) return true

  return !!roles.includes(context.user.role ?? 'none')
}

async function run() {
  const jwtConfig = getJWTConfig()
  await connectToDatabase()

  const schema = await buildSchema({
    resolvers,
    authChecker: checkAuth,
  })
  const server = new ApolloServer({
    schema,
    async context({ req, res }) {
      const header = req.headers?.authorization
      if (!header || !header.startsWith('Bearer ')) return { user: null, res }
      const token = header.substring(7)
      const tokenData = jwt.verify(token, jwtConfig.secret, {
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
      })

      if (typeof tokenData === 'string') throw new Error('Internal error')
      const userId = tokenData.sub
      if (!userId) throw new Error('Invalid token')
      if (!tokenData.exp || expiringSoon(tokenData.exp)) {
        issueNewToken(res, userId)
      }

      return { user: await userRepository.findOne(userId), res }
    },
    cors: {
      origin: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['x-new-token'],
    },
  })
  await server.listen(3000)

  console.log('Ready to accept connections.')
}

run().catch((err) => {
  if (err.details) console.error(err.details)
  console.error(err.stack ?? err.message ?? err ?? 'Unknown error')
  process.exit(55)
})
