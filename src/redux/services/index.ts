import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Harem, Prospect } from '@/types'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api/'

export const cassanovaProtectedApi = createApi({
  reducerPath: 'protectedApi',
  tagTypes: ['Prospects', 'Harems'],
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    validateToken: builder.query<void, void>({
      query: () => ({ url: 'validate-token', method: 'GET' }),
    }),
    createProspect: builder.mutation<void, Pick<Prospect, 'name' | 'haremId'>>({
      query: (body) => ({
        url: 'prospect',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Harems'],
    }),
    deleteProspect: builder.mutation<void, Pick<Prospect, 'id'>>({
      query: (params) => ({
        url: `prospects/${params.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Harems'],
    }),
    moveProspect: builder.mutation<
      void,
      { newHaremId: number; prospectId: number }
    >({
      query: (body) => ({
        url: 'move-prospect',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Harems'],
    }),
    reorderProspects: builder.mutation<void, Prospect[]>({
      query: (body) => ({
        url: 'reorder-prospects',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Harems'],
    }),
    updateProspect: builder.mutation<void, Prospect>({
      query: (body) => ({
        method: 'PUT',
        url: `prospects/${body.id}`,
        body,
      }),
      invalidatesTags: ['Harems'],
    }),
    // Harems
    createUserHarem: builder.mutation<void, Pick<Harem, 'name'>>({
      query: (body) => ({
        method: 'POST',
        url: 'user-harems',
        body,
      }),
      invalidatesTags: ['Harems'],
    }),
    deleteUserHarem: builder.mutation<void, Pick<Harem, 'id'>>({
      query: (params) => ({
        method: 'DELETE',
        url: `user-harems/${params.id}`,
      }),
      invalidatesTags: ['Harems'],
    }),
    getAllHarems: builder.query<Harem[], void>({
      query: () => 'user-harems',
      providesTags: ['Harems'],
    }),
    reorderHarems: builder.mutation<
      void,
      Pick<Harem, 'id' | 'order' | 'name'>[]
    >({
      query: (body) => ({
        method: 'POST',
        url: 'reorder-harems',
        body,
      }),
      invalidatesTags: ['Harems'],
    }),
    updateHarem: builder.mutation<void, Harem>({
      query: (body) => ({
        method: 'PUT',
        url: `user-harems/${body.id}`,
        body,
      }),
      invalidatesTags: ['Harems'],
    }),
  }),
})

export const {
  // Harems
  useCreateUserHaremMutation,
  useDeleteUserHaremMutation,
  useGetAllHaremsQuery,
  useReorderHaremsMutation,
  useUpdateHaremMutation,
  // Prospects
  useCreateProspectMutation,
  useDeleteProspectMutation,
  useMoveProspectMutation,
  useReorderProspectsMutation,
  useUpdateProspectMutation,
  // Token
  useLazyValidateTokenQuery,
} = cassanovaProtectedApi
