import { createContext, useMemo, useState } from "react";
import { tokenService } from "../services/tokenService";
import type { UserType } from "../types/UserType";
import { authStorage } from "../services/authStorage";

type LoginDataType = {
  token: string;
  userType: UserType;
  email: string
};

type AuthContextType = {
  isAuthenticated: boolean;
  userType: UserType | null;
  userEmail: string | null;
  login: ({ token, userType, email }: LoginDataType) => void;
  logout: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userType: null,
  userEmail: null,
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

  const [userEmail, setUserEmail] = useState(authStorage.getUserEmail());

  const login = ({ token, userType, email }: LoginDataType) => {
    tokenService.saveAuth({ token, userType });
    authStorage.setUserEmail(email);
    
    setUserType(userType);
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const logout = () => {
    tokenService.clearAuth();
    authStorage.removeUserEmail();
    setUserType(null);
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      userType,
      logout,
      userEmail,
    }),
    [isAuthenticated, userType, userEmail],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
