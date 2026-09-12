import api from "./api";

export const getStudentJobs = async () => {
  const response = await api.get("/student/jobs");

  return response.data;
};

export const getStudentJobById = async (id) => {
  const response = await api.get(
    `/student/jobs/${id}`
  );

  return response.data;
};

export const getJobs = async () => {
  const response = await api.get("/jobs");

  return response.data;
};

export const createJob = async (jobData) => {
  const response = await api.post(
    "/jobs",
    jobData
  );

  return response.data;
};

export const updateJob = async (
  id,
  jobData
) => {
  const response = await api.put(
    `/jobs/${id}`,
    jobData
  );

  return response.data;
};

export const deleteJob = async (id) => {
  await api.delete(`/jobs/${id}`);
};