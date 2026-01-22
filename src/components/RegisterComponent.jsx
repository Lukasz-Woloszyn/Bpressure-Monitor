import React, { useState } from "react";
import "../Sass/LoginComponent.scss";
import { RegisterAPI, GoogleSignInAPI } from "../API/AuthAPI";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import logo from "../assets/logo.png";
import GoogleButton from "react-google-button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function RegisterComponent() {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validatePassword = (password) => {
    const minLength = /^(?=.{8,})/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const hasUpperCase = /[A-Z]/;
    const hasNumber = /[0-9]/;

    return (
      minLength.test(password) &&
      hasSpecialChar.test(password) &&
      hasUpperCase.test(password) &&
      hasNumber.test(password)
    );
  };

  const register = async (e) => {
    e.preventDefault();
    //sprawdzenie poprawności haseł
    if (credentials.password !== credentials.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    //sprawdzenie wymagań hasła
    if (!validatePassword(credentials.password)) {
      toast.error(
        "Password must be at least 8 characters long, include a special character, an uppercase letter, and a number."
      );
      return;
    }

    try {
      let res = await RegisterAPI(
        credentials.email,
        credentials.password,
        navigate
      );
      //toast.success('Registered');
      //navigate('/home');
    } catch (err) {
      console.log(err);
      //toast.error("Cannot create account");
    }
  };

  const signWithGoogle = async () => {
    try {
      let response = await GoogleSignInAPI();
      console.log(response);
      if (response.user) {
        toast.success("Logged in successfully");
        navigate("/home");
      } else {
        throw new Error("Failed to log in");
      }
    } catch (err) {
      console.error(err);
      toast.error("Google Sign-In failed");
    }
  };

  return (
    <div className="login-wrapper">
      <img className="logo" src={logo}></img>
      <h1 className="main-header">Join us now</h1>
      <form onSubmit={register}>
        <div className="auth-inputs">
          <input
            onChange={(event) =>
              setCredentials({ ...credentials, email: event.target.value })
            }
            type="email"
            className="common-input"
            placeholder="Enter your email"
            required
          />
          <input
            onChange={(event) =>
              setCredentials({ ...credentials, password: event.target.value })
            }
            type="password"
            minLength="8"
            maxLength="40"
            className="common-input"
            placeholder="Enter your password"
            required
          />
          <input
            onChange={(event) =>
              setCredentials({
                ...credentials,
                confirmPassword: event.target.value,
              })
            }
            type="password"
            minLength="8"
            maxLength="40"
            className="common-input"
            placeholder="Confirm your password"
            required
          />
        </div>
        <br></br>
        <button type="submit" className="login-btn">
          Register
        </button>
      </form>
      <br></br>
      <p className="or">OR</p>
      <div className="google-btn-container">
        <GoogleButton className="google-btn" onClick={signWithGoogle} />
      </div>
      <p className="go-to-register">
        Already got an account?{" "}
        <span className="create-acc" onClick={() => navigate("/login")}>
          Log in
        </span>
      </p>
    </div>
  );
}
