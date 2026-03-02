export interface User {
  email: string
  password: string
  userLocation: string
}

export interface Harem {
  name: string
  id: number
  prospects: Prospect[]
  order: number
}

export interface Prospect {
  id: number
  name: string
  harem: number
  hotLead: boolean
  haremOrder: number
  timeInCurrentHarem: string
  // String for (empty string) form value, number as value
  age: string | number | null
  occupation: string
  phoneNumber: string
  notes: string
  location: string
  createdAt: string
  updatedAt: string
  /* For Local Consumption */
  haremId: number
  tags: { prospectId: number; tagId: number; tag: Tag }[]
}

export interface Tag {
  id: number
  userId: number
  name: string
  createdAt: string
}
