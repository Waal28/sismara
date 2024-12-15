import Agent from "../agent";

export async function getAllMessage() {
  const response = await Agent.get(`/pesan`);
  return response;
}
export async function addMessage(data) {
  const response = await Agent.post(`/pesan`, data);
  return response;
}
export async function editMessage(id, data) {
  const response = await Agent.put(`/pesan/${id}`, data);
  return response;
}
export async function readMessage(id) {
  const response = await Agent.put(`/pesan/${id}`, { isRead: true });
  return response;
}
export async function deleteMessage(id) {
  const response = await Agent.delete(`/pesan/${id}`);
  return response;
}
