export interface IinterviewSession {
  _id: string;
  interviewer: string;
  organization: string;
  candidateName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
