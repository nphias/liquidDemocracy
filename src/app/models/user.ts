export class User {
    userhash: string = "";
    name: string
    delegates: Map<string,string> //userhash,proposalhash (validated)
}