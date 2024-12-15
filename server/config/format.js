import { format } from "date-fns";
export function validateEmailStudent(email) {
  // Regex untuk memeriksa apakah email memiliki domain @student.uir.ac.id
  const regex = /^[a-zA-Z0-9._%+-]+@student\.uir\.ac\.id$/;

  // Mengembalikan true jika email sesuai dengan regex, false jika tidak
  return regex.test(email);
}
export const formatDateTime = (date) => {
  return format(new Date(date), "dd MMM yyyy, HH:mm");
};
export const formatTime = (date) => {
  return format(new Date(date), "HH:mm");
};
export function sortObjectKeys(input) {
  const sortKeysInObject = (obj) => {
    const keys = Object.keys(obj).sort(); // Urutkan kunci A-Z
    const sortedObj = {};

    for (const key of keys) {
      const value = obj[key];

      // Rekursi jika value adalah objek atau array
      if (Array.isArray(value)) {
        sortedObj[key] = value.map((item) =>
          typeof item === "object" && item !== null ? sortObjectKeys(item) : item
        );
      } else if (typeof value === "object" && value !== null) {
        sortedObj[key] = sortObjectKeys(value);
      } else {
        sortedObj[key] = value; // Salin value jika bukan objek atau array
      }
    }

    return sortedObj;
  };

  // Cek apakah input adalah array atau objek tunggal
  if (Array.isArray(input)) {
    return input.map((item) =>
      typeof item === "object" && item !== null ? sortKeysInObject(item) : item
    );
  } else {
    return sortKeysInObject(input);
  }
}

export function calculateRatings(reviews) {
  const ratingBreakdown = {
    stars_5: 0,
    stars_4: 0,
    stars_3: 0,
    stars_2: 0,
    stars_1: 0,
  };

  let totalRating = 0;

  reviews.forEach(({ rating }) => {
    totalRating += rating;
    if (rating >= 1 && rating <= 5) {
      ratingBreakdown[`stars_${rating}`]++;
    }
  });

  return { totalRating, ratingBreakdown };
}
export function formatRupiah(amount) {
  if (isNaN(amount)) return "Invalid number"; // Cek validitas input

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // Hilangkan desimal
  }).format(amount);
}
