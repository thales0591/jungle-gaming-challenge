import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RegisterRequest,
  User,
  VerifyTokenRequest,
} from "./interface";
import api from "../api";

export const registerRequest = async (
  requestData: RegisterRequest
): Promise<User> => {
  const { data } = await api.post(`/auth/register`, requestData);
  return data;
};

export const loginRequest = async (
  requestData: LoginRequest
): Promise<LoginResponse> => {
  const { data } = await api.post(`/auth/login`, requestData);
  return data;
};

export const refreshTokenRequest = async (
  requestData: RefreshTokenRequest
): Promise<LoginResponse> => {
  const { data } = await api.post(`/auth/refresh`, requestData);
  return data;
};

export const verifyTokenRequest = async (
  requestData: VerifyTokenRequest
): Promise<User> => {
  const { data } = await api.post(`/auth/verify`, requestData);
  return data;
};
