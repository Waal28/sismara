import AcaraController from "@/server/controller/acara";

// client/app/api/acara/upload-certificate/[id]/route.js
export async function PUT(req, context) {
  return AcaraController.uploadCertificate(req, context);
}