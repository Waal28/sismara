import { handleResponse } from "@/app/api/route";
import AcaraService from "@/server/service/acara";

export default class AcaraController {
  static async getAll() {
    try {
      const result = await AcaraService.getAll();

      return handleResponse(200, "Berhasil menampilkan semua data", result);
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }

  static async getOne(req, context) {
    const id = context.params.id;

    try {
      const result = await AcaraService.getOne(id);

      return handleResponse(200, "Berhasil menampilkan data", result);
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }

  static async create(req) {
    const body = await req.json();
    try {
      const result = await AcaraService.create(body);

      return handleResponse(200, "Berhasil menambahkan data", result);
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }

  static async update(req, context) {
    const id = context.params.id;
    const body = await req.json();
    try {
      const result = await AcaraService.update(id, body);

      return handleResponse(200, "Berhasil mengupdate data", result);
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }

  static async delete(req, context) {
    const id = context.params.id;

    try {
      await AcaraService.delete(id);

      return handleResponse(200, "Berhasil menghapus data");
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }
  static async getBySearch(search, filters, dateRange, skip, limit) {
    try {
      const result = await AcaraService.filterAndSearch(
        search,
        filters,
        dateRange,
        skip,
        limit
      );

      return handleResponse(200, "Berhasil menyaring data", result);
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }
  static async uploadCertificate(req, context) {
    const id = context.params.id;
    const body = await req.json();
    try {
      const result = await AcaraService.uploadCertificate(id, body);

      return handleResponse(200, "Berhasil mengupdate data", result);
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }
  static async getChart(prodi) {
    try {
      const result = await AcaraService.getChart(prodi);

      return handleResponse(200, "Berhasil menampilkan semua data", result);
    } catch (error) {
      return handleResponse(error.statusCode, error.message);
    }
  }
}
