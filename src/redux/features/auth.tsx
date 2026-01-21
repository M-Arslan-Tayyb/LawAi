import { SignupRequest, SignupResponse } from "@/types/authTypes";
import { rtkQApi } from "../rtkQApi";
import { RTK_TAGS } from "../tags";
import { ApiResponse } from "@/types/genericTypes";

export const authService = rtkQApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<ApiResponse<SignupResponse>, SignupRequest>({
      query: (data) => ({
        url: "user/signUp",
        method: "POST",
        data,
      }),
      invalidatesTags: [RTK_TAGS.AUTH],
    }),
  }),
});

export const { useSignupMutation } = authService;
