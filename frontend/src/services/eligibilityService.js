import api from "./api";

export const checkJobEligibility = async (jobId) => {
  const response = await api.get(
    `/eligibility/jobs/${jobId}`
  );

  return response.data;
};