import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import CrudConfig from "../config/crud.mjs";
import { sortObjectKeys } from "../config/format";
import HttpError from "../config/error";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;
const DEFAULT_PASSWORD = process.env.NEXT_PUBLIC_DEFAULT_PASSWORD;

export default class PenggunaService {
  static async getAll() {
    const result = await CrudConfig.getAllData("pengguna");
    return result;
  }
  static async getOne(id) {
    const result = await CrudConfig.getOneData("pengguna", id);
    return result;
  }
  static async create(body) {
    const result = await CrudConfig.addData("pengguna", body);
    return result;
  }
  static async register(body) {
    const { username, email, isAdmin, name, npm, prodi } = body;
    // Validasi input
    if (
      isAdmin === undefined ||
      typeof isAdmin !== "boolean" ||
      !username ||
      !email
    ) {
      throw new HttpError("Username, email & role wajib diisi", 400);
    }
    if (isAdmin === false && (!name || !npm || !prodi)) {
      throw new HttpError(
        "Data mahasiswa (nama, npm & prodi) wajib diisi",
        400
      );
    }

    const userExists = await CrudConfig.filterData(
      "pengguna",
      "username",
      username
    );

    if (userExists.length > 0) {
      throw new HttpError("Username sudah terdaftar", 400);
    }
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const payload = {
      username,
      email,
      isAdmin,
      password: passwordHash,
      prodi: "Fakultas Teknik",
    };
    if (isAdmin === false) {
      payload.name = name;
      payload.npm = npm;
      payload.prodi = prodi;
    }

    const result = await CrudConfig.addData("pengguna", payload);

    return sortObjectKeys(result);
  }
  static async login(body) {
    const { email, password } = body;
    // Validasi input
    if (!email || !password) {
      throw new HttpError("Email dan password wajib diisi", 400);
    }

    // Cari admin berdasarkan email
    const findUser = await CrudConfig.filterData("pengguna", "email", email);
    if (findUser.length < 1) {
      // Jangan beri tahu apakah email atau password salah
      throw new HttpError("Email atau password salah", 400);
    }

    const user = findUser[0];
    // Cek apakah password valid menggunakan bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpError("Email atau password salah", 400);
    }

    // Buat token JWT
    delete user.password;
    const token = sign(user, SECRET_KEY, {
      expiresIn: "1h",
    });

    return sortObjectKeys({ token, user });
  }
  static async update(id, body) {
    const result = await CrudConfig.updateData("pengguna", id, body);
    return result;
  }
  static async delete(id) {
    await CrudConfig.deleteData("pengguna", id);
  }
  static async filterAndSearch(search) {
    const apiCall = !search
      ? CrudConfig.getAllData("pengguna")
      : CrudConfig.filterAndSearchData("pengguna", null, "name", search);
    const result = await apiCall;
    return result;
  }
  static async changePassword(id, body) {
    const { oldPassword, newPassword, verifyNewPassword } = body;
    if (!oldPassword || !newPassword || !verifyNewPassword) {
      throw new HttpError("Data tidak lengkap", 400);
    }
    if (oldPassword.length < 8 || newPassword < 8 || verifyNewPassword < 8) {
      throw new HttpError("Password minimal 8 karakter", 400);
    }
    if (newPassword !== verifyNewPassword) {
      throw new HttpError("Password baru tidak sesuai", 400);
    }
    const pengguna = await CrudConfig.getOneData("pengguna", id);
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      pengguna.password
    );
    if (!isPasswordValid) {
      throw new HttpError("Password lama salah", 400);
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await CrudConfig.updateData("pengguna", id, {
      password: newPasswordHash,
    });

    return { message: "Password berhasil diubah", success: true };
  }
  static async changePasswordUserForAdmin(id, body) {
    const { password, verifyPassword, userId } = body;
    // Validasi input
    if (!password || !verifyPassword || !userId) {
      throw new HttpError("Data tidak lengkap", 400);
    }
    if (password.length < 8 || verifyPassword.length < 8) {
      throw new HttpError("Password minimal 8 karakter", 400);
    }
    if (password !== verifyPassword) {
      throw new HttpError("Password baru tidak sesuai", 400);
    }

    // Pastikan admin dengan ID ini ada
    const admin = await CrudConfig.getOneData("pengguna", id);
    if (!admin) {
      throw new HttpError("Admin tidak ditemukan", 404);
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new HttpError("Password salah", 400);
    }

    // Pastikan pengguna target ada
    const pengguna = await CrudConfig.getOneData("pengguna", userId);
    if (!pengguna) {
      throw new HttpError("Pengguna tidak ditemukan", 404);
    }

    // Hash password baru dan update
    const newPasswordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    await CrudConfig.updateData("pengguna", userId, {
      password: newPasswordHash,
    });

    return { message: "Password berhasil diubah", success: true };
  }
}
