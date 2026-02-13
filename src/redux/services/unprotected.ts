import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { User } from '@/types'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api/'

export const cassanovaUnprotectedApi = createApi({
  reducerPath: 'unprotectedApi',
  tagTypes: [],
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    createUser: builder.mutation<{ token: string }, { email: string }>({
      query: (body) => ({
        url: 'user',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<{ token: string }, User>({
      query: (body) => ({
        url: 'login',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useCreateUserMutation, useLoginMutation } =
  cassanovaUnprotectedApi
