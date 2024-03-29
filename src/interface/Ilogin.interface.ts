import { JwtPayload } from 'jsonwebtoken'

export interface ILogin {
  user: string
  password: string
}

interface IRole {
  role: string
  privileges: Array<string>
}
export interface ITokenData extends JwtPayload {
  user: string
  name: string
  session_id: string
  roles: Array<IRole>
  expat: number
}
