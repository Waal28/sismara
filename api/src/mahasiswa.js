/* eslint-disable no-useless-catch */
import Agent from "../agent";

export async function loginMahasiswa() {
  const response = await Agent.post("/auth/portal-login");
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