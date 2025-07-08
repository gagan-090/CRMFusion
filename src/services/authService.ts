// src/services/authService.ts
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password); // ✅ Only signs in
};

export const signup = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
