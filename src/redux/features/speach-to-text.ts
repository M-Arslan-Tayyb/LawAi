import { ApiResponse } from "@/types/genericTypes";
import { rtkQApi } from "../rtkQApi";
import { Transcription } from "@/types/speach-to-text_types";

export const textToSpeechService = rtkQApi.injectEndpoints({
  endpoints: (builder) => ({
    transcribeAudio: builder.mutation<ApiResponse<Transcription>, FormData>({
      query: (formData) => ({
        url: "text-to-speech/transcribe-audio",
        method: "POST",
        data: formData,
      }),
    }),
  }),
});

export const { useTranscribeAudioMutation } = textToSpeechService;
