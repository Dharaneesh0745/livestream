export const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  export const validatePassword = (password: string): boolean =>
    password.length >= 8;
  