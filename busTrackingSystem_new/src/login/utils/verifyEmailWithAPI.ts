import axios, { AxiosResponse } from 'axios';

interface VerifyEmailApiResponse {
  data: {
    email: string;
    deliverable: boolean;
    [key: string]: unknown; // allow extra fields safely
  };
  status: string;
}
export async function VerifyEmailApiResponse(email: string): Promise<boolean> {
  try {
    const response: AxiosResponse<VerifyEmailApiResponse> = await axios.get(
      `https://api.eva.pingutil.com/email?email=${encodeURIComponent(email)}`,
    );
    return response.data?.data?.deliverable === true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Email verification failed:', error.message);
    } else {
      console.error('Email verification failed with unknown error:', error);
    }
    return false;
  }
}
