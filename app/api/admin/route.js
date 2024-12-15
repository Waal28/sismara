import AdminService from "@/server/service/admin";
import { handleResponse } from "../route";

// client/app/api/admin/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url); // Parsing query params

  const search = searchParams.get("search") || null;
  const idEvent = searchParams.get("idEvent") || null;

  try {
    // Jika ada query params, gunakan untuk filter, jika tidak ambil semua data
    let result = {};
    if (search) {
      result = await AdminService.filterAndSearch(search);
    } else if (idEvent) {
      result = await AdminService.getReviewByIdEvent(idEvent);
    } else {
      result = await AdminService.getAll();
    }
    return handleResponse(200, "Berhasil menyaring data", result);
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}
export async function POST(req) {
  const body = await req.json();
  try {
    const result = await AdminService.create(body);

    return handleResponse(200, "Berhasil menambahkan data", result);
  } catch (error) {
    return handleResponse(error.statusCode, error.message);
  }
}
