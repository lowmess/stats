const logError = (message: string, error: string): void => {
  console.error(`
=================================
${message}
---------------------------------
${error}
=================================
  `)
}

export default logError
