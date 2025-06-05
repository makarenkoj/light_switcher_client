import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom'; // Потрібно, якщо App або його діти використовують роутінг
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next'; // Для i18n
import i18n from '../../i18n.test'; // Ваш інстанс i18n для тестів
import App from './App'; // Ваш компонент App
import { AuthContext } from '../../context/AuthContext'; // Ваш AuthContext
import { vi } from 'vitest'

vi.mock('socket.io-client', () => {
  const mockSocket = {
    on: vi.fn(),
    off: vi.fn(),
    disconnect: vi.fn(),
  };
  return {
    default: vi.fn(() => mockSocket),
  };
});

const theme = createTheme(); // Створюємо базову тему MUI

const renderWithProviders = (ui, { providerProps, ...renderOptions } = {}) => {
  // providerProps - це значення, яке ми хочемо передати в AuthContext
  return render(
    <React.StrictMode>
      <MemoryRouter> {/* Обгортка для роутінгу */}
        <ThemeProvider theme={theme}> {/* Обгортка для теми MUI */}
          <I18nextProvider i18n={i18n}> {/* Обгортка для i18next */}
            {/* Передаємо мокнуте або реальне значення в AuthProvider */}
            <AuthContext.Provider value={providerProps}>
              {/* <AppProvider theme={theme}> Якщо цей провайдер потрібен */}
                {ui}
              {/* </AppProvider> */}
            </AuthContext.Provider>
          </I18nextProvider>
        </ThemeProvider>
      </MemoryRouter>
    </React.StrictMode>,
    renderOptions
  );
};

describe('App Component', () => {

  const loggedInUserContext = {
    user: { id: '1', name: 'Test User', role: 'user' },
    login: vi.fn(),
    logout: vi.fn(),
    isAdmin: false,
    isLoggedIn: true,
    isLoading: false,
  };

  const loggedInAdminContext = {
    user: { id: '2', name: 'Admin User', role: 'admin' },
    login: vi.fn(),
    logout: vi.fn(),
    isAdmin: true,
    isLoggedIn: true,
    isLoading: false,
  };

   // Початковий стан для НЕзалогіненого користувача
   const loggedOutContext = {
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    isAdmin: false,
    isLoggedIn: false,
    isLoading: false,
   };

  beforeEach(() => {
    // Скидаємо моки перед кожним тестом (якщо потрібно)
    loggedInUserContext.logout.mockClear();
    loggedInAdminContext.logout.mockClear();
    loggedOutContext.login.mockClear();
    // Скидаємо мок socket.io-client (якщо потрібно)
    const io = require('socket.io-client');
    const socket = io();
    socket.on.mockClear();
    socket.off.mockClear();
  });

  test('renders login and register buttons when logged out', () => {
    renderWithProviders(<App />, { providerProps: loggedOutContext });

    // Перевіряємо наявність кнопок (використовуємо регулярний вираз для ігнорування регістру)
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();

    // Перевіряємо відсутність кнопки виходу
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });

  test('renders logout button and main content when logged in as user', () => {
    renderWithProviders(<App />, { providerProps: loggedInUserContext });

    // Перевіряємо відсутність кнопок входу/реєстрації
    expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /register/i })).not.toBeInTheDocument();

    // Перевіряємо наявність кнопки виходу
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    // Перевіряємо наявність табів
    expect(screen.getByRole('tab', { name: /tab.general/i })).toBeInTheDocument(); // Використовуємо ключі i18n
    expect(screen.getByRole('tab', { name: /tab.user_info/i })).toBeInTheDocument();
    // Перевіряємо відсутність кнопки Telegram
    expect(screen.queryByTestId('telegram-button')).not.toBeInTheDocument(); // Потрібно додати data-testid="telegram-button" до TelegramButton
  });

  test('renders telegram button when logged in as admin', () => {
    renderWithProviders(<App />, { providerProps: loggedInAdminContext });

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    // Перевіряємо наявність кнопки Telegram (додайте data-testid)
    expect(screen.getByTestId('telegram-button')).toBeInTheDocument();
  });

  test('opens login modal when login button is clicked', async () => {
    const user = userEvent.setup(); // Ініціалізуємо userEvent
    renderWithProviders(<App />, { providerProps: loggedOutContext });

    // Клікаємо на кнопку "Login"
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Перевіряємо, чи з'явився діалог (шукаємо за заголовком або роллю)
    // Потрібно знати точний текст заголовка або додати data-testid
    expect(screen.getByRole('dialog', { name: /form.login/i })).toBeInTheDocument();
  });

   test('calls logout from context when logout button is clicked', async () => {
    const user = userEvent.setup();
    // Використовуємо мок-функцію з нашого об'єкта контексту
    const mockLogout = loggedInUserContext.logout;
    renderWithProviders(<App />, { providerProps: loggedInUserContext });

    // Клікаємо на кнопку Logout
    await user.click(screen.getByRole('button', { name: /logout/i }));

    // Перевіряємо, чи була викликана функція logout з контексту
    expect(mockLogout).toHaveBeenCalledTimes(1);
   });

   test('switches tabs when clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { providerProps: loggedInUserContext });

     // Знаходимо таб "User Info" (використовуємо ключ i18n)
     const userInfoTab = screen.getByRole('tab', { name: /tab.user_info/i });
     expect(userInfoTab).toBeInTheDocument();

     // Перевіряємо, чи компонент UserInfo НЕ видимий спочатку
     // (Припускаємо, що UserInfo має унікальний заголовок або елемент)
     expect(screen.queryByRole('heading', { name: /user info heading/i })).not.toBeInTheDocument(); // Замініть на реальний текст/роль

     // Клікаємо на таб
     await user.click(userInfoTab);

     // Перевіряємо, чи компонент UserInfo тепер видимий
     expect(await screen.findByRole('heading', { name: /user info heading/i })).toBeInTheDocument(); // Замініть

     // Перевіряємо, чи контент першого табу (наприклад, DeviceList) зник
     // (Припускаємо, DeviceList має унікальний заголовок або елемент)
     expect(screen.queryByRole('heading', { name: /your devices/i })).not.toBeInTheDocument(); // Замініть
   });

});