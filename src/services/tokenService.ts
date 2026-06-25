const TOKEN_KEY = "lessio_user_session";

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
};
