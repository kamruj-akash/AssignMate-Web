export interface ICreateAssignmentPayload {
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  attachment: File;
}
