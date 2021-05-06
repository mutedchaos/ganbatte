import { createConnection, Connection } from 'typeorm'

let connection: Connection

export async function connectToDatabase() {
  connection = await createConnection()
}

export function getConnection() {
  return connection
}
