import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ItemList, { Item } from "./ItemList";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Mock axios to control API responses
jest.mock("axios");

// Mock react-router-dom to override useNavigate
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

describe("ItemList", () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Clear mocks and set a dummy auth token in localStorage
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    localStorage.setItem("authToken", "dummyToken");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renders items after a successful fetch", async () => {
    // Arrange: create a fake list of items
    const items: Item[] = [
      {
        id: "1",
        name: "Test Item 1",
        description: "Description 1",
        userId: "u1",
        user: { id: "u1", username: "user1" },
      },
      {
        id: "2",
        name: "Test Item 2",
        description: "Description 2",
        userId: "u2",
        user: { id: "u2", username: "user2" },
      },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: items });

    // Act: Render the component wrapped in MemoryRouter
    render(
      <MemoryRouter>
        <ItemList />
      </MemoryRouter>
    );

    // Assert: Loading message is visible initially
    expect(screen.getByText(/Loading items.../i)).toBeInTheDocument();

    // Wait until the items are rendered in the document
    await waitFor(() => {
      expect(screen.getByText(/Test Item 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Item 2/i)).toBeInTheDocument();
    });

    // Verify that the table header is present
    expect(screen.getByText(/Item List/i)).toBeInTheDocument();
  });

  it("renders an unauthorized error when no token is found", async () => {
    // Arrange: Remove the auth token
    localStorage.removeItem("authToken");

    // Act: Render the component
    render(
      <MemoryRouter>
        <ItemList />
      </MemoryRouter>
    );

    // Assert: An unauthorized error message is eventually displayed
    await waitFor(() => {
      expect(
        screen.getByText(/Unauthorized. Please log in./i)
      ).toBeInTheDocument();
    });
  });

  it("handles deletion of an item", async () => {
    // Arrange: Set up a list with one item and a successful deletion response
    const items: Item[] = [
      {
        id: "1",
        name: "Test Item 1",
        description: "Description 1",
        userId: "u1",
        user: { id: "u1", username: "user1" },
      },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: items });

    render(
      <MemoryRouter>
        <ItemList />
      </MemoryRouter>
    );

    // Wait for the item to load
    await waitFor(() => {
      expect(screen.getByText(/Test Item 1/i)).toBeInTheDocument();
    });

    // Mock the browser's confirm dialog to always return true
    jest.spyOn(window, "confirm").mockReturnValueOnce(true);

    // Arrange deletion: set axios.delete to resolve successfully
    mockedAxios.delete.mockResolvedValueOnce({});

    // Act: Find and click the delete button using its aria-label
    const deleteButton = screen.getByRole("button", { name: /delete item/i });
    fireEvent.click(deleteButton);

    // Assert: Verify that axios.delete was called with the expected URL and headers
    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `https:qa-test-9di7.onrender.com/items/1`,
        { headers: { Authorization: "Bearer dummyToken" } }
      );
    });

    // After deletion, the item should be removed.
    await waitFor(() => {
      expect(screen.getByText(/No items found./i)).toBeInTheDocument();
    });
  });

  it("navigates to create item page when clicking the 'Create New Item' button", async () => {
    // Arrange: Return an empty item list
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <ItemList />
      </MemoryRouter>
    );

    // Wait until the "No items found." message is displayed
    await waitFor(() => {
      expect(screen.getByText(/No items found./i)).toBeInTheDocument();
    });

    // Act: Click the "Create New Item" button using its aria-label
    const createButton = screen.getByRole("button", {
      name: /create new item/i,
    });
    fireEvent.click(createButton);

    // Assert: Verify that navigate was called with the "/create-item" route
    expect(mockNavigate).toHaveBeenCalledWith("/create-item");
  });
});
