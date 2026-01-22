import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import LoginComponent from "../src/components/LoginComponent";
import { auth } from "../src/firebaseConfig";
import {
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import "@testing-library/jest-dom";

// mockowanie funkcji Firebase 
jest.mock("firebase/auth", () => ({
  sendPasswordResetEmail: jest.fn(),
  fetchSignInMethodsForEmail: jest.fn(),
}));

jest.mock("../src/firebaseConfig", () => ({
  auth: {
    currentUser: null,
  },
}));

describe("LoginComponent", () => {
  test("renders login form", () => {
    render(
      <Router>
        <LoginComponent />
      </Router>
    );
    expect(
      screen.getByPlaceholderText(/Enter your email/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter your password/i)
    ).toBeInTheDocument();
  });

  test("handles Google sign-in", async () => {
    render(
      <Router>
        <LoginComponent />
      </Router>
    );
    const googleButton = screen.getByRole("button", {
      name: /Sign in with Google/i,
    });
    expect(googleButton).toBeInTheDocument();
  });

  test("opens and closes reset password modal", () => {
    render(
      <Router>
        <LoginComponent />
      </Router>
    );
    const forgotPasswordLink = screen.getByText(/Forgot your password?/i);
    fireEvent.click(forgotPasswordLink);

    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();

    const closeButton = screen.getByText("X");
    fireEvent.click(closeButton);

    expect(screen.queryByText(/Reset Password/i)).not.toBeInTheDocument();
  });

  test("sends password reset email", async () => {
    fetchSignInMethodsForEmail.mockResolvedValueOnce(["password"]);

    render(
      <Router>
        <LoginComponent />
      </Router>
    );
    const forgotPasswordLink = screen.getByText(/Forgot your password?/i);
    fireEvent.click(forgotPasswordLink);

    const emailInputs = screen.queryAllByPlaceholderText(/Enter your email/i);
    expect(emailInputs).toHaveLength(2);
    const emailInput = emailInputs[1]; // 0 - login email input, 1 - reset password email input
    const sendButton = screen.getByText(/Send Reset Email/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(sendButton);
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      auth,
      "test@example.com"
    );
  });
});
