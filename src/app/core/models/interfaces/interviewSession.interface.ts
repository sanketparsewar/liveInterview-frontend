export interface IinterviewSession {
  _id: string;
  interviewerName: string;
  candidateName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
