export interface IchallengeSession{
    _id: string;
    name: string;
    interviewSessionId: string;
    stackBlitzUrl:string;
    challengeSessionStatus:string;
    score:string;
    isActive:boolean;
    startTime:Date;
    endTime:Date;
    totalTime:number;
    createdAt: Date;
    updatedAt: Date;
}