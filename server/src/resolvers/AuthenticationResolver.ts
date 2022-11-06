import { scrypt } from 'crypto'

import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from 'type-graphql'
import { v4 as uuid } from 'uuid'

import { issueNewToken } from '../jwt'
import User from '../models/User'
import { userRepository } from '../repositories'
import fieldAssign from '../services/fieldAssign'
import { Role } from '../services/roles'

@ObjectType()
class AuthResponse {
  @Field()
  public success: boolean

  @Field({ nullable: true })
  public errorMessage?: string
}

const loginFailed = fieldAssign(new AuthResponse(), {
  success: false,
  errorMessage: 'Invalid username and/or password',
})
const success = fieldAssign(new AuthResponse(), {
  success: true,
})

@Resolver()
export class AuthenticationResolver {
  @Mutation(() => AuthResponse)
  async login(@Arg('username') username: string, @Arg('password') password: string, @Ctx() { res }: any) {
    const user = await userRepository.findOne({ username: username.toLowerCase().trim() })
    if (!user) return loginFailed
    const hash = await new Promise<string>((resolve, reject) => {
      scrypt(password, user.salt, 64, (err, derivedKey) => {
        if (err) return reject(err)
        resolve(derivedKey.toString('hex'))
      })
    })

    if (hash !== user.passwordHash) return loginFailed
    issueNewToken(res, user.id)
    return success
  }

  @Mutation(() => AuthResponse)
  async createAccount(@Arg('username') username: string, @Arg('password') password: string, @Ctx() { res }: any) {
    const actualUsername = username.toLowerCase().trim()
    if (!actualUsername) return errorWithMessage('Invalid username')
    const existing = await userRepository.findOne({ username: actualUsername })

    if (existing) return errorWithMessage('Account already exists')
    const salt = uuid()
    const hash = await new Promise<string>((resolve, reject) => {
      scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) return reject(err)
        resolve(derivedKey.toString('hex'))
      })
    })

    const user = fieldAssign(new User(), {
      username: actualUsername,
      passwordHash: hash,
      role: Role.USER,
      salt,
    })

    await userRepository.save(user)
    issueNewToken(res, user.id)

    return success
  }
}

function errorWithMessage(message: string) {
  return fieldAssign(new AuthResponse(), {
    success: false,
    errorMessage: message,
  })
}
