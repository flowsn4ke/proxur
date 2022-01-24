const devEnvOnly = (fn: () => any) => (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && fn()
export const warnDev = (str: string) => devEnvOnly(() => console.warn(str + " (This message won't pop up in production mode."))
