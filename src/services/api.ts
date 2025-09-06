import axios from 'axios';
import {UserDto} from '../data/models/UserDto';
import {UserRole} from '../data/enum/UserRole';
import {CreateJobRequest} from "src/data/request/CreateJobRequest";
import {JobDto} from "src/data/models/JobDto";
import {PageResponse} from "src/data/models/PageResponse";
import {JobApplicationsDto} from "src/data/models/JobApplicationsDto";

const API_HOST = import.meta.env.VITE_API_HOST;

export type {UserRole} from '../data/enum/UserRole';

export interface Skill {
    publicId: string;
    name: string;
}

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

// Add response interceptor to handle 401 errors and refresh tokens
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark the request as retried
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (refreshToken) {
                try {
                    const response = await refreshTokenApi();
                    localStorage.setItem('token', response.accessToken);
                    if (response.refreshToken) {
                        localStorage.setItem('refreshToken', response.refreshToken);
                    }

                    // Retry the original request with new token
                    originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh failed, redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token available, redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

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

// Refresh token API function
export const refreshTokenApi = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        // Use axios directly without the Authorization header interceptor
        const response = await axios.post(`${API_HOST}/api/v1/auth/refresh-token`, {
            "refreshToken": refreshToken
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to refresh token');
        }
        throw new Error('Failed to refresh token');
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

export const createJob = async (jobData: CreateJobRequest) => {
    try {
        const response = await api.post('api/v1/job', jobData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to create job');
        }
        throw new Error('Failed to create job');
    }
};

export const getAllSkills = async (): Promise<Skill[]> => {
    try {
        const response = await api.get('api/v1/job/skills');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch skills');
        }
        throw new Error('Failed to fetch skills');
    }
};

export const getAllJobs = async (page: number, pageSize: number): Promise<PageResponse<JobDto>> => {
    try {
        const response = await api.get('api/v1/job/getAll', {
            params: {
                page,
                pageSize
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch jobs');
        }
        throw new Error('Failed to fetch jobs');
    }
};

export const getJobDetail = async (uuid: string): Promise<JobDto> => {
    try {
        const response = await api.get(`api/v1/job/${uuid}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch job details');
        }
        throw new Error('Failed to fetch job details');
    }
};

export const applyForJob = async (jobId: string, formData: FormData): Promise<void> => {
    try {
        await api.post(`api/v1/job/${jobId}/apply`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to apply for job');
        }
        throw new Error('Failed to apply for job');
    }
};

export const getMyJobApplications = async (page: number, pageSize: number): Promise<PageResponse<JobApplicationsDto>> => {
    try {
        const response = await api.get('api/v1/job/applications', {
            params: {
                page,
                pageSize
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch job applications');
        }
        throw new Error('Failed to fetch job applications');
    }
}

export const getMyActiveJobApplications = async (page: number, pageSize: number): Promise<PageResponse<JobApplicationsDto>> => {
    try {
        const response = await api.get('api/v1/job/applications/active', {
            params: {
                page,
                pageSize
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch active job applications');
        }
        throw new Error('Failed to fetch active job applications');
    }
}

export const changePassWord= async (oldPassword: string, newPassword: string) => {
    try {
        const response = await api.post('api/v1/auth/change-password', {
            oldPassword,
            newPassword
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to change password');
        }
        throw new Error('Failed to change password');
    }
}

