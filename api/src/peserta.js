/* eslint-disable no-useless-catch */
import Agent from "../agent";

export async function addParticipant(data) {
  const response = await Agent.post("/peserta/", data);
  return response;
}
export async function getMyEvents(idMhs) {
  const response = await Agent.get("/peserta/", {
    params: {
      idMhs,
    },
  });
  return response;
}
export async function editParticipant(id, data) {
  try {
    const response = await Agent.put(`/peserta/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
}
export async function getParticipant() {
  try {
    const response = await Agent.get("/peserta/");
    return response;
  } catch (error) {
    throw error;
  }
}
export async function deleteParticipant(id) {
  try {
    const response = await Agent.delete(`/peserta/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
}
export async function getParticipantBySearch(search) {
  const params = {
    search: search || undefined,
  };
  try {
    const response = await Agent.get("/peserta", {
      params,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
export async function getEventParticipantsAndVolunteers(idEvent) {
  const params = {
    idEvent: idEvent || undefined,
    participantAndVolunteer: true,
  };
  try {
    const response = await Agent.get("/peserta", {
      params,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
export async function getCandidateVolunteer(idEvent) {
  const response = await Agent.post(`/peserta/candidate-volunteer/${idEvent}`);
  return response;
}
export async function addCandidateVolunteer(data) {
  const response = await Agent.post(`/peserta/candidate-volunteer`, data);
  return response;
}
export async function acceptOrRejectCandidate(id, data) {
  const response = await Agent.put(`/peserta/candidate-volunteer/${id}`, data);
  return response;
}
export async function deleteParticipantOrVolunteer(data) {
  const response = await Agent.post(`/peserta/participant-volunteer/`, data);
  return response;
}