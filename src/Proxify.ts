import curry from "./curry"

function setNestedProperty(target: object, next: any, value) {
  target[next] = value
  return true
}

const defineNestedProperty = (target: object, next: any, descriptor) => {
  Object.defineProperty(target, next, descriptor)
  return true
}

function deleteNestedProperty(target: object, next: any) {
  return delete target[next]
}

function hasNestedProperty(target: object, next: any) {
  return next in target
}

function getNestedProperty(target: object, next: any) {
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
