import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Harem, Prospect, ProspectNote, Tag, User } from '@/types'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api/'

export const cassanovaProtectedApi = createApi({
  reducerPath: 'protectedApi',
  tagTypes: ['Prospects', 'ProspectNotes', 'Harems', 'User', 'Tags'],
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
    createProspect: builder.mutation<void, Prospect>({
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
      query: ({ id, ...body }) => ({
        method: 'PUT',
        url: `prospects/${id}`,
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
      query: ({ id, ...body }) => ({
        method: 'PUT',
        url: `user-harems/${id}`,
        body,
      }),
      invalidatesTags: ['Harems'],
    }),
    // User
    updateUser: builder.mutation<void, Pick<User, 'userLocation'>>({
      query: (body) => ({
        method: 'PATCH',
        url: 'user',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        method: 'GET',
        url: 'user',
      }),
      providesTags: ['User'],
    }),
    // Tags
    getUserTags: builder.query<Tag[], void>({
      query: () => ({
        method: 'GET',
        url: 'tags',
      }),
      providesTags: ['Tags'],
    }),
    createUserTag: builder.mutation<Tag, Pick<Tag, 'name'>>({
      query: (body) => ({
        method: 'POST',
        url: 'tags',
        body,
      }),
      invalidatesTags: ['Tags'],
    }),
    // Prospect Tags
    appendTagToProspect: builder.mutation<
      void,
      { tagId: number; prospectId: number }
    >({
      query: ({ prospectId, ...body }) => ({
        method: 'POST',
        url: `/prospects/${prospectId}/tags`,
        body,
      }),
      invalidatesTags: ['Harems'],
    }),
    deleteTagFromProspect: builder.mutation<
      void,
      { tagId: number; prospectId: number }
    >({
      query: ({ prospectId, tagId }) => ({
        url: `/prospects/${prospectId}/tags/${tagId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Harems'],
    }),
    deleteUserTag: builder.mutation<void, { tagId: number }>({
      query: ({ tagId }) => ({
        url: `/tags/${tagId}`,
        method: 'DELETE',
      }),
      // invalidate harems so that tags deleted from prospects are refreshed
      invalidatesTags: ['Tags', 'Harems'],
    }),
    createProspectNote: builder.mutation<
      void,
      ProspectNote & { prospectId: number }
    >({
      query: ({ prospectId, ...body }) => ({
        url: `prospects/${prospectId}/notes`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ProspectNotes'],
    }),
    listProspectNotes: builder.query<ProspectNote[], { prospectId: number }>({
      query: ({ prospectId }) => ({
        url: `/prospects/${prospectId}/notes`,
        method: 'GET',
      }),
      providesTags: ['ProspectNotes'],
    }),
    deleteProspectNote: builder.mutation<
      void,
      { noteId: number; prospectId: number }
    >({
      query: ({ prospectId, noteId }) => ({
        url: `/prospects/${prospectId}/notes/${noteId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProspectNotes'],
    }),
    updateProspectNote: builder.mutation<
      ProspectNote,
      { noteId: number; prospectId: number; content: string }
    >({
      query: ({ prospectId, noteId, content }) => ({
        url: `/prospects/${prospectId}/notes/${noteId}`,
        method: 'PATCH',
        body: { content },
      }),
      invalidatesTags: ['ProspectNotes'],
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
  // Prospect Notes
  useListProspectNotesQuery,
  useCreateProspectNoteMutation,
  useDeleteProspectNoteMutation,
  useUpdateProspectNoteMutation,
  // Token
  useLazyValidateTokenQuery,
  // User
  useUpdateUserMutation,
  useGetCurrentUserQuery,
  // Tags
  useGetUserTagsQuery,
  useCreateUserTagMutation,
  useAppendTagToProspectMutation,
  useDeleteTagFromProspectMutation,
  useDeleteUserTagMutation,
} = cassanovaProtectedApi
