import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddDeviceTriggerButton from './addDeviceTriggerButton'; // Перевірте шлях
// Виправте шлях до форми, якщо потрібно
// import CreateDeviceTriggerForm from "/src/components/forms/createDeviceTriggerForm.jsx";
import { vi } from 'vitest'; // <--- Додайте імпорт vi

// Замініть jest.mock на vi.mock та jest.fn на vi.fn
vi.mock('../forms/createDeviceTriggerForm', () => ({ // Шлях має бути відносним
   // Використовуємо default export, якщо форма експортується як default
   default: vi.fn((props) => <div data-testid="mock-create-form" {...props} />)
}));

describe('AddDeviceTriggerButton Component', () => {
  test('renders button and opens form on click', async () => {
      const user = userEvent.setup();
      const handleTriggerAdded = vi.fn(); // Використовуємо vi.fn()
      render(<AddDeviceTriggerButton deviceId="test-device" onTriggerAdded={handleTriggerAdded} />);

      const addButton = screen.getByRole('button', { name: /trigger.add_trigger/i }); // Використовуйте ключ i18n
      expect(addButton).toBeInTheDocument();

      // Перевіряємо, що форма спочатку не видима
      expect(screen.queryByTestId('mock-create-form')).not.toBeInTheDocument();

      await user.click(addButton);

      // Перевіряємо, що форма тепер видима (або що мок був викликаний з open=true)
      // Оскільки ми мокнули форму, ми можемо перевірити її наявність
       expect(screen.getByTestId('mock-create-form')).toBeInTheDocument();
       // Або перевірити пропси мока, якщо потрібно
  });

  const deviceId = 1;
  const onTriggerAdded = vi.fn();

  beforeEach(() => {
    CreateDeviceTriggerForm.mockClear();
  });

  test('renders the button', () => {
    render(<AddDeviceTriggerButton deviceId={deviceId} onTriggerAdded={onTriggerAdded} />);
    expect(screen.getByText('Add to the device')).toBeInTheDocument();
  });

  test('opens the form when button is clicked', async () => {
    render(<AddDeviceTriggerButton deviceId={deviceId} onTriggerAdded={onTriggerAdded} />);
  
    await waitFor(() => {
      expect(CreateDeviceTriggerForm).toHaveBeenCalledWith(
        expect.objectContaining({
          open: false,
        }),
        {}
      );
    });
  
    fireEvent.click(screen.getByText('Add to the device'));
  
    await waitFor(() => {
      expect(CreateDeviceTriggerForm).toHaveBeenCalledWith(
        expect.objectContaining({
          open: true,
        }),
        {}
      );
    });
  });

  test('closes the form when onClose is called', async () => {
    render(<AddDeviceTriggerButton deviceId={deviceId} onTriggerAdded={onTriggerAdded} />);
    fireEvent.click(screen.getByText('Add to the device'));
  
    await waitFor(() => {
      expect(CreateDeviceTriggerForm).toHaveBeenCalledWith(
        expect.objectContaining({
          open: true,
        }),
        {}
      );
    });
  
    const { onClose } = CreateDeviceTriggerForm.mock.calls.at(-1)[0];
  
    await act(async () => {
      onClose(); // Виклик setIsOpen(false)
    });
  
    await waitFor(() => {
      expect(CreateDeviceTriggerForm).toHaveBeenCalledWith(
        expect.objectContaining({
          open: false,
        }),
        {}
      );
    });
  });
});
