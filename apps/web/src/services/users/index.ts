
import api from "../api";
import type { User } from "../auth/interface";

export const fetchAllUsers = async (): Promise<User[]> => {
  const { data } = await api.get(`/users/all`);
  return data;
};
