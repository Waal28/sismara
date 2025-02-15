import PesertaService from "@/server/service/peserta";
import { handleResponse } from "@/app/api/route";

export async function POST(req) {
  const body = await req.json();
  try {
    const result = await PesertaService.deleteParticipantOrVolunteer(body);

    return handleResponse(200, "Berhasil menambahkan data", result);
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}
