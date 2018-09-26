export class Proposal {
    hash: string = "";
    title: string;
    content: string; 
    options: string[] = []; //option hashes
    votes: number = 0;
    timestamp: string; //creation date
    createdby: string;
}
