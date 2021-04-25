export interface LoginCredentials extends RecoverCredentials {
  pass: string;
}

export interface RecoverCredentials {
  email: string;
}
