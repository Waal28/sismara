import CrudConfig from "../config/crud.mjs";
import HttpError from "../config/error";
import { sortObjectKeys } from "../config/format";

export default class PesertaService {
  static async getAll() {
    const result = await CrudConfig.getAllData("peserta");
    return sortObjectKeys(result);
  }
  static async getOne(id) {
    const peserta = await CrudConfig.getOneData("peserta", id);
    const event = await CrudConfig.getOneData("acara", peserta.id_event);
    const mahasiswa = await CrudConfig.getOneData("mahasiswa", peserta.id_mhs);
    const result = {
      ...peserta,
      event,
      mahasiswa,
    };
    return sortObjectKeys(result);
  }
  static async create(body) {
    const { idEvent, idMhs } = body;
    if (!idEvent || !idMhs) {
      throw new HttpError("Data tidak lengkap", 400);
    }
    const filters = {
      id_event: idEvent,
      id_mhs: idMhs,
    };
    const peserta = await CrudConfig.filterAndSearchData("peserta", filters);
    const volunteer = await CrudConfig.filterAndSearchData(
      "volunteer",
      filters
    );
    if (peserta.length > 0) {
      throw new HttpError("Peserta sudah terdaftar", 400);
    }
    if (volunteer.length > 0) {
      throw new HttpError("Volunteer sudah terdaftar", 400);
    }

    const event = await CrudConfig.getOneData("acara", idEvent);
    const mahasiswa = await CrudConfig.getOneData("mahasiswa", idMhs);
    const payload = {
      id_event: idEvent,
      id_mhs: idMhs,
      is_present: false,
      status: event.is_paid ? "candidate" : "approved",
    };
    const addDataResult = await CrudConfig.addData("peserta", payload);
    const result = {
      ...addDataResult,
      event,
      mahasiswa,
    };
    return sortObjectKeys(result);
  }
  static async update(id, body) {
    const result = await CrudConfig.updateData("peserta", id, body);
    return sortObjectKeys(result);
  }
  static async delete(id) {
    await CrudConfig.deleteData("peserta", id);
  }
  static async filterAndSearch(search) {
    const apiCall = !search
      ? CrudConfig.getAllData("peserta")
      : CrudConfig.filterAndSearchData("peserta", null, "name", search);
    const result = await apiCall;
    return sortObjectKeys(result);
  }
  static async getMyEventsByIdMhs(idMhs) {
    try {
      // Validasi input
      if (!idMhs) {
        throw new HttpError("ID mahasiswa tidak valid", 400);
      }

      // Ambil data peserta dan volunteer secara paralel
      const [peserta, volunteers] = await Promise.all([
        CrudConfig.filterData("peserta", "id_mhs", idMhs),
        CrudConfig.filterData("volunteer", "id_mhs", idMhs),
      ]);
      // Gabungkan peserta dan volunteer
      const allParticipants = [...peserta, ...volunteers];

      const result = await Promise.all(
        allParticipants.map(async (item) => {
          const [event, mahasiswa] = await Promise.all([
            CrudConfig.getOneData("acara", item.id_event),
            CrudConfig.getOneData("mahasiswa", item.id_mhs),
          ]);

          return {
            ...item,
            type: "is_present" in item ? "peserta" : "volunteer",
            event,
            mahasiswa,
          };
        })
      );

      // Urutkan hasil berdasarkan kunci (opsional jika diperlukan)
      return sortObjectKeys(result);
    } catch (error) {
      console.error("Error fetching participant data:", error); // Logging error
      throw new HttpError(error.message, error.statusCode || 500);
    }
  }
  static async getMyEventsByIdEvent(idEvent) {
    try {
      // Validasi input
      if (!idEvent) {
        throw new HttpError("ID acara tidak valid", 400);
      }

      // Ambil data peserta berdasarkan id_mhs
      const peserta = await CrudConfig.filterData(
        "peserta",
        "id_event",
        idEvent
      );

      if (peserta.length < 1) {
        throw new HttpError("Data tidak ditemukan", 404);
      }

      // Ambil data event dan mahasiswa secara paralel
      const result = await Promise.all(
        peserta.map(async (item) => {
          const mahasiswa = await CrudConfig.getOneData(
            "mahasiswa",
            item.id_mhs
          );
          return { ...item, mahasiswa };
        })
      );

      // Urutkan hasil berdasarkan kunci (opsional jika diperlukan)
      return sortObjectKeys(result);
    } catch (error) {
      console.error("Error fetching participant data:", error); // Logging error
      throw new HttpError(error.message, error.statusCode || 500);
    }
  }
  static async getEventParticipantsAndVolunteers(idEvent) {
    try {
      // Validasi input
      if (!idEvent || typeof idEvent !== "string") {
        throw new HttpError("ID acara tidak valid", 400);
      }

      // Ambil data utama acara dan entitas terkait
      const [acara, peserta, volunteers] = await Promise.all([
        CrudConfig.getOneData("acara", idEvent),
        CrudConfig.filterData("peserta", "id_event", idEvent),
        CrudConfig.filterData("volunteer", "id_event", idEvent),
      ]);

      // Helper untuk melengkapi data mahasiswa
      const enrichWithMahasiswa = async (dataList) => {
        return Promise.all(
          dataList.map(async (item) => {
            const mahasiswa = await CrudConfig.getOneData(
              "mahasiswa",
              item.id_mhs
            );
            return { ...item, mahasiswa };
          })
        );
      };

      // Enrich peserta dan volunteer secara paralel
      const [detailedParticipants, detailedVolunteers] = await Promise.all([
        enrichWithMahasiswa(peserta),
        enrichWithMahasiswa(volunteers),
      ]);

      // Hasil akhir
      const result = {
        acara,
        peserta: detailedParticipants,
        volunteers: detailedVolunteers,
      };

      return sortObjectKeys(result);
    } catch (error) {
      console.error(`Error fetching data for event ${idEvent}:`, error); // Logging dengan konteks
      throw new HttpError(
        error.message || "Terjadi kesalahan pada server",
        error.statusCode || 500
      );
    }
  }
  static async addCandidateVolunteer(body) {
    const { eventId, answer, idMhs } = body;

    // Validasi input
    if (!eventId || !answer || !idMhs) {
      throw new HttpError("Data tidak lengkap", 400);
    }

    // Validasi tambahan (misalnya, format UUID)
    if (typeof eventId !== "string" || typeof idMhs !== "string") {
      throw new HttpError("Format ID tidak valid", 400);
    }

    // Ambil data mahasiswa dan event
    const [mahasiswa, event] = await Promise.all([
      CrudConfig.getOneData("mahasiswa", idMhs),
      CrudConfig.getOneData("acara", eventId),
    ]);

    if (!mahasiswa || !event) {
      throw new HttpError("Data mahasiswa atau acara tidak ditemukan", 404);
    }

    // Periksa jika volunteer sudah terdaftar
    const filters = {
      id_event: eventId,
      id_mhs: idMhs,
    };
    const volunteerExists = await CrudConfig.filterAndSearchData(
      "volunteer",
      filters
    );
    if (volunteerExists.length > 0) {
      throw new HttpError("Volunteer sudah terdaftar", 400);
    }

    // Tambahkan volunteer baru
    try {
      const result = await CrudConfig.addData("volunteer", {
        id_event: eventId,
        id_mhs: idMhs,
        test_answers: answer,
        status: "candidate",
      });
      return sortObjectKeys(result);
    } catch (err) {
      console.error("Error saat menambahkan volunteer:", err);
      throw new HttpError("Terjadi kesalahan internal", 500);
    }
  }
  static async decideStatus(id, body) {
    const { isApproved, type } = body;
    if (isApproved === undefined || !type) {
      throw new HttpError("Data tidak lengkap", 400);
    }
    const typeValid = ["volunteer", "peserta"].some((item) => item === type);
    if (typeof isApproved !== "boolean" || !typeValid) {
      throw new HttpError("Format payload tidak valid", 400);
    }
    const apiCall = isApproved
      ? CrudConfig.updateData(type, id, { status: "approved" })
      : CrudConfig.deleteData(type, id);
    try {
      const result = await apiCall;
      return sortObjectKeys(result);
    } catch (error) {
      console.error("Error updating status:", error);
      throw new HttpError("Gagal memperbarui status", 500);
    }
  }
  static async deleteParticipantOrVolunteer(body) {
    const { id, type } = body;
    if (!id || !type) {
      throw new HttpError("Data tidak lengkap", 400);
    }
    const validType = ["volunteer", "peserta"].some((item) => item === type);
    if (!validType) {
      throw new HttpError("Format payload tidak valid", 400);
    }
    await CrudConfig.deleteData(type, id);
  }
  static async present(body) {
    const { mhsId, eventId, timestamp } = body;
    if (!mhsId || !eventId || !timestamp) {
      throw new HttpError("Data tidak lengkap", 400);
    }
    // Validasi timestamp
    const currentTime = new Date();
    const clientTime = new Date(timestamp);
    const timeDifference = Math.abs(currentTime - clientTime); // Dalam milidetik

    if (isNaN(clientTime)) {
      throw new HttpError("Format waktu tidak valid", 400);
    }

    if (timeDifference > 10000) {
      // Maksimal selisih 10 detik
      throw new HttpError("Waktu sudah melebihi batas 10 detik", 400);
    }
    const filters = {
      id_event: eventId,
      id_mhs: mhsId,
    };
    const peserta = await CrudConfig.filterAndSearchData("peserta", filters);
    if (peserta.length < 1) {
      throw new HttpError("Peserta sudah terdaftar", 400);
    }
    const result = await CrudConfig.updateData("peserta", peserta[0].id, {
      is_present: true,
    });
    return result;
  }
}
