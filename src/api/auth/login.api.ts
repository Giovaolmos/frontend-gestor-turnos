import { ILoginCredentials } from "@/types/auth/ILoginCredentials";
import apiClient from "../client";
import type { AuthResponse, ApiResponse } from "@/types";

/**
 * Login user
 */
export const login = async (
  credentials: ILoginCredentials,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    "/auth/login",
    credentials,
  );
  console.log("login response: ", response);
  return response.data; // Retornamos directamente response.data, ya que el backend no anida los datos en data.data
};
