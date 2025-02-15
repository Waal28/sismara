/* eslint-disable no-useless-catch */
import Agent from "../agent";

export async function loginAdmin(data) {
  const response = await Agent.post("/root/admin-login", data);
  return response;
}
