import type { UserType } from "../types/UserType";

const TOKEN_KEY = "lessio_token";
const USERTYPE_KEY = "userType";

type AuthType = {
  token: string;
  userType: UserType;
};

export const tokenService = {
  /**
   * Saves the long-term JWT token received from the backend after successful login
   */
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Retrieves the stored JWT token for API requests authorization
   */
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Removes the token from storage (used during user logout)
   */
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Quick check to see if the user has an active session token stored
   */
  hasToken: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getUserType: (): UserType | null => {
    const userType = localStorage.getItem(USERTYPE_KEY);

    if (userType === "admin" || userType === "student") {
      return userType;
    }

    return null;
  },

  saveAuth: ({ token, userType }: AuthType) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERTYPE_KEY, userType);
  },

  getAuth: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userType = localStorage.getItem(USERTYPE_KEY);

    return {
      token,
      userType,
    };
  },

  clearAuth: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERTYPE_KEY);
  },
};
