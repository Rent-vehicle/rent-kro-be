import User from '#models/user'

type UserResponse = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'email' | 'createdAt' | 'updatedAt'
>
export const userTransformer = (user: User): UserResponse => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}
