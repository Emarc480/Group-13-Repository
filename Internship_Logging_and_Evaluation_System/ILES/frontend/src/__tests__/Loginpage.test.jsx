import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Loginpage from '../pages/Loginpage';

const renderLogin = () => render(
  <BrowserRouter>
    <Loginpage />
  </BrowserRouter>
);

test('renders username and password inputs', () => {
  renderLogin();
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
});

test('renders login button', () => {
  renderLogin();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});
