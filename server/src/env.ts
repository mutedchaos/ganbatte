import dotenv from 'dotenv'
console.log(process.env)
if (!process.env.NO_DOTENV) {
  dotenv.config()
}
