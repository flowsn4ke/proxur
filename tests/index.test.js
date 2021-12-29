import Proxify from "../src"

describe("=== TEST SUITE ===", () => {
  let obj

  beforeEach(() => {
    obj = Proxify({
      a: "1",
      b: [1, 2, 3, 4, 5],
      c: { test: 10 },
      d: "not nested",
      e: [{ foo: { bar: "baz" } }]
    })
  })

  describe("Access flat properties", () => {
    it("can access flat properties using dot notation", () => {
      expect(obj["a"]).toEqual("1")
    })
    it("can access flat properties using regular notation", () => {
      expect(obj.a).toEqual("1")
    })
  })

  describe("Access nested properties", () => {
    it("can access nested object properties using dot notation", () => {
      expect(obj["c.test"]).toEqual(10)
    })
    it("can access nested object properties using regular notation", () => {
      expect(obj.c.test).toEqual(10)
    })
    it("can access nested array properties using dot notation", () => {
      expect(obj["e.0.foo.bar"]).toEqual("baz")
    })
    it("can access nested array properties using regular notation", () => {
      expect(obj.e[0].foo.bar).toEqual("baz")
    })
  })

  describe("Can set properties", () => {
    it("can set an array index using dot notation", () => {
      obj["b.0"] = 333
      expect(obj["b.0"]).toEqual(333)
    })
    it("can set an array index using regular notation", () => {
      obj.b[0] = 333
      expect(obj.b[0]).toEqual(333)
    })
    it("can set nested property using dot notation", () => {
      obj["e.0.foo.bar"] = 333
      expect(obj["e.0.foo.bar"]).toEqual(333)
    })
    it("can set nested property using regular notation", () => {
      obj.e[0].foo.bar = 333
      expect(obj.e[0].foo.bar).toEqual(333)
    })
    it("can set flat properties using dot notation", () => {
      obj["a"] = 42
      expect(obj["a"]).toEqual(42)
    })
    it("can set flat properties using regular notation", () => {
      obj.a = 42
      expect(obj.a).toEqual(42)
    })
    it("can set new properties", () => {
      obj.s = 42
      expect(obj.s).toEqual(42)
    })
    it("does not set new properties on unexisting objects using dot notation without throwing", () => {
      obj["s.s.s"] = 42
      const fn = () => obj["s.s.s"]
      expect(obj["s.s.s"]).toBeUndefined()
      expect(fn).not.toThrow()
    })
    it("throws TypeError when setting properties on unexisting nested objects using regular notation", () => {
      const fn = () => obj.s.s.s
      expect(fn).toThrow(TypeError)
    })
  })

  describe("Can operate on arrays", () => {
    test("Array.push() works on nested arrays using dot notation", () => {
      const val = 6
      obj["b"].push(val)
      expect(obj["b.5"]).toEqual(val)
      expect(obj.b[5]).toEqual(val)
    })
    test("Array.push() works on nested arrays using regular notation", () => {
      const val = 9
      obj.b.push(val)
      expect(obj["b.5"]).toEqual(val)
      expect(obj.b[5]).toEqual(val)
    })
    test("Array.pop() works on nested arrays using dot notation", () => {
      const val = obj["b"].pop()
      expect(val).toEqual(5)
      expect(obj["b.4"]).toBeUndefined()
    })
    test("Array.pop() works on nested arrays using regular notation", () => {
      const val = obj["b"].pop()
      expect(val).toEqual(5)
      expect(obj.b[4]).toBeUndefined()
    })
  })

  describe("Works with the 'in' operator", () => {
    it("returns false if a value does not exist in a nested object", () => {
      expect("x.y.z" in obj).toEqual(false)
    })
    it("returns true if a value exists in a nested object", () => {
      expect("c.test" in obj).toEqual(true)
    })
    it("returns true if a value exists in a flat object", () => {
      expect("a" in obj).toEqual(true)
    })
  })

  describe("Works with the 'Object.defineProperty' method", () => {
    it("can set existing nested properties using the dot path notation", () => {
      const val = 333333
      Object.defineProperty(obj, "c.tested_tester", { value: val, enumerable: true })
      expect(obj["c.tested_tester"]).toEqual(val)
      expect(obj.c.tested_tester).toEqual(val)
    })
    it("can set unexisting flat properties", () => {
      const val = 333333
      Object.defineProperty(obj, "s", { value: val, enumerable: true })
      expect(obj["s"]).toEqual(val)
      expect(obj.s).toEqual(val)
    })

    describe("Works with the 'Object.getOwnPropertyDescriptor' method", () => {
      it("correctly returns the value", () => {
        expect(Object.getOwnPropertyDescriptor(obj, "a").value).toEqual("1")
      })
    })

    describe("Works with the 'Object.getPrototypeOf' method", () => {
      it("correctly returns the original object", () => {
        expect(Object.getPrototypeOf(obj).a).toEqual("1")
      })
    })

    describe("Works with the 'Object.preventExtensions' method", () => {
      it("prevents extending the object while allowing to set its properties", () => {
        Object.preventExtensions(obj)
        obj.a = 42
        const fn = () => (obj["s"] = 42)
        expect(obj.a).toEqual(42)
        expect(fn).toThrow(TypeError)
      })
    })

    describe("Works with the 'Object.getPrototypeOf' method", () => {
      it("correctly returns if the object is extensible", () => {
        expect(Object.isExtensible(obj)).toEqual(true)
      })
      it("correctly returns if the object is not extensible", () => {
        Object.preventExtensions(obj)
        expect(Object.isExtensible(obj)).toEqual(false)
      })
    })

    describe("Works with the 'Object.keys' method", () => {
      it("correctly returns the object keys", () => {
        expect(Object.keys(obj)).toEqual(["a", "b", "c", "d", "e"])
      })
    })
  })

  // TODO: Test deletion

  // describe("Todo", () => {
  //   // TODO: Should it create the object / array though?
  //   it("Should not throw TypeErrors using regular notation and unsafe chaining for getting", () => {
  //     expect(obj.s.s.s).toBeUndefined()
  //   })
  //   it("Should not throw TypeErrors using regular notation and unsafe chaining for setting", () => {
  //     obj.s.s.s = 42
  //     expect(obj.s.s.s).toBeUndefined()
  //   })
  // })
})