// TODO: Find the best abstraction for all those traps

const getNestedProperty = (target, path) => {
  if (!(typeof path === "string" || path instanceof Array) || !path.length)
    throw new Error("The provided path should be a string or an array")

  if (typeof target !== "object")
    return undefined

  if (typeof path === "string")
    path = path.split(".")

  const next = path[0]

  if (path.length === 1)
    return target[next]

  return getNestedProperty(target[next], path.slice(1))
}

const setNestedProperty = (target, path, value) => {
  if (!(typeof path === "string" || path instanceof Array) || !path.length)
    throw new Error("The provided path should be a string or an array")

  if (typeof target !== "object")
    return undefined

  if (typeof path === "string")
    path = path.split(".")

  const next = path[0]

  if (path.length === 1) {
    target[next] = value
    return true
  }

  return setNestedProperty(target[next], path.slice(1), value)
}

const hasNestedProperty = (target, path) => {
  if (!(typeof path === "string" || path instanceof Array) || !path.length)
    throw new Error("The provided path should be a string or an array")

  if (typeof target !== "object")
    return undefined

  if (typeof path === "string")
    path = path.split(".")

  let next = path[0]

  if (path.length === 1)
    return next in target

  return hasNestedProperty(target[next], path.slice(1))
}

const deleteNestedProperty = (target, path) => {
  if (!(typeof path === "string" || path instanceof Array) || !path.length)
    throw new Error("The provided path should be a string or an array")

  if (typeof target !== "object")
    return undefined

  if (typeof path === "string")
    path = path.split(".")

  let next = path[0]

  if (path.length === 1)
    return delete target[next]

  return deleteNestedProperty(target[next], path.slice(1))
}

const defineNestedProperty = (target, path, descriptor) => {
  if (!(typeof path === "string" || path instanceof Array) || !path.length)
    throw new Error("The provided path should be a string or an array")

  if (typeof target !== "object")
    return undefined

  if (typeof path === "string")
    path = path.split(".")

  const next = path[0]

  if (path.length === 1) {
    Object.defineProperty(target, next, descriptor)
    return true
  }

  return defineNestedProperty(target[next], path.slice(1), descriptor)
}

const getOwnNestedPropertyDescriptor = (target, path) => {
  if (!(typeof path === "string" || path instanceof Array) || !path.length)
    throw new Error("The provided path should be a string or an array")

  if (typeof target !== "object")
    return undefined

  if (typeof path === "string")
    path = path.split(".")

  const next = path[0]

  if (path.length === 1)
    return Object.getOwnPropertyDescriptor(target, next)

  return getOwnNestedPropertyDescriptor(target[next], path.slice(1))
}

/* We do not need to implement the following traps as they don't rely on paths:
isExtensible, ownKeys, getOwnPropertyDescriptor, preventExtensions
Additionnally, we do not need to implement:
- apply, since this is a function-only trap
- construct, since this is a trap for the "new" keyword
See:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy
- https://javascript.info/proxy
*/

export default function Proxify(obj) {
  return new Proxy(obj, {
    get: (target, path) => getNestedProperty(target, path),
    // * The set trap should always return true to avoid error-throwing
    set: (target, path, val) => setNestedProperty(target, path, val) || true,
    has: (target, path) => hasNestedProperty(target, path),
    defineProperty: (target, path, descriptor) => defineNestedProperty(target, path, descriptor),
    deleteProperty: (target, path) => deleteNestedProperty(target, path),
    getPrototypeOf: (target) => target,
  })
}
