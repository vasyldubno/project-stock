export interface BodySignIn {
  email: string;
  password: string;
}

export interface ResponseSignIn {
  id: number;
  email: string;
}

export interface BodySignUp {
  email: string;
  password: string;
}

export interface ResponseSignUp {
  id: number;
  email: string;
}
