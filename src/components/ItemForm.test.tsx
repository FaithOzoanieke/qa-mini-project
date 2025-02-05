import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ItemForm from "./ItemForm";
import { createItem } from "../api/items";
import { MemoryRouter } from "react-router-dom";

// --- Mocks ---

// Mock the API function.
jest.mock("../api/items", () => ({
  createItem: jest.fn(),
}));
const mockedCreateItem = createItem as jest.Mock;

// Create a top-level mock for useNavigate.
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

// --- Tests ---

describe("ItemForm", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("renders the form with input fields and buttons", () => {
    render(
      <MemoryRouter>
        <ItemForm />
      </MemoryRouter>
    );

    // Verify that the input fields and buttons are present.
    expect(screen.getByLabelText(/Item Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create Item/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Back to Item List/i })).toBeInTheDocument();
  });

  it("shows an error message if fields are empty", async () => {
    // Render the component.
    const { container } = render(
      <MemoryRouter>
        <ItemForm />
      </MemoryRouter>
    );

    // Instead of clicking the submit button (which may be blocked by native validation),
    // fire a submit event directly on the form element.
    const form = container.querySelector("form");
    if (!form) {
      throw new Error("Form element not found");
    }
    fireEvent.submit(form);

    // Verify that the error message appears.
    expect(await screen.findByText(/Both fields are required/i)).toBeInTheDocument();
  });

  it("submits the form successfully and navigates to /items", async () => {
    // Arrange: set up a fake API response.
    const fakeResponse = { name: "Test Item", description: "Test description" };
    mockedCreateItem.mockResolvedValueOnce(fakeResponse);

    render(
      <MemoryRouter>
        <ItemForm />
      </MemoryRouter>
    );

    // Act: fill in the form fields.
    const nameInput = screen.getByLabelText(/Item Name/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    fireEvent.change(nameInput, { target: { value: "Test Item" } });
    fireEvent.change(descriptionInput, { target: { value: "Test description" } });

    // Submit the form by clicking the button.
    fireEvent.click(screen.getByRole("button", { name: /Create Item/i }));

    // Assert: wait for the API function to have been called with the proper data.
    await waitFor(() => {
      expect(mockedCreateItem).toHaveBeenCalledWith({
        name: "Test Item",
        description: "Test description",
      });
    });

    // Check that a success message appears.
    expect(await screen.findByText(/created successfully/i)).toBeInTheDocument();

    // Fast-forward the timer (the component uses a 1-second timeout to navigate).
    jest.advanceTimersByTime(1000);

    // Verify that navigation occurred.
    expect(mockNavigate).toHaveBeenCalledWith("/items");
  });
});
