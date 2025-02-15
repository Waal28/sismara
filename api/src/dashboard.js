/* eslint-disable no-useless-catch */
import Agent from "../agent";

export async function getDashboardChart(prodi) {
  const response = await Agent.get(`/root/acara`, {
    params: {
      isChart: true,
      prodi: prodi ?? "all",
    },
  });
  return response;
}
export async function uploadImages(images) {
  try {
    const response = await Agent.post("/upload", images, {
      "Content-Type": "multipart/form-data",
    });
    return response;
  } catch (error) {
    throw error;
  }
}
