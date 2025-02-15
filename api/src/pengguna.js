/* eslint-disable no-useless-catch */
import Agent from "../agent";

export async function addEventOrganizer(data) {
  try {
    const response = await Agent.post("/root/pengguna/", data);
    return response;
  } catch (error) {
    throw error;
  }
}
export async function editEventOrganizer(id, data) {
  try {
    const response = await Agent.put(`/root/pengguna/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
}
export async function getEventOrganizer() {
  try {
    const response = await Agent.get("/root/pengguna/");
    return response;
  } catch (error) {
    throw error;
  }
}
export async function deleteEventOrganizer(id) {
  try {
    const response = await Agent.delete(`/root/pengguna/${id}`);
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
    const response = await Agent.get("/root/pengguna", {
      params,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
export async function changePasswordUser(id, data) {
  try {
    const response = await Agent.put(
      `/root/pengguna-changePassword/${id}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
}
export async function changePasswordUserForAdmin(id, data) {
  try {
    const response = await Agent.put(`/root/pengguna-changePassword/${id}`, {
      ...data,
      isAdmin: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
