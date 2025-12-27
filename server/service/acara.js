import CrudConfig from "@/server/config/crud.mjs";
import HttpError from "../config/error";

export default class AcaraService {
  static async getAll() {
    const result = await CrudConfig.getAllData("acara");
    return result;
  }
  static async getOne(id) {
    const [acara, peserta, volunteers] = await Promise.all([
      CrudConfig.getOneData("acara", id),
      CrudConfig.filterData("peserta", "id_event", id),
      CrudConfig.filterData("volunteer", "id_event", id),
    ]);

    if (!acara) {
      throw new Error("Event not found"); // Hindari error jika acara tidak ditemukan
    }

    const result = {
      ...acara,
      totalParticipants: peserta.length,
      totalVolunteers: volunteers.length,
    };

    const startTime = new Date(result?.schedule?.start_time);
    const endTime = new Date(result?.schedule?.end_time);
    const now = new Date();
    const updatedFields = {};
    const newStartTime = startTime.setUTCHours(0, 0, 0, 0);
    const newNow = now.setUTCHours(0, 0, 0, 0);

    // Cek status event berdasarkan waktu
    if (newStartTime === newNow && result.status === "open") {
      updatedFields.status = "ongoing";
    }
    if (endTime < now && result.status !== "closed") {
      updatedFields.status = "closed";
    }

    // Update status jika ada perubahan
    if (Object.keys(updatedFields).length > 0) {
      await CrudConfig.updateData("acara", id, updatedFields);
      Object.assign(result, updatedFields); // Perbarui result tanpa perlu query ulang
    }

    return result;
  }

  static async create(body) {
    const { is_volunteers, is_paid, is_online, is_certificate } = body;
    const newBody = { ...body };

    // Atur nilai default berdasarkan kondisi
    if (is_volunteers !== undefined && !is_volunteers) {
      newBody.max_volunteers = 0;
      newBody.criteria_volunteers = "";
    }

    if (is_volunteers !== undefined && !is_paid) {
      newBody.payment_price = 0;
      newBody.payment_desc = "";
    }

    if (is_certificate !== undefined && !is_certificate) {
      newBody.certificate_template = {
        participant: "",
        volunteer: "",
      };
    }

    if (is_online !== undefined && !is_online) {
      newBody.event_link = "";
    }

    // Simpan ke database
    const result = await CrudConfig.addData("acara", newBody);
    return result;
  }

  static async update(id, body) {
    const { is_volunteers, is_paid, is_online, is_certificate } = body;
    const newBody = { ...body };

    if (is_volunteers !== undefined && !is_volunteers) {
      newBody.max_volunteers = 0;
      newBody.criteria_volunteers = "";
    }
    if (is_paid !== undefined && !is_paid) {
      newBody.payment_price = 0;
      newBody.payment_desc = "";
    }
    if (is_certificate !== undefined && !is_certificate) {
      newBody.certificate_template = {
        participant: "",
        volunteer: "",
      };
    }
    if (is_online !== undefined && !is_online) {
      newBody.event_link = "";
    }
    const result = await CrudConfig.updateData("acara", id, newBody);
    return result;
  }
  static async delete(id) {
    await CrudConfig.deleteData("acara", id);
  }
  static async filterAndSearch(search, filters, dateRange, skip, limit) {
    const apiCall =
      search || filters || dateRange || skip || limit
        ? CrudConfig.filterAndSearchData("acara", filters, "title", search)
        : CrudConfig.getAllData("acara");
    let result = await apiCall;

    if (skip && limit) {
      result = result.slice(skip, skip + limit);
    }

    if (dateRange && dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);

      // Atur waktu untuk mulai dari awal hari dan akhir hari
      start.setHours(0, 0, 0, 0); // Set ke 00:00:00
      end.setHours(23, 59, 59, 999); // Set ke 23:59:59.999

      result = result.filter((event) => {
        const eventDate = new Date(event.schedule.start_time);

        return eventDate >= start && eventDate <= end;
      });
    }

    return result;
  }
  static async uploadCertificate(id, body) {
    const { certificateFor, data } = body;
    const { position, fontSize, fontFamily, fontColor, maxCharacters } = data;
    if (
      !certificateFor ||
      !data ||
      !position ||
      !fontSize ||
      !fontFamily ||
      !fontColor ||
      !maxCharacters
    ) {
      throw new HttpError("Payload tidak sesuai", 400);
    }

    const acara = await CrudConfig.getOneData("acara", id);
    const participant = certificateFor === "Peserta";
    const volunteer = certificateFor === "Volunteer";

    const payload = {
      certificate_template: {
        participant: participant
          ? {
              ...acara.certificate_template.participant,
              ...data,
            }
          : acara.certificate_template.participant,
        volunteer: volunteer
          ? {
              ...acara.certificate_template.volunteer,
              ...data,
            }
          : acara.certificate_template.volunteer,
      },
    };
    const result = await CrudConfig.updateData("acara", id, payload);
    return result;
  }
  static async getChart(prodi) {
    const apiCall =
      prodi === "all"
        ? CrudConfig.getAllData("acara")
        : CrudConfig.filterData("acara", "prodi", prodi);
    const events = await apiCall;
    const bulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const currYear = new Date().getFullYear(); // Tahun saat ini

    const monthData = Array(12)
      .fill(0)
      .map(() => ({
        total: 0,
        totalPerStatus: {
          upcoming: 0,
          open: 0,
          closed: 0,
          ongoing: 0,
        },
      }));

    events.forEach((event) => {
      const eventDate = new Date(event.schedule.start_time);
      const eventYear = eventDate.getFullYear();

      // Hanya proses event jika tahunnya sama dengan tahun saat ini
      if (eventYear === currYear) {
        const monthIndex = eventDate.getMonth();
        monthData[monthIndex].total++;

        if (event.status in monthData[monthIndex].totalPerStatus) {
          monthData[monthIndex].totalPerStatus[event.status]++;
        }
      }
    });

    const result = bulan.map((item, index) => ({
      month: item,
      ...monthData[index],
    }));

    return result;
  }
}
