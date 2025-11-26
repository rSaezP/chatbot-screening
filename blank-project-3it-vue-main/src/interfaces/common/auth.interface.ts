export interface UserAuthRole {
  id: number
  name: string
  description: string
  status: boolean
}

export interface UserAuthIdentity {
  id: number
  name: string
  description: string
}

export interface UserAuthCore {
  id: number
  firstName: string
  lastName: string
  email: string
  address: string
  phoneNumber: string
  identification: string
  identificationType: UserAuthIdentity
  role: UserAuthRole
}
export interface UserAuthConfig {
  darkTheme: boolean
}
