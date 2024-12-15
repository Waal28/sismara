/* eslint-disable no-useless-catch */
import Agent from "../agent";

export async function getAllReviews() {
  const response = await Agent.get("/ulasan/");
  return response;
}
export async function addReview(data) {
  const response = await Agent.post("/ulasan/", data);
  return response;
}
export async function getReviewsEvent(idEvent) {
  const response = await Agent.get("/ulasan/", {
    params: {
      idEvent,
    },
  });
  return response;
}
export async function getFilterAndSearchAlbum({
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
  const response = await Agent.get("/ulasan/", {
    params,
  });
  return response;
}
