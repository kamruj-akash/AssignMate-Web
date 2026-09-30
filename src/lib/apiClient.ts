import envConfig from "@/config/envConfig";
import { ofetch } from "ofetch";

const apiClient = ofetch.create({
  baseURL: envConfig.PUBLIC_API,
});
