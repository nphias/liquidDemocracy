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
  //viewingProposal: Proposal;
  proposals: Array<Proposal> = [];

  constructor(private _holoService: HoloService) { }

  ngOnInit() {
    this.getAllProposals()
  }
  /* find all posts for each registered user */
  getAllProposals() {
    this._holoService.getUsers().subscribe(res => {
      for (var user of res){
        this.getProposalByUser(user.Hash)
      }
    }, err => console.error(err));
  }
  /* aggregates posts of each user into array */
  getProposalByUser(hash:string) {
    this.proposals = []
    this._holoService.getProposalsByUser(hash).subscribe(res => {
      for (const r of res) {
        var p = new Proposal() 
        p.hash = r.Hash
        p.title = r.Entry.title
        p.content = r.Entry.content
        this._holoService.getVotes(r.Hash).subscribe(res =>{
          p.votes = res.length
        })
        p.timestamp = r.Entry.timestamp
        p.createdby = hash
        if(r.Entry.options)
          p.options = r.Entry.options
        this.proposals.push(p)
      }
    }, err => console.log(err));
    console.log(this.proposals)
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
   // this.name = '';
    this._holoService.createProposal(newpro).subscribe(res => {
      newpro.hash = res;
      this.proposals.push(newpro)
    }, err => console.log(err));
  }

  orderProposalsBylikes(){} //TODO filter

  orderProposalsByCreation(){} //TODO default filter - newest first

  /*find() {
    console.log(this.hash);
    this._holoService.getTopic(this.hash).subscribe(res => {
      this.foundTopic = res;
      console.log(this.foundTopic);
    });
  }*/

}
