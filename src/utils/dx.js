const devEnvOnly = (fn) => (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && fn()
const warnDev = (str) => devEnvOnly(() => console.warn(str + " (This message won't pop up in production mode."))

console.dev = warnDev