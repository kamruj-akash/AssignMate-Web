import envConfig from "@/config/envConfig";
import { ofetch } from "ofetch";

interface IApiErrorResponse {
  success: false;
  statusCode: number;
  name?: string;
  message?: string;
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

const apiClient = ofetch.create({
  baseURL: envConfig.PUBLIC_API,
  credentials: "include",
  onResponseError({ response }) {
    const data = response._data as IApiErrorResponse | undefined;
    throw new ApiError(
      data?.message || response.statusText || "Something went wrong",
      data?.statusCode ?? response.status,
    );
  },
});

export default apiClient;
