export enum UserRole {
  Administrator = 'admin',
  Client = 'user',
}

// Sign In
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
}