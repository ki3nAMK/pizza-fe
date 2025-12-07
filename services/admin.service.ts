import { AuthResponse } from "@/interfaces/user.interface";
import { http } from "@/lib/request/base-request";

interface SettingInterface {
  maxLoginRetry: number;
  loginTimeout: number;
  maxResendOtp: number;
  resendOtpTimeout: number;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

const adminService = {
  getSettings: (): Promise<SettingInterface> =>
    http.axios.request({
      method: "GET",
      url: `admin/settings`,
    }),

  updateSettings: (data: SettingInterface): Promise<SettingInterface> =>
    http.axios.request({
      method: "PUT",
      url: `admin/settings`,
      data,
    }),
};

export default adminService;
