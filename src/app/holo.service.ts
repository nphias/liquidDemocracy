import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Proposal } from './models/proposal';
import { map } from 'rxjs/operators';
//import 'rxjs/add/operator/map';


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
    return this._http.post('/fn/topicZome/topicEntryCreate', post).pipe(map(res => res.json()));
  }
  getProposalsByUser(hash: string) {
    return this._http.post('/fn/topicZome/topicGetCollection', JSON.stringify(hash)).pipe(map(res => res.json()));  
  }

  getUsers() {
    return this._http.post('/fn/topicZome/getUsers', JSON.stringify({})).pipe(map(res => res.json()));  
  }

  getProposal(hash: string) {
    return this._http.post('/fn/topicZome/topicGetEntry', JSON.stringify(hash)).pipe(map(res => res.json()));
  }

  getProposals() {
    return this._http.post('/fn/topicZome/topicsGetAll', JSON.stringify({})).pipe(map(res => res.json()));
  }
  vote(proposalHash:string, value:number){
    return this._http.post('/fn/topicZome/vote', JSON.stringify({proposalHash,value})).pipe(map(res => res.json()));

  }

}
