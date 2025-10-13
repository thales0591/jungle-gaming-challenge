export interface User {
  id: string
  email: string;
  name: string;
  createdAt: string
  updatedAt: string  
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface VerifyTokenRequest {
  token: string;
}
