import UlasanService from "@/server/service/ulasan";
import { handleResponse } from "../../route";

// client/app/api/pengguna/[id]/route.js
export async function GET(req, context) {
  const id = context.params.id;
  try {
    const result = await UlasanService.getOne(id);

    return handleResponse(200, "Berhasil menampilkan data", result);
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}

export async function PUT(req, context) {
  const id = context.params.id;
  const body = await req.json();
  try {
    const result = await UlasanService.update(id, body);

    return handleResponse(200, "Berhasil mengupdate data", result);
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}

export async function DELETE(req, context) {
  const id = context.params.id;
  try {
    await UlasanService.delete(id);

    return handleResponse(200, "Berhasil menghapus data");
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}
