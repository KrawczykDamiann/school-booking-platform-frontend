import { createContext, useMemo, useState } from "react";
import { tokenService } from "../services/tokenService";
import type { UserType } from "../types/UserType";

type LoginDataType = {
  token: string;
  userType: UserType;
};

type AuthContextType = {
  isAuthenticated: boolean;
  userType: UserType | null;
  login: ({ token, userType }: LoginDataType) => void;
  logout: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userType: null,
  login: () => {},
  logout: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    tokenService.hasToken(),
  );

  const [userType, setUserType] = useState<UserType | null>(() => {
    return tokenService.getUserType();
  });

  const login = ({ token, userType }: LoginDataType) => {
    tokenService.saveAuth({ token, userType });
    setUserType(userType);
    setIsAuthenticated(true);
  };

  const logout = () => {
    tokenService.clearAuth();
    setUserType(null);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      userType,
      logout,
    }),
    [isAuthenticated, userType],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
