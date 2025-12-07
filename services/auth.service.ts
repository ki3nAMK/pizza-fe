import { AuthResponse } from "@/interfaces/user.interface";
import { http } from "@/lib/request/base-request";
import { User } from "@/type";

const authService = {
  login: (data: {
    username: string;
    password: string;
  }): Promise<AuthResponse> =>
    http.axios.request({
      method: "POST",
      url: `auth/sign-in`,
      data,
    }),

  register: (data: {
    email: string;
    password: string;
    name: string;
  }): Promise<AuthResponse> =>
    http.axios.request({
      method: "POST",
      url: `auth/sign-up`,
      data,
    }),

  verifyEmail: (data: { email: string; otp: string }): Promise<AuthResponse> =>
    http.axios.request({
      method: "POST",
      url: `auth/verify-email`,
      data,
    }),

  resendEmail: (data: { email: string }): Promise<AuthResponse> =>
    http.axios.request({
      method: "POST",
      url: `auth/resend-otp`,
      data,
    }),

  getMe: (): Promise<User> =>
    http.axios.request({
      method: "GET",
      url: `users/me`,
    }),

  logout: (): Promise<{ success: boolean }> =>
    http.axios.request({
      method: "POST",
      url: "auth/sign-out",
    }),
};

export default authService;
