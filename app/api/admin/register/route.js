import AdminService from "@/server/service/admin";
import { handleResponse } from "../../route";

// client/app/api/auth/admin/register/route.js
export async function POST(req) {
  const { username, password } = await req.json();
  try {
    const result = await AdminService.register({ username, password });
    return handleResponse(200, "Register Berhasil", result);
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}
