export interface IchallengeSession{
    _id: string;
    name: string;
    interviewSessionId: string;
    stackBlitzUrl:string;
    projectName:string;
    challengeSessionStatus:string;
    score:string;
    isActive:boolean;
    startTime:Date;
    endTime:Date;
    totalTime:number;
    createdAt: Date;
    updatedAt: Date;
    projectSnapshot:any;
    lostFocus:number;
}