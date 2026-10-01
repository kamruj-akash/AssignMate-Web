export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IGoogleResponse {
  credential: string;
  clientId: string;
  select_by: string;
}
