import apiClient from "../client";
import type { AuthResponse, RegisterCredentials, ApiResponse } from "@/types";

/**
 * Register new user
 */
export const register = async (
  data: RegisterCredentials,
): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    data,
  );
  return response.data.data;
};
