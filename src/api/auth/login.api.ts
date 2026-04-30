import { ILoginCredentials } from "@/types/auth/ILoginCredentials";
import apiClient from "../client";
import type { AuthResponse } from "@/types";

export const URL_AUTH = "/auth";

/**
 * Login user
 */
export const login = async (
  credentials: ILoginCredentials,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    `${URL_AUTH}/login`,
    credentials,
  );
  return response.data;
};
