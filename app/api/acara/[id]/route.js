import AcaraController from "@/server/controller/acara";

// client/app/api/acara/[id]/route.js
export async function GET(req, context) {
  return AcaraController.getOne(req, context);
}

export async function PUT(req, context) {
  return AcaraController.update(req, context);
}

export async function DELETE(req, context) {
  return AcaraController.delete(req, context);
}
