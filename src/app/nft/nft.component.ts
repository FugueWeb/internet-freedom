import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { NFT } from '../models/nft';
import { InternetFreedomService } from '../services/internet-freedom.service';

@Component({
  selector: 'app-nft',
  templateUrl: './nft.component.html',
  styleUrls: ['./nft.component.css']
})
export class NFTComponent implements OnInit {

    breakpoint: number;
    nft: NFT[];

    //MatSpinner
    spinnerColor: ThemePalette = 'warn';

    //MatRipple
    centered = false;
    disabled = false;
    unbounded = false;
    radius: number;
    color: string;

  constructor(private ifService: InternetFreedomService) { }

  ngOnInit(): void {
    this.getNFT();
    this.breakpoint = (window.innerWidth <= 1024) ? 1 : 2;
  }

  getNFT(): void {
    this.ifService.getNFT()
      .subscribe(nft => {
          this.nft = this.ifService.shuffle(nft);
          console.log(this.nft);
      });
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 700) ? 1 : 2;
  }

}
