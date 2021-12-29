### Zero config, zero dependency, safe and lightweight (414 bytes gzipped!) proxy supporting both dot syntax and regular syntax.

# Usage

**TL;DR: All expected methods for object will work on this proxy.**
The only difference is that now you can access and set values using dot-path notation, or regular notation. Dot notation is safe both for setting and getting, while using regular notation will throw a TypeError in strict mode for the time being.

```js
import Proxify from "proxur"

let obj = {
  foo: {
    bar: {
      baz: "42"
    }
  },
  arr: [ 1, 2, 3, 4, 5],
  test: {
    test: "test"
  }
}

obj = Proxify(obj)

console.log(obj["foo.bar.baz"]) // 42
console.log(obj.foo.bar.baz) // 42

console.log(obj["x.y.z"]) // undefined
console.log(obj.x.y.z) // undefined

obj["arr.0"] = "zero"
console.log(obj.arr[0])

obj.arr[1] = "one"
console.log(obj["arr.1"])

delete obj["test.test"]
console.log(obj["test.test"]) // undefined

const keys = Object.keys(obj)
console.log(keys) // [ "foo", "arr", "test"]

Object.defineProperty(obj, "foo.bar.test", { value: 333333 })
console.log(obj.foo.bar.test) // 333333

Object.preventExtensions(obj)
obj.z = "error" // Throws a TypeError using the strict mode
console.log(z in obj) // false
console.log(Object.isExtensible(obj)) // false

const original = Object.getPrototypeOf(obj)
console.log(original.arr) // [ 1, 2, 3, 4, 5]

const descriptor = Object.getOwnPropertyDescriptor(obj, "foo.bar.test")
console.log(descriptor) // { value: 333333, writable: true, enumerable: true, configurable: true }
```

If you just need an empty object, you can just call `Proxify` without any arguments:

```js
const proxifiedObj = Proxify()
```

Etc. You get the idea.

Also, you will still get a TypeError *in strict mode* no matter what syntax you use if you try to set a property AFTER having called `Object.preventExtensions(obj)`.