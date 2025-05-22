import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Reviews from "./Reviews";

// We will handle the mocking of getReviews within the describe block

describe("Reviews component", () => {
  const getReviews = jest.fn();

  it("displays loading indicator while fetching", async () => {
    getReviews.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 1000))
    );

    render(<Reviews />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays reviews correctly after fetching", async () => {
    getReviews.mockResolvedValue([
      {
        id: 1,
        user: "JohnDoe",
        text: "Amazing quality and fast shipping!",
        rating: 5,
        date: "2023-10-15T14:30:00Z",
      },
      {
        id: 2,
        user: "JaneSmith",
        text: "Decent product, but packaging was damaged.",
        rating: 3,
        date: "2023-10-12T11:00:00Z",
      },
    ]);

    render(<Reviews />);

    await waitFor(() => {
      expect(
        screen.getByText("Amazing quality and fast shipping!")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Decent product, but packaging was damaged.")
      ).toBeInTheDocument();
    });
  });

  it("displays error message when fetching fails", async () => {
    getReviews.mockRejectedValue(new Error("Failed to fetch reviews"));

    render(<Reviews />);

    await waitFor(() => {
      expect(
        screen.getByText(/Error: Failed to fetch reviews/i)
      ).toBeInTheDocument();
    });
  });
});
