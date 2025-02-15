import PenggunaService from "@/server/service/pengguna";
import { handleResponse } from "@/app/api/route";
// client/app/api/auth/admin/login/route.js
export async function POST(req) {
  const { email, password } = await req.json();
  try {
    const result = await PenggunaService.login({ email, password });
    return handleResponse(200, "Login Berhasil", result);
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}
