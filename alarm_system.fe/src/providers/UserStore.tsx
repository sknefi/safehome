import { useEffect, useState } from "react";
import { User } from "../components/assets";

const LOCAL_USER_KEY = "userData";
const LOCAL_ACCESS_TOKEN_KEY = "accessToken";
const LOCAL_REFRESH_TOKEN_KEY = "refreshToken";

export function useUser() {
  const [userData, setUserData] = useState<User | null>(() => {
    const stored = localStorage.getItem(LOCAL_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_ACCESS_TOKEN_KEY);
  });

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_REFRESH_TOKEN_KEY);
  });

  useEffect(() => {
    if (userData) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  }, [userData]);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem(LOCAL_ACCESS_TOKEN_KEY, accessToken);
    } else {
      localStorage.removeItem(LOCAL_ACCESS_TOKEN_KEY);
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem(LOCAL_REFRESH_TOKEN_KEY, refreshToken);
    } else {
      localStorage.removeItem(LOCAL_REFRESH_TOKEN_KEY);
    }
  }, [refreshToken]);

  return {
    userData,
    accessToken,
    refreshToken,
    updateUserData: setUserData,
    updateAccessToken: setAccessToken,
    updateRefreshToken: setRefreshToken,
  };
}
