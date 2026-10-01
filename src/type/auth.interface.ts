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

export interface IVerifyRegisterPayload {
  otp: string;
  email: string;
}

export interface IVerifyExpertRegisterPayload extends IVerifyRegisterPayload {
  university: string;
  department: string;
  ratePerAssignment: number;
  bio: string;
}

/** {
  "email": "{{expertEmail}}",
  "otp": "670643",
  "university": "University of Dhaka",
  "department": "Computer Science",
  "ratePerAssignment": 1500,
  "bio": "5 years of tutoring experience in algorithms and databases."
} */
