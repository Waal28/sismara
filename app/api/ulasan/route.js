import UlasanService from "@/server/service/ulasan";
import { handleResponse } from "../route";

// client/app/api/ulasan/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url); // Parsing query params

  const idEvent = searchParams.get("idEvent") || null;
  // Ambil nilai query parameter atau null
  const search = searchParams.get("search") || null;
  const skip = searchParams.get("skip") || null;
  const limit = searchParams.get("limit") || null;

  // Set filters menjadi null jika kedua nilainya null
  const filters =
    searchParams.get("prodi") || searchParams.get("status")
      ? {
          prodi: searchParams.get("prodi") ?? null,
          status: searchParams.get("status") ?? null,
        }
      : null;

  // Set dateRange menjadi null jika kedua nilainya null
  const dateRange =
    searchParams.get("start") || searchParams.get("end")
      ? {
          start: searchParams.get("start") ?? null,
          end: searchParams.get("end") ?? null,
        }
      : null;

  try {
    // Jika ada query params, gunakan untuk filter, jika tidak ambil semua data
    let result = {};
    if (search || filters || dateRange || skip || limit) {
      result = await UlasanService.filterAndSearchAlbum(
        search,
        filters,
        dateRange,
        skip,
        limit
      );
    } else if (idEvent) {
      result = await UlasanService.getReviewByIdEvent(idEvent);
    } else {
      result = await UlasanService.getAll();
    }
    return handleResponse(200, "Berhasil menyaring data", result);
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}
export async function POST(req) {
  const body = await req.json();
  try {
    const result = await UlasanService.create(body);

    return handleResponse(200, "Berhasil menambahkan data", result);
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}
