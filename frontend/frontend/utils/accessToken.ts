import axios from "axios";

const API_URL = "http://localhost:3000";
let accessToken: string | null = null;
interface RefreshTokenResponse {
  accessToken: string;
  email: string;
}

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
};

export const refreshAccessToken =
  async (): Promise<RefreshTokenResponse | null> => {
    try {
      const res = await axios.post(
        `${API_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      );
      const { accessToken: newToken } = res.data;
      setAccessToken(newToken);
      return { accessToken: newToken, email: res.data.email };
    } catch {
      clearAccessToken();
      return null;
    }
  };
