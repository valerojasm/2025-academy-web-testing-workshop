import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { calculateTotalPriceByCategory } from "./utils";
import ProductList from "./ProductList";

describe("calculateTotalPriceByCategory", () => {
  const products = [
    { id: 1, name: "Shirt", price: 20, condition: "New", category: "Clothing" },
    {
      id: 2,
      name: "Phone",
      price: 600,
      condition: "Used",
      category: "Electronics",
    },
    { id: 3, name: "Pants", price: 40, condition: "New", category: "Clothing" },
  ];

  it("calculates the total price for a given category", () => {
    const chosenCategory = "Clothing";
    const totalPrice = calculateTotalPriceByCategory(products, chosenCategory);

    expect(totalPrice).toBe(60);
  });

  it("returns 0 when no products match the category", () => {
    const chosenCategory = "Books";
    const totalPrice = calculateTotalPriceByCategory(products, chosenCategory);

    expect(totalPrice).toBe(0);
  });
});

describe("ProductList component", () => {
  const products = [
    { id: 1, name: "Shirt", price: 20, condition: "New", category: "Clothing" },
    {
      id: 2,
      name: "Phone",
      price: 600,
      condition: "Used",
      category: "Electronics",
    },
  ];

  it("renders ProductList correctly - snapshot", () => {
    const component = render(<ProductList products={products} />);
    expect(component).toMatchSnapshot();
  });

  it("shows all products by default", () => {
    render(<ProductList products={products} />);
    expect(screen.getByText("Shirt - $20 (New, Clothing)")).toBeInTheDocument();
    expect(
      screen.getByText("Phone - $600 (Used, Electronics)")
    ).toBeInTheDocument();
  });

  it("filters products by selected category", () => {
    render(<ProductList products={products} />);
    fireEvent.change(screen.getByLabelText(/Filter by Category/i), {
      target: { value: "Clothing" },
    });

    expect(screen.getByText("Shirt - $20 (New, Clothing)")).toBeInTheDocument();
    expect(
      screen.queryByText("Phone - $600 (Used, Electronics)")
    ).not.toBeInTheDocument();
  });
});

describe("ProductList component edge cases", () => {
  it("renders correctly with no products", () => {
    render(<ProductList products={[]} />);
    expect(screen.getByText("Product List")).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("handles unknown category gracefully", () => {
    const products = [
      {
        id: 1,
        name: "Shirt",
        price: 20,
        condition: "New",
        category: "Clothing",
      },
    ];
    render(<ProductList products={products} />);
    fireEvent.change(screen.getByLabelText(/Filter by Category/i), {
      target: { value: "Unknown Category" },
    });

    expect(
      screen.queryByText("Shirt - $20 (New, Clothing)")
    ).not.toBeInTheDocument();
  });
});
