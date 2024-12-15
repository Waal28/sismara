import PesertaService from "@/server/service/peserta";
import { handleResponse } from "../../route";

// export async function GET(request) {
//   const { searchParams } = new URL(request.url); // Parsing query params

//   const search = searchParams.get("search") || null;
//   const idEvent = searchParams.get("idEvent") || null;

//   try {
//     // Jika ada query params, gunakan untuk filter, jika tidak ambil semua data
//     let result = {};
//     if (search) {
//       result = await PesertaService.getAll(search);
//     } else if (idEvent) {
//       result = await PesertaService.getCandidateVolunteer(idEvent);
//     } else {
//       result = await PesertaService.getAll();
//     }
//     return handleResponse(200, "Berhasil menyaring data", result);
//   } catch (error) {
//     return handleResponse(error.statusCode, error.message);
//   }
// }
export async function POST(req) {
  const body = await req.json();
  try {
    const result = await PesertaService.addCandidateVolunteer(body);

    return handleResponse(200, "Berhasil menambahkan data", result);
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}
