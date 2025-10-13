import { useLayoutEffect, useState, useRef } from "react";
import { useAuthStore } from "@/lib/store";
import { isTokenExpired } from "@/lib/token-utils";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { env } from "@/services/env";

export function SessionValidator() {
  const [isValidating, setIsValidating] = useState(false);
  const isRefreshingRef = useRef(false);
  const { token, refreshToken, updateTokens, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const validateAndRefresh = async () => {
      if (!isAuthenticated || !token || !refreshToken) {
        return;
      }

      if (isRefreshingRef.current) {
        return;
      }

      if (isTokenExpired(token)) {
        isRefreshingRef.current = true;
        setIsValidating(true);

        try {
          const { data } = await axios.post(`${env.VITE_API_URL}/auth/refresh`, {
            refreshToken,
          });
          updateTokens(data.accessToken, data.refreshToken);
        } catch (error) {
          logout();
          if (window.location.pathname !== "/") {
            navigate({ to: "/" });
          }
        } finally {
          setIsValidating(false);
          isRefreshingRef.current = false;
        }
      }
    };

    const initialTimeout = setTimeout(() => {
      validateAndRefresh();
    }, 500); // evitar race condition

    const interval = setInterval(() => {
      validateAndRefresh();
    }, 5 * 60 * 1000); // 5 min

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [token, refreshToken, updateTokens, logout, navigate, isAuthenticated]);

  if (isValidating) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
      }}>
        <div style={{
          color: 'white',
          fontSize: '16px',
          padding: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '8px'
        }}>
          Atualizando sessão...
        </div>
      </div>
    );
  }

  return null;
}
