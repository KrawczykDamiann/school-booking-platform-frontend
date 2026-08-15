const USER_EMAIL_KEY = "userEmail";
const PENDING_OTT_EMAIL_KEY = "pendingOttEmail";

export const authStorage = {

    /**
    * Pending Email
    */
    
  setPendingEmail(email: string) {
    localStorage.setItem(PENDING_OTT_EMAIL_KEY, email);
  },

  getPendingEmail() {
    return localStorage.getItem(PENDING_OTT_EMAIL_KEY);
  },

  clearPendingEmail() {
    localStorage.removeItem(PENDING_OTT_EMAIL_KEY);
  },

    /**
    * User Email
    */

  setUserEmail(email: string) {
    localStorage.setItem(USER_EMAIL_KEY, email);
  },

  getUserEmail() {
    return localStorage.getItem(USER_EMAIL_KEY);
  },

  removeUserEmail() {
    localStorage.removeItem(USER_EMAIL_KEY);
  }
}