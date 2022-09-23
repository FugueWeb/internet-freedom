import { Component, OnInit } from '@angular/core';
import { InternetFreedom } from '../models/internet-freedom';
import { InternetFreedomService } from '../services/internet-freedom.service';
import { ThemePalette } from '@angular/material/core';

declare let window: any;

@Component({
  selector: 'app-internet-freedom',
  templateUrl: './if.component.html',
  styleUrls: [ './if.component.css' ]
})
export class IFComponent implements OnInit {

  internetFreedom: InternetFreedom[];
  breakpoint: number;

  //MatSpinner
  spinnerColor: ThemePalette = 'warn';

  //MatRipple
  centered = false;
  disabled = false;
  unbounded = false;
  radius: number;
  color: string;

  constructor(private ifService: InternetFreedomService) { }

  ngOnInit() {
    this.getInternetFreedom();
    //this.getEvaluators();
    this.breakpoint = (window.innerWidth <= 1024) ? 1 : 2;
  }

  getInternetFreedom(): void {
    this.ifService.getInternetFreedom()
      .subscribe(internetFreedom => {
          this.internetFreedom = this.ifService.shuffle(internetFreedom);
          console.log(this.internetFreedom);
      });
  }
  
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 700) ? 1 : 2;
  }
}