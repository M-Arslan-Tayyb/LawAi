import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import axios, {
  AxiosRequestConfig,
  ResponseType as AxiosResponseType,
} from "axios";
import { RTK_TAGS } from "./tags";
import { signOut } from "next-auth/react";

type AxiosBaseQueryArgs = {
  url: string;
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  data?: any;
  params?: any;
  body?: any;
  customBaseUrl?: string;
  customHeader?: { [key: string]: string };
  responseType?: AxiosResponseType;
  customtoken?: string;
};

const axiosBaseQuery: BaseQueryFn<AxiosBaseQueryArgs> = async ({
  url,
  method,
  data,
  params,
  customBaseUrl,
  customHeader,
  responseType,
  customtoken,
}: AxiosBaseQueryArgs) => {
  let headers: { [key: string]: string } = {
    "Content-type": "application/json; charset=UTF-8",
    ...customHeader,
  };

  if (customtoken) {
    headers = {
      ...headers,
      Authorization: `Bearer ${customtoken}`,
    };
  }

  try {
    const resp = await axios({
      url: customBaseUrl
        ? customBaseUrl + url
        : process.env.NEXT_PUBLIC_API_URL + url,
      method,
      data,
      params,
      headers,
      responseType,
    } as AxiosRequestConfig);

    if (resp.data) {
      return { data: resp.data };
    }
    throw resp.data;
  } catch (error: any) {
    // Handle 401 unauthorized - sign out user
    if (error.response?.status === 401 && customtoken) {
      await signOut({ callbackUrl: "/" });
    }
    return {
      error: error?.response,
    };
  }
};

export const rtkQApi = createApi({
  reducerPath: "rtkQApi",
  baseQuery: axiosBaseQuery,
  endpoints: () => ({}),
  tagTypes: [...Object.values(RTK_TAGS)],
});
