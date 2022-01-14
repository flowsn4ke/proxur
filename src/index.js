function curry(produce, return_value) {
  return function trap(target, path, arg) {
    if (!(typeof path === "string" || path instanceof Array) || !path.length) {
      path = String(path)
      console.error("The provided path should be a string or an array")
    }

    if (typeof target !== "object")
      return return_value

    if (typeof path === "string")
      path = path.split(".")

    const next = path[0]

    if (path.length === 1)
      return produce(target, next, arg)

    return trap(target[next], path.slice(1), arg)
  }
}

function setNestedProperty(target, next, value) {
  target[next] = value
  return true
}

const defineNestedProperty = (target, next, descriptor) => {
  Object.defineProperty(target, next, descriptor)
  return true
}

function deleteNestedProperty(target, next) {
  return delete target[next]
}

function hasNestedProperty(target, next) {
  return next in target
}

function getNestedProperty(target, next) {
  return target[next]
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

export default function Proxify(obj = {}) {
  return new Proxy(obj, {
    get: curry(getNestedProperty),
    set: curry(setNestedProperty, true), // * The set must return true in order to avoid error-throwing
    has: curry(hasNestedProperty),
    defineProperty: curry(defineNestedProperty),
    deleteProperty: curry(deleteNestedProperty),
    getPrototypeOf: target => target,
  })
}
