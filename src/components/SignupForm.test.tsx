import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupForm from "./SignupForm";
import { signupUser } from "../api/auth";
import { MemoryRouter } from "react-router-dom";

// Mock the signupUser API call
jest.mock("../api/auth", () => ({
  signupUser: jest.fn(),
}));

// Ensure react-router-dom’s components are not inadvertently mocked
jest.mock("react-router-dom", () => {
  // Get the actual implementations from react-router-dom
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    Link: actual.Link,
    MemoryRouter: actual.MemoryRouter,
  };
});

describe("SignupForm", () => {
  it("displays success message when signup is successful", async () => {
    // Simulate a successful signup response
    (signupUser as jest.Mock).mockResolvedValueOnce({
      id: "1",
      username: "testUser",
    });

    // Render the SignupForm wrapped in MemoryRouter (since it uses <Link>)
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "testPassword" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    // Wait for and assert that the success message appears
    await waitFor(() => {
      expect(
        screen.getByText(/Signup successful! User ID: 1/i)
      ).toBeInTheDocument();
    });
  });

  it("displays error message when signup fails", async () => {
    // Simulate a failed signup response (null indicates failure)
    (signupUser as jest.Mock).mockResolvedValueOnce(null);

    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "testPassword" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    // Wait for and assert that the error message appears
    await waitFor(() => {
      expect(
        screen.getByText(/Signup failed. Please try again./i)
      ).toBeInTheDocument();
    });
  });
});
