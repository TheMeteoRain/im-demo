import { User } from 'shared'

export const getUserAvatarName = (user: User) => {
  return user.firstName.charAt(0) + user.lastName.charAt(0)
}
