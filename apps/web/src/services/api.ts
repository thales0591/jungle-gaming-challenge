import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { env } from "./env";
import { useAuthStore } from "../lib/store";
import { isTokenExpired } from "../lib/token-utils";

const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    const state = useAuthStore.getState();
    const token = state.token;
    const refreshToken = state.refreshToken;

    if (
      token &&
      state.isAuthenticated &&
      isTokenExpired(token) &&
      refreshToken &&
      !config.url?.includes("/auth/refresh") &&
      !config.url?.includes("/auth/login") &&
      !config.url?.includes("/auth/register")
    ) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { data } = await axios.post(
            `${env.VITE_API_URL}/auth/refresh`,
            {
              refreshToken,
            }
          );

          state.updateTokens(data.accessToken, data.refreshToken);
          processQueue(null);

          config.headers.Authorization = `Bearer ${data.accessToken}`;
        } catch (error) {
          processQueue(error as Error);
          state.logout();
          throw error;
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          const newToken = useAuthStore.getState().token;
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
          }
          return config;
        });
      }
    } else if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      const state = useAuthStore.getState();
      const refreshToken = state.refreshToken;

      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const { data } = await axios.post(
              `${env.VITE_API_URL}/auth/refresh`,
              {
                refreshToken,
              }
            );

            state.updateTokens(data.accessToken, data.refreshToken);
            processQueue(null);

            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError as Error);
            state.logout();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              const newToken = useAuthStore.getState().token;
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }
      } else {
        state.logout();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
