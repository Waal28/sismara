import axios from "axios";

// const token = localStorage.getItem("token");
export default class Agent {
  static async get(endpoint, params = {}) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api${endpoint}`,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
          },
          ...params,
        }
      );
      const data = response?.data;

      return data;
    } catch (error) {
      if (error?.response?.data?.message === "Forbidden") {
        window.location.href = "/admin/login";
      }
      throw error;
    }
  }

  static async post(endpoint, payload, otherHeaders) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api${endpoint}`,
        payload,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            ...otherHeaders,
          },
        }
      );
      const data = response?.data;
      return data;
    } catch (error) {
      if (error?.response?.data?.message === "Forbidden") {
        window.location.href = "/admin/login";
      }
      throw error;
    }
  }

  static async put(endpoint, payload, otherHeaders = {}) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api${endpoint}`,
        payload,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            ...otherHeaders, // Menggabungkan otherHeaders dengan header lainnya
          },
        }
      );
      return response.data; // Tidak perlu await di sini
    } catch (error) {
      if (error.response && error?.response?.data?.message === "Forbidden") {
        window.location.href = "/admin/login"; // Redirect ke login jika Forbidden
      }

      throw error; // Throw error agar bisa ditangani oleh caller
    }
  }

  static async delete(endpoint) {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api${endpoint}`,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data;
      return data;
    } catch (error) {
      if (error?.response?.data?.message === "Forbidden") {
        window.location.href = "/admin/login";
      }
      throw error;
    }
  }
}
