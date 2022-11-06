import jwt from 'jsonwebtoken'

export function getJWTConfig() {
  if (!process.env.JWT_ISSUER) throw new Error('JWT_ISSUER is missing')
  if (!process.env.JWT_AUDIENCE) throw new Error('JWT_AUDIENCE is missing')
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing')

  return {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    secret: process.env.JWT_SECRET,
  }
}

export function expiringSoon(exp: number) {
  const now = new Date().valueOf() / 1000
  return exp - now < 60 * 15
}

export function issueNewToken(res: any, userId: string) {
  const jwtConfig = getJWTConfig()
  const newToken = jwt.sign({}, jwtConfig.secret, {
    audience: jwtConfig.audience,
    issuer: jwtConfig.issuer,
    subject: userId,
    expiresIn: '2h',
  })
  res.setHeader('x-new-token', newToken)
}
