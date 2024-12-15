import PenggunaController from "@/server/controller/pengguna";

// client/app/api/pengguna/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url); // Parsing query params

  const search = searchParams.get("search") || null;

  // Jika ada query params, gunakan untuk filter, jika tidak ambil semua data
  if (search) {
    return PenggunaController.getBySearch(search);
  } else {
    return PenggunaController.getAll();
  }
}
export async function POST(req) {
  return PenggunaController.register(req);
}
