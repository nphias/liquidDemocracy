export class Comment {
    hash?: string;
    timestamp: number //creation date
    content: string
    likes?:[string] //agent hashes array (validated)
    dislikes?:[string] //agent hashes array (validated)
    bgcolor: string = "#FFFFFF"
}