"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { AuthContextType, CredetialType } from "@/types/authTypes";
import {
  fetchProfile,
  login as loginApi,
  logout as logoutApi,
} from "@/lib/sanctum";
import Swal from "sweetalert2";
import echo from "@/hooks/echo";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>([]);
  const [error, setError] = useState<string>("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isApprover, setIsApprover] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isAuditor, setIsAuditor] = useState<boolean>(false);

  useEffect(() => {
    if (!user.id || !echo) return;

    echo
      .private(`request-access.${user.id}`)
      .listen("RequestAccessEvent", (event: any) => {
        const { requestAccess } = event;
        if (requestAccess.user.id === user.id) {
          updateProfile();
        }
      });

    return () => {
      echo.leave(`request-access.${user.id}`);
    };
  }, [echo, user.id]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetchProfile();
      if (response.status === 200) {
        setUser(response.data.data);
        setIsAuthenticated(true);
        if (response.data.data.role === "Admin") {
          setIsAdmin(true);
        }
        if (response.data.data.role === "approver") {
          setIsApprover(true);
        }
        if (response.data?.data?.position?.startsWith("Audit")) {
          setIsAuditor(true);
        }
      }
    } catch (error) {
      console.error(error);
      setUser([]);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsApprover(false);
      setIsAuditor(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const response = await fetchProfile();
      if (response.status === 200) {
        setUser(response.data.data);
        setIsAuthenticated(true);
        if (response.data.data.role === "Admin") {
          setIsAdmin(true);
        }
        if (response.data.data.role === "approver") {
          setIsApprover(true);
        }
        if (response.data?.data?.position?.startsWith("Audit")) {
          setIsAuditor(true);
        }
      }
    } catch (error) {
      console.error(error);
      setUser([]);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsAuditor(false);
      setIsApprover(false);
    }
  };

  const login = async (credentials: CredetialType) => {
    try {
      const response = await loginApi(credentials);
      if (response.status === 200) {
        setIsLogin(true);
        fetchUserProfile();
        setError("");
      } else if (response.status === 226) {
        Swal.fire({
          icon: "warning",
          title: "Ops!",
          text: response.data.message,
          confirmButtonText: "Okay",
          confirmButtonColor: "#007bff",
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      }
    } catch (error: any) {
      console.error(error);

      if (error.response.status === 500) {
        const errorMessage = `${error.response.statusText}, Please contact the administrator.`;

        setError(errorMessage);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonText: "Close",
          confirmButtonColor: "#dc3545",
        });
      } else {
        const errorMessage =
          error?.response?.data?.message || "An unexpected error occurred.";

        setError(errorMessage);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonText: "Close",
          confirmButtonColor: "#dc3545",
        });
      }
      if (error.response.status === 429) {
        setError(error?.response?.data?.message);
      }
      if (error.response.status === 400) {
        setErrors(error?.response?.data?.errors);
      }
    }
  };

  const logout = async () => {
    try {
      const response = await logoutApi();
      if (response.status === 204) {
        setUser([]);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsAuditor(false);
        setIsApprover(false);
        setIsLogin(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        setIsAuthenticated,
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
        error,
        setError,
        errors,
        isAdmin,
        isApprover,
        fetchUserProfile,
        isLogin,
        setIsLogin,
        updateProfile,
        isAuditor,
        setIsAuditor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a AuthProvider");
  }
  return context;
};
