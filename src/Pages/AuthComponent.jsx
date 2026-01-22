import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  confirmPasswordReset,
  signOut,
  verifyPasswordResetCode,
  applyActionCode,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "/src/Sass/AuthComponent.scss";

const AuthComponent = () => {
  let navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const oobCode = query.get("oobCode"); // kod oob z linku
  const mode = query.get("mode");

  useEffect(() => {
    const handleAction = async () => {
      if (!oobCode) {
        toast.error("Invalid link.");
        navigate("/login");
        return;
      }

      try {
        if (mode === "resetPassword") {
          await verifyPasswordResetCode(auth, oobCode);
        } else if (mode === "verifyEmail") {
          await applyActionCode(auth, oobCode);
          toast.success("Email verified successfully!");
          navigate("/login");
          return;
        } else {
          toast.error("Invalid action.");
          navigate("/login");
        }
      } catch (error) {
        toast.error("Invalid or expired link.");
        navigate("/login");
      }
    };

    handleAction();
  }, [oobCode, mode, navigate]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!validatePassword(newPassword)) {
      toast.error(
        "Password must be at least 8 characters long, include a special character, an uppercase letter, and a number."
      );
      return;
    }
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success("Password has been reset successfully!");
      await signOut(auth);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("You have already resetted your password.");
      await signOut(auth);
    }
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      <div className="reset-form">
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default AuthComponent;
