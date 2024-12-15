/* eslint-disable no-useless-catch */
import axios from "axios";
import Agent from "../agent";

export async function getAllEvents() {
  const response = await Agent.get("/acara/");
  return response;
}
export async function getAllEventsByFilters({
  search,
  prodi,
  status,
  start,
  end,
  skip,
  limit,
}) {
  const params = {
    search: search || undefined,
    prodi: prodi || undefined,
    status: status || undefined,
    start: start || undefined,
    end: end || undefined,
    skip: skip !== undefined ? skip : undefined,
    limit: limit !== undefined ? limit : undefined,
  };
  try {
    const response = await Agent.get("/acara", {
      params,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
export async function getEventsWithLimit({ limit, skip, keyword = "" }) {
  // const response = await Agent.get(`/galeri/album?limit=${limit}&skip=${skip`);
  const response = await axios.get(
    `https://dummyjson.com/products/search?q=${keyword}&limit=${limit}&skip=${skip}`
  );
  return response;
}
export async function getOneEvent(idEvent) {
  // const response = await Agent.get(`/galeri/album?limit=${limit}&skip=${skip`);
  const response = await Agent.get(`/acara/${idEvent}`);
  return response;
}
export async function getLatestFeedBack(limit, skip) {
  // const response = await Agent.get(`/galeri/album?limit=${limit}&skip=${skip`);
  const response = await axios.get(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
  );
  return response;
}
export async function getEventReview(idEvent) {
  // const response = await Agent.get(`/galeri/album?limit=${limit}&skip=${skip`);
  const response = await axios.get(
    `https://dummyjson.com/products?limit=10&skip=0`
  );
  return response;
}
export async function addEvent(data) {
  const response = await Agent.post("/acara/", data);
  return response;
}
export async function updateEvent(id, data) {
  const response = await Agent.put(`/acara/${id}`, data);
  return response;
}
export async function deleteEvent(id) {
  const response = await Agent.delete(`/acara/${id}`);
  return response;
}
export async function uploadEventCertificate(id, data) {
  const response = await Agent.put(`/acara/upload-certificate/${id}`, data);
  return response;
}
export async function downloadEventCertificate(data) {
  const response = await Agent.post(`/acara/download-certificate`, data);
  return response;
}
