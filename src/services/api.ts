import axios from 'axios';
import { UserDto } from '../data/models/UserDto';
import { UserRole } from '../data/enum/UserRole';

const API_HOST = import.meta.env.VITE_API_HOST;

export type { UserRole } from '../data/enum/UserRole';

// Create axios instance
const api = axios.create({
  baseURL: API_HOST,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Mock login function
export const loginApi = async (email: string, password: string) => {
    const loginRequest = {
        username: email,
        password: password
    };
  try {
    const response = await api.post('api/v1/auth/login', loginRequest);
    if (!response || !response.data) {
      throw new Error('Invalid response from server');
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Login failed');
    }
    throw new Error('Login failed');
  }
};

// Mock register function
export const registerApi = async (
  username: string,
  email: string,
  password: string,
  role: UserRole
) => {
  try {
    const response = await api.post('api/v1/auth/users', {
      username,
      email,
      password,
      role
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Registration failed');
  }
};

export const getMySelf = async (): Promise<UserDto> => {
  try {
    const response = await api.get('api/v1/auth/myself');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch user data');
    }
    throw new Error('Failed to fetch user data');
  }
};

export default api;
