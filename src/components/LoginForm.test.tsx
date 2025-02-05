import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { loginUser } from "../api/auth"; 
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";

// Mock the loginUser function and the useNavigate hook
jest.mock("../api/auth", () => ({
  loginUser: jest.fn(),
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

describe("LoginForm", () => {
  beforeEach(() => {
    jest.useFakeTimers(); 
    // Enable fake timers for each test
  });

  afterEach(() => {
    jest.useRealTimers(); 
    // Optionally restore real timers after each test
  });

  it("displays success message and redirects when login is successful", async () => {
    // Explicitly type the mock for useNavigate
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    // Mock the loginUser function to simulate a successful login response
    (loginUser as jest.Mock).mockResolvedValueOnce({
      accessToken: "dummyToken",
      user: { id: "1", username: "testUser" },
    });

    render(<LoginForm />);

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testUser" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "testPassword" } });

    // Trigger form submission
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    // Wait for the success message to appear
    await waitFor(() => {
      expect(screen.getByText("Login successful! Redirecting...")).toBeInTheDocument();
    });

    // Advance timers by 1 second (the delay before navigation)
    jest.advanceTimersByTime(1000);

    // Optionally wait for any pending promises (if needed)
    await waitFor(() => {
      // Check if the navigate function was called with the correct route
      expect(mockNavigate).toHaveBeenCalledWith("/items");
    });
  });
});
