import { rtkQApi } from "../rtkQApi";
import { RTK_TAGS } from "../tags";
import { ApiResponse } from "@/types/genericTypes";
import {
  FamilyLawQueryRequest,
  FamilyLawQueryResponse,
  FamilyLawSessionResponse,
  FamilyLawMessage,
  GetSessionsParams,
  GetMessagesParams,
} from "@/types/FamilyLawTypes";

export const familyLawService = rtkQApi.injectEndpoints({
  endpoints: (builder) => ({
    // Query to agent - send message
    queryFamilyLawAgent: builder.mutation<
      ApiResponse<FamilyLawQueryResponse>,
      FamilyLawQueryRequest
    >({
      query: (data) => ({
        url: "family-law/family-law-agent",
        method: "POST",
        data,
      }),
      invalidatesTags: [RTK_TAGS.FAMILY_LAW],
    }),

    // Get all sessions for a user
    getFamilyLawSessions: builder.query<
      ApiResponse<FamilyLawSessionResponse[]>,
      GetSessionsParams
    >({
      query: ({ user_id }) => ({
        url: `family-law/get-sessions?user_id=${user_id}`,
        method: "GET",
      }),
      providesTags: [RTK_TAGS.FAMILY_LAW],
    }),

    // Get messages for a specific session
    getFamilyLawMessages: builder.query<
      ApiResponse<FamilyLawMessage[]>,
      GetMessagesParams
    >({
      query: ({ chat_session_id }) => ({
        url: `family-law/get-messages?chat_session_id=${chat_session_id}`,
        method: "GET",
      }),
      providesTags: [RTK_TAGS.FAMILY_LAW],
    }),
  }),
});

export const {
  useQueryFamilyLawAgentMutation,
  useGetFamilyLawSessionsQuery,
  useGetFamilyLawMessagesQuery,
  useLazyGetFamilyLawMessagesQuery,
} = familyLawService;
