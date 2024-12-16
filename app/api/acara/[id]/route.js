import AcaraController from "@/server/controller/acara";

// client/app/api/acara/[id]/route.js
export async function GET(req, { params }) {
  const id = params.id;
  return AcaraController.getOne(req, id);
}

export async function PUT(req, { params }) {
  const id = params.id;
  return AcaraController.update(req, id);
}

export async function DELETE(req, { params }) {
  const id = params.id;
  return AcaraController.delete(req, id);
}
