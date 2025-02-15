import PesanService from "@/server/service/pesan";
import { handleResponse } from "@/app/api/route";

// client/app/api/pesan/[id]/route.js
export async function PUT(req, context) {
  const id = context.params.id;
  const body = await req.json();
  try {
    const result = await PesanService.update(id, body);

    return handleResponse(200, "Berhasil mengupdate data", result);
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}

export async function DELETE(req, context) {
  const id = context.params.id;
  try {
    await PesanService.delete(id);

    return handleResponse(200, "Berhasil menghapus data");
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}
