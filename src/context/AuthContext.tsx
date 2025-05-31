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
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    fetchUserProfile();
  }, [isRefresh]);

  const fetchUserProfile = async () => {
    setIsLoading(true);
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
      }
    } catch (error) {
      console.error(error);
      setUser([]);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: CredetialType, router: any) => {
    try {
      const response = await loginApi(credentials);
      if (response.status === 200) {
        if (response.data.role === "approver") {
          router.push("/approver/dashboard");
        } else {
          router.push("/dashboard");
        }
        setIsLogin(true);
        fetchUserProfile();
        setError("");
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

  const logout = async (router: any) => {
    try {
      const response = await logoutApi();
      if (response.status === 204) {
        setIsAdmin(false);
        setIsApprover(false);
        setIsAuthenticated(false);
        setUser([]);
        setIsLoading(true);
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        setIsAuthenticated,
        setIsLoading,
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
        setIsRefresh,
        isLogin,
        setIsLogin,
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
