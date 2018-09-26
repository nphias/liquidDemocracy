// import { holochain } from '../../holochain';
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var genesis = function () {
    var result = commit('directoryLink', { Links: [
            { Base: App.DNA.Hash, Link: App.Agent.Hash, Tag: 'has user' },
        ] });
    //debug(result)
    return true;
};
var getMe = function () {
    return App.Key.Hash;
};
var topicGetEntry = function (hash) {
    var topic = __assign({}, get(hash));
    topic.votes = countVotes({ hash: hash });
    return topic;
};
var getUsers = function () {
    var userList = getLinks(App.DNA.Hash, 'has user', { Load: true });
    //debug(userList);
    return userList;
};
var topicGetCollection = function (userhash) {
    //debug(userhash)
    var collectionList = getLinks(userhash, 'has topics', { Load: true });
    collectionList = collectionList.map(function (i) {
        console.log(JSON.stringify(i));
        // @ts-ignore
        i.Entry.votes = countVotes(i.Hash);
        return i;
    });
    // debug(collectionList);
    return collectionList;
};
var topicEntryCreate = function (topic) {
    var hash = commit('topicEntry', topic);
    // inputs.collection
    var collectionHash = commit('topicLink', { Links: [
            { Base: App.Agent.Hash, Link: hash, Tag: 'has topics' },
        ] });
    return hash;
};
var getTopicDirectory = function () {
    var directory = getLinks(App.DNA.Hash, 'contains', { Load: true });
    return directory;
};
var hasVoted = function (proposalHash) {
    var votes = getLinks(proposalHash, '', { Load: true });
    var myVote = votes.filter(function (vote) { return vote.Hash === getMe(); });
    if (myVote.length === 0)
        return false;
    else
        return true;
};
var vote = function (params) {
    var proposal = topicGetEntry(params.proposalHash);
    if (hasVoted(params.proposalHash))
        return false;
    // If the provided choice is out of bound
    if (params.value >= proposal.values.length)
        return false;
    var vote = commit('vote', { Links: [{
                Base: params.proposalHash,
                Link: getMe(),
                Tag: params.value
            }] });
    var voteBacklink = commit('vote', { Links: [{
                Base: getMe(),
                Link: params.proposalHash,
                Tag: params.value
            }] });
    return {
        voteHash: vote,
        voteBacklinkHash: voteBacklink
    };
};
var removeDelegations = function (params) {
    var delegations = getLinks(params.targetHash, 'delegation');
    if (delegations.length === 0)
        return false;
    var delegationsRes = delegations.map(function (x) { return ({
        Base: x.Source,
        Link: x.Hash,
        LinkAction: HC.LinkAction.Del
    }); });
    // Create array of backlinks
    var delegationBacklinksRes = delegationsRes.map(function (x) { return (__assign({}, x, { Base: x.Link, Link: x.Base })); });
    commit('delegate', delegationsRes);
    commit('delegateBacklink', delegationBacklinksRes);
};
var delegate = function (params) {
    removeDelegations(params);
    commit('delegate', { Links: [{
                Base: getMe(),
                Link: params.targetHash,
                Tag: 'delegate'
            }] });
    commit('delegate', { Links: [{
                Base: getMe(),
                Link: params.targetHash,
                Tag: 'delegateBacklink'
            }] });
};
var countVotes = function (params) {
    var res = {};
    var votes = getLinks(params.hash, '', { Load: true });
    votes
        .map(function (vote) { return Number(vote.Tag); })
        .forEach(function (x) { return res[x] = (res[x] || 0) + 1; });
    return res;
};
var validateCommit = function (entryName, entry, header, pkg, sources) {
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
};
var validatePut = function (entryName, entry, header, pkg, sources) {
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
};
var validateMod = function (entryName, entry, header, replaces, pkg, sources) {
    switch (entryName) {
        case "topicEntry":
            return true;
        default:
            // invalid entry name
            return false;
    }
};
var validateDel = function (entryName, hash, pkg, sources) {
    switch (entryName) {
        case "topicEntry":
            return true;
        default:
            // invalid entry name
            return false;
    }
};
var validateLink = function (linkEntryType, baseHash, links, pkg, sources) {
    switch (linkEntryType) {
        case "directoryLink":
            return true;
        case "topicLink":
            return true;
        default:
            // invalid entry name
            return false;
    }
};
var validatePutPkg = function (entryName) {
    return null;
};
var validateModPkg = function (entryName) {
    return null;
};
var validateDelPkg = function (entryName) {
    return null;
};
var validateLinkPkg = function (entryName) {
    return null;
};
