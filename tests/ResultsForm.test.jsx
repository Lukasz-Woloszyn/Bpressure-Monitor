import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResultsForm from "../src/components/common/ResultsForm";
import "@testing-library/jest-dom";
import { ToastContainer } from "react-toastify";

// mockowanie API i hooków firebase
jest.mock("../src/API/FirestoreAPI", () => ({
  postResults: jest.fn().mockResolvedValue(true),
  saveUserTableEntry: jest.fn(),
}));
jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn().mockReturnValue([true]), // mockowanie zalogowanego konta
}));

// wyczyszczenie mockowania
afterEach(() => {
  jest.clearAllMocks();
});

test("renders results form with all fields", () => {
  render(<ResultsForm />);

  expect(screen.getByLabelText(/Systolic Pressure:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Diastolic Pressure:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Pulse:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Date:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Time:/i)).toBeInTheDocument();
  expect(screen.getByText(/Save Results/i)).toBeInTheDocument();
  expect(screen.getByText(/How to Read Results/i)).toBeInTheDocument();
});

test("submits results", async () => {
  render(<ResultsForm />);

  fireEvent.change(screen.getByLabelText(/Systolic Pressure:/i), {
    target: { value: "120" },
  });
  fireEvent.change(screen.getByLabelText(/Diastolic Pressure:/i), {
    target: { value: "80" },
  });
  fireEvent.change(screen.getByLabelText(/Pulse:/i), {
    target: { value: "60" },
  });
  fireEvent.change(screen.getByLabelText(/Date:/i), {
    target: { value: "2024-09-01" },
  });
  fireEvent.change(screen.getByLabelText(/Time:/i), {
    target: { value: "12:30" },
  });

  fireEvent.click(screen.getByText(/Save Results/i));

  // sprawdzenie toasta
  expect(await screen.findByText(/Result added!/i)).toBeInTheDocument();
});

test("resets form fields after saving", async () => {
  render(<ResultsForm />);
  fireEvent.change(screen.getByLabelText(/Systolic Pressure:/i), {
    target: { value: "120" },
  });
  fireEvent.change(screen.getByLabelText(/Diastolic Pressure:/i), {
    target: { value: "80" },
  });
  fireEvent.change(screen.getByLabelText(/Pulse:/i), {
    target: { value: "70" },
  });

  // klikniecie potwierdzenia
  fireEvent.click(screen.getByText(/Save Results/i));

  // czekanie na powiadomienie
  await waitFor(() => {
    expect(screen.getByText(/Result added!/i)).toBeInTheDocument();
  });

  // sprawdzenie resetowania formularzy
  expect(screen.getByLabelText(/Systolic Pressure:/i).value).toBe("");
  expect(screen.getByLabelText(/Diastolic Pressure:/i).value).toBe("");
  expect(screen.getByLabelText(/Pulse:/i).value).toBe("");
});

test("opens and closes instruction modal", () => {
  render(<ResultsForm />);

  fireEvent.click(screen.getByText(/How to Read Results/i));
  expect(
    screen.getByText(/How to Read Your Blood Pressure/i)
  ).toBeInTheDocument();

  fireEvent.click(screen.getByText(/X/i));
  expect(
    screen.queryByText(/How to Read Your Blood Pressure/i)
  ).not.toBeInTheDocument();
});
