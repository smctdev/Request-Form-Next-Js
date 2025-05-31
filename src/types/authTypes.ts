export type CredetialType = {
  email: string;
  password: string;
};

export type AuthContextType = {
  user: any;
  isAuthenticated: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  login: (credentials: CredetialType, router: any) => Promise<void>;
  logout: (router: any) => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  errors: any;
  isAdmin: boolean;
  isApprover: boolean;
  fetchUserProfile: () => Promise<void>;
  setIsRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};
