import MahasiswaController from "@/server/controller/mahasiswa";

// client/app/api/mahasiswa/[id]/route.js
export async function GET(req, context) {
  return MahasiswaController.getOne(req, context);
}

export async function PUT(req, context) {
  return MahasiswaController.update(req, context);
}

export async function DELETE(req, context) {
  return MahasiswaController.delete(req, context);
}
