import api from "./api";

export const getStudentJobs = async () => {
  const response = await api.get("/student/jobs");

  return response.data;
};

export const getStudentJobById = async (id) => {
  const response = await api.get(`/student/jobs/${id}`);

  return response.data;
};