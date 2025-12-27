import CrudConfig from "../config/crud.mjs";
import HttpError from "../config/error";
import { calculateRatings, sortObjectKeys } from "../config/format";

export default class UlasanService {
  static async getAll() {
    const reviews = await CrudConfig.getAllData("ulasan");
    const result = await Promise.all(
      reviews.map(async (item) => {
        const [event, mahasiswa] = await Promise.all([
          CrudConfig.getOneData("acara", item.id_event),
          CrudConfig.getOneData("mahasiswa", item.id_mhs),
        ]);
        return {
          ...item,
          event: {
            id: event.id,
            title: event.title,
          },
          mahasiswa: {
            name: mahasiswa.name,
            image: mahasiswa.image,
            defaultImg: mahasiswa.defaultImg,
            prodi: mahasiswa.prodi,
          },
        };
      })
    );
    return result;
  }
  static async getOne(id) {
    const ulasan = await CrudConfig.getOneData("ulasan", id);
    const [event, mahasiswa] = await Promise.all([
      CrudConfig.getOneData("acara", ulasan.id_event),
      CrudConfig.getOneData("mahasiswa", ulasan.id_mhs),
    ]);
    const result = {
      ...ulasan,
      event,
      mahasiswa,
    };
    return sortObjectKeys(result);
  }
  static async create(body) {
    const { idEvent, idMhs, content, rating, images } = body;

    // Validasi data wajib
    if (!idEvent || !idMhs || !content || !rating) {
      throw new HttpError("Data tidak lengkap", 400);
    }

    // Filters untuk query
    const filters = { id_event: idEvent, id_mhs: idMhs };

    // Periksa apakah ulasan sudah ada
    const [ulasan, peserta, volunteer] = await Promise.all([
      CrudConfig.filterAndSearchData("ulasan", filters),
      CrudConfig.filterAndSearchData("peserta", filters),
      CrudConfig.filterAndSearchData("volunteer", filters),
    ]);

    if (ulasan.length > 0) {
      throw new HttpError("Ulasan sudah pernah dibuat", 400);
    }

    // Tentukan peran pengguna
    const user_as =
      peserta.length > 0 ? "peserta" : volunteer.length > 0 ? "volunteer" : "";

    // Ambil data mahasiswa
    const mahasiswa = await CrudConfig.getOneData("mahasiswa", idMhs);

    // Payload untuk ditambahkan
    const payload = {
      id_event: idEvent,
      id_mhs: idMhs,
      images: images || [],
      content,
      rating: Number(rating),
      user_as,
    };

    // Tambahkan ulasan
    const addDataResult = await CrudConfig.addData("ulasan", payload);

    // Gabungkan hasil dengan data mahasiswa
    return sortObjectKeys({
      ...addDataResult,
      mahasiswa,
    });
  }

  static async update(id, body) {
    const result = await CrudConfig.updateData("ulasan", id, body);
    return result;
  }
  static async delete(id) {
    await CrudConfig.deleteData("ulasan", id);
  }
  static async filterAndSearch(search) {
    const apiCall = !search
      ? CrudConfig.getAllData("ulasan")
      : CrudConfig.filterAndSearchData("ulasan", null, "name", search);
    const result = await apiCall;
    return result;
  }
  static async getReviewByIdEvent(idEvent) {
    try {
      // Validasi input
      if (!idEvent) throw new HttpError("ID event tidak valid", 400);

      // Ambil data ulasan berdasarkan id_event
      const ulasan = await CrudConfig.filterData("ulasan", "id_event", idEvent);

      if (ulasan.length === 0) {
        return {
          reviews: [],
          total_rating: 0,
          rating_breakdown: {
            stars_5: 0,
            stars_4: 0,
            stars_3: 0,
            stars_2: 0,
            stars_1: 0,
          },
          total_reviews: 0,
        };
      }

      // Ambil data mahasiswa secara paralel untuk setiap ulasan
      const reviews = await Promise.all(
        ulasan.map(async (item) => {
          const mahasiswa = await CrudConfig.getOneData(
            "mahasiswa",
            item.id_mhs
          );
          return { ...item, mahasiswa };
        })
      );

      // Hitung total rating dan breakdown rating
      const { totalRating, ratingBreakdown } = calculateRatings(ulasan);

      return sortObjectKeys({
        reviews,
        total_rating: totalRating / ulasan.length,
        rating_breakdown: ratingBreakdown,
        total_reviews: ulasan.length,
      });
    } catch (error) {
      console.error("Error fetching review data:", error);
      throw new HttpError(error.message, error.statusCode || 500);
    }
  }
  static async filterAndSearchAlbum(search, filters, dateRange, skip, limit) {
    // Ambil data acara berdasarkan parameter pencarian dan filter
    const apiCall =
      search || filters || dateRange || skip || limit
        ? CrudConfig.filterAndSearchData("acara", filters, "title", search)
        : CrudConfig.getAllData("acara");
    const acara = await apiCall;

    // Ambil semua ulasan untuk efisiensi filter
    const ulasanData = await CrudConfig.getAllData("ulasan");

    // Filter acara berdasarkan kecocokan ID dengan ulasan
    const filteredAcara = acara.filter((item) =>
      ulasanData.some(
        (ulasan) => ulasan.id_event === item.id && ulasan.images.length > 0
      )
    );

    // Map hasil yang difilter ke dalam format hasil yang diinginkan
    let result = await Promise.all(
      filteredAcara.map(async (item) => {
        const ulasan = ulasanData.filter(
          (ulasan) => ulasan.id_event === item.id
        );
        return {
          eventId: item.id,
          eventTitle: item.title,
          eventProdi: item.prodi,
          thumbnail: ulasan[0]?.images[0],
          images: ulasan.map((ul) => ul.images).flat(),
        };
      })
    );

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
}
