import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserInfo from './user';
import useUserService from '../../services/userService';
import useTelegramService from '../../services/telegramService';
import LocalStorageService, { JWT_TOKEN, USER_ID } from '../../services/LocalStorageService';

jest.mock('../../services/userService');
jest.mock('../../services/telegramService');
jest.mock('../../services/LocalStorageService');

describe('UserInfo Component', () => {
  const mockGetUserRequest = jest.fn();
  const mockGetTelegramData = jest.fn();
  const mockLocalStorageService = {
    getItem: jest.fn()
  };

  beforeEach(() => {
    useUserService.mockReturnValue({
      getUserRequest: mockGetUserRequest,
      loading: false,
      error: null
    });

    useTelegramService.mockReturnValue({
      getTelegramData: mockGetTelegramData
    });

    LocalStorageService.mockImplementation(() => mockLocalStorageService);
    mockLocalStorageService.getItem.mockImplementation((key) => {
      if (key === JWT_TOKEN) return 'mockToken';
      if (key === USER_ID) return 'mockUserId';
    });
  });

  test('renders UserInfo component and fetches user data', async () => {
    mockGetUserRequest.mockResolvedValue({
      user: { email: 'test@example.com', phoneNumber: '123456789' },
      devicesCount: 5,
      telegramSession: true
    });

    mockGetTelegramData.mockResolvedValue({
      telegram: { apiId: '123456', apiHash: 'abcdef', channel: 'testChannel' }
    });

    render(<UserInfo handleUserDeleted={jest.fn()} />);

    await waitFor(() => {
      expect(mockGetUserRequest).toHaveBeenCalledWith('mockToken', 'mockUserId');
    });

    await waitFor(() => {
      expect(mockGetTelegramData).toHaveBeenCalledWith('mockToken');
    });

    expect(screen.getByText((content, element) => content.startsWith('Email:') && element.tagName.toLowerCase() === 'p')).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.startsWith('Phone:') && element.tagName.toLowerCase() === 'p')).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.startsWith('Total Devices:') && element.tagName.toLowerCase() === 'p')).toBeInTheDocument();
  });

  test('handles tab change', async () => {
    mockGetUserRequest.mockResolvedValue({
      user: { email: 'test@example.com', phoneNumber: '123456789' },
      devicesCount: 5,
      telegramSession: true
    });

    mockGetTelegramData.mockResolvedValue({
      telegram: { apiId: '123456', apiHash: 'abcdef', channel: 'testChannel' }
    });

    render(<UserInfo handleUserDeleted={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText((content, element) => content.startsWith('Email:') && element.tagName.toLowerCase() === 'p')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Telegram Credentials'));

    expect(await screen.findByText('Telegram session saved: true')).toBeInTheDocument();
    expect(await screen.findByText('API ID: *******')).toBeInTheDocument();
    expect(await screen.findByText('API Hash: **************')).toBeInTheDocument();
    expect(await screen.findByText('Channel: testChannel')).toBeInTheDocument();
  });

  // test('toggles API ID visibility', async () => {
  //   mockGetUserRequest.mockResolvedValue({
  //     user: { email: 'test@example.com', phoneNumber: '123456789' },
  //     devicesCount: 5,
  //     telegramSession: true
  //   });

  //   mockGetTelegramData.mockResolvedValue({
  //     telegram: { apiId: '123456', apiHash: 'abcdef', channel: 'testChannel' }
  //   });

  //   render(<UserInfo handleUserDeleted={jest.fn()} />);

  //   fireEvent.click(screen.getByText('Telegram Credentials'));

  //   expect(await screen.findByText('API ID: *******')).toBeInTheDocument();

  //   fireEvent.click(screen.getByRole('button', { name: /visibility/i }));

  //   expect(await screen.findByText('API ID: 123456')).toBeInTheDocument();
  // });

  // test('toggles API Hash visibility', async () => {
  //   mockGetUserRequest.mockResolvedValue({
  //     user: { email: 'test@example.com', phoneNumber: '123456789' },
  //     devicesCount: 5,
  //     telegramSession: true
  //   });

  //   mockGetTelegramData.mockResolvedValue({
  //     telegram: { apiId: '123456', apiHash: 'abcdef', channel: 'testChannel' }
  //   });

  //   render(<UserInfo handleUserDeleted={jest.fn()} />);

  //   fireEvent.click(screen.getByText('Telegram Credentials'));

  //   await waitFor(() => {
  //     expect(screen.getByText('API Hash: **************')).toBeInTheDocument();
  //   });

  //   fireEvent.click(screen.getByRole('button', { name: /visibility/i }));

  //   await waitFor(() => {
  //     expect(screen.getByText('API Hash: abcdef')).toBeInTheDocument();
  //   });
  // });

  // test('displays loading spinner and error message', async () => {
  //   useUserService.mockReturnValue({
  //     getUserRequest: mockGetUserRequest,
  //     loading: true,
  //     error: 'Error fetching user'
  //   });

  //   render(<UserInfo handleUserDeleted={jest.fn()} />);

  //   expect(screen.getByTestId('spinner')).toBeInTheDocument();
  //   expect(screen.getByText('Error fetching user')).toBeInTheDocument();
  // });
});
