import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddDevice from './addDevice'; // Перевірте шлях
import { vi } from 'vitest';

describe('AddDevice Component', () => {
  test('renders Add Device button', () => {
    // Замініть jest.fn() на vi.fn()
    render(<AddDevice onDeviceAdded={vi.fn()} />);
    const addButton = screen.getByText(/Add Device/i); // Або краще за роллю: getByRole('button', { name: /add device/i })
    expect(addButton).toBeInTheDocument();
  });

  test('opens CreateDeviceForm on button click', () => {
    render(<AddDevice onDeviceAdded={vi.fn()} />);
    const addButton = screen.getByText(/Add Device/i);
    fireEvent.click(addButton);
    const createDeviceForm = screen.getByRole('dialog');
    expect(createDeviceForm).toBeInTheDocument();
  });

  test('closes CreateDeviceForm on form close', async () => {
    render(<AddDevice onDeviceAdded={vi.fn()} />);
    const addButton = screen.getByText(/Add Device/i);
    fireEvent.click(addButton);
    const closeButton = screen.getByLabelText(/Close/i); // Assuming there's a close button with label 'Close'
    expect(closeButton).toBeInTheDocument(); // Check if closeButton exists
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
