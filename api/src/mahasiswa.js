/* eslint-disable no-useless-catch */
import Agent from "../agent";

export async function loginMahasiswa(data) {
  const response = await Agent.post("/auth-portalLogin", data);
  return response;
}
export async function editMahasiswa(id, data) {
  try {
    const response = await Agent.put(`/mahasiswa/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
}
