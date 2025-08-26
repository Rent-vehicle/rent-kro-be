export type UserCreateDTO = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type UserUpdateDTO = {
  firstName?: string
  lastName?: string
}
