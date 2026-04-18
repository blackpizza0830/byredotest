export type AuthMode = "signIn" | "signUp";

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput extends SignInInput {
  fullName: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export interface AuthResult {
  user: AuthUser;
  accessToken: string | null;
}

export interface AuthClient {
  signIn(input: SignInInput): Promise<AuthResult>;
  signUp(input: SignUpInput): Promise<AuthResult>;
  requestPasswordReset(email: string): Promise<void>;
}
