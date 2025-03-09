import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Login from '../Login';
import { AuthProvider } from '../../context/AuthContext';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Login Component', () => {
  it('renders login form', () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('shows error on failed login', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'test' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByText('Login'));
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });
});
