import api from "./api";

export const getAdminDashboard = async () => {
  const response = await api.get(
    "/dashboard/admin"
  );

  return response.data;
};


export const getRecruiterDashboard = async () => {
    const response = await api.get("/recruiter/dashboard");
    return response.data;
};