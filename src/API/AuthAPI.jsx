import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const LoginAPI = async (email, password, navigate) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (!user.emailVerified) {
      // email niezweryfikowany - wylogowanie
      await signOut(auth);
      toast.error("Please verify your email before logging in.");
      navigate("/login");
      return null;
    }

    toast.success("Logged in successfully!");
    return user;
  } catch (error) {
    if (error.code === "auth/too-many-requests") {
      toast.error("Too many requests. Try again later.");
    } else if (error.code === "auth/invalid-credential") {
      toast.error("Incorrect email or password. Please try again.");
    } else if (error.code === "auth/invalid-email") {
      toast.error("Your email address is incorrect.");
    } else {
      toast.error("Failed to login. Please try again.");
    }
    console.error("Error during login:", error);
  }
};

export const RegisterAPI = async (email, password, navigate) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await sendEmailVerification(user);
    toast.success(
      "Registration successful! Please check your email to verify your account."
    );
    // Wylogowanie po rejestracji
    Logout();
    navigate("/login");
    return user;
  } catch (error) {
    if (error.code === "auth/invalid-email") {
      toast.error("Your email address is incorrect.");
    } else if (error.code === "auth/email-already-in-use") {
      toast.error("This email is already in use.");
    } else if (error.code === "auth/weak-password") {
      toast.error("Password is too weak.");
    } else {
      toast.error("Registration failed. Please try again later.");
    }
    return error;
  }
};

export const GoogleSignInAPI = () => {
  try {
    let googleProvider = new GoogleAuthProvider();
    let res = signInWithPopup(auth, googleProvider);
    return res;
  } catch (err) {
    return err;
  }
};

export const Logout = () => {
  try {
    signOut(auth);
  } catch (err) {
    return err;
  }
};
