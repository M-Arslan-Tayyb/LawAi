import { rtkQApi } from "../rtkQApi";
import { RTK_TAGS } from "../tags";
import { ApiResponse } from "@/types/genericTypes";
import {
  DrafterGenerateRequest,
  DrafterGenerateResponse,
  DrafterDraft,
  GetDraftsParams,
} from "@/types/DrafterTypes";

export const drafterService = rtkQApi.injectEndpoints({
  endpoints: (builder) => ({
    generateDraft: builder.mutation<
      ApiResponse<DrafterGenerateResponse>,
      DrafterGenerateRequest
    >({
      query: (data) => ({
        url: "drafter/generate-draft",
        method: "POST",
        data,
      }),
      invalidatesTags: [RTK_TAGS.DRAFTER],
    }),

    getDrafts: builder.query<ApiResponse<DrafterDraft[]>, GetDraftsParams>({
      query: ({ user_id }) => ({
        url: `drafter/get-drafts?user_id=${user_id}`,
        method: "GET",
      }),
      providesTags: [RTK_TAGS.DRAFTER],
    }),
  }),
});

export const { useGenerateDraftMutation, useGetDraftsQuery } = drafterService;
