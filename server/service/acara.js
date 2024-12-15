import CrudConfig from "@/server/config/crud.mjs";
import HttpError from "../config/error";

export default class AcaraService {
  static async getAll() {
    const result = await CrudConfig.getAllData("acara");
    return result;
  }
  static async getOne(id) {
    const result = await CrudConfig.getOneData("acara", id);
    return result;
  }
  static async create(body) {
    const { is_volunteers, is_paid, is_online, is_certificate } = body;
    if (!is_volunteers) {
      body.max_volunteers = 0;
      body.criteria_volunteers = "";
    }
    if (!is_paid) {
      body.payment_price = 0;
      body.payment_desc = "";
    }
    if (!is_certificate) {
      body.certificate_template = {
        participant: "",
        volunteer: "",
      };
    }
    if (!is_online) {
      body.event_link = "";
    }
    const result = await CrudConfig.addData("acara", body);
    return result;
  }
  static async update(id, body) {
    console.log("waal body", body);
    const { is_volunteers, is_paid, is_online, is_certificate } = body;
    if (!is_volunteers) {
      body.max_volunteers = 0;
      body.criteria_volunteers = "";
    }
    if (!is_paid) {
      body.payment_price = 0;
      body.payment_desc = "";
    }
    if (!is_certificate) {
      body.certificate_template = {
        participant: "",
        volunteer: "",
      };
    }
    if (!is_online) {
      body.event_link = "";
    }
    const result = await CrudConfig.updateData("acara", id, body);
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
    const apiCall = prodi === "all" ? CrudConfig.getAllData("acara") : CrudConfig.filterData("acara", "prodi", prodi);
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
  
    const monthData = Array(12).fill(0).map(() => ({
      total: 0,
      totalPerStatus: {
        upcoming: 0,
        open: 0,
        closed: 0,
        ongoing: 0,
      },
    }));
  
    events.forEach((event) => {
      const eventDate = new Date(event.createdAt);
      const monthIndex = eventDate.getMonth();
      monthData[monthIndex].total++;
      if (event.status in monthData[monthIndex].totalPerStatus) {
        monthData[monthIndex].totalPerStatus[event.status]++;
      }
    });
  
    const result = bulan.map((item, index) => ({
      month: item,
      ...monthData[index],
    }));
  
    return result;
  }
}
