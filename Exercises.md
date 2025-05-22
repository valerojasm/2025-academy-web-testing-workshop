# 2025 Academy Web - Testing Workshop

## Exercise 1

**Scenario:** You have a React component that displays a detailed list of products. Each product includes a name, price, condition, and category. Additionally, the component has a feature to filter products by category. There is also a utility function that calculates the total price of the products in a specific category.

**Files and setup:**

**1. ProductList.tsx**

```ts
import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  condition: string;
  category: string;
}

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredProducts = products.filter(
    product => selectedCategory === 'All' || product.category === selectedCategory
  );

  return (
    <div>
      <h1>Product List</h1>
      <div>
        <label htmlFor="category">Filter by Category: </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Clothing">Clothing</option>
          <option value="Electronics">Electronics</option>
        </select>
      </div>
      <ul>
        {filteredProducts.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price} ({product.condition}, {product.category})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
```
**2. utils.ts**

```ts
export const calculateTotalPriceByCategory = (products: Product[], category: string): number => {
  return products
    .filter(product => product.category === category)
    .reduce((acc, product) => acc + product.price, 0);
};
```

**Tasks:**

a. **Unit Tests for Utility Function**:

-   Write tests for  `calculateTotalPriceByCategory`  to ensure it returns the correct total price for products in a specified category.
-   Verify that it returns 0 when no products match the category.

b. **Component Snapshot Test**:

-   Use snapshot testing to verify the output of the  `ProductList`  component with a sample set of products.

c. **Component Interaction Tests**:

-   Test the product filtering feature by verifying that selecting a category updates the displayed list correctly.
-   Ensure the filter defaults to "All", showing all products initially.

d. **Edge Case Tests**:

-   Test how the component behaves when there are no products.
-   Verify that the component handles an unknown category gracefully.

## Exercise 2

**Scenario:** You have a React component that fetches and displays user reviews for a product from an API. The component should display a loading indicator while the data is being fetched and show an error message if the request fails.

**Files and setup:**

**1. Reviews.tsx**

```ts
import React, { useState, useEffect } from 'react';

interface Review {
  id: number;
  text: string;
}

interface ReviewsProps {
  productId: number;
}

const Reviews: React.FC<ReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`https://api.example.com/products/${productId}/reviews`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Product Reviews</h1>
      <ul>
        {reviews.map(review => (
          <li key={review.id}>{review.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;
```

**Tasks:**

a. **Loading State Test**:

-   Write tests to check that the loading indicator is displayed while the fetch is in progress.

b. **Successful Fetch Test**:

-   Write tests to verify that reviews are displayed correctly once fetched.

c. **Error Handling Test**:

-   Write tests to handle an error response and check if the error message is shown.

## Async cheatsheet
When working with asynchronous code in React components and testing them using tools like Jest and React Testing Library, you'll often need to manage tasks like waiting for UI updates and handling promises. Both Jest and React Testing Library offer a set of utilities to help you efficiently test asynchronous logic. Here’s an overview of the main async tools they provide:

### React Testing Library (RTL) Async Utilities

1.  **`waitFor()`**
    -   **Purpose**: To wait for some expectation to be met before continuing with the test. It repeatedly calls the callback function until the assertion inside passes or a timeout is reached.
    -   **Usage**: Often used when you expect some change to happen asynchronously in your component, such as a state update after a network request completes.
    -   **Example**:
  ```ts     
  await waitFor(() => expect(getByText('Loaded')).toBeInTheDocument());
  ```
        
2.  **`waitForElementToBeRemoved()`**
    -   **Purpose**: Waits for an element to be removed from the DOM.
    -   **Usage**: Useful for scenarios where you expect a loading spinner or message to disappear once content is loaded.
    -   **Example**:
      
 ```ts       
 await waitForElementToBeRemoved(() => getByText('Loading...'));
 ```
        

### Jest Async Utilities

1.  **`async`/`await`**
    
    -   **Purpose**: JavaScript syntax feature used within Jest tests to handle promises synchronously, making code easier to read and maintain.
    -   **Usage**: Ideal when you need to wait for a promise to resolve before making assertions.
2.  **`jest.setTimeout()`**
    
    -   **Purpose**: Sets the default timeout interval for asynchronous tests.
    -   **Usage**: Use this when your asynchronous operations might take longer than the default timeout in Jest.
    -   **Example**:
 ```ts
jest.setTimeout(30000); // Increase timeout to 30 seconds
```
        
3.  **Jest Mock Functions (e.g., `jest.fn()`)**
    
    -   **Purpose**: Let's you mock asynchronous functions to control their behavior during the test.
    -   **Usage**: Useful when network calls need to be simulated without making actual requests.

### React Testing with  `act()`

-   **`act()`**
    -   **Purpose**: To ensure all updates related to the React component state and effects are processed before assertions are made.
    -   **Usage**: Wrap updates, like triggering events or state changes, inside  `act()`  to ensure that asynchronous work is finished.
    -   **Example**:
```js      
await act(async () => {
  fireEvent.click(button);
});
```        

#### Important Notes:

-   **Timeouts**: All these async functions have a default timeout to prevent tests from hanging indefinitely. It's typically best practice to configure timeout values according to the expected delays in your environment.
-   **Cleaning-up**: It's crucial to clean up after tests to prevent interference with subsequent tests. React Testing Library automatically cleans up DOM after each test, but be aware of maintaining clean state especially when using Jest’s global states.
-   **Be Specific**: Although these tools are powerful, aim for tests that are specific about what asynchronous behavior they’re awaiting. This ensures tests remain clear and meaningful.
