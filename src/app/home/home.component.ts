/* nphias  2018 - Amsterdam Hackathon */

import { Component, OnInit } from '@angular/core';
import { HoloService } from '../holo.service';
import { Proposal } from '../models/proposal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  newproposal: Proposal = new Proposal;
  proposals: Proposal[] = [];

  constructor(private _holoService: HoloService) { }

  ngOnInit() {
    this.getAllProposals()
  }
  /* find all posts for each registered user */
  getAllProposals() {
    this.proposals = []
    this._holoService.getUsers().subscribe(res => {
      for (var user of res){
        this.getProposalByUser(user.Hash)
      }
    }, err => console.error(err));
  }
  /* aggregates posts of each user into array */
  getProposalByUser(hash:string) {
    this._holoService.getProposalsByUser(hash).subscribe(res => {
      for (const r of res) {
        if (this.proposals.some(p => p.hash === r.Hash)) //avoid duplicates
          continue
        var p = new Proposal() 
        p.hash = r.Hash
        p.title = r.Entry.title
        p.content = r.Entry.content
        p.votes = r.Entry.votes
        p.timestamp = r.Entry.timestamp
        p.createdby = hash
        if(r.Entry.options)
          p.options = r.Entry.options
        this.proposals.push(p)
      }
    }, err => console.log(err));
  }
  createProposal() {
     let newpro = {
      hash: "",
      title: this.newproposal.title,
      content: this.newproposal.content,
      options: this.newproposal.options,
      votes: this.newproposal.votes,
      timestamp: (new Date).toDateString(),
      createdby: ""
    };
    this._holoService.createProposal(newpro).subscribe(res => {
      newpro.hash = res;
      this.proposals.push(newpro)
    }, err => console.log(err));
  }

  orderProposalsByVotes(){} //TODO filter

  orderProposalsByCreation(){} //TODO default filter - newest first

}
