import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EditItem from "./EditItem";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { fetchItemById, updateItem } from "../api/items";

// --- Mock the API functions ---
jest.mock("../api/items", () => ({
  fetchItemById: jest.fn(),
  updateItem: jest.fn(),
}));

const mockedFetchItemById = fetchItemById as jest.Mock;
const mockedUpdateItem = updateItem as jest.Mock;

// --- Override useNavigate via module mock ---
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

describe("EditItem", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Ensure any pending timers are run and mocks are cleared.
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("shows a loading indicator while fetching the item", () => {
    // Arrange: Return a pending promise so loading remains true.
    mockedFetchItemById.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={["/edit/123"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditItem />} />
        </Routes>
      </MemoryRouter>
    );

    // Assert: "Loading..." is displayed.
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders the form with pre-populated data", async () => {
    // Arrange: Fake fetched item data.
    const fakeItem = {
      id: "123",
      name: "Fake Name",
      description: "Fake Description",
      createdAt: "2020-01-01T00:00:00Z",
      updatedAt: "2020-01-02T00:00:00Z",
      userId: "u1",
    };
    mockedFetchItemById.mockResolvedValueOnce(fakeItem);

    render(
      <MemoryRouter initialEntries={["/edit/123"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditItem />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the form fields to be pre-populated.
    await waitFor(() => {
      expect(screen.getByDisplayValue("Fake Name")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Fake Description")).toBeInTheDocument();
    });
  });

  it("updates the item successfully and navigates back", async () => {
    // Arrange: Fake fetched item.
    const fakeItem = {
      id: "123",
      name: "Fake Name",
      description: "Fake Description",
      createdAt: "2020-01-01T00:00:00Z",
      updatedAt: "2020-01-02T00:00:00Z",
      userId: "u1",
    };
    mockedFetchItemById.mockResolvedValueOnce(fakeItem);
    // Make updateItem resolve successfully.
    mockedUpdateItem.mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={["/edit/123"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditItem />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for form to be pre-populated.
    await waitFor(() => {
      expect(screen.getByDisplayValue("Fake Name")).toBeInTheDocument();
    });

    // Act: Update the form fields.
    fireEvent.change(screen.getByLabelText(/Item Name/i), {
      target: { value: "Updated Name" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Updated Description" },
    });

    // Submit the form.
    fireEvent.click(screen.getByRole("button", { name: /Update Item/i }));

    // Assert: Ensure updateItem is called with the correct arguments.
    await waitFor(() => {
      expect(mockedUpdateItem).toHaveBeenCalledWith("123", {
        name: "Updated Name",
        description: "Updated Description",
      });
    });

    // Check that a success message appears.
    expect(
      await screen.findByText(/Item updated successfully!/i)
    ).toBeInTheDocument();

    // Fast-forward time by 1000ms so that navigate is triggered.
    jest.advanceTimersByTime(1000);
    expect(mockNavigate).toHaveBeenCalledWith("/items");
  });

  it("displays an error message if update fails", async () => {
    // Arrange: Fake fetched item.
    const fakeItem = {
      id: "123",
      name: "Fake Name",
      description: "Fake Description",
      createdAt: "2020-01-01T00:00:00Z",
      updatedAt: "2020-01-02T00:00:00Z",
      userId: "u1",
    };
    mockedFetchItemById.mockResolvedValueOnce(fakeItem);
    // Make updateItem reject.
    mockedUpdateItem.mockRejectedValueOnce(new Error("Update failed"));

    render(
      <MemoryRouter initialEntries={["/edit/123"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditItem />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for form pre-population.
    await waitFor(() => {
      expect(screen.getByDisplayValue("Fake Name")).toBeInTheDocument();
    });

    // Act: Submit the form.
    fireEvent.click(screen.getByRole("button", { name: /Update Item/i }));

    // Assert: Wait for the error message.
    expect(await screen.findByText(/Update failed/i)).toBeInTheDocument();
  });

  it("navigates back when the 'Back to Item List' button is clicked", async () => {
    // Arrange: Fake fetched item.
    const fakeItem = {
      id: "123",
      name: "Fake Name",
      description: "Fake Description",
      createdAt: "2020-01-01T00:00:00Z",
      updatedAt: "2020-01-02T00:00:00Z",
      userId: "u1",
    };
    mockedFetchItemById.mockResolvedValueOnce(fakeItem);

    render(
      <MemoryRouter initialEntries={["/edit/123"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditItem />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the form to be rendered.
    await waitFor(() => {
      expect(screen.getByDisplayValue("Fake Name")).toBeInTheDocument();
    });

    // Act: Click the "Back to Item List" button.
    fireEvent.click(screen.getByRole("button", { name: /Back to Item List/i }));

    // Assert: Verify that navigate was called with "/items".
    expect(mockNavigate).toHaveBeenCalledWith("/items");
  });
});
