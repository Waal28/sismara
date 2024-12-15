import PesanService from "@/server/service/pesan";
import { handleResponse } from "../route";

// client/app/api/pesan/route.js
export async function GET() {
  try {
    const result = await PesanService.getAll();

    return handleResponse(200, "Berhasil menambahkan data", result);
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}
export async function POST(req) {
  const body = await req.json();
  try {
    const result = await PesanService.create(body);

    return handleResponse(200, "Berhasil menambahkan data", result);
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}
