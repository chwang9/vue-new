import request from "@/utils/request";

export async function api() {
  return request("/api");
}
