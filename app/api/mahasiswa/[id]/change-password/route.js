import MahasiswaController from "@/server/controller/mahasiswa";

export async function PUT(req, context) {
  return MahasiswaController.ubahPassword(req, context);
}
