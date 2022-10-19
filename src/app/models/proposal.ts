export class Proposal {
    id: string;
    deadline: number;
    eta: number;
    snapshot: number;
    votes: number; 
    state: number;
    proposals: [{id:string, tx:string}];
    tx: string;
    title: string;
};