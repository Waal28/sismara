import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase.mjs";
import HttpError from "./error.js";

export default class CrudConfig {
  // Get all data, ordered by createdAt descending
  static async getAllData(collect) {
    try {
      const q = query(collection(db, collect), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (data.length > 0) {
        return data;
      } else {
        return [];
      }
    } catch (error) {
      throw new HttpError(error.message, error.statusCode || 500);
    }
  }

  // Get one data by ID
  static async getOneData(collect, id) {
    const docRef = doc(db, collect, id);
    try {
      const result = await getDoc(docRef);
      if (result.exists()) {
        return { id, ...result.data() };
      } else {
        throw new HttpError("Data tidak ditemukan", 400);
      }
    } catch (error) {
      throw new HttpError(error.message, error.statusCode || 500);
    }
  }

  // Add new data with timestamps
  static async addData(collect, payload) {
    const data = {
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: "",
    };
    try {
      const result = await addDoc(collection(db, collect), data);
      return { id: result.id, ...data };
    } catch (error) {
      throw new HttpError(error.message, 500);
    }
  }

  // Update data with updatedAt timestamp
  static async updateData(collect, id, payload) {
    const data = {
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    const isData = await this.getOneData(collect, id);

    if (isData) {
      try {
        const docRef = doc(db, collect, id);
        await updateDoc(docRef, data);
        return await this.getOneData(collect, id);
      } catch (error) {
        throw new HttpError(error.message, 500);
      }
    } else {
      throw new HttpError("Data tidak ditemukan", 400);
    }
  }

  // Delete data by ID
  static async deleteData(collect, id) {
    const isData = await this.getOneData(collect, id);

    if (isData) {
      try {
        await deleteDoc(doc(db, collect, id));
        return {
          message: "Data berhasil dihapus",
        };
      } catch (error) {
        throw new HttpError(error.message, 500);
      }
    } else {
      throw new HttpError("Data tidak ditemukan", 400);
    }
  }

  // Filter data by key-value pair
  static async filterData(collect, key, value) {
    const q = query(collection(db, collect), where(key, "==", value));
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data;
  }

  // Filter data with multiple filters and search functionality
  static async filterAndSearchData(collect, filters, searchKey, searchVal) {
    try {
      let q = collection(db, collect);

      // Apply filters
      if (filters && Object.keys(filters).length > 0) {
        for (const [key, value] of Object.entries(filters)) {
          if (value !== undefined && value !== null && value !== "") {
            q = query(q, where(key, "==", value));
          }
        }
      }

      // Apply search functionality
      if (searchKey && searchVal) {
        q = query(
          q,
          where(searchKey, ">=", searchVal),
          where(searchKey, "<=", searchVal + "\uf8ff")
        );
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return data;
    } catch (error) {
      throw new HttpError(error.message, error.statusCode || 500);
    }
  }

  // Upload file to Firebase Storage
  static async upload(file) {
    if (!file) {
      throw new HttpError("File tidak ditemukan", 400);
    }

    try {
      const fileRef = ref(storage, `images/${file.originalname || file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        downloadURL,
        fileName: snapshot.ref.name,
      };
    } catch (error) {
      throw new HttpError(error.message, 500);
    }
  }
}
