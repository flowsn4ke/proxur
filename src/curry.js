export default function curry(produce, return_value) {
  return function trap(target, path, arg) {
    if (!(typeof path === "string" || path instanceof Array) || !path.length) {
      console.dev(`The provided path should be a string or an array, you provided ${path}`)
      path = String(path)
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