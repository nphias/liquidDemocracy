/* nphias 2018 - Amsterdam Hackathon */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Proposal } from './models/proposal';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root',})
export class HoloService {

  private _proposal: Proposal;
  private _p$: BehaviorSubject<Proposal> = new BehaviorSubject<Proposal>(this._proposal);

  get post$() {
    return this._p$.asObservable();
  }

  set post(post: Proposal) {
    this._proposal = post;
    this._p$.next(this._proposal);
  }

  constructor(private _http: Http) { }

  createProposal(post: Proposal) {
    return this._http.post('/fn/proposalZome/proposalEntryCreate', post).pipe(map(res => res.json()));
  }
  getProposalsByUser(hash: string) {
    return this._http.post('/fn/proposalZome/proposalGetCollection', JSON.stringify(hash)).pipe(map(res => res.json()));  
  }

  getUsers() {
    return this._http.post('/fn/proposalZome/getUsers', JSON.stringify({})).pipe(map(res => res.json()));  
  }

  getProposal(hash: string) {
    return this._http.post('/fn/proposalZome/proposalGetEntry', JSON.stringify(hash)).pipe(map(res => res.json()));
  }

  getProposals() {
    return this._http.post('/fn/proposalZome/proposalGetAll', JSON.stringify({})).pipe(map(res => res.json()));
  }
  vote(proposalHash:string, option:number){
    return this._http.post('/fn/proposalZome/vote', JSON.stringify({proposalHash,option})).pipe(map(res => res.json()));
  }

  getVoteStats(proposalHash:string){
    return this._http.post('/fn/proposalZome/getVoteStats', JSON.stringify(proposalHash)).pipe(map(res => res.json()));
  }

}
