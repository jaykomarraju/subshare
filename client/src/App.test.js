// src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Subshare brand in the navbar', () => {
  render(<App />);
  const brandElements = screen.getAllByText(/Subshare/i);
  expect(brandElements.length).toBeGreaterThan(0);
});
