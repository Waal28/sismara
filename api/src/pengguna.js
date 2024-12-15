/* eslint-disable no-useless-catch */
import Agent from "../agent";

export async function addEventOrganizer(data) {
  try {
    const response = await Agent.post("/pengguna/", data);
    return response;
  } catch (error) {
    throw error;
  }
}
export async function editEventOrganizer(id, data) {
  try {
    const response = await Agent.put(`/pengguna/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
}
export async function getEventOrganizer() {
  try {
    const response = await Agent.get("/pengguna/");
    return response;
  } catch (error) {
    throw error;
  }
}
export async function deleteEventOrganizer(id) {
  try {
    const response = await Agent.delete(`/pengguna/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
}
export async function getEventOrganizerBySearch(search) {
  const params = {
    search: search || undefined,
  };
  try {
    const response = await Agent.get("/pengguna", {
      params,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
export async function changePasswordUser(id, data) {
  try {
    const response = await Agent.put(`/pengguna/change-password/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
}
export async function changePasswordUserForAdmin(id, data) {
  try {
    const response = await Agent.put(`/pengguna/change-password/${id}`, {
      ...data,
      isAdmin: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
