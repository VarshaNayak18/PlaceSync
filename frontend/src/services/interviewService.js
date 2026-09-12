import api from "./api";

export const getAllInterviews = async () => {
  const response = await api.get("/interviews");
  return response.data;
};

export const scheduleInterview = async (interviewData) => {
  const response = await api.post("/interviews", interviewData);
  return response.data;
};

export const updateInterviewStatus = async (id, status) => {
  const response = await api.put(
    `/interviews/${id}/status?status=${status}`
  );

  return response.data;
};

export const cancelInterview = async (id) => {
  await api.put(`/interviews/${id}/cancel`);
};