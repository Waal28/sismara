import MahasiswaController from "@/server/controller/mahasiswa";

// client/app/api/mahasiswa/route.js
export async function GET() {
  return MahasiswaController.getAll();
}
export async function POST(req) {
  return MahasiswaController.register(req);
}
