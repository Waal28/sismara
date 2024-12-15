import AcaraController from "@/server/controller/acara";

// client/app/api/acara/route.js
export async function GET() {
  return AcaraController.getAll();
}
export async function POST(req) {
  return AcaraController.create(req);
}
