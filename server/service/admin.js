import CrudConfig from "@/server/config/crud.mjs";
import HttpError from "@/server/config/error";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { sortObjectKeys } from "../config/format";

const NEXT_PUBLIC_SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;
export default class AdminService {
  static async getAll() {
    const result = await CrudConfig.getAllData("admin");
    return result;
  }
  static async getOne(id) {
    const result = await CrudConfig.getOneData("admin", id);

    return result;
  }
  static async update(id, body) {
    const data = await CrudConfig.filterData("admin", "npm", body.npm);

    if (data.length > 0) {
      throw new HttpError("NPM sudah terdaftar", 400);
    }

    const result = await CrudConfig.updateData("admin", id, body);

    return result;
  }
  static async delete(id) {
    await CrudConfig.deleteData("admin", id);
  }
  static async register(body) {
    const { username, password } = body;
    // Validasi input
    if (!username || !password) {
      throw new HttpError("Username dan password wajib diisi", 400);
    }

    const data = await CrudConfig.filterData("admin", "username", username);

    if (data.length > 0) {
      throw new HttpError("Username sudah terdaftar", 400);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    body.password = passwordHash;
    const result = await CrudConfig.addData("admin", body);

    return result;
  }
  static async login(body) {
    const { username, password } = body;
    // Validasi input
    if (!username || !password) {
      throw new HttpError("Username dan password wajib diisi", 400);
    }

    // Cari admin berdasarkan username
    const findUser = await CrudConfig.filterData("admin", "username", username);

    if (findUser.length < 1) {
      // Jangan beri tahu apakah username atau password salah
      throw new HttpError("Username atau password salah", 400);
    }

    const user = findUser[0];
    // Cek apakah password valid menggunakan bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpError("Username atau password salah", 400);
    }

    // Buat token JWT
    delete user.password;
    const token = sign(user, NEXT_PUBLIC_SECRET_KEY, {
      expiresIn: '1h',
    });

    return sortObjectKeys({ token, user });
  }
}
