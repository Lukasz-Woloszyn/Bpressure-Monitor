import React, { useState } from "react";
import "../Sass/LoginComponent.scss";
import { LoginAPI, GoogleSignInAPI } from "../API/AuthAPI";
import logo from "../assets/logo.png";
import GoogleButton from "react-google-button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoginComponent() {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({});
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      let res = await LoginAPI(
        credentials.email,
        credentials.password,
        navigate
      );
      //toast.success('Signed in');
      navigate("/home");
    } catch (err) {
      console.log(err);
      //toast.error("Check your email and password")
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

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    //console.log("Reset email:", resetEmail); // debugowanie

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success("Password reset email sent!");
      setIsResetModalOpen(false);
    } catch (error) {
      console.error("Error sending password reset email:", error);

      if (error.code === "auth/user-not-found") {
        toast.error("Email not found.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address.");
      } else if (error.code === "auth/missing-email") {
        toast.error("Email is required.");
      } else {
        toast.error("Failed to send password reset email.");
      }
    }
  };
  return (
    <div className="login-wrapper">
      <img className="logo" src={logo}></img>
      <h1 className="main-header">Make your life easier</h1>
      <form onSubmit={login}>
        <div className="auth-inputs">
          <input
            onChange={(event) =>
              setCredentials({ ...credentials, email: event.target.value })
            }
            className="common-input"
            placeholder="Enter your email"
            type="email"
          />
          <input
            onChange={(event) =>
              setCredentials({ ...credentials, password: event.target.value })
            }
            type="password"
            className="common-input"
            placeholder="Enter your password"
          />
        </div>
        <p
          className="forgot-password"
          onClick={() => setIsResetModalOpen(true)}
        >
          Forgot your password?
        </p>
        <br></br>
        <button type="submit" className="login-btn">
          Log in
        </button>
      </form>
      <div className="google-btn-container">
        <GoogleButton className="google-btn" onClick={signWithGoogle} />
      </div>
      <p className="go-to-register">
        New to BPM?{" "}
        <span className="create-acc" onClick={() => navigate("/register")}>
          Create an account
        </span>
      </p>

      {isResetModalOpen && (
        <div className="reset-modal" onClick={() => setIsResetModalOpen(false)}>
          <div
            className="reset-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="close-btn"
              onClick={() => setIsResetModalOpen(false)}
            >
              X
            </span>
            <h2>Reset Password</h2>
            <form onSubmit={handlePasswordReset}>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <button className="reset-send" type="submit">
                Send Reset Email
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
