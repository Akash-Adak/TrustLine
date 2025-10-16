import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

describe('App Component', () => {
  it('renders Navbar and Footer', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Navbar
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
  });

  it('renders HomePage on "/" route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/home hero title/i)).toBeInTheDocument();
  });

  it('renders LoginPage on "/login" route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument(); // modal/dialog
  });

  it('renders DashboardPage on "/dashboard" route', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/new report/i)).toBeInTheDocument();
  });
});
