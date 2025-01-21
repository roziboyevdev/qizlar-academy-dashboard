export declare namespace IApi {
  export interface SignIn {
    credentials: string;
    password: string;
  }

  export interface SignUp {
    first_name: string;
    last_name: string;
    credentials: string;
    password1: string;
    password2: string;
  }

  export interface Verify {
    key?: string;
  }

  export interface ResetPassword {
    credentials: string;
  }
}
