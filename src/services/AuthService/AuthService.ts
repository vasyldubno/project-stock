import axios from "axios";
import {
  BodySignIn,
  BodySignUp,
  ResponseSignIn,
  ResponseSignUp,
} from "./types";

export class AuthService {
  static async signIn(body: BodySignIn) {
    return axios.post<ResponseSignIn>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/sign-in`,
      body
    );
  }

  static async signUp(body: BodySignUp) {
    return axios.post<ResponseSignUp>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/sign-up`,
      body
    );
  }
}
