export default function fieldAssign<T>(object: T, assign: Partial<T>): T {
  return Object.assign(object, assign)
}
