import { handleResponse } from "@/app/api/route";
import PenggunaService from "@/server/service/pengguna";

export default class PenggunaController {
  static async getAll() {
    try {
      const result = await PenggunaService.getAll();

      return handleResponse(200, "Berhasil menampilkan semua data", result);
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }

  static async getOne(req, context) {
    const id = context.params.id;

    try {
      const result = await PenggunaService.getOne(id);

      return handleResponse(200, "Berhasil menampilkan data", result);
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }

  static async register(req) {
    const body = await req.json();
    try {
      const result = await PenggunaService.register(body);

      return handleResponse(200, "Berhasil menambahkan data", result);
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }

  static async update(req, context) {
    const id = context.params.id;
    const body = await req.json();
    try {
      const result = await PenggunaService.update(id, body);

      return handleResponse(200, "Berhasil mengupdate data", result);
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }

  static async delete(req, context) {
    const id = context.params.id;

    try {
      await PenggunaService.delete(id);

      return handleResponse(200, "Berhasil menghapus data");
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }

  static async getBySearch(req) {
    try {
      const result = await PenggunaService.filterAndSearch(req);

      return handleResponse(200, "Berhasil menyaring data", result);
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }
}
