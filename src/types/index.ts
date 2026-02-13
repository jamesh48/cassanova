export interface User {
  email: string
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
  createdAt: string
  updatedAt: string
  /* For Local Consumption */
  haremId: number
}
