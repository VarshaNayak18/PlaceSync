import api from "./api";

export const getStudentProfile = async () => {
  const response = await api.get("/students/profile");

  return response.data;
};

export const updateStudentProfile = async (profileData) => {
  const response = await api.put(
    "/students/profile",
    profileData
  );

  return response.data;
};