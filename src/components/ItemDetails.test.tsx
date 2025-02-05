import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ItemDetails from "./ItemDetails";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { fetchItemById } from "../api/items";

// --- Mock the API call ---
jest.mock("../api/items", () => ({
  fetchItemById: jest.fn(),
}));
const mockedFetchItemById = fetchItemById as jest.Mock;

// --- Override useNavigate via module mock ---
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

describe("ItemDetails", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays a loading message initially", () => {
    // Arrange: Make fetchItemById return a pending promise.
    mockedFetchItemById.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={["/items/123"]}>
        <Routes>
          <Route path="/items/:id" element={<ItemDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Assert: The loading text is displayed.
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("displays item details when fetch is successful", async () => {
    // Arrange: Define a fake item.
    const fakeItem = {
      id: "123",
      name: "Test Item",
      description: "Test Description",
      createdAt: new Date("2020-01-01T00:00:00Z").toISOString(),
      updatedAt: new Date("2020-01-02T00:00:00Z").toISOString(),
      userId: "u1",
    };
    mockedFetchItemById.mockResolvedValueOnce(fakeItem);

    render(
      <MemoryRouter initialEntries={["/items/123"]}>
        <Routes>
          <Route path="/items/:id" element={<ItemDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Act & Assert: Wait for the item details to be rendered.
    await waitFor(() => {
      expect(screen.getByText(/Test Item/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Test Description/i)).toBeInTheDocument();

    // Instead of a custom matcher, get the element that contains "u1" and verify its parent also has "Created By:".
    const userIdElement = screen.getByText("u1", { exact: false });
    // The parent element should be the <p> that contains both the <strong> label and the text "u1"
    expect(userIdElement.parentElement).toHaveTextContent(/Created By:\s*u1/i);

    // Verify that the date labels exist.
    expect(screen.getByText(/Created At:/i)).toBeInTheDocument();
    expect(screen.getByText(/Updated At:/i)).toBeInTheDocument();
  });

  it("displays an error message when fetch fails", async () => {
    // Arrange: Have the API call reject.
    mockedFetchItemById.mockRejectedValueOnce(new Error("Error fetching item"));

    render(
      <MemoryRouter initialEntries={["/items/123"]}>
        <Routes>
          <Route path="/items/:id" element={<ItemDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Act & Assert: Wait for the error message to appear.
    await waitFor(() => {
      expect(screen.getByText(/Error fetching item/i)).toBeInTheDocument();
    });
  });

  it("navigates back to /items when the 'Back to Item List' button is clicked", async () => {
    // Arrange: Define a fake item.
    const fakeItem = {
      id: "123",
      name: "Test Item",
      description: "Test Description",
      createdAt: new Date("2020-01-01T00:00:00Z").toISOString(),
      updatedAt: new Date("2020-01-02T00:00:00Z").toISOString(),
      userId: "u1",
    };
    mockedFetchItemById.mockResolvedValueOnce(fakeItem);

    render(
      <MemoryRouter initialEntries={["/items/123"]}>
        <Routes>
          <Route path="/items/:id" element={<ItemDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the item details to be displayed.
    await waitFor(() => {
      expect(screen.getByText(/Test Item/i)).toBeInTheDocument();
    });

    // Act: Click the back button.
    const backButton = screen.getByRole("button", { name: /Back to Item List/i });
    fireEvent.click(backButton);

    // Assert: Verify that navigate was called with "/items".
    expect(mockNavigate).toHaveBeenCalledWith("/items");
  });
});
