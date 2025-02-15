import { handleResponse } from "@/app/api/route";
import PenggunaService from "@/server/service/pengguna";

export async function PUT(req, context) {
  const id = context.params.id;
  const body = await req.json();
  const apiCall = body.isAdmin
    ? PenggunaService.changePasswordUserForAdmin(id, body)
    : PenggunaService.changePassword(id, body);
  try {
    const result = await apiCall;

    return handleResponse(200, "Berhasil mengupdate data", result);
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}
