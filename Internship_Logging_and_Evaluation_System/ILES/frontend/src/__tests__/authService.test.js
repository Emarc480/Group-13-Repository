import { isAuthenticated, logout } from '../services/authService';

beforeEach(() => {
  localStorage.clear();
});

test('isAuthenticated returns false when no token', () => {
  expect(isAuthenticated()).toBe(false);
});

test('isAuthenticated returns true when token exists', () => {
  localStorage.setItem('access_token', 'fake-token');
  expect(isAuthenticated()).toBe(true);
});

test('logout clears tokens from localStorage', () => {
  localStorage.setItem('access_token', 'fake-token');
  localStorage.setItem('refresh_token', 'fake-refresh');
  logout();
  expect(localStorage.getItem('access_token')).toBeNull();
  expect(localStorage.getItem('refresh_token')).toBeNull();
});
