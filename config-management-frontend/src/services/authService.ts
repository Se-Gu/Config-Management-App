import { auth } from "../firebase/index";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useToast } from "vue-toastification";

const toast = useToast();

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    toast.success("Login successful!");
    return userCredential.user;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMessage = error.message || "Failed to login.";
    toast.error(`Login failed: ${errorMessage}`);
    throw error;
  }
};

export const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    toast.success("Registration successful!");
    return userCredential.user;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMessage = error.message || "Failed to register.";
    toast.error(`Registration failed: ${errorMessage}`);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    toast.success("Logout successful!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMessage = error.message || "Failed to logout.";
    toast.error(`Logout failed: ${errorMessage}`);
    throw error;
  }
};
