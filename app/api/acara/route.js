import AcaraController from "@/server/controller/acara";

// client/app/api/acara/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url); // Parsing query params

  // Ambil nilai query parameter atau null
  const search = searchParams.get("search") || null;
  const skip = searchParams.get("skip") || null;
  const limit = searchParams.get("limit") || null;
  const isChart = searchParams.get("isChart") || null;
  const prodi = searchParams.get("prodi") || null;

  // Set filters menjadi null jika kedua nilainya null
  const filters = (searchParams.get("prodi") || searchParams.get("status")) 
    ? {
        prodi: searchParams.get("prodi") ?? null,
        status: searchParams.get("status") ?? null,
      }
    : null;

  // Set dateRange menjadi null jika kedua nilainya null
  const dateRange = (searchParams.get("start") || searchParams.get("end")) 
    ? {
        start: searchParams.get("start") ?? null,
        end: searchParams.get("end") ?? null,
      }
    : null;

  if (isChart) {
    return AcaraController.getChart(prodi);
  }
  // Jika ada query parameter, gunakan pencarian, jika tidak ambil semua data
  return AcaraController.getBySearch(search, filters, dateRange, skip, limit);
}
export async function POST(req) {
  return AcaraController.create(req);
}
