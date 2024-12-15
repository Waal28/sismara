import CrudConfig from "../config/crud.mjs";
import HttpError from "../config/error";

export default class PesanService {
  static async getAll() {
    const allMsg = await CrudConfig.getAllData("pesan");
    const msgCount = allMsg.length;
    const msgNoRead = allMsg.filter((pesan) => pesan.isRead === false);
    const result = {
      messages: allMsg,
      msgCount,
      msgNoRead: msgNoRead.length,
    };
    return result;
  }
  static async getOne(id) {
    const result = await CrudConfig.getOneData("pesan", id);
    return result;
  }
  static async create(body) {
    const { email, subject, message } = body;

    if (!email || !subject || !message) {
      throw new HttpError("Email, subject & message wajib diisi", 400);
    }
    const payload = {
      ...body,
      isRead: false,
    };
    const result = await CrudConfig.addData("pesan", payload);
    return result;
  }
  static async update(id, body) {
    const result = await CrudConfig.updateData("pesan", id, body);
    return result;
  }
  static async delete(id) {
    await CrudConfig.deleteData("pesan", id);
  }
  static async filterAndSearch(search) {
    const apiCall = !search
      ? CrudConfig.getAllData("pesan")
      : CrudConfig.filterAndSearchData("pesan", null, "name", search);
    const result = await apiCall;
    return result;
  }
}
