import { handleResponse } from "../route";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/server/config/firebase.mjs";

export const POST = async (req) => {
  const formData = await req.formData();

  const file = formData.get("image");
  console.log("waal file", file);
  if (!file) {
    return handleResponse(400, "File tidak ditemukan");
  }

  const filename = file.name.replaceAll(" ", "_");
  console.log(filename);
  try {
    // Upload ke Firebase Storage
    const storageRef = ref(storage, `images/${filename}`);
    const snapshot = await uploadBytes(storageRef, file);

    // Dapatkan URL download
    const downloadURL = await getDownloadURL(snapshot.ref);

    return handleResponse(200, "Upload Berhasil", {
      fileName: snapshot.ref.name,
      downloadURL,
    });
  } catch (error) {
    console.log("Error occured ", error);
    return handleResponse(500, error.message);
  }
};
