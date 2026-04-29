import { ILoginCredentials } from "@/types/auth/ILoginCredentials";
import apiClient from "../client";
import type { AuthResponse, ApiResponse } from "@/types";

/**
 * Login user
 */
export const login = async (
  credentials: ILoginCredentials,
): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(
    "/auth/login",
    credentials,
  );
  console.log("login response: ", response);
  return response.data;
};
