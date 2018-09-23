"use strict";
// import { holochain } from '../../holochain';
var genesis = function () {
    var result = commit('directoryLink', { Links: [
            { Base: App.DNA.Hash, Link: App.Agent.Hash, Tag: 'has user' },
        ] });
    //debug(result)
    return true;
};
var topicGetEntry = function (hash) {
    var topic = get(hash);
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
