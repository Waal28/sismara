import { handleResponse } from "@/app/api/route";
import HttpError from "@/server/config/error";
import MahasiswaService from "@/server/service/mahasiswa";
import { validateEmailStudent } from "../config/format";

export default class MahasiswaController {
  static async getAll() {
    try {
      const result = await MahasiswaService.getAll();

      return handleResponse(200, "Berhasil menampilkan semua data", result);
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }

  static async getOne(req, context) {
    const id = context.params.id;

    try {
      const result = await MahasiswaService.getOne(id);

      return handleResponse(200, "Berhasil menampilkan data", result);
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }

  static async update(req, context) {
    const id = context.params.id;
    const body = await req.json();

    try {
      const result = await MahasiswaService.update(id, body);

      return handleResponse(200, "Berhasil mengupdate data", result);
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }

  static async delete(req, context) {
    const id = context.params.id;

    try {
      await MahasiswaService.delete(id);

      return handleResponse(200, "Berhasil menghapus data");
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }
  static async register(req) {
    const body = await req.json();
    const { nama, npm, email, prodi, password, confirmPassword } = body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validateEmail = emailRegex.test(email);

    try {
      if (!nama || !npm || !email || !prodi || !password || !confirmPassword) {
        throw new HttpError("Data tidak lengkap", 400);
      }

      if (!validateEmail) {
        throw new HttpError("Format email tidak sesuai", 400);
      }

      const result = await MahasiswaService.register(body);

      return handleResponse(200, "Register Berhasil", result);
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }
  static async login(req) {
    const body = await req.json();
    const { email, name, image } = body;
    try {
      if (!name || !email || !image) {
        throw new HttpError("Data tidak lengkap", 400);
      }
      const isEmailValid = validateEmailStudent(body.email);
      if (!isEmailValid) {
        throw new HttpError("Email tidak valid", 400);
      }
      const result = await MahasiswaService.login({ email, name, image });
      return handleResponse(200, "Login Berhasil", result);
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }
}
