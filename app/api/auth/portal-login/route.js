import MahasiswaController from "@/server/controller/mahasiswa";
//import { getToken } from "next-auth/jwt";

//const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req) {
  return MahasiswaController.login(req);
}
