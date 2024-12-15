import bcrypt from "bcrypt";
import CrudConfig from "@/server/config/crud.mjs";
import HttpError from "@/server/config/error";
import { sortObjectKeys } from "../config/format";

export default class MahasiswaService {
  static async getAll() {
    const result = await CrudConfig.getAllData("mahasiswa");
    return result;
  }
  static async getOne(id) {
    const result = await CrudConfig.getOneData("mahasiswa", id);

    return result;
  }
  static async update(id, body) {
    const { name, email, npm, image } = body;
    if (image) {
      const result = await CrudConfig.updateData("mahasiswa", id, { image });
      return result;
    }
    const [mhs, data] = await Promise.all([
      CrudConfig.getOneData("mahasiswa", id),
      CrudConfig.filterData("mahasiswa", "npm", npm),
    ]);

    if (data.length > 0 && data[0].npm !== mhs.npm) {
      throw new HttpError("NPM sudah terdaftar", 400);
    }

    const result = await CrudConfig.updateData("mahasiswa", id, body);

    return result;
  }

  static async delete(id) {
    await CrudConfig.deleteData("mahasiswa", id);
  }
  static async register(body) {
    const { nama, npm, email, prodi } = body;

    if (!nama || !npm || !email || !prodi) {
      throw new HttpError("Data tidak lengkap", 400);
    }
    const data = await CrudConfig.filterData("mahasiswa", "npm", npm);

    if (data.length > 0) {
      throw new HttpError("NPM sudah terdaftar", 400);
    }

    const result = await CrudConfig.addData("mahasiswa", body);

    return result;
  }
  static async login(body) {
    const { name, email, image } = body;
    const findMhs = await CrudConfig.filterData("mahasiswa", "email", email);

    if (findMhs.length < 1) {
      const payload = {
        name,
        email,
        defaultImg: image,
      };
      const result = await CrudConfig.addData("mahasiswa", payload);

      return { ...result, isFirstLogin: true };
    }
    if (!findMhs[0].npm || !findMhs[0].prodi) {
      return { ...findMhs[0], isFirstLogin: true };
    }
    return sortObjectKeys({ ...findMhs[0], isFirstLogin: false });
  }
}
