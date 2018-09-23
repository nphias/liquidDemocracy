export class Proposal {
    hash?: string;
    title: string;
    content: string; 
    options?: string[] = ["","","",""];
    votes: number = 0;
    timestamp: string; //creation date
    createdby: string;
    //voters?:[string] //agent hashes array (validated)
}
