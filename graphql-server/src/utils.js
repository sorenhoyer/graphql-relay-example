export const getUserId = (request) => {
  const Authorization = request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    // const { userId } = jwt.verify(token, APP_SECRET)
    return token; // userId
  }

  throw new Error('Not authenticated')
}