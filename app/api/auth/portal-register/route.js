import MahasiswaController from "@/server/controller/mahasiswa";

export async function POST(req) {
  return MahasiswaController.register(req);
}
