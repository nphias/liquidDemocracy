// import { holochain } from '../../holochain';

const genesis = () => {
    var result = commit('directoryLink', {Links:[
        {Base: App.DNA.Hash, Link: App.Agent.Hash, Tag: 'has user'},
    ]})
    //debug(result)
    return true;
};

const getMe = () => {
    return App.Key.Hash
}

const topicGetEntry = (hash) => {
    const topic = get(hash);
    return topic;
}

const getUsers = () => {
    var userList = getLinks(App.DNA.Hash, 'has user', { Load: true });
    //debug(userList);
    return userList
}

const topicGetCollection = (userhash) => {
    //debug(userhash)
    var collectionList = getLinks(userhash, 'has topics', { Load: true });
   // debug(collectionList);
    return collectionList
}

const topicEntryCreate = (topic) => {
    const hash = commit('topicEntry', topic);
    // inputs.collection
    const collectionHash =  commit('topicLink', {Links:[
        {Base: App.Agent.Hash, Link: hash, Tag: 'has topics'},
    ]})
    return hash;
}

const getTopicDirectory = () => {
    var directory = getLinks(App.DNA.Hash, 'contains', { Load: true })
    return directory
}


const hasVoted = (proposalHash) => {
    const votes = getLinks(proposalHash, '', { Load: true })

    const myVote = votes.filter(vote => vote.Hash === getMe())

    if (myVote.length === 0)
        return false
    else
        return true
}

const vote = (params: {
    proposalHash: string,
    value: number
}) => {
    const proposal = topicGetEntry(params.proposalHash)

    // If the provided choice is out of bound
    if (value >= proposal.values.length)
        return false

    if (hasVoted(params.proposalHash))
        return false

    const vote = commit('vote', { Links: [ {
        Base: params.proposalHash,
        Link: getMe(),
        tag: params.value
    } ]})

    const voteBacklink = commit('vote', { Links: [ {
        Base: getMe(),
        Link: params.proposalHash,
        tag: params.value
    } ]})

    return {
        voteHash: vote,
        voteBacklinkHash: voteBacklink
    };
}

const validateCommit = (entryName, entry, header, pkg, sources) => {
    switch (entryName) {
        case "topicEntry":
            return true;
        case "directoryLink":
            return true;
        case "topicLink":
            return true;
        default:
            // invalid entry name
            return false;
    }
}

const validatePut = (entryName, entry, header, pkg, sources) => {
    switch (entryName) {
        case "topicEntry":
            return true;
        case "directoryLink":
            return true;
        case "topicLink":
            return true;
        default:
            // invalid entry name
            return false;
    }
}

const validateMod = (entryName, entry, header, replaces, pkg, sources) => {
    switch (entryName) {
        case "topicEntry":
            return true;
        default:
            // invalid entry name
            return false;
    }
}

const validateDel = (entryName, hash, pkg, sources) => {
    switch (entryName) {
        case "topicEntry":
            return true;
        default:
            // invalid entry name
            return false;
    }
}

const validateLink = (linkEntryType, baseHash, links, pkg, sources) => {
    switch (linkEntryType) {
        case "directoryLink":
            return true;
        case "topicLink":
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
