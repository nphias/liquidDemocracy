/* nphias 2018 - Amsterdam Hackathon */

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HoloService } from '../../holo.service';
import { Proposal } from '../../models/proposal';

@Component({
    selector: 'detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
  })
  export class DetailComponent
  {
    p: Proposal
    optionCount: number
    optionVotes: [{}] = [{}]

    constructor(private _holoService: HoloService, private route: ActivatedRoute) { }

    ngOnInit() {
      this.route.params.subscribe(params => {
        this.getProposal(params['id']) //log the value of id
        this._holoService.getVoteStats(params['id']).subscribe(res => {
          this.optionVotes = res
        })
      });
    }

    getProposal(hash:string){
        this._holoService.getProposal(hash).subscribe(res => {
          this.p = res
          this.p.hash = hash
          this.optionCount = res.options.length
      })
    }

    vote(option:number){
      console.log(this.p.hash)
      this._holoService.vote(this.p.hash,option).subscribe(res =>{
        console.log(res)
      })    
    }
  }