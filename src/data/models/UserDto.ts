export interface UserDto {
    createdAt: string;
    email: string;
    username: string;
    roles: string[];
    publicId: string;
    expiresAt?: string;
    }