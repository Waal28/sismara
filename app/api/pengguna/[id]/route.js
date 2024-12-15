import PenggunaController from "@/server/controller/pengguna";

// client/app/api/pengguna/[id]/route.js
export async function GET(req, context) {
  return PenggunaController.getOne(req, context);
}

export async function PUT(req, context) {
  return PenggunaController.update(req, context);
}

export async function DELETE(req, context) {
  return PenggunaController.delete(req, context);
}
