export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IGoogleResponse {
  credential: string;
  clientId: string;
  select_by: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "EXPERT";
}
