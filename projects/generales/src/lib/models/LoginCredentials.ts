export interface LoginCredentials extends RecoverCredentials {
  pass: string;
  name?: string;
}

export interface RecoverCredentials {
  email: string;
}
