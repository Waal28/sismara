import { handleResponse } from "../route";
import PesertaService from "@/server/service/peserta";

// client/app/api/peserta/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url); // Parsing query params

  const search = searchParams.get("search") || null;
  const idMhs = searchParams.get("idMhs") || null;
  const idEvent = searchParams.get("idEvent") || null;
  const participantAndVolunteer =
    searchParams.get("participantAndVolunteer") || null;

  try {
    // Jika ada query params, gunakan untuk filter, jika tidak ambil semua data
    let result = {};
    if (search) {
      result = await PesertaService.filterAndSearch(search);
    } else if (idMhs) {
      result = await PesertaService.getMyEventsByIdMhs(idMhs);
    } else if (idEvent) {
      if (participantAndVolunteer) {
        result = await PesertaService.getEventParticipantsAndVolunteers(
          idEvent
        );
      } else {
        result = await PesertaService.getMyEventsByIdEvent(idEvent);
      }
    } else {
      result = await PesertaService.getAll();
    }
    return handleResponse(200, "Berhasil menyaring data", result);
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}
export async function POST(req) {
  const body = await req.json();
  try {
    const result = await PesertaService.create(body);

    return handleResponse(200, "Berhasil menambahkan data", result);
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}
