import apiClient from "../client";
import type { AuthResponse } from "@/types";
import { URL_AUTH } from "./login.api";
import { IRegisterCredentials } from "@/types/auth/IRegisterCredentials";

/**
 * Register new user
 */
export const register = async (
  data: IRegisterCredentials,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    `${URL_AUTH}/register`,
    data,
  );
  console.log("register response: ", response);
  return response.data;
};
