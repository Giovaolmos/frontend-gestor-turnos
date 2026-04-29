import { forgotPassword } from "./forgotPassword.api";
import { getProfile } from "./getProfile.api";
import { login } from "./login.api";
import { logout } from "./logout.api";
import { register } from "./register.api";
import { resetPassword } from "./resetPassword.api";
import { updateProfile } from "./updateProfile.api";

export const authApi = {
  login,
  register,
  getProfile,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
};
