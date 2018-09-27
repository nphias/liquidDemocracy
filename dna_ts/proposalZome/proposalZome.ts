/* nphias + maxamillion 2018 - Amsterdam Hackathon */

const genesis = () => {
    var result = commit('directoryLink', {Links:[
        {Base: App.DNA.Hash, Link: App.Key.Hash, Tag: 'has user'},
    ]})
    //debug(result)
    return true;
};


const proposalEntryCreate = (proposal) => {
    const phash = commit('proposalEntry', proposal);
    const collectionHash =  commit('proposalLink', {Links:[
        {Base: App.Key.Hash, Link: phash, Tag: 'has proposals'},
    ]})
    return phash;
}

const proposalGetEntry = (proposalhash) => {
    let proposal = get(proposalhash);
    //debug(proposal)
    return proposal
}

const getUsers = () => {
    var userList = getLinks(App.DNA.Hash, 'has user', { Load: true });
    //debug(userList);
   // debug(App.Agent.Hash)
   // debug(App.Key.Hash)
    return userList
}

const proposalGetCollection = (userhash) => {
    let collectionList = getLinks(userhash, 'has proposals', { Load: true })
    //debug(collectionList)
    collectionList.map(p => {p.Entry.votes = getVotes(p.Hash).length})
    return collectionList
}

const vote = (params:{proposalHash:string, option:number}) => {  //TODO Add validation
    const vote = commit('voteLink', {Links:[
        { Base: params.proposalHash, Link: App.Key.Hash, Tag: params.option.toString()} ]})
        //debug(vote)
    return true
}

const getVotes = (proposalhash) => {
    const votes = getLinks(proposalhash, '', { Load: true });
    //debug(votes)
    return votes
}

const getVoteStats = (proposalHash) => {
    let res = []
    getVotes(proposalHash).map((vote) => Number(vote.Tag)).forEach(x => res[x] = (res[x] || 0) + 1)
    return res
}


const getTopicDirectory = () => {
    var directory = getLinks(App.DNA.Hash, 'contains', { Load: true })
    return directory
}

const hasVoted = (proposalHash) => {
    const votes = getLinks(proposalHash, '', { Load: true })

    const myVote = votes.filter(vote => vote.Hash === App.Key.Hash)

    if (myVote.length === 0)
        return false
    else
        return true
}

const removeDelegations = (params: { targetHash: string }) => {
    const delegations = getLinks(params.targetHash, 'delegation')

    if (delegations.length === 0)
        return false

    const delegationsRes = delegations.map(x => ({
        Base: x.Source,
        Link: x.Hash,
        LinkAction: HC.LinkAction.Del
    }))

    // Create array of backlinks
    const delegationBacklinksRes = delegationsRes.map(x => ({
        ...x,
        Base: x.Link,
        Link: x.Base
    }))

    commit('delegate', delegationsRes)
    commit('delegateBacklink', delegationBacklinksRes)
}

const delegate = (params: { targetHash: string}) => {
    removeDelegations(params)

    commit('delegate', { Links: [ {
        Base: App.Key.Hash,
        Link: params.targetHash,
        Tag: 'delegate'
    } ]})

    commit('delegate', { Links: [ {
            Base: App.Key.Hash,
            Link: params.targetHash,
            Tag: 'delegateBacklink'
    } ]})
}


const validateVote = (entry) => {
    let proposalhash = entry.Links[0].Base
    let voteOption = Number(entry.Links[0].Tag)
    const proposal = proposalGetEntry(proposalhash)
    if (hasVoted(proposalhash))
        return false
    if (voteOption < 0)
        return false
    if (voteOption >= proposal.options.length)
        return false
    return true
}

//validation
const validateCommit = (entryName, entry, header, pkg, sources) => {
    switch (entryName) {
        case "proposalEntry":
            return true;
        case "directoryLink":
            return true;
        case "proposalLink":
            return true;
        case "voteLink": return validateVote(entry)
           // return true;
        default:
            // invalid entry name
            return false;
    }
}

const validatePut = (entryName, entry, header, pkg, sources) => {
    switch (entryName) {
        case "proposalEntry":
            return true;
        case "directoryLink":
            return true;
        case "voteLink":
            return true;
        case "proposalLink":
            return true;
        default:
            // invalid entry name
            return false;
    }
}

const validateMod = (entryName, entry, header, replaces, pkg, sources) => {
    switch (entryName) {
        case "proposalEntry":
            return true;
        default:
            // invalid entry name
            return false;
    }
}

const validateDel = (entryName, hash, pkg, sources) => {
    switch (entryName) {
        case "proposalEntry":
            return true;
        default:
            // invalid entry name
            return false;
    }
}

const validateLink = (linkEntryType, baseHash, links, pkg, sources) => {
    switch (linkEntryType) {
        case "voteLink":
            return true;
        case "proposalLink":
            return true;
        case "directoryLink":
            return true;
        default:
            // invalid entry name
            return false;
    }
}

const validatePutPkg = (entryName) => {
    return null;
}

const validateModPkg = (entryName) => {
    return null;
}

const validateDelPkg = (entryName) => {
    return null;
}

const validateLinkPkg = (entryName) => {
    return null;
}
