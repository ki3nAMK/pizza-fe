import { http } from "@/lib/request/base-request";

const systemService = {
  getPublickey: (): Promise<{ publicKey: string }> =>
    http.axios.request({
      method: "GET",
      url: `system/public-key`,
    }),
};

export default systemService;
